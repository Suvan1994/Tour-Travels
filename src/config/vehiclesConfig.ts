import { VehicleCategory, VehicleDefinition } from '../types/travel';

const STITCH_SEDAN_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA-aldJC67u0U5tNbIAH048d8PNgNMVJGb4PRdLtcunuKSGWNwyoC2wnwULVsKitNLYlzbxBnyvw6eFhgnWQZOxi-tztDQS0r8pjlhUs495MC3sRCJ3BlTIc9r-7HF6t6ELA1EDrMOHTTsKNFa3hkafPWJaQCPQSP0S4VnsFcMkO-YnU96t_y5cfH8Ju_kATjVV4uoIP3Rx66uypbatJIE2B-u_ls3Lq7gcnlf_dXw';

const STITCH_CRYSTA_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBfpmEn4X0wLJXQ2rDwjx5eLoKFOKD5FjtN9XdBgTO5h3ZUp0QlIWkwegXNM4U0sDAMW9oiWVJk2jRBSyEyH5tNKuTjPYFWg5kDSlc4Hk32l3TbCEKYno7ruYWN3GjM_0CONNcBPzJ6_kMuKukNnxj0rmy9tleiOfgxWqE3LRrJWG0rMBn6r__2a90b54BsmdvhXXxkhgNgKVr4MyU3oQniP4EgH1ZhEPBu-Wqhjy0';

const STITCH_URBANIA_13_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDIS18SLdHCvbCgFfA10eCoLysWJQp94DaRZGi4kGdykBwa03_luJpYQBPPz2XuWjriIW69IKT6NieVXHs9R1xMzwunaUJwC-FF2bSIL8_CG7sJ6riTAeM4Age3Fpn8vVJ1GZKOF80wJ89rvZvdhehe0yt9B9hTHqyEAJ8Fa-ogD6IcVYvNeQAL0sJKkxWNtHG-RoB6e5E9UlQrbKDV3fZDuLVtPIUh2s_hYCD74G0';

const STITCH_URBANIA_17_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDTSRrOHH2dmFvwal1ahZoG0aJLfomIq8o2HpN6ckMYl1Cb5oAlfGXDuc0djBf45ycXaRONVNQgvWAVU-3DueRzxhVH6SIycr4x0gzRRnKmHwbo6Vsw4SbzYzSNifZ103m8V3Cs0nMMyVehj6NyayVURlvI1QVEKdPqbetUqNqJdJVOy1Ugc6SX8I5pGa2k9DddaPy3SfZUdo8k5pV8Wc0NbysWvHSJ1qHVdetOo8Q';

const STITCH_TEMPO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAsQA3SMquOV30GCTXujmeN9Zw2EfguBlNG4RQqZmv4vTDAXdULuhHwq_BugyL2-0fYTVIp0wTWEfdziNK0C-STCMYtjP_r5mlhAVrYfHiz_iNeDFVDnjzNiXbOQpMbg-voefYLAR5Jzrx_1bpijZ9Saw7tdxoOGCT74gaD98D1qZzjmDv0RiQDXxsmoQ8E6rr3XQKLdNnsKDd0wNm7w0jyhkf3eSFiYAOhpib0XrY';

const STITCH_BUS_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCbGOKQStZguOPf3Wr6b52k-m0WbNyc1zAuuTDfHjXH-o4iV2MwEsLFKVKray5Yfnpg_NKzxMWuzVEcCve7Yg6T0tkiU8aOQOOFRma3pd3BlNsmdIsTe6f-y64nJ7rk6Ul1Shv71-8badiXrUasf0bsE7rRgGTiIA54YPNAi1y4WWgboqjivrvLx6jTb8UkIsOMqvU0yYKKRSyBiOxrly8lifGs94fsMheJLn2dEWA';

export const DEFAULT_VEHICLES: VehicleDefinition[] = [
  {
    id: 'sedan',
    name: 'Sedan (Swift Dzire / Toyota Etios)',
    shortName: 'Sedan',
    category: VehicleCategory.SEDAN_SUV,
    badge: 'Executive Sedan',
    badgeStyle: 'primary',
    headerIcon: 'local_taxi',
    passengerCapacity: 4,
    seatLabel: '4 Passengers',
    luggageLabel: '2 Large Bags',
    description:
      'Ideal for compact family outstation journeys, city airport drop-offs, and express business commutes.',
    imageUrl: STITCH_SEDAN_IMG,
    imageAlt: 'Clean white Maruti Suzuki Dzire commercial tourist sedan car',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '4 Passengers' },
      { icon: 'luggage', label: '2 Large Bags' },
      { icon: 'ac_unit', label: 'Chilled AC' },
      { icon: 'speed', label: 'Fastag Enabled' },
    ],
  },
  {
    id: 'ertiga-carens',
    name: 'Maruti Ertiga / Kia Carens',
    shortName: 'Ertiga / Carens',
    category: VehicleCategory.SEDAN_SUV,
    badge: 'Smart Family MUV',
    badgeStyle: 'secondary',
    headerIcon: 'directions_car',
    passengerCapacity: 6,
    seatLabel: '6+1 Seater',
    luggageLabel: '3 Medium Bags',
    description:
      'Versatile 6-passenger MUV offering smooth suspension, dual AC vents, and budget-friendly family highway comfort.',
    imageUrl: STITCH_CRYSTA_IMG,
    imageAlt: 'Modern family 6-seater MPV on North Indian highway',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '6 Passengers' },
      { icon: 'luggage', label: '3 Medium Bags' },
      { icon: 'ac_unit', label: 'Dual Roof AC' },
      { icon: 'power', label: 'USB Charging' },
    ],
  },
  {
    id: 'innova-crysta',
    name: 'Toyota Innova Crysta',
    shortName: 'Innova Crysta',
    category: VehicleCategory.SEDAN_SUV,
    badge: 'Customer Favorite',
    badgeStyle: 'secondary',
    headerIcon: 'star',
    passengerCapacity: 7,
    seatLabel: '6+1 & 7+1 Seater',
    luggageLabel: '4 Big Bags',
    description:
      'The undisputed highway king. Supreme ride comfort, dual blower climate control, and captain recliner seats.',
    imageUrl: STITCH_CRYSTA_IMG,
    imageAlt: 'White Toyota Innova Crysta luxury MPV on a scenic Himalayan road',
    featured: true,
    specs: [
      { icon: 'airline_seat_recline_normal', label: '7 Passengers' },
      { icon: 'luggage', label: '4 Big Bags' },
      { icon: 'chair', label: 'Captain Seats' },
      { icon: 'power', label: 'USB Charging' },
    ],
  },
  {
    id: 'premium-suv',
    name: 'Premium SUV (Innova Hycross / Fortuner)',
    shortName: 'Premium SUV',
    category: VehicleCategory.SEDAN_SUV,
    badge: 'VIP Executive SUV',
    badgeStyle: 'primary',
    headerIcon: 'workspace_premium',
    passengerCapacity: 7,
    seatLabel: '6+1 VIP Lounge',
    luggageLabel: '4 Large Bags',
    description:
      'Commanding road presence for corporate CXOs, VIP delegations, wedding entries, and high-altitude mountain tours.',
    imageUrl: STITCH_CRYSTA_IMG,
    imageAlt: 'Premium executive SUV for VIP highway travel',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '7 Passengers' },
      { icon: 'luggage', label: '4 Large Bags' },
      { icon: 'chair', label: 'Ottoman Lounge' },
      { icon: 'terrain', label: 'All-Terrain Ready' },
    ],
  },
  {
    id: 'traveller-9-12',
    name: '9–12 Seater Tempo Traveller',
    shortName: '9–12 Seater Traveller',
    category: VehicleCategory.TEMPO,
    badge: 'Compact Group Tour',
    badgeStyle: 'secondary',
    headerIcon: 'groups',
    passengerCapacity: 12,
    seatLabel: '9 to 12 Pushback',
    luggageLabel: 'Dedicated Carrier',
    description:
      'Perfect for medium-sized families and friend groups travelling together with ample legroom and overhead luggage racks.',
    imageUrl: STITCH_TEMPO_IMG,
    imageAlt: 'White Force Tempo Traveller 12-seater tourist van',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '12 Passengers' },
      { icon: 'luggage', label: 'Roof + Boot Space' },
      { icon: 'ac_unit', label: 'Individual AC Vents' },
      { icon: 'curtains', label: 'Privacy Curtains' },
    ],
  },
  {
    id: 'traveller-16',
    name: '16 Seater Tempo Traveller',
    shortName: '16 Seater Traveller',
    category: VehicleCategory.TEMPO,
    badge: 'Pilgrimage Favorite',
    badgeStyle: 'secondary',
    headerIcon: 'groups',
    passengerCapacity: 16,
    seatLabel: '16 Pushback Seats',
    luggageLabel: 'Roof Carrier + Boot',
    description:
      'The trusted companion for Char Dham Yatra, Rajasthan heritage circuits, and Vaishno Devi family pilgrimages.',
    imageUrl: STITCH_TEMPO_IMG,
    imageAlt: 'Force Tempo Traveller 16-seater parked near Haridwar temple gate',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '16 Passengers' },
      { icon: 'terrain', label: 'Hill Specialist' },
      { icon: 'mic', label: 'Audio Mic System' },
      { icon: 'curtains', label: 'Privacy Curtains' },
    ],
  },
  {
    id: 'traveller-20',
    name: '20 Seater Maharaja Traveller',
    shortName: '20 Seater Traveller',
    category: VehicleCategory.TEMPO,
    badge: 'Extended Group Van',
    badgeStyle: 'primary',
    headerIcon: 'groups_3',
    passengerCapacity: 20,
    seatLabel: '20 Pushback Seats',
    luggageLabel: 'Full Roof Carrier',
    description:
      'Spacious 2x1 aisle layout engineered for joint-family tours, outstation retreats, and temple yatra groups.',
    imageUrl: STITCH_TEMPO_IMG,
    imageAlt: '20-seater Maharaja Tempo Traveller for group tours',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '20 Passengers' },
      { icon: 'luggage', label: 'Heavy Luggage Carrier' },
      { icon: 'tv', label: 'LED Entertainment' },
      { icon: 'power', label: 'Charging Ports' },
    ],
  },
  {
    id: 'urbania-10-13',
    name: 'Force Urbania (10–13 Seater)',
    shortName: 'Urbania 10–13 Seater',
    category: VehicleCategory.URBANIA,
    badge: 'VIP Luxury Van',
    badgeStyle: 'primary',
    headerIcon: 'airline_seat_individual_suite',
    passengerCapacity: 13,
    seatLabel: '10–13 Recliners',
    luggageLabel: 'Deep Rear Boot',
    description:
      'European styling, individual executive bucket recliners, panoramic sealed windows, and whisper-quiet monocoque cabin.',
    imageUrl: STITCH_URBANIA_13_IMG,
    imageAlt: 'Pearl white Force Urbania luxury van on expressway at golden hour',
    featured: true,
    specs: [
      { icon: 'airline_seat_recline_normal', label: '13 Passengers' },
      { icon: 'lightbulb', label: 'LED Mood Lights' },
      { icon: 'tv', label: 'Smart Screen' },
      { icon: 'hvac', label: 'Individual Vents' },
    ],
  },
  {
    id: 'urbania-17',
    name: 'Force Urbania (17 Seater)',
    shortName: 'Urbania 17 Seater',
    category: VehicleCategory.URBANIA,
    badge: 'Wedding & Corporate',
    badgeStyle: 'primary',
    headerIcon: 'airport_shuttle',
    passengerCapacity: 17,
    seatLabel: '17 Luxury Pushbacks',
    luggageLabel: 'Massive Rear Boot',
    description:
      'First-class road travel for wedding delegations, corporate leadership offsites, and luxury group expeditions.',
    imageUrl: STITCH_URBANIA_17_IMG,
    imageAlt: 'White 17-seater Force Urbania luxury van with custom leather interior',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '17 Passengers' },
      { icon: 'luggage', label: 'Massive Boot' },
      { icon: 'airplay', label: 'Bluetooth Audio' },
      { icon: 'sos', label: 'GPS Live Tracking' },
    ],
  },
  {
    id: 'mini-bus',
    name: 'AC Luxury Mini Bus (22–27 Seater)',
    shortName: 'Mini Bus',
    category: VehicleCategory.BUS,
    badge: 'Mid-Size Coach',
    badgeStyle: 'secondary',
    headerIcon: 'directions_bus',
    passengerCapacity: 27,
    seatLabel: '22–27 Pushback',
    luggageLabel: 'Underbody + Rear Boot',
    description:
      'Air-conditioned mini coach bridging the gap between Tempo Travellers and full-size buses for 25-member groups.',
    imageUrl: STITCH_BUS_IMG,
    imageAlt: 'AC Luxury Mini Bus for corporate and wedding groups',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '27 Passengers' },
      { icon: 'air', label: 'Air Suspension' },
      { icon: 'mic', label: 'PA Mic System' },
      { icon: 'luggage', label: 'Dedicated Boot' },
    ],
  },
  {
    id: 'bus-35-40',
    name: '35–40 Seater Luxury AC Bus',
    shortName: '35–40 Seater Bus',
    category: VehicleCategory.BUS,
    badge: 'Large Delegations',
    badgeStyle: 'primary',
    headerIcon: 'directions_bus',
    passengerCapacity: 40,
    seatLabel: '35–40 Pushback',
    luggageLabel: 'Belly Luggage Bays',
    description:
      'BharatBenz & Ashok Leyland air-suspension coaches built for wedding baraat logistics, college tours, and conventions.',
    imageUrl: STITCH_BUS_IMG,
    imageAlt: '35-40 seater BharatBenz luxury tourist coach bus on expressway',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '40 Passengers' },
      { icon: 'air', label: 'Air Suspension' },
      { icon: 'videocam', label: 'LED Monitors' },
      { icon: 'luggage', label: 'Luggage Bays' },
    ],
  },
  {
    id: 'bus-45-50',
    name: '45–50 Seater Volvo / BharatBenz Coach',
    shortName: '45–50 Seater Bus',
    category: VehicleCategory.BUS,
    badge: 'Grand Charter Coach',
    badgeStyle: 'gold',
    headerIcon: 'directions_bus',
    passengerCapacity: 50,
    seatLabel: '45–50 Recliner Coach',
    luggageLabel: 'Dual Belly Compartments',
    description:
      'Flagship multi-axle/air-suspension luxury highway liner for large destination weddings, institutional tours, and corporate events.',
    imageUrl: STITCH_BUS_IMG,
    imageAlt: '45-50 seater Volvo and BharatBenz luxury highway coach bus',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '50 Passengers' },
      { icon: 'air', label: 'Full Air Suspension' },
      { icon: 'tv', label: 'Dual LED Screens' },
      { icon: 'luggage', label: 'XL Belly Storage' },
    ],
  },
];
