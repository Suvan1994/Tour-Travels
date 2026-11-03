import React, { useState } from 'react';
import { useAppConfig } from '../context/AppConfigContext';
import { buildWhatsAppUrl } from '../utils/whatsappBooking';
import { ResilientImage } from './ResilientImage';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Fleet', href: '#our-fleet' },
  { label: 'Fare Calculator', href: '#fare-estimator' },
  { label: 'Tour Packages', href: '#tour-packages' },
  { label: 'Why JMD', href: '#why-jmd' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Contact Us', href: '#contact-us' },
];

export const Navbar: React.FC<{ hasQuotaBanner?: boolean }> = ({ hasQuotaBanner = false }) => {
  const { contactConfig, isAdminAuthenticated, setIsAdminModalOpen } = useAppConfig();
  const [activeHref, setActiveHref] = useState<string>('#home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const directWhatsAppHref = buildWhatsAppUrl(
    contactConfig.whatsappNumberInternational,
    `Hello ${contactConfig.businessName}, I would like to enquire about vehicle availability and outstation fare.`
  );

  return (
    <header
      className={`${
        hasQuotaBanner ? 'sticky top-10' : 'fixed top-0 left-0 right-0'
      } w-full z-40 bg-surface-glass backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border-subtle`}
    >
      <div className="h-20 w-full max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2 lg:gap-3 2xl:gap-5">
        {/* Brand Identity */}
        <a
          href="#home"
          onClick={() => setActiveHref('#home')}
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-route-active rounded-lg"
        >
          <div className="h-9 w-9 rounded-lg overflow-hidden bg-primary-container flex items-center justify-center shrink-0">
            <ResilientImage
              src={contactConfig.logoUrl}
              alt={`${contactConfig.shortName} Logo`}
              className="h-8 w-auto object-contain"
              fallbackIcon="directions_car"
              eager
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[16px] sm:text-[17px] 2xl:text-title-md text-primary font-bold tracking-tight leading-none whitespace-nowrap">
              {contactConfig.shortName}
            </span>
            <span className="text-[9.5px] 2xl:text-label-sm text-secondary tracking-wide uppercase font-semibold mt-1 hidden sm:block whitespace-nowrap truncate max-w-[205px] 2xl:max-w-none">
              {contactConfig.subtitle}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-3 min-[1360px]:gap-3.5 2xl:gap-5 shrink-0"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveHref(item.href)}
                className={`text-[13px] 2xl:text-label-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-secondary font-bold underline underline-offset-4 decoration-2'
                    : 'text-on-surface-variant font-semibold hover:text-on-surface'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 2xl:gap-2.5 shrink-0">
          {/* Full Phone Link (visible on lg before nav expands, and on >=1360px alongside full nav) */}
          <a
            href={contactConfig.phoneHref}
            className="hidden lg:flex xl:hidden min-[1360px]:flex items-center gap-1 text-[12px] 2xl:text-label-md font-bold text-primary hover:text-secondary transition-colors px-1.5 py-1 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary" aria-hidden="true">
              call
            </span>
            <span className="tabular-nums">{contactConfig.phoneDisplay}</span>
          </a>

          {/* Compact Phone Icon Button on 1280px–1359px laptops so buttons never clip */}
          <a
            href={contactConfig.phoneHref}
            title={`Call ${contactConfig.phoneDisplay}`}
            aria-label={`Call ${contactConfig.phoneDisplay}`}
            className="hidden xl:flex min-[1360px]:hidden w-9 h-9 rounded-lg bg-surface-subtle hover:bg-surface-container items-center justify-center text-secondary transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              call
            </span>
          </a>

          <a
            href={directWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-success-green hover:bg-success-green/90 text-on-secondary px-3 2xl:px-space-md py-2 rounded-lg text-label-md font-bold shadow-[0_4px_12px_rgba(27,135,86,0.25)] transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              chat
            </span>
            <span>WhatsApp</span>
          </a>

          <a
            href="#quick-booking"
            onClick={() => setActiveHref('#quick-booking')}
            className="inline-flex items-center gap-1 bg-rating-gold hover:bg-rating-gold/90 text-primary-container font-bold text-[13px] sm:text-label-lg px-3 sm:px-3.5 2xl:px-space-lg py-2 rounded-lg shadow-[0_8px_24px_rgba(245,185,66,0.35)] transition-all whitespace-nowrap"
          >
            <span>Book Your Ride</span>
          </a>

          {/* Admin Rate & Policy Config Trigger (Password Protected) */}
          <button
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
            title={
              isAdminAuthenticated
                ? 'Admin Fare & Policy Settings (Unlocked)'
                : 'Admin Login — Fare & Policy Settings'
            }
            aria-label="Open Admin Fare and Policy Login"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary hover:bg-primary-container flex items-center justify-center shrink-0 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-route-active"
          >
            <span className="material-symbols-outlined text-on-primary text-[17px]" aria-hidden="true">
              {isAdminAuthenticated ? 'lock_open' : 'lock'}
            </span>
          </button>

          {/* Mobile / Tablet Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-surface-subtle hover:bg-surface-container flex items-center justify-center text-primary transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="xl:hidden bg-surface-canvas border-t border-primary-container/10 shadow-xl px-4 sm:px-6 py-space-md flex flex-col gap-space-sm"
        >
          <nav aria-label="Mobile Navigation" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setActiveHref(item.href);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2.5 rounded-lg text-label-lg font-semibold transition-colors ${
                  activeHref === item.href
                    ? 'bg-surface-container-low text-secondary font-bold'
                    : 'text-on-surface hover:bg-surface-subtle'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-primary-container/10 flex flex-wrap items-center justify-between gap-2">
            <a
              href={contactConfig.phoneHref}
              className="inline-flex items-center gap-1.5 text-label-lg font-bold text-primary"
            >
              <span className="material-symbols-outlined text-secondary text-[18px]">call</span>
              <span className="tabular-nums">{contactConfig.phoneDisplay}</span>
            </a>
            <a
              href={directWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-success-green text-on-secondary px-4 py-2 rounded-lg text-label-md font-bold"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
