import React from 'react';
import { useAppConfig } from '../context/AppConfigContext';
import { buildWhatsAppUrl } from '../utils/whatsappBooking';

export const WhatsAppFloatingButton: React.FC = () => {
  const { contactConfig } = useAppConfig();

  const whatsappUrl = buildWhatsAppUrl(
    contactConfig.whatsappNumberInternational,
    `Hello ${contactConfig.businessName}, I would like to enquire about booking a vehicle.`
  );

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${contactConfig.shortName} on WhatsApp at ${contactConfig.phoneDisplay}`}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-space-xs bg-success-green text-on-secondary px-space-md py-space-sm rounded-full shadow-[0_12px_32px_rgba(27,135,86,0.4)] hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-success-green"
    >
      <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
        chat
      </span>
      <div className="flex flex-col text-left">
        <span className="text-label-sm leading-tight opacity-90">24x7 Quick Enquiry</span>
        <span className="text-label-lg font-bold leading-tight">WhatsApp Us</span>
      </div>
    </a>
  );
};
