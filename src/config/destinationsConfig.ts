import { FAQItem, TestimonialItem, TourPackageItem, WhyChoosePillar } from '../types/travel';

export const HERO_BACKGROUND_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCzdXLf87HQIsABFZ3E1FhYAVYkQ4SAfP3dhePkNIvZnKTK0t-lD6GL-ha-PgC1h3PmosYoFxvMgoEcupngR5fT7JCVhJeMBuYhJLrxXZBEMr9inmVSP6funejt5LhG5Yc1mlkaHeKmta6hDXCtapiW2e-oPLOF7-wCarUGb6p7xARNNSnlyd6zLNAKhCv-2MSA7BKol9YMcnEU-5VC8zs7-nwwcP1mEnfJK5YdVDo';

export const TOUR_PACKAGES: TourPackageItem[] = [
  {
    id: 'delhi-agra',
    title: 'Delhi to Agra (Taj Mahal Tour)',
    badge: 'Same Day Heritage',
    badgeVariant: 'primary',
    corridorTag: 'Yamuna Expressway',
    originQuery: 'New Delhi, Delhi, India',
    destinationQuery: 'Agra, Uttar Pradesh, India',
    recommendedDays: 1,
    recommendedVehicleId: 'innova-crysta',
    description:
      'Taj Mahal, Agra Fort & Mehtab Bagh sunset. Smooth Yamuna Expressway drive with flexible highway breakfast halts.',
    highlights: [
      { icon: 'schedule', text: '12–14 Hours' },
      { icon: 'directions_car', text: 'Sedan / Crysta' },
    ],
    highlightNote: 'Fastag Ready',
    startingPriceLabel: 'From ₹4,500',
    priceSubLabel: 'est. sedan',
    ctaLabel: 'Load Route & Quote',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwB-ZGuDTK22mu5tTsIK83chfIxGGicnzeJD5h026Jum8X26BDd3XI7ShaNHy8cFpV-AQCZ2xVGndtaHmDsiSflamGmi6DUCxknqYAxzAb7bhHqAcOuq87DzVmezyNYciX_OKyeTe2X9zoBXp83wCgffuodD4EvRGUaauW7MGjgFxbX6j5J3eG1t20mLHuvxObb39M0QUUForDI6Fgt0byKzdVVqmBjXpbYb7W8sk',
    imageAlt: 'Taj Mahal marble dome reflecting in morning sunrise water pool in Agra',
  },
  {
    id: 'delhi-jaipur',
    title: 'Delhi to Jaipur (Pink City Circuit)',
    badge: '2 Days / 1 Night',
    badgeVariant: 'secondary',
    corridorTag: 'NH48 / Expressway',
    originQuery: 'New Delhi, Delhi, India',
    destinationQuery: 'Jaipur, Rajasthan, India',
    recommendedDays: 2,
    recommendedVehicleId: 'innova-crysta',
    description:
      'Amer Fort, Jal Mahal, City Palace, Hawa Mahal and evening Chokhi Dhani cultural village dining transfer.',
    highlights: [
      { icon: 'hotel', text: '2D / 1N or 3D / 2N' },
      { icon: 'groups', text: 'Ideal for Families' },
    ],
    startingPriceLabel: 'From ₹6,800',
    priceSubLabel: 'est. round trip',
    ctaLabel: 'Load Route & Quote',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCgHSFoFOHTAz9Co77U-8cyGsoSvw39O-TzMHNUEee6mb6AZh_J6EiL_0h2xBFIbgIuuCULKW62OsM1DbbzpYoSt8_LztKBU1tcw7UD03VXzv62X2yUP2dGlAFYoNmHsksAyJIseipFKLVeAq97_UdM_yumUOlLNic07p_PPaEoiRrWpDiqYXLSkGsk-1jDQpExR8_dakIIEzwyb0ddsIukxF-VL6tOtXtQJkk7AMY',
    imageAlt: 'Hawa Mahal Palace of Winds pink facade in Jaipur Rajasthan',
  },
  {
    id: 'haridwar-rishikesh',
    title: 'Haridwar & Rishikesh Ganga Darshan',
    badge: 'Sacred Yatra',
    badgeVariant: 'gold',
    corridorTag: 'Delhi–Meerut Expy',
    originQuery: 'New Delhi, Delhi, India',
    destinationQuery: 'Rishikesh, Uttarakhand, India',
    recommendedDays: 2,
    recommendedVehicleId: 'innova-crysta',
    description:
      'Ganga Aarti at Har Ki Pauri, Ram Jhula, Laxman Jhula, Parmarth Niketan and river rafting camp transfers.',
    highlights: [
      { icon: 'self_improvement', text: 'Yoga & Aarti' },
      { icon: 'hotel', text: '2D / 1N Custom' },
    ],
    startingPriceLabel: 'From ₹6,400',
    priceSubLabel: 'est. starting',
    ctaLabel: 'Load Route & Quote',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCoFtrwsm9DVmnh40dbliXPaFVdkml63ZRUV3ZLlE87QSufVy80C-rLZww5Z99Cgyiaosw1jWtkERu2C8ClF_dE0raMh_nepBO02sl5iwl-PHSnmLU1oA6TIwEwJdnagybN4_nldGtPvyO8xwhgwOvnvIzJwrgCmCIUAgDeuqi3tQOaJX9esC0mid2KD9hlFpHWVzd1oeWIZtcUJAg0yaQwrBfXEq45sx4Y30xOFLc',
    imageAlt: 'Evening Ganga Aarti ceremony with oil lamps at Har Ki Pauri Haridwar',
  },
  {
    id: 'mathura-vrindavan',
    title: 'Mathura, Vrindavan & Govardhan',
    badge: 'Braj Bhoomi Tour',
    badgeVariant: 'primary',
    corridorTag: '1-Day Darshan',
    originQuery: 'New Delhi, Delhi, India',
    destinationQuery: 'Vrindavan, Uttar Pradesh, India',
    recommendedDays: 1,
    recommendedVehicleId: 'sedan',
    description:
      'Shri Krishna Janmabhoomi, Bankey Bihari Ji, Prem Mandir evening illumination and Govardhan Parikrama cab.',
    highlights: [
      { icon: 'schedule', text: 'Same Day Return' },
      { icon: 'diversity_1', text: 'Senior Friendly' },
    ],
    startingPriceLabel: 'From ₹3,800',
    priceSubLabel: 'est. starting',
    ctaLabel: 'Load Route & Quote',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAN6ahUkentBGl2P5DXDbYM2O10agxjlLFAZdVT9RuqJRUyGz40XKGd0MRZaw7Iq5rvbeQ57l2-5Nu7yBUnIgshyqoSiNgTdfrc69rYdLdtLMQuaukEu7umgncntqEWXu3PYkrJYb5NAQCEoFWbC5Dvj6lr_G-XmlsJtjxXHVM0n9poIw6zLaUftVH_71RYPYZ75kAL7JSonxJB9h5aKwQ2Fy7vaRFMzNIFrKqQ2rQ',
    imageAlt: 'Prem Mandir illuminated in evening lights in Vrindavan',
  },
  {
    id: 'shimla-manali',
    title: 'Shimla, Kullu & Manali Escapes',
    badge: 'Himachal Holidays',
    badgeVariant: 'secondary',
    corridorTag: '5–6 Days Circuit',
    originQuery: 'New Delhi, Delhi, India',
    destinationQuery: 'Manali, Himachal Pradesh, India',
    recommendedDays: 5,
    recommendedVehicleId: 'innova-crysta',
    description:
      'Mall Road, Kufri viewpoint, Atal Tunnel, and Solang Valley mountain excursions with seasoned hill chauffeurs.',
    highlights: [
      { icon: 'landscape', text: 'Mountain Specialists' },
      { icon: 'ac_unit', text: 'All-Season Fleet' },
    ],
    startingPriceLabel: 'From ₹17,500',
    priceSubLabel: '5 Days / 4 Nights',
    ctaLabel: 'Load Route & Quote',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9IBvCTtQZaQ7tHwiMdG5n3D47c6bG3yAtrNwqA5ErPxERNWscVrZ8koFrNR-0dY0HEBas-aPlTnkK1OOx_RcLeEvCpQ7eIm8XSW3l2H5UXb7U9EVFG-CbaStcngO_bvh_oqYVUg3zCGKIcxbtxRB6nj-uRqrWjzsgOLacA7kcpce4lbTNCsA0-hnUq41RnT5AMb4WYcCz7p8oHbgjCA4kOhEkgMOJbnt4QhqIE5I',
    imageAlt: 'Snow-capped Himalayan peaks and pine valleys near Manali',
  },
  {
    id: 'char-dham-yatra',
    title: 'Complete Char Dham Yatra Package',
    badge: 'Devbhoomi Special',
    badgeVariant: 'gold',
    corridorTag: '10–12 Days Yatra',
    originQuery: 'Haridwar, Uttarakhand, India',
    destinationQuery: 'Badrinath, Uttarakhand, India',
    recommendedDays: 10,
    recommendedVehicleId: 'traveller-16',
    isCustomQuote: true,
    description:
      'Yamunotri, Gangotri, Kedarnath & Badrinath in high-torque Innova Crysta, Force Urbania, or Tempo Travellers with Green-Card certified mountain drivers.',
    highlights: [
      { icon: 'verified', text: 'Green Card Certified' },
      { icon: 'luggage', text: 'Full Group Comfort' },
    ],
    startingPriceLabel: 'Custom Quotation',
    priceSubLabel: 'per group',
    ctaLabel: 'Plan Yatra on WhatsApp',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXVcFqpkU15fMHslZQYfr_kmhcEJjw2j_NkoCu1XADgdC0t39e8Z6BafFlDo-zfn1E3yOGAK6F4xDq5TRaX9bLsML8jJmdbnvW8k76o5hS_-n5E9ypyFo8SpRs2ohQsz_qJfVik7ULGp_5wkuq4sGJN1OyfxXsu434B0NNJ3kpXD3J3TafUHx8U-ZDJ4MLKZ8ALF6MngRyT_JzFYgQIERR7t6odxcj0-IuxJWJk50',
    imageAlt: 'Holy Kedarnath temple below snow-clad Himalayan peaks',
  },
];

export const POPULAR_FOOTER_DESTINATIONS: { label: string; destinationQuery: string; highlight?: boolean }[] = [
  { label: 'Delhi NCR Local', destinationQuery: 'Connaught Place, New Delhi, India' },
  { label: 'Agra Taj Mahal', destinationQuery: 'Agra, Uttar Pradesh, India' },
  { label: 'Jaipur Pink City', destinationQuery: 'Jaipur, Rajasthan, India' },
  { label: 'Haridwar Ghats', destinationQuery: 'Haridwar, Uttarakhand, India' },
  { label: 'Rishikesh Rafting', destinationQuery: 'Rishikesh, Uttarakhand, India' },
  { label: 'Manali Hills', destinationQuery: 'Manali, Himachal Pradesh, India' },
  { label: 'Shimla Heights', destinationQuery: 'Shimla, Himachal Pradesh, India' },
  { label: 'Char Dham Yatra', destinationQuery: 'Badrinath, Uttarakhand, India', highlight: true },
];

export const WHY_CHOOSE_PILLARS: WhyChoosePillar[] = [
  {
    icon: 'price_check',
    iconColorClass: 'text-secondary',
    title: 'Affordable & Transparent Rates',
    description:
      'Clear per-kilometre billing from ₹12/km. No algorithmic surge pricing, platform commissions, or last-minute surprises.',
  },
  {
    icon: 'sanitizer',
    iconColorClass: 'text-success-green',
    title: 'Sanitized & Spotless Fleet',
    description:
      'Deep interior cleaning before every dispatch. Fresh seat covers, working dual-zone AC, and clean luggage bays.',
  },
  {
    icon: 'badge',
    iconColorClass: 'text-secondary',
    title: 'Police-Verified Drivers',
    description:
      'Courteous, uniformed commercial chauffeurs with verified backgrounds, tourist permits, and highway etiquette.',
  },
  {
    icon: 'alt_route',
    iconColorClass: 'text-rating-gold',
    title: 'Flexible Multi-Day Circuits',
    description:
      'Travel at your family’s pace. Pause comfortably for highway dhabas, scenic valley viewpoints, or temple darshans.',
  },
  {
    icon: 'celebration',
    iconColorClass: 'text-secondary',
    title: 'Weddings & Corporate Logistics',
    description:
      'Coordinated fleet dispatch for destination wedding guest shuttles, airport VIP arrivals, and corporate multi-bus convoys.',
  },
  {
    icon: 'chat_bubble',
    iconColorClass: 'text-success-green',
    title: 'Direct WhatsApp Assistance',
    description:
      'Zero app downloads needed. Receive itemized fare quotes, vehicle photos, and chauffeur details directly on WhatsApp.',
  },
  {
    icon: 'landscape',
    iconColorClass: 'text-rating-gold',
    title: 'Hill & Ghat Specialists',
    description:
      'Veteran mountain chauffeurs experienced across Himachal, Uttarakhand, and Char Dham high-altitude hairpin routes.',
  },
  {
    icon: 'support',
    iconColorClass: 'text-secondary',
    title: '24x7 Direct Highway SOS',
    description:
      'Round-the-clock central dispatch desk monitoring every outstation trip with rapid roadside backup support.',
  },
];

export const CUSTOMER_TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Vikas Mehra',
    tripContext: 'Corporate Offsite • Delhi to Neemrana',
    rating: 5,
    quote:
      'Booked a 13-seater Force Urbania for our tech leadership team offsite to Neemrana. The vehicle was immaculately clean, captain seats were ultra-comfortable, and the driver reached 15 minutes early.',
  },
  {
    name: 'Dr. Ananya Srivastava',
    tripContext: 'Family Vacation • Delhi to Jaipur & Pushkar',
    rating: 5,
    quote:
      'We hired an Innova Crysta for a family trip to Jaipur and Pushkar with elderly parents. Ride comfort was top-notch and our chauffeur Manoj ji was exceptionally courteous and patient.',
  },
  {
    name: 'Rajinder Grover & Group',
    tripContext: 'Pilgrimage • 16-Seater Char Dham Yatra',
    rating: 5,
    quote:
      'Completed our 11-day Char Dham Yatra in a 16-seater Tempo Traveller. Mountain driving demands real skill, and our JMD captain drove smoothly and safely throughout. Jai Maa Durge!',
  },
  {
    name: 'Pooja & Kunal Singhania',
    tripContext: 'Wedding Transfer • Delhi to Agra Resort',
    rating: 5,
    quote:
      'Booked two 40-seater AC luxury buses and an Urbania for our sister’s wedding in Agra. Airport pickups and hotel transfers were coordinated right on schedule.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I book a cab, Force Urbania, or bus with JMD Tour & Travels?',
    answer:
      'Enter your pickup location, destination, travel dates, and preferred vehicle in our live Route & Fare Calculator, then click Book Now / Request Best Fare to send your enquiry on WhatsApp (+91 88593 64336). Our dispatch desk will verify availability and confirm your final quotation.',
  },
  {
    id: 'faq-2',
    question: 'How is the estimated trip fare calculated? Are tolls and parking included?',
    answer:
      'Estimated Fare is calculated using Base Fare (Billable Distance × Per-KM Vehicle Rate) plus Driver Daily Allowance, plus optional Estimated Tolls, Parking, Night Charges, and GST if applicable. Outstation round trips carry a standard minimum running of 250 KM per calendar day. Actual Fastag tolls, state entry taxes, and parking slips can be settled at actuals or requested as an all-inclusive quote.',
  },
  {
    id: 'faq-3',
    question: 'Is the fare shown on the website a confirmed booking price?',
    answer:
      'No — the amount displayed by the calculator is an ESTIMATED FARE based on live Google Maps driving distance and standard per-km tariffs. Opening WhatsApp submits an enquiry; your booking and exact tariff are confirmed once our team verifies route permits, hill terrain, and vehicle availability.',
  },
  {
    id: 'faq-4',
    question: 'Can I book both One-Way drops and multi-day Round-Trip outstation journeys?',
    answer:
      'Yes! Both our Booking Form and Fare Calculator support One-Way drops and multi-day Outstation Round Trips, as well as Local 8Hr/80KM city packages and Airport Transfers.',
  },
  {
    id: 'faq-5',
    question: 'Do you provide Force Urbania, Tempo Travellers, and 35–50 Seater Buses for hills and weddings?',
    answer:
      'Yes. Our commercial fleet spans 4-seater Sedans, Ertiga/Carens, Innova Crysta, Premium SUVs, 9–20 Seater Tempo Travellers, 10–17 Seater Force Urbania vans, Mini Buses, and 35–50 Seater Luxury AC Buses with experienced hill-certified chauffeurs.',
  },
  {
    id: 'faq-6',
    question: 'What are the driver allowance (batta) and night driving charges?',
    answer:
      'Driver daily allowance ranges from ₹350/day (Sedans) to ₹400–₹600/day (SUVs, Travellers, Urbania) and ₹700–₹1,000/day (Mini & Luxury Buses) to cover chauffeur meals and rest. If driving is required between 10:00 PM and 5:00 AM, a standard night charge per night applies.',
  },
];
