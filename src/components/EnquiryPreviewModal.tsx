import React, { useState } from 'react';
import { useAppConfig } from '../context/AppConfigContext';

export const EnquiryPreviewModal: React.FC = () => {
  const { enquiryModal, closeEnquiryModal, contactConfig } = useAppConfig();
  const [copied, setCopied] = useState(false);

  if (!enquiryModal.isOpen || !enquiryModal.payload) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enquiryModal.rawMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-container/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div className="w-full max-w-lg bg-surface-canvas text-on-surface rounded-2xl shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-primary text-surface-canvas px-space-lg py-space-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-rating-gold text-[22px]" aria-hidden="true">
              send_to_mobile
            </span>
            <div>
              <h3 id="enquiry-modal-title" className="text-title-md font-bold">
                WhatsApp Enquiry Ready
              </h3>
              <p className="text-label-sm text-secondary-fixed">
                Enquiry prepared for {contactConfig.phoneDisplay}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeEnquiryModal}
            aria-label="Close enquiry summary dialog"
            className="w-8 h-8 rounded-lg bg-surface-canvas/10 hover:bg-surface-canvas/20 flex items-center justify-center text-surface-canvas transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-space-lg overflow-y-auto flex flex-col gap-space-md">
          {/* Transparent Notice: Not a confirmed booking */}
          <div className="bg-amber-50 border border-amber-200 text-amber-950 rounded-xl p-space-md flex items-start gap-2.5 text-body-sm">
            <span className="material-symbols-outlined text-amber-700 text-[20px] shrink-0 mt-0.5" aria-hidden="true">
              info
            </span>
            <div>
              <p className="font-bold">Important: Enquiry Only — Not Yet Confirmed</p>
              <p className="mt-0.5 text-amber-900">
                The calculated amount is an <strong>ESTIMATED FARE</strong>. Your trip booking is confirmed only after our JMD dispatch team verifies vehicle availability and shares your final quotation on WhatsApp.
              </p>
            </div>
          </div>

          {/* Formatted WhatsApp Summary */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">
                Formatted WhatsApp Enquiry
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-label-sm font-bold text-secondary hover:underline"
              >
                <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <pre className="bg-surface-subtle border border-border-subtle rounded-xl p-space-md text-body-sm font-sans whitespace-pre-wrap text-on-surface leading-relaxed">
              {enquiryModal.rawMessage}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-space-lg py-space-md bg-surface-subtle border-t border-border-subtle flex flex-col sm:flex-row items-center justify-end gap-space-sm">
          <button
            type="button"
            onClick={closeEnquiryModal}
            className="w-full sm:w-auto px-space-md py-2.5 rounded-xl text-label-md font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          <a
            href={enquiryModal.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeEnquiryModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-success-green hover:bg-success-green/90 text-on-secondary px-space-lg py-2.5 rounded-xl text-label-lg font-bold shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              open_in_new
            </span>
            <span>Open WhatsApp Chat</span>
          </a>
        </div>
      </div>
    </div>
  );
};
