import React, { useState } from 'react';
import { useAppConfig } from '../context/AppConfigContext';
import { JourneyType } from '../types/travel';
import { formatDurationMillis, formatINR, getJourneyTypeLabel } from '../utils/fareCalculator';
import {
  buildWhatsAppEnquiryMessage,
  buildWhatsAppUrl,
  openExternalLinkInNewTab,
  validateBookingEnquiry,
} from '../utils/whatsappBooking';
import { PlacesAutocompleteInput } from './PlacesAutocompleteInput';

export const FareCalculator: React.FC<{ hasMapsApiKey: boolean }> = ({ hasMapsApiKey }) => {
  const {
    contactConfig,
    vehicles,
    pricingConfig,
    pickupPlace,
    setPickupPlace,
    destinationPlace,
    setDestinationPlace,
    routeResult,
    isRouteLoading,
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
    returnDate,
    tripDays,
    setTripDays,
    specialRequirements,
    includeTolls,
    includeParking,
    includeGst,
    nightDrivingNights,
    setNightDrivingNights,
    requestCustomQuotation,
    setRequestCustomQuotation,
    fareBreakdown,
    openEnquiryModal,
    isAdminAuthenticated,
    setIsAdminModalOpen,
  } = useAppConfig();

  const [showQuickContactPrompt, setShowQuickContactPrompt] = useState<boolean>(false);
  const [quickErrors, setQuickErrors] = useState<Record<string, string>>({});

  const isRoundTripLike =
    journeyType === JourneyType.ROUND_TRIP || journeyType === JourneyType.GROUP_TOUR;

  const handleRequestBestFare = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateBookingEnquiry({
      name: passengerName,
      mobile: passengerMobile,
      pickup: pickupPlace.label,
      destination: destinationPlace.label,
      passengers,
      maxCapacity: selectedVehicle.passengerCapacity,
      travelDate,
      returnDate,
      requireReturnDate: isRoundTripLike,
    });

    if (!validation.valid) {
      setShowQuickContactPrompt(true);
      setQuickErrors(validation.errors);
      return;
    }

    setQuickErrors({});
    setShowQuickContactPrompt(false);

    const distanceText =
      journeyType === JourneyType.LOCAL_RENTAL
        ? `${fareBreakdown.billableDistanceKm} KM (Local 8Hr / 80KM)`
        : routeResult
          ? `${routeResult.distanceKm} KM one-way (${fareBreakdown.billableDistanceKm} KM billable)`
          : 'Route calculation pending';

    const estimatedFareText = !fareBreakdown.isRouteReady
      ? 'Custom Quotation Requested'
      : fareBreakdown.isCustomQuotation
        ? `${formatINR(fareBreakdown.estimatedTotal)} (ESTIMATED FARE • Custom Quotation Requested)`
        : `${formatINR(fareBreakdown.estimatedTotal)} (ESTIMATED FARE • ₹${fareBreakdown.appliedRatePerKm}/km${
            includeGst ? `, incl. ${fareBreakdown.gstPercentage}% GST` : ''
          })`;

    const payload = {
      name: passengerName,
      mobile: passengerMobile,
      pickup: pickupPlace.label,
      destination: destinationPlace.label,
      distanceText,
      journeyTypeLabel: getJourneyTypeLabel(journeyType),
      vehicleName: `${selectedVehicle.name} (${selectedVehicle.passengerCapacity} Pax)`,
      passengers,
      travelDate,
      returnDate: isRoundTripLike ? returnDate : 'N/A (One-Way / Single Day)',
      estimatedFareText,
      specialRequirements:
        specialRequirements ||
        (requestCustomQuotation
          ? 'Requesting custom package quotation.'
          : 'Calculated via JMD Dynamic Fare Estimator.'),
    };

    const message = buildWhatsAppEnquiryMessage(payload);
    const whatsappUrl = buildWhatsAppUrl(contactConfig.whatsappNumberInternational, message);

    openEnquiryModal(payload, whatsappUrl, message);
    openExternalLinkInNewTab(whatsappUrl);
  };

  const rule = pricingConfig.vehicleRates[selectedVehicleId];

  return (
    <section id="fare-estimator" className="w-full py-space-xl bg-background">
      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
        <div className="bg-surface-canvas rounded-3xl p-space-lg lg:p-space-xl shadow-lg border border-primary-container/8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
            <div className="max-w-3xl">
              <span className="text-label-md text-secondary font-bold uppercase tracking-wider">
                Dynamic Pricing Engine • Live Google Maps Distance
              </span>
              <h2 className="text-headline-lg-mobile sm:text-headline-lg text-primary tracking-tight mt-1">
                Inter-State Dynamic Fare Calculator
              </h2>
              <p className="text-body-lg text-on-surface-variant mt-1">
                Enter your pickup, destination, vehicle category, and trip duration below to compute an itemized <strong>Estimated Fare</strong> based on official JMD tariffs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-subtle hover:bg-surface-container text-primary text-label-md font-bold transition-colors cursor-pointer shrink-0 border border-primary-container/10"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary" aria-hidden="true">
                {isAdminAuthenticated ? 'lock_open' : 'lock'}
              </span>
              <span>
                {isAdminAuthenticated ? 'Edit Fare & Policy Settings' : 'Admin Fare Policy Login'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Estimator Configuration Inputs (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <PlacesAutocompleteInput
                  id="calcOriginInput"
                  label="Pickup Location"
                  icon="my_location"
                  placeholder="Enter origin city or airport..."
                  value={pickupPlace}
                  onSelect={setPickupPlace}
                  hasMapsApiKey={hasMapsApiKey}
                />

                <PlacesAutocompleteInput
                  id="calcDestInput"
                  label="Destination Location"
                  icon="pin_drop"
                  placeholder="Enter destination city..."
                  value={destinationPlace}
                  onSelect={setDestinationPlace}
                  hasMapsApiKey={hasMapsApiKey}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="calcVehicleSelect"
                    className="text-label-md text-on-surface font-semibold"
                  >
                    Vehicle Category
                  </label>
                  <select
                    id="calcVehicleSelect"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border border-primary-container/15 focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active text-body-md"
                  >
                    {vehicles.map((v) => {
                      const r = pricingConfig.vehicleRates[v.id]?.ratePerKm ?? 0;
                      return (
                        <option key={v.id} value={v.id}>
                          {v.shortName} — ₹{r}/km ({v.passengerCapacity} Pax)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="calcJourneyType"
                    className="text-label-md text-on-surface font-semibold"
                  >
                    Journey Type
                  </label>
                  <select
                    id="calcJourneyType"
                    value={journeyType}
                    onChange={(e) => setJourneyType(e.target.value as JourneyType)}
                    className="w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border border-primary-container/15 focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active text-body-md"
                  >
                    <option value={JourneyType.ROUND_TRIP}>Round Trip (Return)</option>
                    <option value={JourneyType.ONE_WAY}>One-Way Drop</option>
                    <option value={JourneyType.LOCAL_RENTAL}>Local 8Hr / 80KM</option>
                    <option value={JourneyType.AIRPORT_TRANSFER}>Airport Transfer</option>
                    <option value={JourneyType.GROUP_TOUR}>Group Tour (Round Trip)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="calcDaysSelect"
                    className="text-label-md text-on-surface font-semibold"
                  >
                    Trip Duration (Days)
                  </label>
                  <select
                    id="calcDaysSelect"
                    value={tripDays}
                    disabled={
                      journeyType === JourneyType.ONE_WAY ||
                      journeyType === JourneyType.AIRPORT_TRANSFER
                    }
                    onChange={(e) => setTripDays(parseInt(e.target.value, 10))}
                    className="w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border border-primary-container/15 focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active text-body-md disabled:opacity-60"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14].map((d) => (
                      <option key={d} value={d}>
                        {d === 1 ? 'Same Day (1 Day)' : `${d} Days / ${d - 1} Nights`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Trip Timing & Custom Itinerary Options */}
              <div className="bg-surface-subtle p-space-md rounded-2xl border border-primary-container/8 flex flex-col gap-space-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-label-md text-primary font-bold uppercase tracking-wider">
                    Trip Timing &amp; Special Itinerary Options
                  </span>
                  <span className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant bg-surface-canvas px-2.5 py-1 rounded-md border border-primary-container/10">
                    <span className="material-symbols-outlined text-[14px] text-secondary" aria-hidden="true">
                      verified_user
                    </span>
                    <span>
                      Official Tariff Policy ({includeTolls ? 'Est. Tolls Incl.' : 'Tolls at Actuals'} •{' '}
                      {includeParking ? 'Est. Parking Incl.' : 'Parking at Actuals'}
                      {includeGst ? ` • ${pricingConfig.policy.gstPercentage}% GST` : ''})
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex flex-col gap-1 bg-surface-canvas p-3 rounded-xl border border-primary-container/8">
                    <label
                      htmlFor="nightNightsInput"
                      className="text-label-md font-semibold text-on-surface"
                    >
                      Night Driving ({pricingConfig.policy.nightDrivingWindowLabel})
                    </label>
                    <select
                      id="nightNightsInput"
                      value={nightDrivingNights}
                      onChange={(e) => setNightDrivingNights(parseInt(e.target.value, 10))}
                      className="h-10 px-3 bg-surface-subtle rounded-lg border border-primary-container/15 text-body-sm text-on-surface mt-0.5"
                    >
                      <option value={0}>0 Nights (Standard Day Driving)</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Night' : 'Nights'} (+₹
                          {(rule?.nightChargePerNight ?? 300) * n})
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center justify-between gap-2 bg-surface-canvas p-3 rounded-xl border border-primary-container/8 cursor-pointer">
                    <div className="flex flex-col">
                      <span className="text-label-lg font-semibold text-on-surface">
                        Custom Multi-City / Wedding Quote
                      </span>
                      <span className="text-body-sm text-on-surface-variant">
                        Request tailored group or hill yatra package
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={requestCustomQuotation}
                      onChange={(e) => setRequestCustomQuotation(e.target.checked)}
                      className="w-4 h-4 accent-secondary shrink-0"
                    />
                  </label>
                </div>
              </div>

              {/* Policy Note Box */}
              <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5" aria-hidden="true">
                  info
                </span>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  <strong>Outstation Policy:</strong> Minimum{' '}
                  <span className="tabular-nums font-semibold">
                    {pricingConfig.policy.minOutstationKmPerDay} KM
                  </span>{' '}
                  per calendar day on round trips (minimum{' '}
                  <span className="tabular-nums font-semibold">
                    {pricingConfig.policy.minOneWayBillableKm} KM
                  </span>{' '}
                  on one-way drops). State border passenger taxes, hill AC surcharges (if applicable), and physical toll/parking receipts are settled transparently.
                </p>
              </div>
            </div>

            {/* Itemized Estimated Fare Breakdown Card (5 Cols) */}
            <form
              onSubmit={handleRequestBestFare}
              noValidate
              className="lg:col-span-5 bg-primary text-surface-canvas p-space-lg rounded-2xl shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-space-md border-b border-surface-canvas/10 gap-2">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-rating-gold text-[22px]" aria-hidden="true">
                      payments
                    </span>
                    <span className="text-title-md font-bold text-surface-canvas">
                      Itemized Estimated Fare
                    </span>
                  </div>
                  <span className="text-label-sm bg-rating-gold/20 text-rating-gold px-2 py-1 rounded uppercase font-bold">
                    Estimate Only
                  </span>
                </div>

                {/* Breakdown Rows */}
                <div className="flex flex-col gap-2.5 text-body-sm pt-space-md">
                  <div className="flex justify-between items-center text-surface-container-high">
                    <span>Selected Vehicle:</span>
                    <span className="text-label-lg font-bold text-surface-canvas text-right">
                      {selectedVehicle.shortName} (₹{fareBreakdown.appliedRatePerKm}/km)
                    </span>
                  </div>

                  {journeyType !== JourneyType.LOCAL_RENTAL && (
                    <div className="flex justify-between items-center text-surface-container-high">
                      <span>Google Maps Road Distance:</span>
                      <span className="text-label-lg font-bold text-surface-canvas tabular-nums">
                        {isRouteLoading
                          ? 'Calculating…'
                          : routeResult
                            ? `${routeResult.distanceKm} KM (${routeResult.durationText})`
                            : 'Select Route'}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-surface-container-high">
                    <span>
                      Billable Distance
                      {fareBreakdown.minKmApplied ? ' (Min KM Rule)' : ''}:
                    </span>
                    <span className="text-label-lg font-bold text-surface-canvas tabular-nums">
                      {fareBreakdown.isRouteReady
                        ? `${fareBreakdown.billableDistanceKm} KM`
                        : '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-surface-container-high">
                    <span>
                      Base Fare
                      {fareBreakdown.minTripFareApplied ? ' (Min Trip Fare)' : ''}:
                    </span>
                    <span className="text-label-lg font-bold text-surface-canvas tabular-nums">
                      {fareBreakdown.isRouteReady ? formatINR(fareBreakdown.baseFare) : '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-surface-container-high">
                    <span>Driver Allowance ({fareBreakdown.tripDays}D):</span>
                    <span className="text-label-lg font-bold text-surface-canvas tabular-nums">
                      {fareBreakdown.isRouteReady
                        ? formatINR(fareBreakdown.driverAllowance)
                        : '—'}
                    </span>
                  </div>

                  {fareBreakdown.nightCharges > 0 && (
                    <div className="flex justify-between items-center text-surface-container-high">
                      <span>Night Driving Charges ({nightDrivingNights}N):</span>
                      <span className="text-label-lg font-bold text-surface-canvas tabular-nums">
                        {formatINR(fareBreakdown.nightCharges)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-surface-container-high">
                    <span>Estimated Tolls:</span>
                    <span className="text-label-lg font-bold text-surface-canvas tabular-nums">
                      {!fareBreakdown.isRouteReady
                        ? '—'
                        : includeTolls
                          ? `~${formatINR(fareBreakdown.estimatedTolls)}`
                          : 'At Actuals'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-surface-container-high">
                    <span>Estimated Parking:</span>
                    <span className="text-label-lg font-bold text-surface-canvas tabular-nums">
                      {!fareBreakdown.isRouteReady
                        ? '—'
                        : includeParking
                          ? `~${formatINR(fareBreakdown.estimatedParking)}`
                          : 'At Actuals'}
                    </span>
                  </div>

                  {includeGst && fareBreakdown.isRouteReady && (
                    <div className="flex justify-between items-center text-surface-container-high">
                      <span>GST ({fareBreakdown.gstPercentage}%):</span>
                      <span className="text-label-lg font-bold text-surface-canvas tabular-nums">
                        {formatINR(fareBreakdown.gstAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-surface-container-high">
                    <span>State Entry Permit:</span>
                    <span className="text-label-sm text-rating-gold font-semibold">
                      At Actuals (if inter-state)
                    </span>
                  </div>
                </div>

                {/* Estimated Total Box */}
                <div className="mt-space-md p-space-md bg-surface-canvas/8 rounded-xl border border-surface-canvas/10 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-label-sm text-surface-dim uppercase tracking-wider">
                      ESTIMATED FARE TOTAL
                    </span>
                    <span className="text-headline-lg font-extrabold text-rating-gold leading-none mt-1 tabular-nums">
                      {fareBreakdown.isRouteReady
                        ? formatINR(fareBreakdown.estimatedTotal)
                        : '—'}
                    </span>
                    {fareBreakdown.isCustomQuotation && fareBreakdown.customQuotationReason && (
                      <span className="text-label-sm text-secondary-fixed mt-1.5">
                        {fareBreakdown.customQuotationReason}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col text-right shrink-0">
                    <span className="text-label-sm text-secondary-fixed font-bold uppercase">
                      Not a Final Quote
                    </span>
                    <span className="text-body-sm text-surface-dim">
                      {isRoundTripLike
                        ? `${formatDurationMillis((routeResult?.durationMillis ?? 0) * 2)} drive`
                        : routeResult?.durationText || 'Live Route'}
                    </span>
                  </div>
                </div>

                {/* Inline Name/Mobile Prompt if not yet filled */}
                {showQuickContactPrompt && (
                  <div className="mt-space-md p-3.5 rounded-xl bg-surface-canvas/10 border border-rating-gold/40 flex flex-col gap-2.5">
                    <span className="text-label-md text-rating-gold font-bold">
                      Enter your details to send this fare summary on WhatsApp:
                    </span>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="h-10 px-3 rounded-lg bg-surface-canvas text-on-surface text-body-md"
                    />
                    {quickErrors.name && (
                      <span className="text-body-sm text-red-300">{quickErrors.name}</span>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        placeholder="WhatsApp Mobile *"
                        value={passengerMobile}
                        onChange={(e) => setPassengerMobile(e.target.value)}
                        className="h-10 px-3 rounded-lg bg-surface-canvas text-on-surface text-body-md"
                      />
                      <input
                        type="number"
                        min={1}
                        max={selectedVehicle.passengerCapacity}
                        placeholder="Passengers *"
                        value={passengers}
                        onChange={(e) =>
                          setPassengers(Math.max(1, parseInt(e.target.value || '1', 10)))
                        }
                        className="h-10 px-3 rounded-lg bg-surface-canvas text-on-surface text-body-md tabular-nums"
                      />
                    </div>
                    {(quickErrors.mobile || quickErrors.passengers || quickErrors.pickup || quickErrors.destination) && (
                      <span className="text-body-sm text-red-300">
                        {quickErrors.mobile ||
                          quickErrors.passengers ||
                          quickErrors.pickup ||
                          quickErrors.destination}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-space-lg flex flex-col gap-space-xs">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-space-sm bg-rating-gold text-primary-container py-space-md px-4 rounded-xl text-label-lg font-bold shadow-lg hover:bg-rating-gold/90 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    chat
                  </span>
                  <span>
                    {fareBreakdown.isCustomQuotation
                      ? 'Request Custom Quotation on WhatsApp'
                      : 'Request Best Fare on WhatsApp'}
                  </span>
                </button>
                <span className="text-label-sm text-surface-dim text-center mt-1">
                  This is an ESTIMATED FARE, not a confirmed booking. Exact quotation shared on WhatsApp.
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
