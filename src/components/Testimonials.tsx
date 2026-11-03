import React from 'react';
import { CUSTOMER_TESTIMONIALS } from '../config/destinationsConfig';
import { useAppConfig } from '../context/AppConfigContext';

export const Testimonials: React.FC = () => {
  const { contactConfig } = useAppConfig();

  return (
    <section id="reviews" className="w-full py-space-xl bg-surface-subtle">
      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs">
              <div className="flex items-center text-rating-gold" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((star) => (
                  <span
                    key={star}
                    className="material-symbols-outlined material-symbol-filled text-[20px]"
                    aria-hidden="true"
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-label-lg font-bold text-on-surface tabular-nums">
                {contactConfig.googleRating} Stars
              </span>
            </div>
            <h2 className="text-headline-lg-mobile sm:text-headline-lg text-primary tracking-tight">
              Real Stories From North India Travelers
            </h2>
          </div>

          <div className="flex items-center gap-space-sm">
            <span className="text-body-sm text-on-surface-variant">
              Verified bookings across Delhi NCR, Rajasthan, Himachal &amp; Uttarakhand
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {CUSTOMER_TESTIMONIALS.map((review, idx) => (
            <article
              key={idx}
              className="bg-surface-canvas p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-primary-container/6"
            >
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center text-rating-gold gap-0.5" aria-label={`${review.rating} stars`}>
                  {Array.from({ length: review.rating }).map((_, sIdx) => (
                    <span
                      key={sIdx}
                      className="material-symbols-outlined material-symbol-filled text-[16px]"
                      aria-hidden="true"
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-body-md text-on-surface italic leading-relaxed">
                  “{review.quote}”
                </p>
              </div>

              <div className="pt-space-md mt-space-md flex flex-col border-t border-primary-container/8">
                <span className="text-label-lg font-bold text-on-surface">{review.name}</span>
                <span className="text-label-sm text-on-surface-variant mt-0.5">
                  {review.tripContext}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
