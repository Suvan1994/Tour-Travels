import React, { useEffect, useRef } from 'react';
import {
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  JourneyType,
  RouteCalculationResult,
  SelectedPlaceInfo,
} from '../types/travel';
import { formatDurationMillis } from '../utils/fareCalculator';

const INITIAL_INDIA_VIEWPORT = { lat: 26.85, lng: 78.0 };

function checkAndDispatchQuotaError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  if (
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('QuotaExceededError') ||
    msg.includes('429')
  ) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
}

interface RouteControllerProps {
  pickup: SelectedPlaceInfo;
  destination: SelectedPlaceInfo;
  journeyType: JourneyType;
  onRouteCalculated: (result: RouteCalculationResult | null) => void;
  onLoadingChange: (loading: boolean) => void;
  onErrorChange: (error: string | null) => void;
}

const RouteController: React.FC<RouteControllerProps> = ({
  pickup,
  destination,
  journeyType,
  onRouteCalculated,
  onLoadingChange,
  onErrorChange,
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map || !routesLib) return;

    // Clear previous polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    if (journeyType === JourneyType.LOCAL_RENTAL) {
      onLoadingChange(false);
      onErrorChange(null);
      return;
    }

    const originInput = pickup.location ?? pickup.formattedAddress.trim();
    const destInput = destination.location ?? destination.formattedAddress.trim();

    if (!originInput || !destInput) {
      onRouteCalculated(null);
      onLoadingChange(false);
      return;
    }

    let isCancelled = false;
    onLoadingChange(true);
    onErrorChange(null);

    const request: google.maps.routes.ComputeRoutesRequest = {
      origin: originInput,
      destination: destInput,
      travelMode: 'DRIVING',
      fields: [
        'path',
        'distanceMeters',
        'durationMillis',
        'viewport',
        'legs',
        'localizedValues',
        'description',
      ],
    };

    routesLib.Route.computeRoutes(request)
      .then(({ routes }) => {
        if (isCancelled) return;
        onLoadingChange(false);

        if (!routes || routes.length === 0) {
          onRouteCalculated(null);
          onErrorChange(
            'No drivable road route was found between these two locations. Please verify your pickup and destination cities.'
          );
          return;
        }

        const primaryRoute = routes[0];
        const distanceMeters = primaryRoute.distanceMeters ?? 0;
        const durationMillis = primaryRoute.durationMillis ?? 0;

        // Draw actual road polylines on the Google Map
        const createdPolylines = primaryRoute.createPolylines();
        createdPolylines.forEach((polyline) => {
          polyline.setOptions({
            strokeColor: '#1769AA',
            strokeOpacity: 0.95,
            strokeWeight: 5,
          });
          polyline.setMap(map);
        });
        polylinesRef.current = createdPolylines;

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport, 36);
        }

        const readPoint = (pt: unknown): { lat: number; lng: number } | null => {
          if (!pt || typeof pt !== 'object') return null;
          const candidate = pt as {
            lat?: number | (() => number);
            lng?: number | (() => number);
          };
          const rawLat =
            typeof candidate.lat === 'function' ? candidate.lat() : candidate.lat;
          const rawLng =
            typeof candidate.lng === 'function' ? candidate.lng() : candidate.lng;
          if (
            typeof rawLat === 'number' &&
            Number.isFinite(rawLat) &&
            typeof rawLng === 'number' &&
            Number.isFinite(rawLng)
          ) {
            return { lat: rawLat, lng: rawLng };
          }
          return null;
        };

        const leg = primaryRoute.legs?.[0];
        const pathArr = primaryRoute.path ?? [];
        const resolvedStart =
          pickup.location ??
          readPoint(leg?.startLocation) ??
          readPoint(pathArr[0]) ??
          INITIAL_INDIA_VIEWPORT;
        const resolvedEnd =
          destination.location ??
          readPoint(leg?.endLocation) ??
          readPoint(pathArr[pathArr.length - 1]) ??
          INITIAL_INDIA_VIEWPORT;

        const durationText =
          primaryRoute.localizedValues?.duration || formatDurationMillis(durationMillis);

        onRouteCalculated({
          distanceMeters,
          distanceKm: Math.max(1, Math.round(distanceMeters / 1000)),
          durationMillis,
          durationText,
          routeDescription: primaryRoute.description
            ? `Via ${primaryRoute.description}`
            : 'Fastest Highway Route',
          startAddress: pickup.label,
          endAddress: destination.label,
          startLocation: resolvedStart,
          endLocation: resolvedEnd,
        });
      })
      .catch((err: unknown) => {
        if (isCancelled) return;
        onLoadingChange(false);
        checkAndDispatchQuotaError(err);
        onRouteCalculated(null);
        onErrorChange(
          'Unable to calculate driving route right now. Please select a valid location from the suggestions or try again.'
        );
      });

    return () => {
      isCancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [
    map,
    routesLib,
    pickup.formattedAddress,
    pickup.location?.lat,
    pickup.location?.lng,
    destination.formattedAddress,
    destination.location?.lat,
    destination.location?.lng,
    journeyType,
  ]);

  return null;
};

interface GoogleMapRouteProps {
  pickup: SelectedPlaceInfo;
  destination: SelectedPlaceInfo;
  journeyType: JourneyType;
  routeResult: RouteCalculationResult | null;
  isLoading: boolean;
  error: string | null;
  hasMapsApiKey: boolean;
  onRouteCalculated: (result: RouteCalculationResult | null) => void;
  onLoadingChange: (loading: boolean) => void;
  onErrorChange: (error: string | null) => void;
  heightClassName?: string;
}

export const GoogleMapRoute: React.FC<GoogleMapRouteProps> = ({
  pickup,
  destination,
  journeyType,
  routeResult,
  isLoading,
  error,
  hasMapsApiKey,
  onRouteCalculated,
  onLoadingChange,
  onErrorChange,
  heightClassName = 'h-56 sm:h-64',
}) => {
  if (!hasMapsApiKey) {
    return (
      <div
        className={`relative w-full ${heightClassName} rounded-xl overflow-hidden bg-primary-container text-surface-canvas p-space-md flex flex-col items-center justify-center text-center gap-2 border border-surface-canvas/10`}
      >
        <span className="material-symbols-outlined text-rating-gold text-[32px]">
          vpn_key_alert
        </span>
        <p className="text-label-lg font-bold">Google Maps API Key Required</p>
        <p className="text-body-sm text-surface-container-high max-w-sm">
          Configure <code className="bg-surface-canvas/10 px-1.5 py-0.5 rounded">VITE_GOOGLE_MAPS_API_KEY</code> in
          your environment variables with Maps JavaScript API, Places API (New), and Routes API enabled to calculate live driving routes.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${heightClassName} rounded-xl overflow-hidden shadow-inner border border-primary-container/10 bg-surface-container`}>
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={INITIAL_INDIA_VIEWPORT}
        defaultZoom={6}
        gestureHandling="cooperative"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={true}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full"
      >
        <RouteController
          pickup={pickup}
          destination={destination}
          journeyType={journeyType}
          onRouteCalculated={onRouteCalculated}
          onLoadingChange={onLoadingChange}
          onErrorChange={onErrorChange}
        />

        {routeResult && journeyType !== JourneyType.LOCAL_RENTAL && (
          <>
            <AdvancedMarker
              position={routeResult.startLocation}
              title={`Pickup: ${pickup.label}`}
            >
              <Pin
                background="#0261a2"
                borderColor="#ffffff"
                glyphColor="#ffffff"
                glyphText="A"
              />
            </AdvancedMarker>
            <AdvancedMarker
              position={routeResult.endLocation}
              title={`Destination: ${destination.label}`}
            >
              <Pin
                background="#F5B942"
                borderColor="#10243a"
                glyphColor="#10243a"
                glyphText="B"
              />
            </AdvancedMarker>
          </>
        )}
      </GoogleMap>

      {/* Loading Indicator Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-primary/45 backdrop-blur-[2px] flex items-center justify-center z-10">
          <div className="bg-surface-canvas text-on-surface px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 text-label-md font-bold">
            <span className="w-4 h-4 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
            <span>Calculating live highway route…</span>
          </div>
        </div>
      )}

      {/* Friendly Route Error Overlay */}
      {!isLoading && error && (
        <div className="absolute inset-x-3 bottom-3 bg-error-container text-on-error-container px-3.5 py-2.5 rounded-lg shadow-md flex items-start gap-2 z-10 text-body-sm">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Bottom Highway Corridor Badge */}
      {!isLoading && !error && routeResult && journeyType !== JourneyType.LOCAL_RENTAL && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 via-primary/40 to-transparent p-3 text-surface-canvas flex items-center justify-between gap-2">
          <span className="text-label-lg font-bold truncate">
            {pickup.label.split(',')[0]} ➔ {destination.label.split(',')[0]}
          </span>
          <span className="bg-rating-gold text-primary text-label-sm font-bold px-2 py-0.5 rounded shrink-0">
            {routeResult.routeDescription}
          </span>
        </div>
      )}
    </div>
  );
};
