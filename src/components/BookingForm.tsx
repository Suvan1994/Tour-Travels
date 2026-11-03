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
import { GoogleMapRoute } from './GoogleMapRoute';
import { PlacesAutocompleteInput } from './PlacesAutocompleteInput';

const JOURNEY_TABS: { type: JourneyType; icon: string; label: string }[] = [
  { type: JourneyType.ROUND_TRIP, icon: 'commute', label: 'Outstation Round Trip' },
  { type: JourneyType.ONE_WAY, icon: 'arrow_forward', label: 'One Way Drop' },
  { type: JourneyType.LOCAL_RENTAL, icon: 'near_me', label: 'Local 8Hr / 80KM' },
  { type: JourneyType.AIRPORT_TRANSFER, icon: 'flight_takeoff', label: 'Airport Transfer' },
  { type: JourneyType.GROUP_TOUR, icon: 'groups', label: 'Tempo / Urbania Group Tour' },
];

export const BookingForm: React.FC<{ hasMapsApiKey: boolean }> = ({ hasMapsApiKey }) => {
  const {
    contactConfig,
    vehicles,
    pricingConfig,
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
    specialRequirements,
    setSpecialRequirements,
    fareBreakdown,
    openEnquiryModal,
  } = useAppConfig();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isRoundTripLike =
    journeyType === JourneyType.ROUND_TRIP || journeyType === JourneyType.GROUP_TOUR;

  const handleJourneyTabClick = (type: JourneyType) => {
    setJourneyType(type);
    if (type === JourneyType.GROUP_TOUR) {
      const currentCap = selectedVehicle.passengerCapacity;
      if (currentCap < 9) {
        setSelectedVehicleId('urbania-10-13');
        setPassengers(10);
      }
    } else if (type === JourneyType.LOCAL_RENTAL) {
      setDestinationPlace({
        label: `${pickupPlace.label.split(',')[0]} (8Hr / 80KM Local City Package)`,
        formattedAddress: pickupPlace.formattedAddress,
      });
    } else if (
      destinationPlace.label.includes('Local City Package')
    ) {
      setDestinationPlace({
        label: 'Jaipur, Rajasthan',
        formattedAddress: 'Jaipur, Rajasthan, India',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});

    const distanceText =
      journeyType === JourneyType.LOCAL_RENTAL
        ? `${fareBreakdown.billableDistanceKm} KM (Local 8Hr / 80KM Package)`
        : routeResult
          ? `${routeResult.distanceKm} KM one-way (${fareBreakdown.billableDistanceKm} KM billable${
              fareBreakdown.minKmApplied ? ', min KM/day applied' : ''
            })`
          : 'To be calculated by dispatch';

    const estimatedFareText = !fareBreakdown.isRouteReady
      ? 'Custom Quotation Requested (Route pending)'
      : fareBreakdown.isCustomQuotation
        ? `${formatINR(fareBreakdown.estimatedTotal)} (Estimated — Custom Group Quotation Requested)`
        : `${formatINR(fareBreakdown.estimatedTotal)} (ESTIMATED FARE • ${formatINR(
            fareBreakdown.appliedRatePerKm
          )}/km)`;

    const payload = {
      name: passengerName,
      mobile: passengerMobile,
      pickup: pickupPlace.label,
      destination: destinationPlace.label,
      distanceText,
      journeyTypeLabel: getJourneyTypeLabel(journeyType),
      vehicleName: `${selectedVehicle.name} (${selectedVehicle.passengerCapacity} Pax)`,
      passengers,
      travelDate: pickupTime ? `${travelDate} (${pickupTime})` : travelDate,
      returnDate: isRoundTripLike ? returnDate : 'N/A (One-Way / Single Day)',
      estimatedFareText,
      specialRequirements,
    };

    const message = buildWhatsAppEnquiryMessage(payload);
    const whatsappUrl = buildWhatsAppUrl(contactConfig.whatsappNumberInternational, message);

    openEnquiryModal(payload, whatsappUrl, message);
    openExternalLinkInNewTab(whatsappUrl);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="quick-booking" className="w-full bg-background -mt-6 relative z-20 pb-space-xl">
      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
        <div className="bg-surface-canvas rounded-2xl shadow-xl overflow-hidden border border-primary-container/8">
          {/* Service Type Tab Bar */}
          <div
            role="tablist"
            aria-label="Select Journey Type"
            className="bg-surface-subtle p-space-sm flex items-center gap-space-xs overflow-x-auto"
          >
            {JOURNEY_TABS.map((tab) => {
              const active = journeyType === tab.type;
              return (
                <button
                  key={tab.type}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleJourneyTabClick(tab.type)}
                  className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg text-label-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'font-bold bg-surface-canvas text-secondary shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-canvas/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Booking Form & Interactive Google Route Map Grid */}
          <div className="p-space-lg lg:p-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
            {/* Form Inputs Column (7 Cols) */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="lg:col-span-7 flex flex-col gap-space-md"
            >
              {/* Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="bookingName"
                    className="text-label-md text-on-surface font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
                      person
                    </span>
                    <span>Passenger Name *</span>
                  </label>
                  <input
                    id="bookingName"
                    type="text"
                    value={passengerName}
                    onChange={(e) => {
                      setPassengerName(e.target.value);
                      if (formErrors.name) {
                        setFormErrors((prev) => ({ ...prev, name: '' }));
                      }
                    }}
                    placeholder="e.g. Rahul Sharma"
                    aria-invalid={Boolean(formErrors.name)}
                    className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border transition-all text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                      formErrors.name ? 'border-error' : 'border-primary-container/15'
                    }`}
                  />
                  {formErrors.name && (
                    <span className="text-body-sm text-error font-medium" role="alert">
                      {formErrors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="bookingPhone"
                    className="text-label-md text-on-surface font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
                      call
                    </span>
                    <span>Mobile / WhatsApp Number *</span>
                  </label>
                  <input
                    id="bookingPhone"
                    type="tel"
                    value={passengerMobile}
                    onChange={(e) => {
                      setPassengerMobile(e.target.value);
                      if (formErrors.mobile) {
                        setFormErrors((prev) => ({ ...prev, mobile: '' }));
                      }
                    }}
                    placeholder="+91 98765 43210"
                    aria-invalid={Boolean(formErrors.mobile)}
                    className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border transition-all text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                      formErrors.mobile ? 'border-error' : 'border-primary-container/15'
                    }`}
                  />
                  {formErrors.mobile && (
                    <span className="text-body-sm text-error font-medium" role="alert">
                      {formErrors.mobile}
                    </span>
                  )}
                </div>
              </div>

              {/* Pickup & Destination with Google Places Autocomplete */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-sm items-start">
                <div className="sm:col-span-5">
                  <PlacesAutocompleteInput
                    id="bookingPickup"
                    label="Pickup Location *"
                    icon="my_location"
                    placeholder="Search pickup city, airport, hotel..."
                    value={pickupPlace}
                    onSelect={(place) => {
                      setPickupPlace(place);
                      if (formErrors.pickup) {
                        setFormErrors((prev) => ({ ...prev, pickup: '' }));
                      }
                    }}
                    error={formErrors.pickup}
                    hasMapsApiKey={hasMapsApiKey}
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-center sm:pt-6">
                  <button
                    type="button"
                    onClick={swapLocations}
                    disabled={journeyType === JourneyType.LOCAL_RENTAL}
                    title="Swap Pickup and Destination"
                    aria-label="Swap Pickup and Destination"
                    className="h-10 px-3 rounded-lg bg-surface-subtle hover:bg-surface-container text-secondary font-semibold text-label-md inline-flex items-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      swap_horiz
                    </span>
                    <span className="sm:hidden">Swap</span>
                  </button>
                </div>

                <div className="sm:col-span-5">
                  <PlacesAutocompleteInput
                    id="bookingDrop"
                    label="Destination *"
                    icon="pin_drop"
                    placeholder="Search drop city or tourist destination..."
                    value={destinationPlace}
                    onSelect={(place) => {
                      setDestinationPlace(place);
                      if (formErrors.destination) {
                        setFormErrors((prev) => ({ ...prev, destination: '' }));
                      }
                    }}
                    error={formErrors.destination}
                    hasMapsApiKey={hasMapsApiKey}
                  />
                </div>
              </div>

              {/* Vehicle & Passengers */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-md">
                <div className="sm:col-span-8 flex flex-col gap-1">
                  <label
                    htmlFor="bookingVehicle"
                    className="text-label-md text-on-surface font-semibold flex items-center justify-between gap-1"
                  >
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
                        directions_car
                      </span>
                      <span>Select Vehicle</span>
                    </span>
                    <span className="text-label-sm text-secondary font-bold">
                      Max {selectedVehicle.passengerCapacity} Pax • ₹
                      {pricingConfig.vehicleRates[selectedVehicleId]?.ratePerKm}/km
                    </span>
                  </label>
                  <select
                    id="bookingVehicle"
                    value={selectedVehicleId}
                    onChange={(e) => {
                      setSelectedVehicleId(e.target.value);
                      if (formErrors.passengers) {
                        setFormErrors((prev) => ({ ...prev, passengers: '' }));
                      }
                    }}
                    className="w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border border-primary-container/15 focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active text-body-md"
                  >
                    {vehicles.map((v) => {
                      const rate = pricingConfig.vehicleRates[v.id]?.ratePerKm ?? 0;
                      return (
                        <option key={v.id} value={v.id}>
                          {v.shortName} — Up to {v.passengerCapacity} Pax (₹{rate}/km)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="sm:col-span-4 flex flex-col gap-1">
                  <label
                    htmlFor="bookingPassengers"
                    className="text-label-md text-on-surface font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
                      group
                    </span>
                    <span>Passengers *</span>
                  </label>
                  <input
                    id="bookingPassengers"
                    type="number"
                    min={1}
                    max={selectedVehicle.passengerCapacity}
                    value={passengers}
                    onChange={(e) => {
                      const val = parseInt(e.target.value || '1', 10);
                      setPassengers(Number.isNaN(val) ? 1 : val);
                      if (formErrors.passengers) {
                        setFormErrors((prev) => ({ ...prev, passengers: '' }));
                      }
                    }}
                    aria-invalid={Boolean(formErrors.passengers)}
                    className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border transition-all text-body-md tabular-nums focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                      formErrors.passengers ? 'border-error' : 'border-primary-container/15'
                    }`}
                  />
                  {formErrors.passengers && (
                    <span className="text-body-sm text-error font-medium" role="alert">
                      {formErrors.passengers}
                    </span>
                  )}
                </div>
              </div>

              {/* Travel Date, Return Date (if Round Trip), & Pickup Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="bookingDate"
                    className="text-label-md text-on-surface font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
                      calendar_today
                    </span>
                    <span>Travel Date *</span>
                  </label>
                  <input
                    id="bookingDate"
                    type="date"
                    min={todayStr}
                    value={travelDate}
                    onChange={(e) => {
                      setTravelDate(e.target.value);
                      if (formErrors.travelDate) {
                        setFormErrors((prev) => ({ ...prev, travelDate: '' }));
                      }
                    }}
                    aria-invalid={Boolean(formErrors.travelDate)}
                    className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                      formErrors.travelDate ? 'border-error' : 'border-primary-container/15'
                    }`}
                  />
                  {formErrors.travelDate && (
                    <span className="text-body-sm text-error font-medium" role="alert">
                      {formErrors.travelDate}
                    </span>
                  )}
                </div>

                {isRoundTripLike ? (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="bookingReturnDate"
                      className="text-label-md text-on-surface font-semibold flex items-center justify-between gap-1"
                    >
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
                          event_repeat
                        </span>
                        <span>Return Date *</span>
                      </span>
                      <span className="text-label-sm text-secondary font-bold">
                        {tripDays} {tripDays === 1 ? 'Day' : 'Days'}
                      </span>
                    </label>
                    <input
                      id="bookingReturnDate"
                      type="date"
                      min={travelDate || todayStr}
                      value={returnDate}
                      onChange={(e) => {
                        setReturnDate(e.target.value);
                        if (formErrors.returnDate) {
                          setFormErrors((prev) => ({ ...prev, returnDate: '' }));
                        }
                      }}
                      aria-invalid={Boolean(formErrors.returnDate)}
                      className={`w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active ${
                        formErrors.returnDate ? 'border-error' : 'border-primary-container/15'
                      }`}
                    />
                    {formErrors.returnDate && (
                      <span className="text-body-sm text-error font-medium" role="alert">
                        {formErrors.returnDate}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <label className="text-label-md text-on-surface font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
                        route
                      </span>
                      <span>Journey Mode</span>
                    </label>
                    <div className="w-full h-12 px-space-md bg-surface-subtle/70 text-on-surface-variant rounded-lg border border-primary-container/10 flex items-center text-body-md">
                      Single-Day / One-Way
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="bookingTime"
                    className="text-label-md text-on-surface font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
                      alarm
                    </span>
                    <span>Pickup Time</span>
                  </label>
                  <input
                    id="bookingTime"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border border-primary-container/15 text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active"
                  />
                </div>
              </div>

              {/* Special Requirements */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bookingNotes"
                  className="text-label-md text-on-surface font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
                    notes
                  </span>
                  <span>Special Requirements / Sightseeing Stops (Optional)</span>
                </label>
                <input
                  id="bookingNotes"
                  type="text"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="e.g. Roof carrier needed, child seat, highway breakfast halt, extra sightseeing"
                  className="w-full h-12 px-space-md bg-surface-subtle text-on-surface rounded-lg border border-primary-container/15 text-body-md focus:outline-none focus:bg-surface-canvas focus:ring-2 focus:ring-route-active"
                />
              </div>

              {/* Submit Row */}
              <div className="pt-space-xs flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-xs text-on-surface-variant text-body-sm">
                  <span className="material-symbols-outlined text-success-green text-[18px] shrink-0" aria-hidden="true">
                    verified
                  </span>
                  <span>
                    Opens WhatsApp enquiry — no advance payment required to request availability.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm bg-rating-gold text-primary-container px-space-xl py-space-md rounded-xl text-label-lg font-bold shadow-lg hover:bg-rating-gold/90 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Book Now on WhatsApp</span>
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>

            {/* Interactive Google Route Map & Live Estimated Fare Card (5 Cols) */}
            <div className="lg:col-span-5 bg-surface-subtle p-space-lg rounded-xl flex flex-col justify-between border border-primary-container/8">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-label-md text-secondary font-bold uppercase tracking-wider">
                    Live Google Route &amp; Fare Estimator
                  </span>
                  <span className="inline-flex items-center gap-1 bg-surface-container px-space-sm py-1 rounded text-label-sm text-primary font-semibold">
                    {journeyType === JourneyType.ONE_WAY ||
                    journeyType === JourneyType.AIRPORT_TRANSFER
                      ? 'One-Way'
                      : journeyType === JourneyType.LOCAL_RENTAL
                        ? 'Local 80 KM'
                        : `Round-Trip (${tripDays}D)`}
                  </span>
                </div>

                {/* Real Interactive Google Map */}
                <GoogleMapRoute
                  pickup={pickupPlace}
                  destination={destinationPlace}
                  journeyType={journeyType}
                  routeResult={routeResult}
                  isLoading={isRouteLoading}
                  error={routeError}
                  hasMapsApiKey={hasMapsApiKey}
                  onRouteCalculated={setRouteResult}
                  onLoadingChange={setIsRouteLoading}
                  onErrorChange={setRouteError}
                  heightClassName="h-52 sm:h-56"
                />

                {/* Route Visual Timeline & Road Distance / Duration Metrics */}
                <div className="flex flex-col gap-space-sm bg-surface-canvas p-space-md rounded-xl shadow-sm border border-primary-container/5">
                  <div className="flex items-start gap-space-sm">
                    <div className="flex flex-col items-center mt-1 shrink-0" aria-hidden="true">
                      <div className="w-3 h-3 rounded-full bg-secondary" />
                      <div className="w-0.5 h-7 bg-secondary/30" />
                      <div className="w-3 h-3 rounded-full bg-rating-gold" />
                    </div>
                    <div className="flex flex-col justify-between w-full min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-label-lg font-bold text-on-surface truncate">
                          {pickupPlace.label}
                        </span>
                        <span className="text-label-sm text-secondary font-semibold shrink-0">
                          Pickup
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-3">
                        <span className="text-label-lg font-bold text-on-surface truncate">
                          {destinationPlace.label}
                        </span>
                        <span className="text-label-sm text-on-surface-variant font-semibold shrink-0">
                          Destination
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Distance & Duration Stats Strip */}
                  <div className="pt-2.5 mt-1 border-t border-primary-container/8 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-surface-subtle rounded-lg p-2 flex flex-col">
                      <span className="text-label-sm text-on-surface-variant uppercase">
                        Road Distance
                      </span>
                      <span className="text-label-lg font-bold text-primary tabular-nums mt-0.5">
                        {journeyType === JourneyType.LOCAL_RENTAL
                          ? '80 KM'
                          : isRouteLoading
                            ? '...'
                            : routeResult
                              ? `${routeResult.distanceKm} KM`
                              : '—'}
                      </span>
                    </div>

                    <div className="bg-surface-subtle rounded-lg p-2 flex flex-col">
                      <span className="text-label-sm text-on-surface-variant uppercase">
                        Est. Drive Time
                      </span>
                      <span className="text-label-lg font-bold text-primary tabular-nums mt-0.5">
                        {journeyType === JourneyType.LOCAL_RENTAL
                          ? 'Up to 8 Hrs'
                          : isRouteLoading
                            ? '...'
                            : routeResult
                              ? isRoundTripLike
                                ? `${formatDurationMillis(routeResult.durationMillis * 2)} RT`
                                : routeResult.durationText
                              : '—'}
                      </span>
                    </div>

                    <div className="bg-surface-subtle rounded-lg p-2 flex flex-col">
                      <span className="text-label-sm text-on-surface-variant uppercase">
                        Billable KM
                      </span>
                      <span className="text-label-lg font-bold text-secondary tabular-nums mt-0.5">
                        {fareBreakdown.isRouteReady
                          ? `${fareBreakdown.billableDistanceKm} KM`
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ESTIMATED FARE Box */}
                <div className="bg-primary text-surface-canvas p-space-md rounded-xl flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-label-sm text-secondary-fixed uppercase tracking-wider">
                        Estimated Fare ({selectedVehicle.shortName})
                      </span>
                      <span className="bg-rating-gold/20 text-rating-gold text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Estimate Only
                      </span>
                    </div>

                    <span className="text-headline-md font-extrabold text-rating-gold tabular-nums mt-0.5">
                      {isRouteLoading
                        ? 'Calculating…'
                        : fareBreakdown.isRouteReady
                          ? formatINR(fareBreakdown.estimatedTotal)
                          : 'Select Valid Route'}
                    </span>

                    <span className="text-body-sm text-surface-dim mt-0.5">
                      {fareBreakdown.isRouteReady ? (
                        <>
                          Base {formatINR(fareBreakdown.baseFare)} ({fareBreakdown.billableDistanceKm}{' '}
                          KM × ₹{fareBreakdown.appliedRatePerKm}/km) + Allowances/Tolls
                        </>
                      ) : (
                        'Enter pickup & destination to view driving estimate'
                      )}
                    </span>
                  </div>

                  <a
                    href="#fare-estimator"
                    title="View Detailed Fare Breakdown"
                    className="w-11 h-11 rounded-xl bg-surface-canvas/10 hover:bg-surface-canvas/20 flex items-center justify-center text-rating-gold shrink-0 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
                      receipt_long
                    </span>
                  </a>
                </div>
              </div>

              <p className="text-body-sm text-on-surface-variant italic mt-space-md">
                * Displayed amount is an <strong>ESTIMATED FARE</strong> based on Google Maps driving route, not a confirmed quotation. Actual tolls, state taxes, parking, and hill charges are confirmed on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
