import React, { useState } from 'react';
import { useAppConfig } from '../context/AppConfigContext';

type AdminTab = 'vehicles' | 'policies' | 'contact';

export const AdminConfigModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    vehicles,
    pricingConfig,
    contactConfig,
    updateVehicleRate,
    updateFarePolicy,
    updateContactConfig,
    resetAdminConfigToDefaults,
  } = useAppConfig();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('vehicles');
  const [confirmReset, setConfirmReset] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isAdminModalOpen) {
    return null;
  }

  const handleCloseModal = () => {
    setConfirmReset(false);
    setAuthError(null);
    setPassword('');
    setIsAdminModalOpen(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!username.trim() || !password) {
      setAuthError('Please enter both Admin username and password.');
      return;
    }

    setIsLoggingIn(true);
    const result = await loginAdmin(username, password);
    setIsLoggingIn(false);

    if (!result.ok) {
      setAuthError(result.error || 'Invalid credentials.');
      return;
    }

    setPassword('');
    setAuthError(null);
  };

  const triggerSavedBadge = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1800);
  };

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    await resetAdminConfigToDefaults();
    setConfirmReset(false);
    triggerSavedBadge();
  };

  // LOCKED STATE: Require Admin Username & Password before viewing or modifying Fare Policies
  if (!isAdminAuthenticated) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-container/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
      >
        <div className="w-full max-w-md bg-surface-canvas text-on-surface rounded-2xl shadow-2xl border border-border-subtle overflow-hidden">
          <div className="bg-primary text-surface-canvas px-space-lg py-space-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rating-gold/20 flex items-center justify-center text-rating-gold shrink-0">
                <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                  lock
                </span>
              </div>
              <div>
                <h2 id="admin-login-title" className="text-title-md font-bold">
                  Admin Fare &amp; Policy Login
                </h2>
                <p className="text-label-sm text-secondary-fixed">
                  Authorized JMD Tour &amp; Travels access only
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close Admin Login dialog"
              className="w-8 h-8 rounded-lg bg-surface-canvas/10 hover:bg-surface-canvas/20 flex items-center justify-center text-surface-canvas transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-space-lg flex flex-col gap-space-md">
            <p className="text-body-sm text-on-surface-variant">
              Fare rates, toll/parking policies, GST rules, and dispatch contact settings are password-protected so visitors cannot alter pricing.
            </p>

            {authError && (
              <div
                role="alert"
                className="bg-error-container text-on-error-container px-3.5 py-2.5 rounded-xl text-body-sm flex items-start gap-2"
              >
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5" aria-hidden="true">
                  error
                </span>
                <span>{authError}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="adminUsernameInput" className="text-label-md font-bold text-on-surface">
                Admin Username
              </label>
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                >
                  person
                </span>
                <input
                  id="adminUsernameInput"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active text-body-md"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="adminPasswordInput" className="text-label-md font-bold text-on-surface">
                Password
              </label>
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                >
                  key
                </span>
                <input
                  id="adminPasswordInput"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-11 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active text-body-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-space-md py-2.5 rounded-xl text-label-md font-bold text-on-surface-variant hover:bg-surface-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="inline-flex items-center justify-center gap-2 px-space-lg py-2.5 rounded-xl bg-primary text-surface-canvas text-label-lg font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-surface-canvas border-t-transparent animate-spin" />
                    <span>Verifying…</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                      login
                    </span>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN VIEW
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-primary-container/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-config-title"
    >
      <div className="w-full max-w-5xl bg-surface-canvas text-on-surface rounded-2xl shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-primary text-surface-canvas px-space-lg py-space-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-canvas/10 flex items-center justify-center text-rating-gold shrink-0">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                lock_open
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="admin-config-title" className="text-title-lg font-bold">
                  Owner Tariff &amp; Fare Policy Configuration
                </h2>
                <span className="bg-rating-gold/20 text-rating-gold text-label-sm px-2 py-0.5 rounded font-bold">
                  Admin Signed In
                </span>
                {savedNotice && (
                  <span className="bg-success-green text-on-secondary text-label-sm px-2 py-0.5 rounded font-bold">
                    Saved Live
                  </span>
                )}
              </div>
              <p className="text-label-sm text-secondary-fixed">
                Changes save to the server automatically and apply across all visitor fare calculations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                logoutAdmin();
                handleCloseModal();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-canvas/10 hover:bg-surface-canvas/20 text-label-sm font-bold text-surface-canvas transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                logout
              </span>
              <span className="hidden sm:inline">Sign Out &amp; Lock</span>
            </button>

            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close configuration panel"
              className="w-9 h-9 rounded-lg bg-surface-canvas/10 hover:bg-surface-canvas/20 flex items-center justify-center text-surface-canvas transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-surface-subtle px-space-lg pt-space-sm border-b border-border-subtle flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('vehicles')}
            className={`px-space-md py-2.5 rounded-t-xl text-label-lg font-bold transition-colors border-b-2 ${
              activeTab === 'vehicles'
                ? 'bg-surface-canvas text-secondary border-secondary'
                : 'text-on-surface-variant border-transparent hover:text-on-surface'
            }`}
          >
            Vehicle Per-KM Rates (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('policies')}
            className={`px-space-md py-2.5 rounded-t-xl text-label-lg font-bold transition-colors border-b-2 ${
              activeTab === 'policies'
                ? 'bg-surface-canvas text-secondary border-secondary'
                : 'text-on-surface-variant border-transparent hover:text-on-surface'
            }`}
          >
            Fare Policy &amp; GST Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-space-md py-2.5 rounded-t-xl text-label-lg font-bold transition-colors border-b-2 ${
              activeTab === 'contact'
                ? 'bg-surface-canvas text-secondary border-secondary'
                : 'text-on-surface-variant border-transparent hover:text-on-surface'
            }`}
          >
            Business &amp; WhatsApp Info
          </button>
        </div>

        {/* Content Body */}
        <div className="p-space-lg overflow-y-auto flex-1">
          {activeTab === 'vehicles' && (
            <div className="flex flex-col gap-space-md">
              <p className="text-body-sm text-on-surface-variant">
                Adjusting any tariff below updates estimated fares across the Booking Widget, Fleet Cards, and Dynamic Fare Calculator for all visitors.
              </p>

              <div className="overflow-x-auto border border-border-subtle rounded-xl">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-surface-subtle text-label-sm uppercase text-on-surface-variant border-b border-border-subtle">
                      <th className="py-3 px-4">Vehicle Category</th>
                      <th className="py-3 px-2.5">Round-Trip (₹/km)</th>
                      <th className="py-3 px-2.5">One-Way (₹/km)</th>
                      <th className="py-3 px-2.5">Driver Batta (₹/day)</th>
                      <th className="py-3 px-2.5">Night Charge (₹)</th>
                      <th className="py-3 px-2.5">Min Trip Fare (₹)</th>
                      <th className="py-3 px-2.5">Est. Toll (₹/km)</th>
                      <th className="py-3 px-2.5">Est. Parking (₹)</th>
                      <th className="py-3 px-2.5">Local 8Hr/80KM (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-body-sm">
                    {vehicles.map((v) => {
                      const rule = pricingConfig.vehicleRates[v.id];
                      if (!rule) return null;

                      return (
                        <tr key={v.id} className="hover:bg-surface-subtle/60">
                          <td className="py-3 px-4">
                            <div className="font-bold text-on-surface">{v.shortName}</div>
                            <div className="text-label-sm text-on-surface-variant">
                              Up to {v.passengerCapacity} Pax
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5">
                            <input
                              type="number"
                              min={1}
                              value={rule.ratePerKm}
                              onChange={(e) => {
                                updateVehicleRate(v.id, {
                                  ratePerKm: Math.max(1, Number(e.target.value) || 0),
                                });
                                triggerSavedBadge();
                              }}
                              aria-label={`${v.shortName} round trip rate per km`}
                              className="w-20 h-9 px-2 rounded-lg border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active font-bold text-primary"
                            />
                          </td>
                          <td className="py-2.5 px-2.5">
                            <input
                              type="number"
                              min={1}
                              value={rule.oneWayRatePerKm}
                              onChange={(e) => {
                                updateVehicleRate(v.id, {
                                  oneWayRatePerKm: Math.max(1, Number(e.target.value) || 0),
                                });
                                triggerSavedBadge();
                              }}
                              aria-label={`${v.shortName} one way rate per km`}
                              className="w-20 h-9 px-2 rounded-lg border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                            />
                          </td>
                          <td className="py-2.5 px-2.5">
                            <input
                              type="number"
                              min={0}
                              step={50}
                              value={rule.driverAllowancePerDay}
                              onChange={(e) => {
                                updateVehicleRate(v.id, {
                                  driverAllowancePerDay: Math.max(0, Number(e.target.value) || 0),
                                });
                                triggerSavedBadge();
                              }}
                              aria-label={`${v.shortName} driver allowance per day`}
                              className="w-20 h-9 px-2 rounded-lg border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                            />
                          </td>
                          <td className="py-2.5 px-2.5">
                            <input
                              type="number"
                              min={0}
                              step={50}
                              value={rule.nightChargePerNight}
                              onChange={(e) => {
                                updateVehicleRate(v.id, {
                                  nightChargePerNight: Math.max(0, Number(e.target.value) || 0),
                                });
                                triggerSavedBadge();
                              }}
                              aria-label={`${v.shortName} night charge`}
                              className="w-20 h-9 px-2 rounded-lg border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                            />
                          </td>
                          <td className="py-2.5 px-2.5">
                            <input
                              type="number"
                              min={0}
                              step={100}
                              value={rule.minTripFare}
                              onChange={(e) => {
                                updateVehicleRate(v.id, {
                                  minTripFare: Math.max(0, Number(e.target.value) || 0),
                                });
                                triggerSavedBadge();
                              }}
                              aria-label={`${v.shortName} minimum trip fare`}
                              className="w-24 h-9 px-2 rounded-lg border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                            />
                          </td>
                          <td className="py-2.5 px-2.5">
                            <input
                              type="number"
                              min={0}
                              step={0.1}
                              value={rule.estimatedTollPerKm}
                              onChange={(e) => {
                                updateVehicleRate(v.id, {
                                  estimatedTollPerKm: Math.max(0, Number(e.target.value) || 0),
                                });
                                triggerSavedBadge();
                              }}
                              aria-label={`${v.shortName} estimated toll per km`}
                              className="w-20 h-9 px-2 rounded-lg border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                            />
                          </td>
                          <td className="py-2.5 px-2.5">
                            <input
                              type="number"
                              min={0}
                              step={50}
                              value={rule.defaultParkingEstimate}
                              onChange={(e) => {
                                updateVehicleRate(v.id, {
                                  defaultParkingEstimate: Math.max(0, Number(e.target.value) || 0),
                                });
                                triggerSavedBadge();
                              }}
                              aria-label={`${v.shortName} default parking estimate`}
                              className="w-20 h-9 px-2 rounded-lg border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                            />
                          </td>
                          <td className="py-2.5 px-2.5">
                            <input
                              type="number"
                              min={0}
                              step={100}
                              value={rule.localPackage8Hr80KmFare}
                              onChange={(e) => {
                                updateVehicleRate(v.id, {
                                  localPackage8Hr80KmFare: Math.max(0, Number(e.target.value) || 0),
                                });
                                triggerSavedBadge();
                              }}
                              aria-label={`${v.shortName} local 8hr 80km package fare`}
                              className="w-24 h-9 px-2 rounded-lg border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="flex flex-col gap-space-lg">
              {/* Policy Switches */}
              <div className="bg-surface-subtle p-space-md rounded-2xl border border-border-subtle flex flex-col gap-space-sm">
                <span className="text-label-md text-primary font-bold uppercase tracking-wider">
                  Mandatory Estimate Charge Policies (Controlled by Admin)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <label className="flex items-center justify-between gap-3 bg-surface-canvas p-3.5 rounded-xl border border-border-subtle cursor-pointer">
                    <div>
                      <span className="text-label-lg font-bold text-on-surface block">
                        Include Est. Tolls
                      </span>
                      <span className="text-body-sm text-on-surface-variant">
                        Add Fastag highway toll estimate in calculator
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={pricingConfig.policy.includeEstimatedTollsByDefault}
                      onChange={(e) => {
                        updateFarePolicy({ includeEstimatedTollsByDefault: e.target.checked });
                        triggerSavedBadge();
                      }}
                      className="w-4 h-4 accent-secondary shrink-0"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 bg-surface-canvas p-3.5 rounded-xl border border-border-subtle cursor-pointer">
                    <div>
                      <span className="text-label-lg font-bold text-on-surface block">
                        Include Est. Parking
                      </span>
                      <span className="text-body-sm text-on-surface-variant">
                        Add standard parking allowance in calculator
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={pricingConfig.policy.includeParkingByDefault}
                      onChange={(e) => {
                        updateFarePolicy({ includeParkingByDefault: e.target.checked });
                        triggerSavedBadge();
                      }}
                      className="w-4 h-4 accent-secondary shrink-0"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 bg-surface-canvas p-3.5 rounded-xl border border-border-subtle cursor-pointer">
                    <div>
                      <span className="text-label-lg font-bold text-on-surface block">
                        Include GST ({pricingConfig.policy.gstPercentage}%)
                      </span>
                      <span className="text-body-sm text-on-surface-variant">
                        Add GST automatically to all estimated totals
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={pricingConfig.policy.includeGstByDefault}
                      onChange={(e) => {
                        updateFarePolicy({ includeGstByDefault: e.target.checked });
                        triggerSavedBadge();
                      }}
                      className="w-4 h-4 accent-secondary shrink-0"
                    />
                  </label>
                </div>
              </div>

              {/* Numeric Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-lg font-bold text-on-surface">
                    Minimum Round-Trip KM Per Calendar Day
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={10}
                    value={pricingConfig.policy.minOutstationKmPerDay}
                    onChange={(e) => {
                      updateFarePolicy({
                        minOutstationKmPerDay: Math.max(50, Number(e.target.value) || 250),
                      });
                      triggerSavedBadge();
                    }}
                    className="h-11 px-3.5 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                  />
                  <span className="text-label-sm text-on-surface-variant">
                    Standard North India outstation policy is 250 KM / day.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-lg font-bold text-on-surface">
                    Minimum One-Way Billable Distance (KM)
                  </label>
                  <input
                    type="number"
                    min={50}
                    step={10}
                    value={pricingConfig.policy.minOneWayBillableKm}
                    onChange={(e) => {
                      updateFarePolicy({
                        minOneWayBillableKm: Math.max(40, Number(e.target.value) || 130),
                      });
                      triggerSavedBadge();
                    }}
                    className="h-11 px-3.5 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                  />
                  <span className="text-label-sm text-on-surface-variant">
                    Applies when one-way road distance is shorter than minimum dispatch threshold.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-lg font-bold text-on-surface">
                    GST Percentage (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={28}
                    step={0.5}
                    value={pricingConfig.policy.gstPercentage}
                    onChange={(e) => {
                      updateFarePolicy({
                        gstPercentage: Math.max(0, Number(e.target.value) || 0),
                      });
                      triggerSavedBadge();
                    }}
                    className="h-11 px-3.5 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                  />
                  <span className="text-label-sm text-on-surface-variant">
                    Passenger transport SAC 9964 standard GST rate (default 5%).
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-lg font-bold text-on-surface">
                    Custom Quotation Threshold (Days)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={pricingConfig.policy.customQuoteDaysThreshold}
                    onChange={(e) => {
                      updateFarePolicy({
                        customQuoteDaysThreshold: Math.max(2, Number(e.target.value) || 8),
                      });
                      triggerSavedBadge();
                    }}
                    className="h-11 px-3.5 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                  />
                  <span className="text-label-sm text-on-surface-variant">
                    Extended itineraries exceeding this duration flag Custom Quotation advisory.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-lg font-bold text-on-surface">Business Name</label>
                <input
                  type="text"
                  value={contactConfig.businessName}
                  onChange={(e) => {
                    updateContactConfig({ businessName: e.target.value });
                    triggerSavedBadge();
                  }}
                  className="h-11 px-3.5 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-lg font-bold text-on-surface">
                  WhatsApp Number (International Digits, e.g. 918859364336)
                </label>
                <input
                  type="text"
                  value={contactConfig.whatsappNumberInternational}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    updateContactConfig({ whatsappNumberInternational: digits });
                    triggerSavedBadge();
                  }}
                  className="h-11 px-3.5 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-lg font-bold text-on-surface">
                  Display Phone Number
                </label>
                <input
                  type="text"
                  value={contactConfig.phoneDisplay}
                  onChange={(e) => {
                    const val = e.target.value;
                    const digits = val.replace(/\D/g, '');
                    updateContactConfig({
                      phoneDisplay: val,
                      phoneHref: digits ? `tel:+${digits}` : contactConfig.phoneHref,
                    });
                    triggerSavedBadge();
                  }}
                  className="h-11 px-3.5 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-lg font-bold text-on-surface">Booking Email</label>
                <input
                  type="email"
                  value={contactConfig.email}
                  onChange={(e) => {
                    updateContactConfig({ email: e.target.value });
                    triggerSavedBadge();
                  }}
                  className="h-11 px-3.5 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-label-lg font-bold text-on-surface">
                  Headquarters Address
                </label>
                <input
                  type="text"
                  value={contactConfig.headquartersAddress}
                  onChange={(e) => {
                    updateContactConfig({ headquartersAddress: e.target.value });
                    triggerSavedBadge();
                  }}
                  className="h-11 px-3.5 rounded-xl border border-border-subtle bg-surface-subtle focus:bg-surface-canvas focus:outline-none focus:ring-2 focus:ring-route-active"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-space-lg py-space-md bg-surface-subtle border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className={`px-space-md py-2 rounded-xl text-label-md font-bold transition-colors ${
                confirmReset
                  ? 'bg-error text-on-secondary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {confirmReset
                ? 'Click Again to Confirm Reset to Default Rates'
                : 'Reset to Official Default Rates'}
            </button>
            {confirmReset && (
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-label-sm text-on-surface-variant underline"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                logoutAdmin();
                handleCloseModal();
              }}
              className="flex-1 sm:flex-initial px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface text-label-md font-bold hover:bg-surface-container-high transition-colors"
            >
              Save &amp; Lock
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 sm:flex-initial px-space-lg py-2.5 rounded-xl bg-primary text-surface-canvas text-label-lg font-bold hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
