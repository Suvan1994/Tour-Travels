import React, { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AdminConfigModal } from './components/AdminConfigModal';
import { BookingForm } from './components/BookingForm';
import { ContactSection } from './components/ContactSection';
import { EnquiryPreviewModal } from './components/EnquiryPreviewModal';
import { FAQ } from './components/FAQ';
import { FareCalculator } from './components/FareCalculator';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { PriceEnquiryBanner } from './components/PriceEnquiryBanner';
import { Testimonials } from './components/Testimonials';
import { TourPackages } from './components/TourPackages';
import { VehicleCards } from './components/VehicleCards';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { WhyChooseUs } from './components/WhyChooseUs';
import { AppConfigProvider } from './context/AppConfigContext';

export default function App() {
  const rawApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  const hasMapsApiKey = Boolean(
    rawApiKey &&
      rawApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' &&
      rawApiKey !== 'MY_GOOGLE_MAPS_API_KEY'
  );

  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const pageContent = (
    <div className="min-h-screen flex flex-col bg-background text-on-surface selection:bg-secondary-fixed selection:text-primary">
      {quotaExceeded && (
        <div
          role="status"
          className="sticky top-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-sm text-amber-900 flex items-center justify-between gap-4"
        >
          <span>
            Map features are temporarily unavailable (demo key quota reached).{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-amber-950"
            >
              Learn how to switch to your own Google Cloud API key
            </a>{' '}
            for higher limits.
          </span>
        </div>
      )}

      <Navbar hasQuotaBanner={quotaExceeded} />

      <main className={quotaExceeded ? 'pt-0 flex-1' : 'pt-20 flex-1'}>
        <Hero />
        <BookingForm hasMapsApiKey={hasMapsApiKey} />
        <VehicleCards />
        <FareCalculator hasMapsApiKey={hasMapsApiKey} />
        <TourPackages />
        <WhyChooseUs />
        <Testimonials />
        <PriceEnquiryBanner />
        <FAQ />
        <ContactSection hasMapsApiKey={hasMapsApiKey} />
      </main>

      <Footer />
      <WhatsAppFloatingButton />
      <EnquiryPreviewModal />
      <AdminConfigModal />
    </div>
  );

  return (
    <AppConfigProvider>
      {hasMapsApiKey ? (
        <APIProvider apiKey={rawApiKey} region="IN" language="en">
          {pageContent}
        </APIProvider>
      ) : (
        pageContent
      )}
    </AppConfigProvider>
  );
}
