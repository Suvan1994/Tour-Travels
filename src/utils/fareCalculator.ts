import {
  FareBreakdown,
  FareCalculationInput,
  JourneyType,
  PricingConfiguration,
} from '../types/travel';

/**
 * Reusable Dynamic Fare Pricing Engine for JMD Tour & Travels.
 *
 * Formula:
 *   Base Fare = Billable Distance × Vehicle Rate (subject to Minimum Trip Fare)
 *   Estimated Total = Base Fare + Driver Allowance + Tolls + Parking + Other Applicable Charges (+ GST if enabled)
 */
export function calculateEstimatedFare(
  input: FareCalculationInput,
  pricingConfig: PricingConfiguration
): FareBreakdown {
  const { policy, vehicleRates } = pricingConfig;
  const rule =
    vehicleRates[input.vehicleId] ??
    Object.values(vehicleRates)[0];

  const validDays = Math.max(1, Math.round(input.tripDays || 1));
  const nights = Math.max(0, Math.round(input.nightDrivingNights || 0));

  // Local 8Hr / 80KM Rental Mode
  if (input.journeyType === JourneyType.LOCAL_RENTAL) {
    const billableDistanceKm = policy.localPackageKm * validDays;
    const baseFare = rule.localPackage8Hr80KmFare * validDays;
    const driverAllowance = validDays > 1 ? rule.driverAllowancePerDay * validDays : 0;
    const nightCharges = nights * rule.nightChargePerNight;
    const estimatedParking = input.includeParking
      ? (input.customParkingAmount ?? rule.defaultParkingEstimate)
      : 0;
    const estimatedTolls = input.includeTolls
      ? (input.customTollAmount ?? 0)
      : 0;
    const otherCharges = nightCharges;
    const subTotalBeforeGst =
      baseFare + driverAllowance + estimatedTolls + estimatedParking + otherCharges;
    const gstAmount = input.includeGst
      ? Math.round((subTotalBeforeGst * policy.gstPercentage) / 100)
      : 0;

    return {
      isRouteReady: true,
      isCustomQuotation: Boolean(input.requestCustomQuotation),
      customQuotationReason: input.requestCustomQuotation
        ? 'Custom itinerary quotation requested'
        : undefined,
      oneWayRoadDistanceKm: policy.localPackageKm,
      actualTripDistanceKm: billableDistanceKm,
      billableDistanceKm,
      minKmApplied: false,
      appliedRatePerKm: rule.ratePerKm,
      baseFare,
      minTripFareApplied: false,
      driverAllowance,
      tripDays: validDays,
      nightCharges,
      estimatedTolls,
      estimatedParking,
      otherCharges,
      subTotalBeforeGst,
      gstAmount,
      gstPercentage: policy.gstPercentage,
      estimatedTotal: Math.round(subTotalBeforeGst + gstAmount),
    };
  }

  // Require real road distance for One-Way, Round-Trip, Airport, and Group Tour
  if (
    input.oneWayRoadDistanceKm === null ||
    Number.isNaN(input.oneWayRoadDistanceKm) ||
    input.oneWayRoadDistanceKm <= 0
  ) {
    return {
      isRouteReady: false,
      isCustomQuotation: Boolean(input.requestCustomQuotation),
      oneWayRoadDistanceKm: 0,
      actualTripDistanceKm: 0,
      billableDistanceKm: 0,
      minKmApplied: false,
      appliedRatePerKm:
        input.journeyType === JourneyType.ONE_WAY ? rule.oneWayRatePerKm : rule.ratePerKm,
      baseFare: 0,
      minTripFareApplied: false,
      driverAllowance: 0,
      tripDays: validDays,
      nightCharges: 0,
      estimatedTolls: 0,
      estimatedParking: 0,
      otherCharges: 0,
      subTotalBeforeGst: 0,
      gstAmount: 0,
      gstPercentage: policy.gstPercentage,
      estimatedTotal: 0,
    };
  }

  const oneWayKm = Math.max(1, Math.round(input.oneWayRoadDistanceKm));
  const isOneWayOrAirport =
    input.journeyType === JourneyType.ONE_WAY ||
    input.journeyType === JourneyType.AIRPORT_TRANSFER;

  const actualTripDistanceKm = isOneWayOrAirport ? oneWayKm : oneWayKm * 2;

  let minRequiredKm = 0;
  if (input.journeyType === JourneyType.AIRPORT_TRANSFER) {
    minRequiredKm = 40;
  } else if (input.journeyType === JourneyType.ONE_WAY) {
    minRequiredKm = policy.minOneWayBillableKm;
  } else {
    minRequiredKm = validDays * policy.minOutstationKmPerDay;
  }

  const billableDistanceKm = Math.max(actualTripDistanceKm, minRequiredKm);
  const minKmApplied = billableDistanceKm > actualTripDistanceKm;

  // Use standard per-km starting rate from central config (or oneWayRatePerKm when configured & applicable)
  const appliedRatePerKm =
    input.journeyType === JourneyType.ONE_WAY ? rule.ratePerKm : rule.ratePerKm;

  const rawBaseFare = billableDistanceKm * appliedRatePerKm;
  const baseFare = Math.max(rawBaseFare, rule.minTripFare);
  const minTripFareApplied = baseFare > rawBaseFare;

  const effectiveDays =
    input.journeyType === JourneyType.AIRPORT_TRANSFER ? 1 : validDays;
  const driverAllowance =
    input.journeyType === JourneyType.AIRPORT_TRANSFER
      ? 0
      : effectiveDays * rule.driverAllowancePerDay;

  const nightCharges = nights * rule.nightChargePerNight;

  const calculatedToll = Math.round(actualTripDistanceKm * rule.estimatedTollPerKm);
  const estimatedTolls = input.includeTolls
    ? input.customTollAmount !== null && input.customTollAmount !== undefined
      ? Math.max(0, Math.round(input.customTollAmount))
      : calculatedToll
    : 0;

  const estimatedParking = input.includeParking
    ? input.customParkingAmount !== null && input.customParkingAmount !== undefined
      ? Math.max(0, Math.round(input.customParkingAmount))
      : rule.defaultParkingEstimate * (isOneWayOrAirport ? 1 : Math.min(effectiveDays, 3))
    : 0;

  const otherCharges = nightCharges;

  const subTotalBeforeGst =
    baseFare + driverAllowance + estimatedTolls + estimatedParking + otherCharges;

  const gstAmount = input.includeGst
    ? Math.round((subTotalBeforeGst * policy.gstPercentage) / 100)
    : 0;

  const estimatedTotal = Math.round(subTotalBeforeGst + gstAmount);

  const exceedsThreshold =
    actualTripDistanceKm >= policy.customQuoteDistanceThresholdKm ||
    effectiveDays >= policy.customQuoteDaysThreshold;

  const isCustomQuotation = Boolean(input.requestCustomQuotation || exceedsThreshold);
  const customQuotationReason = input.requestCustomQuotation
    ? 'Custom multi-stop / group quotation requested'
    : exceedsThreshold
      ? `Long-distance / ${effectiveDays}-day tour qualifies for special package discount`
      : undefined;

  return {
    isRouteReady: true,
    isCustomQuotation,
    customQuotationReason,
    oneWayRoadDistanceKm: oneWayKm,
    actualTripDistanceKm,
    billableDistanceKm,
    minKmApplied,
    appliedRatePerKm,
    baseFare,
    minTripFareApplied,
    driverAllowance,
    tripDays: effectiveDays,
    nightCharges,
    estimatedTolls,
    estimatedParking,
    otherCharges,
    subTotalBeforeGst,
    gstAmount,
    gstPercentage: policy.gstPercentage,
    estimatedTotal,
  };
}

export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatDurationMillis(durationMillis: number): string {
  if (!durationMillis || durationMillis <= 0) return '—';
  const totalMinutes = Math.round(durationMillis / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

export function getJourneyTypeLabel(type: JourneyType): string {
  switch (type) {
    case JourneyType.ROUND_TRIP:
      return 'Outstation Round Trip';
    case JourneyType.ONE_WAY:
      return 'One-Way Drop';
    case JourneyType.LOCAL_RENTAL:
      return 'Local 8Hr / 80KM Package';
    case JourneyType.AIRPORT_TRANSFER:
      return 'Airport Transfer';
    case JourneyType.GROUP_TOUR:
      return 'Group Tour (Round Trip)';
    default:
      return 'Outstation Trip';
  }
}

export function calculateDaysBetweenDates(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return 1;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
}
