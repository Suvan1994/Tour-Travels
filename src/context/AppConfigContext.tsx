import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_CONTACT_CONFIG } from '../config/contactConfig';
import { DEFAULT_PRICING_CONFIG } from '../config/pricingConfig';
import { DEFAULT_VEHICLES } from '../config/vehiclesConfig';
import {
  BookingEnquiryPayload,
  ContactInformation,
  FareBreakdown,
  FarePolicyConfig,
  JourneyType,
  PricingConfiguration,
  RouteCalculationResult,
  SelectedPlaceInfo,
  VehicleDefinition,
  VehiclePricingRule,
} from '../types/travel';
import { calculateDaysBetweenDates, calculateEstimatedFare } from '../utils/fareCalculator';

const ADMIN_SESSION_STORAGE_KEY = 'jmd_admin_session_token_v1';

function getTomorrowDateString(offsetDays = 1): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function mergePricingWithDefaults(incoming?: Partial<PricingConfiguration> | null): PricingConfiguration {
  if (!incoming || typeof incoming !== 'object') {
    return DEFAULT_PRICING_CONFIG;
  }

  const mergedRates: Record<string, VehiclePricingRule> = { ...DEFAULT_PRICING_CONFIG.vehicleRates };
  if (incoming.vehicleRates && typeof incoming.vehicleRates === 'object') {
    for (const key of Object.keys(DEFAULT_PRICING_CONFIG.vehicleRates)) {
      if (incoming.vehicleRates[key]) {
        mergedRates[key] = {
          ...DEFAULT_PRICING_CONFIG.vehicleRates[key],
          ...incoming.vehicleRates[key],
        };
      }
    }
  }

  return {
    policy: {
      ...DEFAULT_PRICING_CONFIG.policy,
      ...(incoming.policy ?? {}),
    },
    vehicleRates: mergedRates,
  };
}

interface ActiveEnquiryModalState {
  isOpen: boolean;
  payload: BookingEnquiryPayload | null;
  whatsappUrl: string;
  rawMessage: string;
}

interface AppConfigContextValue {
  // Admin Authentication
  isAdminAuthenticated: boolean;
  loginAdmin: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logoutAdmin: () => void;

  // Admin-editable configurations (locked unless authenticated)
  contactConfig: ContactInformation;
  vehicles: VehicleDefinition[];
  pricingConfig: PricingConfiguration;
  updateVehicleRate: (vehicleId: string, partial: Partial<VehiclePricingRule>) => void;
  updateFarePolicy: (partial: Partial<FarePolicyConfig>) => void;
  updateContactConfig: (partial: Partial<ContactInformation>) => void;
  resetAdminConfigToDefaults: () => Promise<void>;

  // Shared Trip & Route State
  pickupPlace: SelectedPlaceInfo;
  setPickupPlace: (place: SelectedPlaceInfo) => void;
  destinationPlace: SelectedPlaceInfo;
  setDestinationPlace: (place: SelectedPlaceInfo) => void;
  swapLocations: () => void;

  routeResult: RouteCalculationResult | null;
  setRouteResult: (res: RouteCalculationResult | null) => void;
  isRouteLoading: boolean;
  setIsRouteLoading: (loading: boolean) => void;
  routeError: string | null;
  setRouteError: (err: string | null) => void;

  journeyType: JourneyType;
  setJourneyType: (type: JourneyType) => void;
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  selectedVehicle: VehicleDefinition;

  passengerName: string;
  setPassengerName: (name: string) => void;
  passengerMobile: string;
  setPassengerMobile: (mobile: string) => void;
  passengers: number;
  setPassengers: (count: number) => void;
  travelDate: string;
  setTravelDate: (date: string) => void;
  returnDate: string;
  setReturnDate: (date: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  tripDays: number;
  setTripDays: (days: number) => void;
  specialRequirements: string;
  setSpecialRequirements: (notes: string) => void;

  // Policy-driven Fare Flags (governed by Admin policy)
  includeTolls: boolean;
  includeParking: boolean;
  includeGst: boolean;
  nightDrivingNights: number;
  setNightDrivingNights: (n: number) => void;
  requestCustomQuotation: boolean;
  setRequestCustomQuotation: (v: boolean) => void;

  // Live Calculated Fare Breakdown
  fareBreakdown: FareBreakdown;

  // Helper to pre-load a tour package or destination
  loadRoutePreset: (opts: {
    originAddress?: string;
    destinationAddress: string;
    vehicleId?: string;
    days?: number;
    journeyType?: JourneyType;
    customQuote?: boolean;
  }) => void;

  // Modals
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  enquiryModal: ActiveEnquiryModalState;
  openEnquiryModal: (payload: BookingEnquiryPayload, whatsappUrl: string, rawMessage: string) => void;
  closeEnquiryModal: () => void;
}

const AppConfigContext = createContext<AppConfigContextValue | null>(null);

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pricingConfig, setPricingConfig] = useState<PricingConfiguration>(DEFAULT_PRICING_CONFIG);
  const [contactConfig, setContactConfig] = useState<ContactInformation>(DEFAULT_CONTACT_CONFIG);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const vehicles = DEFAULT_VEHICLES;
  const saveTimerRef = useRef<number | null>(null);

  // Clean up any legacy unauthenticated localStorage keys from older builds
  useEffect(() => {
    try {
      localStorage.removeItem('jmd_admin_pricing_v1');
      localStorage.removeItem('jmd_admin_contact_v1');
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Load official persisted config from backend on mount
  useEffect(() => {
    let cancelled = false;
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { config?: { pricingConfig?: Partial<PricingConfiguration>; contactConfig?: Partial<ContactInformation> } | null } | null) => {
        if (cancelled || !data?.config) return;
        if (data.config.pricingConfig) {
          setPricingConfig(mergePricingWithDefaults(data.config.pricingConfig));
        }
        if (data.config.contactConfig) {
          setContactConfig({ ...DEFAULT_CONTACT_CONFIG, ...data.config.contactConfig });
        }
      })
      .catch(() => {
        // Fallback to built-in official defaults if offline
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Verify existing admin session token on mount
  useEffect(() => {
    if (!adminToken) {
      setIsAdminAuthenticated(false);
      return;
    }

    let cancelled = false;
    fetch('/api/admin/session', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data: { authenticated?: boolean }) => {
        if (cancelled) return;
        if (data.authenticated) {
          setIsAdminAuthenticated(true);
        } else {
          setIsAdminAuthenticated(false);
          setAdminToken(null);
          try {
            sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
          } catch {
            // Ignore
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdminAuthenticated(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [adminToken]);

  const loginAdmin = useCallback(
    async (username: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = (await res.json()) as {
          ok?: boolean;
          token?: string;
          error?: string;
        };

        if (!res.ok || !data.ok || !data.token) {
          return {
            ok: false,
            error: data.error || 'Invalid Admin username or password.',
          };
        }

        setAdminToken(data.token);
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, data.token);
        } catch {
          // Ignore storage errors
        }
        return { ok: true };
      } catch {
        return {
          ok: false,
          error: 'Unable to reach authentication server. Please try again.',
        };
      }
    },
    []
  );

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    setAdminToken(null);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const persistAdminConfigToServer = useCallback(
    (nextPricing: PricingConfiguration, nextContact: ContactInformation, token: string | null) => {
      if (!token) return;
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = window.setTimeout(() => {
        fetch('/api/admin/config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pricingConfig: nextPricing,
            contactConfig: nextContact,
          }),
        }).catch(() => {
          // Ignore transient network errors
        });
      }, 300);
    },
    []
  );

  const updateVehicleRate = useCallback(
    (vehicleId: string, partial: Partial<VehiclePricingRule>) => {
      if (!isAdminAuthenticated) return;
      setPricingConfig((prev) => {
        const next: PricingConfiguration = {
          ...prev,
          vehicleRates: {
            ...prev.vehicleRates,
            [vehicleId]: {
              ...prev.vehicleRates[vehicleId],
              ...partial,
            },
          },
        };
        persistAdminConfigToServer(next, contactConfig, adminToken);
        return next;
      });
    },
    [isAdminAuthenticated, contactConfig, adminToken, persistAdminConfigToServer]
  );

  const updateFarePolicy = useCallback(
    (partial: Partial<FarePolicyConfig>) => {
      if (!isAdminAuthenticated) return;
      setPricingConfig((prev) => {
        const next: PricingConfiguration = {
          ...prev,
          policy: {
            ...prev.policy,
            ...partial,
          },
        };
        persistAdminConfigToServer(next, contactConfig, adminToken);
        return next;
      });
    },
    [isAdminAuthenticated, contactConfig, adminToken, persistAdminConfigToServer]
  );

  const updateContactConfig = useCallback(
    (partial: Partial<ContactInformation>) => {
      if (!isAdminAuthenticated) return;
      setContactConfig((prev) => {
        const next = { ...prev, ...partial };
        persistAdminConfigToServer(pricingConfig, next, adminToken);
        return next;
      });
    },
    [isAdminAuthenticated, pricingConfig, adminToken, persistAdminConfigToServer]
  );

  const resetAdminConfigToDefaults = useCallback(async () => {
    if (!isAdminAuthenticated || !adminToken) return;
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }
    setPricingConfig(DEFAULT_PRICING_CONFIG);
    setContactConfig(DEFAULT_CONTACT_CONFIG);
    try {
      await fetch('/api/admin/config', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    } catch {
      // Ignore network errors
    }
  }, [isAdminAuthenticated, adminToken]);

  // Shared Trip State
  const [pickupPlace, setPickupPlace] = useState<SelectedPlaceInfo>({
    label: 'Indira Gandhi International Airport, New Delhi',
    formattedAddress: 'Indira Gandhi International Airport, New Delhi, Delhi, India',
  });

  const [destinationPlace, setDestinationPlace] = useState<SelectedPlaceInfo>({
    label: 'Jaipur, Rajasthan',
    formattedAddress: 'Jaipur, Rajasthan, India',
  });

  const [routeResult, setRouteResult] = useState<RouteCalculationResult | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState<boolean>(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const [journeyType, setJourneyTypeState] = useState<JourneyType>(JourneyType.ROUND_TRIP);
  const [selectedVehicleId, setSelectedVehicleIdState] = useState<string>('innova-crysta');

  const [passengerName, setPassengerName] = useState<string>('');
  const [passengerMobile, setPassengerMobile] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(4);
  const [travelDate, setTravelDateState] = useState<string>(() => getTomorrowDateString(1));
  const [returnDate, setReturnDateState] = useState<string>(() => getTomorrowDateString(2));
  const [pickupTime, setPickupTime] = useState<string>('06:00');
  const [tripDays, setTripDaysState] = useState<number>(2);
  const [specialRequirements, setSpecialRequirements] = useState<string>('');

  const [nightDrivingNights, setNightDrivingNights] = useState<number>(0);
  const [requestCustomQuotation, setRequestCustomQuotation] = useState<boolean>(false);

  // Governed exclusively by Admin Fare Policy settings
  const includeTolls = pricingConfig.policy.includeEstimatedTollsByDefault;
  const includeParking = pricingConfig.policy.includeParkingByDefault;
  const includeGst = pricingConfig.policy.includeGstByDefault;

  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [enquiryModal, setEnquiryModal] = useState<ActiveEnquiryModalState>({
    isOpen: false,
    payload: null,
    whatsappUrl: '',
    rawMessage: '',
  });

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId) ?? vehicles[0],
    [vehicles, selectedVehicleId]
  );

  const setSelectedVehicleId = useCallback(
    (id: string) => {
      setSelectedVehicleIdState(id);
      const found = vehicles.find((v) => v.id === id);
      if (found && passengers > found.passengerCapacity) {
        setPassengers(found.passengerCapacity);
      }
    },
    [vehicles, passengers]
  );

  const setJourneyType = useCallback(
    (type: JourneyType) => {
      setJourneyTypeState(type);
      if (type === JourneyType.ONE_WAY || type === JourneyType.AIRPORT_TRANSFER) {
        setTripDaysState(1);
      } else if (type === JourneyType.ROUND_TRIP || type === JourneyType.GROUP_TOUR) {
        const computedDays = calculateDaysBetweenDates(travelDate, returnDate);
        setTripDaysState(Math.max(1, computedDays));
      }
    },
    [travelDate, returnDate]
  );

  const setTravelDate = useCallback(
    (newTravelDate: string) => {
      setTravelDateState(newTravelDate);
      if (returnDate && newTravelDate > returnDate) {
        setReturnDateState(newTravelDate);
        setTripDaysState(1);
      } else if (
        journeyType === JourneyType.ROUND_TRIP ||
        journeyType === JourneyType.GROUP_TOUR
      ) {
        setTripDaysState(calculateDaysBetweenDates(newTravelDate, returnDate));
      }
    },
    [returnDate, journeyType]
  );

  const setReturnDate = useCallback(
    (newReturnDate: string) => {
      setReturnDateState(newReturnDate);
      if (
        journeyType === JourneyType.ROUND_TRIP ||
        journeyType === JourneyType.GROUP_TOUR
      ) {
        setTripDaysState(calculateDaysBetweenDates(travelDate, newReturnDate));
      }
    },
    [travelDate, journeyType]
  );

  const setTripDays = useCallback(
    (days: number) => {
      const clamped = Math.max(1, Math.round(days));
      setTripDaysState(clamped);
      if (travelDate) {
        const d = new Date(travelDate);
        if (!Number.isNaN(d.getTime())) {
          d.setDate(d.getDate() + (clamped - 1));
          setReturnDateState(d.toISOString().split('T')[0]);
        }
      }
    },
    [travelDate]
  );

  const swapLocations = useCallback(() => {
    setPickupPlace(destinationPlace);
    setDestinationPlace(pickupPlace);
  }, [pickupPlace, destinationPlace]);

  // Auto-detect night charge when pickup time falls in night window (22:00 - 05:00)
  useEffect(() => {
    if (!pickupTime) return;
    const hour = parseInt(pickupTime.split(':')[0] || '6', 10);
    if (hour >= 22 || hour < 5) {
      setNightDrivingNights((prev) => (prev === 0 ? 1 : prev));
    }
  }, [pickupTime]);

  const fareBreakdown = useMemo(
    () =>
      calculateEstimatedFare(
        {
          vehicleId: selectedVehicleId,
          oneWayRoadDistanceKm: routeResult ? routeResult.distanceKm : null,
          journeyType,
          tripDays,
          includeTolls,
          includeParking,
          nightDrivingNights,
          includeGst,
          requestCustomQuotation,
        },
        pricingConfig
      ),
    [
      selectedVehicleId,
      routeResult,
      journeyType,
      tripDays,
      includeTolls,
      includeParking,
      nightDrivingNights,
      includeGst,
      requestCustomQuotation,
      pricingConfig,
    ]
  );

  const loadRoutePreset = useCallback(
    (opts: {
      originAddress?: string;
      destinationAddress: string;
      vehicleId?: string;
      days?: number;
      journeyType?: JourneyType;
      customQuote?: boolean;
    }) => {
      if (opts.originAddress) {
        setPickupPlace({
          label: opts.originAddress,
          formattedAddress: opts.originAddress,
        });
      }
      setDestinationPlace({
        label: opts.destinationAddress,
        formattedAddress: opts.destinationAddress,
      });
      if (opts.vehicleId) {
        setSelectedVehicleId(opts.vehicleId);
      }
      if (opts.journeyType) {
        setJourneyTypeState(opts.journeyType);
      } else {
        setJourneyTypeState(JourneyType.ROUND_TRIP);
      }
      if (opts.days) {
        setTripDays(opts.days);
      }
      setRequestCustomQuotation(Boolean(opts.customQuote));
    },
    [setSelectedVehicleId, setTripDays]
  );

  const openEnquiryModal = useCallback(
    (payload: BookingEnquiryPayload, whatsappUrl: string, rawMessage: string) => {
      setEnquiryModal({
        isOpen: true,
        payload,
        whatsappUrl,
        rawMessage,
      });
    },
    []
  );

  const closeEnquiryModal = useCallback(() => {
    setEnquiryModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const value: AppConfigContextValue = {
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    contactConfig,
    vehicles,
    pricingConfig,
    updateVehicleRate,
    updateFarePolicy,
    updateContactConfig,
    resetAdminConfigToDefaults,
    pickupPlace,
    setPickupPlace,
    destinationPlace,
    setDestinationPlace,
    swapLocations,
    routeResult,
    setRouteResult,
    isRouteLoading,
    setIsRouteLoading,
    routeError,
    setRouteError,
    journeyType,
    setJourneyType,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedVehicle,
    passengerName,
    setPassengerName,
    passengerMobile,
    setPassengerMobile,
    passengers,
    setPassengers,
    travelDate,
    setTravelDate,
    returnDate,
    setReturnDate,
    pickupTime,
    setPickupTime,
    tripDays,
    setTripDays,
    specialRequirements,
    setSpecialRequirements,
    includeTolls,
    includeParking,
    includeGst,
    nightDrivingNights,
    setNightDrivingNights,
    requestCustomQuotation,
    setRequestCustomQuotation,
    fareBreakdown,
    loadRoutePreset,
    isAdminModalOpen,
    setIsAdminModalOpen,
    enquiryModal,
    openEnquiryModal,
    closeEnquiryModal,
  };

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
};

export function useAppConfig(): AppConfigContextValue {
  const ctx = useContext(AppConfigContext);
  if (!ctx) {
    throw new Error('useAppConfig must be used inside AppConfigProvider');
  }
  return ctx;
}
