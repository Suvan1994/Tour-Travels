import React, { useEffect, useState } from 'react';
import { useAppConfig } from '../context/AppConfigContext';
import { buildWhatsAppUrl } from '../utils/whatsappBooking';

interface HeritageSlide {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  badge: string;
  corridor: string;
  imageUrl: string;
  alt: string;
  theme: {
    gradientText: string;
    glowColor: string;
    pillBorder: string;
    pillBg: string;
    pillText: string;
  };
}

const HERITAGE_SLIDES: HeritageSlide[] = [
  {
    id: 'taj-mahal',
    title: 'Taj Mahal',
    subtitle: 'Symbol of Eternal Love & UNESCO World Heritage',
    location: 'Agra, Uttar Pradesh',
    badge: 'Same Day Heritage',
    corridor: 'Yamuna Expressway • 210 KM',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwB-ZGuDTK22mu5tTsIK83chfIxGGicnzeJD5h026Jum8X26BDd3XI7ShaNHy8cFpV-AQCZ2xVGndtaHmDsiSflamGmi6DUCxknqYAxzAb7bhHqAcOuq87DzVmezyNYciX_OKyeTe2X9zoBXp83wCgffuodD4EvRGUaauW7MGjgFxbX6j5J3eG1t20mLHuvxObb39M0QUUForDI6Fgt0byKzdVVqmBjXpbYb7W8sk',
    alt: 'Majestic Taj Mahal marble dome reflecting in morning sunrise water pool in Agra',
    theme: {
      gradientText: 'from-amber-300 via-amber-200 to-yellow-400',
      glowColor: 'rgba(245, 185, 66, 0.4)',
      pillBorder: 'border-amber-400/60',
      pillBg: 'bg-amber-500/20',
      pillText: 'text-amber-300',
    },
  },
  {
    id: 'hawa-mahal',
    title: 'Hawa Mahal & Amer Fort',
    subtitle: 'Palace of Winds & Royal Rajput Fortresses',
    location: 'Jaipur, Rajasthan',
    badge: 'Pink City Royal Circuit',
    corridor: 'Delhi–Jaipur Expressway • 270 KM',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCgHSFoFOHTAz9Co77U-8cyGsoSvw39O-TzMHNUEee6mb6AZh_J6EiL_0h2xBFIbgIuuCULKW62OsM1DbbzpYoSt8_LztKBU1tcw7UD03VXzv62X2yUP2dGlAFYoNmHsksAyJIseipFKLVeAq97_UdM_yumUOlLNic07p_PPaEoiRrWpDiqYXLSkGsk-1jDQpExR8_dakIIEzwyb0ddsIukxF-VL6tOtXtQJkk7AMY',
    alt: 'Intricate pink terracotta honeycomb facade of Hawa Mahal Palace of Winds in Jaipur',
    theme: {
      gradientText: 'from-rose-400 via-amber-200 to-rose-300',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      pillBorder: 'border-rose-400/60',
      pillBg: 'bg-rose-500/20',
      pillText: 'text-rose-300',
    },
  },
  {
    id: 'kedarnath',
    title: 'Kedarnath Dham & Himalayas',
    subtitle: 'Sacred Devbhoomi Temple Amidst Snow-Capped Peaks',
    location: 'Kedarnath, Uttarakhand',
    badge: 'Char Dham Special',
    corridor: 'Himalayan Mountain Route • 450 KM',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXVcFqpkU15fMHslZQYfr_kmhcEJjw2j_NkoCu1XADgdC0t39e8Z6BafFlDo-zfn1E3yOGAK6F4xDq5TRaX9bLsML8jJmdbnvW8k76o5hS_-n5E9ypyFo8SpRs2ohQsz_qJfVik7ULGp_5wkuq4sGJN1OyfxXsu434B0NNJ3kpXD3J3TafUHx8U-ZDJ4MLKZ8ALF6MngRyT_JzFYgQIERR7t6odxcj0-IuxJWJk50',
    alt: 'Holy Kedarnath temple standing serenely below snow-clad Himalayan mountain peaks',
    theme: {
      gradientText: 'from-sky-300 via-cyan-200 to-emerald-300',
      glowColor: 'rgba(56, 189, 248, 0.4)',
      pillBorder: 'border-sky-400/60',
      pillBg: 'bg-sky-500/20',
      pillText: 'text-sky-300',
    },
  },
  {
    id: 'haridwar-rishikesh',
    title: 'Har Ki Pauri & Ganga Ghats',
    subtitle: 'Spiritual Maha Aarti & Emerald River Rapids',
    location: 'Haridwar & Rishikesh, Uttarakhand',
    badge: 'Sacred Ganga Darshan',
    corridor: 'Delhi–Meerut Expressway • 240 KM',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCoFtrwsm9DVmnh40dbliXPaFVdkml63ZRUV3ZLlE87QSufVy80C-rLZww5Z99Cgyiaosw1jWtkERu2C8ClF_dE0raMh_nepBO02sl5iwl-PHSnmLU1oA6TIwEwJdnagybN4_nldGtPvyO8xwhgwOvnvIzJwrgCmCIUAgDeuqi3tQOaJX9esC0mid2KD9hlFpHWVzd1oeWIZtcUJAg0yaQwrBfXEq45sx4Y30xOFLc',
    alt: 'Evening Ganga Aarti ceremony with glowing brass oil lamps at Har Ki Pauri Ghat',
    theme: {
      gradientText: 'from-amber-400 via-orange-300 to-amber-200',
      glowColor: 'rgba(251, 146, 60, 0.4)',
      pillBorder: 'border-orange-400/60',
      pillBg: 'bg-orange-500/20',
      pillText: 'text-orange-300',
    },
  },
  {
    id: 'prem-mandir',
    title: 'Prem Mandir & Braj Bhoomi',
    subtitle: 'Divine White Italian Marble & Evening Illumination',
    location: 'Vrindavan, Mathura',
    badge: 'Braj Darshan Circuit',
    corridor: 'Yamuna Expressway • 160 KM',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAN6ahUkentBGl2P5DXDbYM2O10agxjlLFAZdVT9RuqJRUyGz40XKGd0MRZaw7Iq5rvbeQ57l2-5Nu7yBUnIgshyqoSiNgTdfrc69rYdLdtLMQuaukEu7umgncntqEWXu3PYkrJYb5NAQCEoFWbC5Dvj6lr_G-XmlsJtjxXHVM0n9poIw6zLaUftVH_71RYPYZ75kAL7JSonxJB9h5aKwQ2Fy7vaRFMzNIFrKqQ2rQ',
    alt: 'Prem Mandir temple illuminated in vibrant evening spiritual lighting in Vrindavan',
    theme: {
      gradientText: 'from-purple-300 via-pink-200 to-amber-300',
      glowColor: 'rgba(192, 132, 252, 0.4)',
      pillBorder: 'border-purple-400/60',
      pillBg: 'bg-purple-500/20',
      pillText: 'text-purple-300',
    },
  },
  {
    id: 'manali-himalayas',
    title: 'Manali & Solang Snow Valley',
    subtitle: 'Pine Forests, Rohtang Pass & Winding Hill Highways',
    location: 'Manali, Himachal Pradesh',
    badge: 'Himalayan Escapes',
    corridor: 'Chandigarh–Manali Four Lane • 540 KM',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9IBvCTtQZaQ7tHwiMdG5n3D47c6bG3yAtrNwqA5ErPxERNWscVrZ8koFrNR-0dY0HEBas-aPlTnkK1OOx_RcLeEvCpQ7eIm8XSW3l2H5UXb7U9EVFG-CbaStcngO_bvh_oqYVUg3zCGKIcxbtxRB6nj-uRqrWjzsgOLacA7kcpce4lbTNCsA0-hnUq41RnT5AMb4WYcCz7p8oHbgjCA4kOhEkgMOJbnt4QhqIE5I',
    alt: 'Snow-capped alpine pine mountains and winding mountain highways near Manali',
    theme: {
      gradientText: 'from-emerald-300 via-teal-200 to-sky-300',
      glowColor: 'rgba(52, 211, 153, 0.4)',
      pillBorder: 'border-emerald-400/60',
      pillBg: 'bg-emerald-500/20',
      pillText: 'text-emerald-300',
    },
  },
];

export const Hero: React.FC = () => {
  const { contactConfig } = useAppConfig();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic slideshow: changes real heritage images every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERITAGE_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const whatsappHref = buildWhatsAppUrl(
    contactConfig.whatsappNumberInternational,
    `Hello ${contactConfig.businessName}, I would like to enquire about booking an Urbania, Tempo Traveller, or Luxury Bus.`
  );

  const activeSlide = HERITAGE_SLIDES[currentSlideIndex];

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#000915] text-surface-canvas -mt-20 sm:-mt-22 pt-24 sm:pt-28 pb-16 lg:pb-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Automatic Real Heritage Photos Slideshow (Full View, No Obstructive Box) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERITAGE_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.alt}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Very Light Airy Shading so Background Monuments & Mountains are 100% Seen */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020713]/90 via-[#020814]/30 to-black/40 pointer-events-none z-10" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

        {/* Dynamic ambient color glow that changes smoothly with the active heritage destination */}
        <div
          className="absolute -top-24 -right-20 w-[36rem] h-[36rem] rounded-full blur-3xl pointer-events-none z-10 transition-colors duration-1000"
          style={{ backgroundColor: activeSlide.theme.glowColor }}
        />
        <div
          className="absolute bottom-10 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none z-10 opacity-60 transition-colors duration-1000"
          style={{ backgroundColor: activeSlide.theme.glowColor }}
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-gutter-mobile sm:px-gutter flex flex-col pt-4 lg:pt-8">
        {/* Top Header Row: Official Logo Badge & Floating Heritage Location Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-space-lg">
          {/* Prominent Official Logo Badge */}
          <div className="flex items-center gap-3 bg-white/95 text-slate-900 p-2 sm:p-2.5 pr-4 sm:pr-5 rounded-2xl shadow-xl border border-slate-200/90 backdrop-blur-md hover:scale-[1.02] transition-transform w-fit">
            <div className="h-12 w-14 sm:h-14 sm:w-16 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm border border-slate-200/80 shrink-0">
              <img
                src={contactConfig.logoUrl}
                alt={`${contactConfig.businessName} Official Logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] sm:text-[15px] font-black uppercase tracking-wider text-slate-950 leading-tight">
                Jai Maa Durga Tour &amp; Travels
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-red-600 tracking-wider uppercase leading-tight">
                Where Luxury and Exploration Meet • Empire to Legacy
              </span>
            </div>
          </div>

          {/* Floating Heritage Place Indicator with Clickable Dots */}
          <div className="flex items-center gap-3 bg-black/45 backdrop-blur-xl border border-white/25 px-4 py-2.5 rounded-2xl shadow-2xl w-fit">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-rating-gold text-[22px] animate-pulse">
                location_on
              </span>
              <div className="flex flex-col">
                <span className="text-[13px] sm:text-[14px] font-black text-white leading-tight">
                  {activeSlide.title}
                </span>
                <span className="text-[11px] text-amber-300 font-bold leading-tight">
                  {activeSlide.location} • {activeSlide.corridor}
                </span>
              </div>
            </div>

            {/* Clickable Switcher Dots */}
            <div className="flex items-center gap-1.5 pl-3 border-l border-white/20">
              {HERITAGE_SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(i)}
                  title={`View ${slide.title} (${slide.location})`}
                  aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                  className={`transition-all rounded-full cursor-pointer ${
                    i === currentSlideIndex
                      ? 'w-7 h-2.5 bg-amber-400 shadow-[0_0_10px_rgba(245,185,66,0.9)]'
                      : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Hero Content Area: Unobstructed, Airy, and Directly Over the Beautiful Heritage Scenery */}
        <div className="flex flex-col max-w-3xl mb-space-xl">
          {/* Floating Tag with Active Heritage Corridor */}
          <div className="inline-flex items-center gap-2 mb-space-sm w-fit">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md border ${activeSlide.theme.pillBorder} ${activeSlide.theme.pillBg} ${activeSlide.theme.pillText} text-[11px] sm:text-label-md font-extrabold uppercase tracking-widest shadow-lg transition-colors duration-700`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{activeSlide.badge}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/90 normal-case font-semibold">{activeSlide.corridor}</span>
            </span>
          </div>

          {/* Crisp, Bold Headline with Drop Shadows (No Opaque Boxes Obstructing the Scenery) */}
          <h1 className="text-display-hero-mobile sm:text-display-hero text-white tracking-tight leading-[1.08] font-black drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Epic Squad Road Trips, <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${activeSlide.theme.gradientText} transition-all duration-700`}
            >
              Pure Luxury Vibes.
            </span>
          </h1>

          <p className="text-body-lg text-slate-100 max-w-2xl leading-relaxed mt-space-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] font-medium">
            Explore India’s timeless heritage in high-torque{' '}
            <strong className="text-white font-bold underline decoration-amber-400/60 underline-offset-4">
              Force Urbania luxury vans
            </strong>
            ,{' '}
            <strong className="text-white font-bold underline decoration-amber-400/60 underline-offset-4">
              Maharaja Tempo Travellers
            </strong>
            , and{' '}
            <strong className="text-white font-bold underline decoration-amber-400/60 underline-offset-4">
              Air-Suspension Luxury Coaches
            </strong>{' '}
            with panoramic windows, recliner seats, surround sound, and seasoned highway captains.
          </p>

          {/* Floating Vibrant Youth CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-space-md pt-space-lg">
            <a
              href="#quick-booking"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-6 sm:px-space-xl py-3.5 rounded-xl text-label-lg font-extrabold shadow-[0_10px_28px_rgba(220,38,38,0.5)] hover:shadow-[0_14px_35px_rgba(220,38,38,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap cursor-pointer border border-red-400/40"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                airport_shuttle
              </span>
              <span>Book Urbania / Traveller</span>
            </a>

            <a
              href="#fare-estimator"
              className="inline-flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-md px-5 sm:px-space-lg py-3.5 rounded-xl text-label-lg font-bold shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-amber-400" aria-hidden="true">
                calculate
              </span>
              <span>Live Route &amp; Fare</span>
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 sm:px-space-lg py-3.5 rounded-xl text-label-lg font-bold shadow-[0_8px_24px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap cursor-pointer border border-emerald-400/30"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                chat
              </span>
              <span>WhatsApp Instant Quote</span>
            </a>

            {/* Quick Tariff Highlight Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/45 backdrop-blur-md border border-amber-400/40 text-amber-300 text-label-md font-bold shadow-lg">
              <span className="material-symbols-outlined text-[18px] text-rating-gold">
                verified
              </span>
              <span>10–50 Seater Squads From ₹25/KM</span>
            </div>
          </div>
        </div>

        {/* Dynamic Vibe Badges Row in Translucent Floating Glass */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-xs">
          <div className="flex items-center gap-space-sm bg-black/35 hover:bg-black/55 transition-colors backdrop-blur-md p-space-md rounded-2xl border border-white/15 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-red-500/25 flex items-center justify-center text-red-400 shrink-0 border border-red-500/30">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                airline_seat_individual_suite
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-lg text-white font-bold drop-shadow-sm">VIP Recliners</span>
              <span className="text-body-sm text-slate-300">Panoramic Glass &amp; AC</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm bg-black/35 hover:bg-black/55 transition-colors backdrop-blur-md p-space-md rounded-2xl border border-white/15 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/30">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                speaker
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-lg text-white font-bold drop-shadow-sm">Party Sound &amp; RGB</span>
              <span className="text-body-sm text-slate-300">Bluetooth &amp; Smart Screen</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm bg-black/35 hover:bg-black/55 transition-colors backdrop-blur-md p-space-md rounded-2xl border border-white/15 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/30">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                landscape
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-lg text-white font-bold drop-shadow-sm">Hill &amp; Ghat Pros</span>
              <span className="text-body-sm text-slate-300">Himachal, UK &amp; Yatra</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm bg-black/35 hover:bg-black/55 transition-colors backdrop-blur-md p-space-md rounded-2xl border border-white/15 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-sky-500/25 flex items-center justify-center text-sky-400 shrink-0 border border-sky-500/30">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                verified_user
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-lg text-white font-bold drop-shadow-sm">24x7 Road SOS</span>
              <span className="text-body-sm text-slate-300">GPS Tracked Fleet</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
