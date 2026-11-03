import { useCallback, useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { SelectedPlaceInfo } from '../types/travel';

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

export interface PlaceSuggestionItem {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
  rawSuggestion: google.maps.places.AutocompleteSuggestion;
}

export function usePlacesAutocomplete(query: string, enabled: boolean) {
  const placesLib = useMapsLibrary('places');
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetSession = useCallback(() => {
    sessionTokenRef.current = null;
    setSuggestions([]);
  }, []);

  useEffect(() => {
    if (!enabled || !placesLib) {
      setSuggestions([]);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
        }

        const response = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: trimmed,
          sessionToken: sessionTokenRef.current,
          region: 'in',
        });

        if (cancelled) return;

        const mapped: PlaceSuggestionItem[] = (response?.suggestions ?? [])
          .filter((s) => Boolean(s.placePrediction))
          .slice(0, 6)
          .map((s) => {
            const pred = s.placePrediction!;
            return {
              placeId: pred.placeId,
              mainText: pred.mainText?.text || pred.text.text,
              secondaryText: pred.secondaryText?.text || '',
              fullText: pred.text.text,
              rawSuggestion: s,
            };
          });

        setSuggestions(mapped);
      } catch (err) {
        if (!cancelled) {
          checkAndDispatchQuotaError(err);
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, 240);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [placesLib, query, enabled]);

  const resolveSuggestionToPlace = useCallback(
    async (item: PlaceSuggestionItem): Promise<SelectedPlaceInfo | null> => {
      const prediction = item.rawSuggestion.placePrediction;
      if (!prediction) return null;

      try {
        const place = prediction.toPlace();
        await place.fetchFields({
          fields: ['displayName', 'formattedAddress', 'location', 'viewport'],
        });

        const latLng = place.location
          ? { lat: place.location.lat(), lng: place.location.lng() }
          : undefined;

        const label =
          place.displayName && place.formattedAddress
            ? place.formattedAddress.includes(place.displayName)
              ? place.formattedAddress
              : `${place.displayName}, ${place.formattedAddress}`
            : place.formattedAddress || item.fullText;

        resetSession();

        return {
          label,
          formattedAddress: place.formattedAddress || item.fullText,
          placeId: place.id,
          location: latLng,
        };
      } catch (err) {
        checkAndDispatchQuotaError(err);
        resetSession();
        return {
          label: item.fullText,
          formattedAddress: item.fullText,
          placeId: item.placeId,
        };
      }
    },
    [resetSession]
  );

  return {
    suggestions,
    isLoading,
    resolveSuggestionToPlace,
    resetSession,
    isPlacesReady: Boolean(placesLib),
  };
}
