import React, { useState } from 'react';
import { HERO_BACKGROUND_IMAGE } from '../config/destinationsConfig';
import { useAppConfig } from '../context/AppConfigContext';
import { buildWhatsAppUrl } from '../utils/whatsappBooking';

export const Hero: React.FC = () => {
  const { contactConfig } = useAppConfig();
  const [bgFailed, setBgFailed] = useState(false);

  const whatsappHref = buildWhatsAppUrl(
    contactConfig.whatsappNumberInternational,
    `Hello ${contactConfig.businessName}, I would like to enquire about booking a vehicle.`
  );

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-primary text-surface-canvas -mt-20 pt-24 pb-16"
    >
      {/* Ambient Hill Landscape Background with measured darkening scrim */}
      <div className="absolute inset-0 z-0">
        {!bgFailed && (
          <img
            src={HERO_BACKGROUND_IMAGE}
            alt="Toyota Innova Crysta and luxury Force Urbania tourist van on a scenic Himalayan mountain highway overlook at golden hour"
            referrerPolicy="no-referrer"
            onError={() => setBgFailed(true)}
            className="w-full h-full object-cover opacity-45 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-rating-gold/10 blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-gutter-mobile sm:px-gutter flex flex-col pt-8 lg:pt-14">
        {/* Trust & Rating Strip */}
        <div className="flex flex-wrap items-center gap-space-sm mb-space-md">
          <div className="inline-flex items-center gap-space-xs bg-surface-glass/20 backdrop-blur-md px-space-md py-space-xs rounded-full">
            <span className="material-symbols-outlined text-secondary-fixed text-[16px]" aria-hidden="true">
              local_shipping
            </span>
            <span className="text-label-md text-secondary-fixed uppercase tracking-wider">
              Jai Maa Durge Logistics • North India Central Hub
            </span>
          </div>

          <div className="inline-flex items-center gap-space-xs bg-surface-canvas/10 backdrop-blur-md px-space-md py-space-xs rounded-full">
            <span className="material-symbols-outlined material-symbol-filled text-rating-gold text-[16px]" aria-hidden="true">
              star
            </span>
            <span className="text-label-md text-surface-canvas font-bold tabular-nums">
              {contactConfig.googleRating}
            </span>
            <span className="text-body-sm text-surface-container-high opacity-85">
              {contactConfig.reviewCountLabel}
            </span>
          </div>
        </div>

        {/* Main Headline & Subheading Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-end mb-space-xl">
          <div className="lg:col-span-8 flex flex-col gap-space-sm">
            <span className="text-label-lg text-rating-gold uppercase font-bold tracking-widest">
              {contactConfig.tagline}
            </span>

            <h1 className="text-display-hero-mobile sm:text-display-hero text-surface-canvas tracking-tight leading-tight">
              Your Journey, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-surface-canvas via-secondary-fixed to-rating-gold">
                Our Responsibility.
              </span>
            </h1>

            <p className="text-body-lg text-surface-container-high max-w-2xl leading-relaxed mt-space-xs">
              From family pilgrimages and executive corporate offsites to Himalayan hill escapes,{' '}
              <strong className="text-surface-canvas font-semibold">
                {contactConfig.businessName}
              </strong>{' '}
              delivers punctual, sanitized Cars, SUVs, Force Urbania vans, Tempo Travellers, Mini Buses, and Luxury Coaches across every kilometre.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-md">
              <a
                href="#quick-booking"
                className="inline-flex items-center justify-center gap-space-sm bg-rating-gold text-primary-container px-space-xl py-space-md rounded-xl text-label-lg font-bold shadow-xl hover:bg-rating-gold/90 transition-all whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  directions_car
                </span>
                <span>Book Your Journey</span>
              </a>

              <a
                href="#fare-estimator"
                className="inline-flex items-center justify-center gap-space-sm bg-secondary text-surface-canvas px-space-lg py-space-md rounded-xl text-label-lg font-bold shadow-md hover:bg-secondary/90 transition-all whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  calculate
                </span>
                <span>Calculate Instant Fare</span>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-space-sm bg-success-green text-surface-canvas px-space-lg py-space-md rounded-xl text-label-lg font-bold shadow-md hover:bg-success-green/90 transition-all whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  chat
                </span>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Hero Metric Column */}
          <div className="lg:col-span-4 flex flex-col gap-space-md bg-surface-canvas/10 backdrop-blur-xl p-space-lg rounded-2xl border border-surface-canvas/10">
            <div className="flex items-center justify-between">
              <span className="text-label-md text-surface-dim uppercase tracking-wider">
                Fleet Operational Reach
              </span>
              <span className="material-symbols-outlined text-rating-gold text-[22px]" aria-hidden="true">
                explore
              </span>
            </div>
            <div className="grid grid-cols-2 gap-space-md pt-space-xs">
              <div className="flex flex-col">
                <span className="text-headline-lg text-surface-canvas font-extrabold leading-none tabular-nums">
                  {contactConfig.totalTripsLabel}
                </span>
                <span className="text-body-sm text-surface-container-high mt-1">
                  Inter-State Trips
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-headline-lg text-rating-gold font-extrabold leading-none tabular-nums">
                  4–50 Pax
                </span>
                <span className="text-body-sm text-surface-container-high mt-1">
                  Cars to Luxury Buses
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed/20 flex items-center justify-center text-secondary-fixed shrink-0">
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  verified_user
                </span>
              </div>
              <span className="text-body-sm text-surface-container-high">
                Police-Verified Drivers • All-India Tourist Permits
              </span>
            </div>
          </div>
        </div>

        {/* Trust Pillars Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-md">
          <div className="flex items-center gap-space-sm bg-surface-canvas/5 backdrop-blur-md p-space-md rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-surface-canvas/10 flex items-center justify-center text-rating-gold shrink-0">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                shield_person
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-lg text-surface-canvas font-bold">100% Verified</span>
              <span className="text-body-sm text-surface-dim">Seasoned Chauffeurs</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm bg-surface-canvas/5 backdrop-blur-md p-space-md rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-surface-canvas/10 flex items-center justify-center text-rating-gold shrink-0">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                currency_rupee
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-lg text-surface-canvas font-bold">Transparent Rates</span>
              <span className="text-body-sm text-surface-dim">Starting ₹12/KM</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm bg-surface-canvas/5 backdrop-blur-md p-space-md rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-surface-canvas/10 flex items-center justify-center text-rating-gold shrink-0">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                schedule
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-lg text-surface-canvas font-bold">On-Time Pickup</span>
              <span className="text-body-sm text-surface-dim">Punctual Dispatch</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm bg-surface-canvas/5 backdrop-blur-md p-space-md rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-surface-canvas/10 flex items-center justify-center text-rating-gold shrink-0">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                support_agent
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-lg text-surface-canvas font-bold">24x7 Road Support</span>
              <span className="text-body-sm text-surface-dim">Direct Helpline</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
