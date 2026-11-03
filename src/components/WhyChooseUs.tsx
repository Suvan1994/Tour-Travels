import React from 'react';
import { WHY_CHOOSE_PILLARS } from '../config/destinationsConfig';

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-jmd" className="w-full py-space-xl bg-background">
      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-xl">
          <span className="text-label-md text-secondary uppercase font-bold tracking-widest">
            The JMD Reliability Pledge
          </span>
          <h2 className="text-headline-lg-mobile sm:text-headline-lg text-primary tracking-tight mt-1">
            Why Travelers Rely On Jai Maa Durge
          </h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Over 12 years of delivering dependable outstation road journeys across North and Central India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {WHY_CHOOSE_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-surface-canvas p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-space-sm border border-primary-container/6"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center ${pillar.iconColorClass}`}
              >
                <span className="material-symbols-outlined text-[26px]" aria-hidden="true">
                  {pillar.icon}
                </span>
              </div>
              <h3 className="text-title-md font-bold text-on-surface">{pillar.title}</h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
