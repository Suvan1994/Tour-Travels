export enum JourneyType {
  ROUND_TRIP = 'ROUND_TRIP',
  ONE_WAY = 'ONE_WAY',
  LOCAL_RENTAL = 'LOCAL_RENTAL',
  AIRPORT_TRANSFER = 'AIRPORT_TRANSFER',
  GROUP_TOUR = 'GROUP_TOUR',
}

export enum VehicleCategory {
  ALL = 'all',
  SEDAN_SUV = 'suv',
  URBANIA = 'urbania',
  TEMPO = 'tempo',
  BUS = 'bus',
}

export interface VehicleSpecItem {
  icon: string;
  label: string;
}

export interface VehicleDefinition {
  id: string;
  name: string;
  shortName: string;
  category: Exclude<VehicleCategory, VehicleCategory.ALL>;
  badge: string;
  badgeStyle: 'primary' | 'secondary' | 'gold';
  headerIcon: string;
  passengerCapacity: number;
  seatLabel: string;
  luggageLabel: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  specs: VehicleSpecItem[];
  featured?: boolean;
}

export interface VehiclePricingRule {
  vehicleId: string;
  ratePerKm: number;
  oneWayRatePerKm: number;
  driverAllowancePerDay: number;
  nightChargePerNight: number;
  minTripFare: number;
  estimatedTollPerKm: number;
  defaultParkingEstimate: number;
  localPackage8Hr80KmFare: number;
  requiresCustomQuoteOverDays?: number;
}

export interface FarePolicyConfig {
  minOutstationKmPerDay: number;
  minOneWayBillableKm: number;
  localPackageKm: number;
  localPackageHours: number;
  gstPercentage: number;
  includeGstByDefault: boolean;
  includeEstimatedTollsByDefault: boolean;
  includeParkingByDefault: boolean;
  nightDrivingWindowLabel: string;
  customQuoteDistanceThresholdKm: number;
  customQuoteDaysThreshold: number;
  currencySymbol: string;
}

export interface PricingConfiguration {
  policy: FarePolicyConfig;
  vehicleRates: Record<string, VehiclePricingRule>;
}

export interface FareCalculationInput {
  vehicleId: string;
  oneWayRoadDistanceKm: number | null;
  journeyType: JourneyType;
  tripDays: number;
  includeTolls: boolean;
  includeParking: boolean;
  customTollAmount?: number | null;
  customParkingAmount?: number | null;
  nightDrivingNights: number;
  includeGst: boolean;
  requestCustomQuotation?: boolean;
}

export interface FareBreakdown {
  isRouteReady: boolean;
  isCustomQuotation: boolean;
  customQuotationReason?: string;
  oneWayRoadDistanceKm: number;
  actualTripDistanceKm: number;
  billableDistanceKm: number;
  minKmApplied: boolean;
  appliedRatePerKm: number;
  baseFare: number;
  minTripFareApplied: boolean;
  driverAllowance: number;
  tripDays: number;
  nightCharges: number;
  estimatedTolls: number;
  estimatedParking: number;
  otherCharges: number;
  subTotalBeforeGst: number;
  gstAmount: number;
  gstPercentage: number;
  estimatedTotal: number;
}

export interface SelectedPlaceInfo {
  label: string;
  formattedAddress: string;
  placeId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface RouteCalculationResult {
  distanceMeters: number;
  distanceKm: number;
  durationMillis: number;
  durationText: string;
  routeDescription: string;
  startAddress: string;
  endAddress: string;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
}

export interface BookingEnquiryPayload {
  name: string;
  mobile: string;
  pickup: string;
  destination: string;
  distanceText: string;
  journeyTypeLabel: string;
  vehicleName: string;
  passengers: number | string;
  travelDate: string;
  returnDate: string;
  estimatedFareText: string;
  specialRequirements: string;
}

export interface ContactInformation {
  businessName: string;
  shortName: string;
  subtitle: string;
  tagline: string;
  whatsappNumberInternational: string; // e.g. "918859364336"
  phoneDisplay: string; // e.g. "+91 88593 64336"
  phoneHref: string; // e.g. "tel:+918859364336"
  email: string;
  headquartersLabel: string;
  headquartersAddress: string;
  headquartersPlaceSearchQuery: string;
  googleRating: string;
  reviewCountLabel: string;
  totalTripsLabel: string;
  serviceHubs: string[];
  logoUrl: string;
}

export interface TourPackageItem {
  id: string;
  title: string;
  badge: string;
  badgeVariant: 'primary' | 'secondary' | 'gold';
  corridorTag: string;
  originQuery: string;
  destinationQuery: string;
  recommendedDays: number;
  recommendedVehicleId: string;
  description: string;
  highlights: { icon: string; text: string }[];
  highlightNote?: string;
  startingPriceLabel: string;
  priceSubLabel: string;
  isCustomQuote?: boolean;
  ctaLabel: string;
  imageUrl: string;
  imageAlt: string;
}

export interface WhyChoosePillar {
  icon: string;
  iconColorClass: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  name: string;
  tripContext: string;
  quote: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
