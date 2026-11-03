import React, { useState } from 'react';
import { FAQ_ITEMS } from '../config/destinationsConfig';
import { useAppConfig } from '../context/AppConfigContext';

export const FAQ: React.FC = () => {
  const { contactConfig } = useAppConfig();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [FAQ_ITEMS[0]?.id ?? 'faq-1']: true,
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faqs" className="w-full py-space-xl bg-background">
      <div className="max-w-4xl mx-auto px-gutter-mobile sm:px-gutter">
        <div className="flex flex-col items-center text-center mb-space-xl">
          <span className="text-label-md text-secondary uppercase font-bold tracking-widest">
            Everything You Need To Know
          </span>
          <h2 className="text-headline-lg-mobile sm:text-headline-lg text-primary tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Simple, transparent answers regarding estimated fares, toll policies, one-way drops, and chauffeur allowances.
          </p>
        </div>

        <div className="flex flex-col gap-space-md">
          {FAQ_ITEMS.map((item) => {
            const isOpen = Boolean(openIds[item.id]);
            const dynamicAnswer = item.answer.replace(
              '+91 88593 64336',
              contactConfig.phoneDisplay
            );
            const panelId = `${item.id}-panel`;
            const buttonId = `${item.id}-button`;

            return (
              <div
                key={item.id}
                className="bg-surface-canvas rounded-2xl shadow-sm border border-border-subtle overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-space-lg text-left flex items-center justify-between gap-space-md text-title-md font-bold text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-route-active"
                >
                  <span>{item.question}</span>
                  <span
                    className={`material-symbols-outlined text-secondary shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                    aria-hidden="true"
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-space-lg pb-space-lg text-body-md text-on-surface-variant leading-relaxed border-t border-surface-subtle pt-space-md"
                  >
                    {dynamicAnswer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
