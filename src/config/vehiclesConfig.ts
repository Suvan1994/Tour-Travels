import { VehicleCategory, VehicleDefinition } from '../types/travel';

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
    id: 'urbania-10-13',
    name: 'Force Urbania (10–13 Seater)',
    shortName: 'Urbania 10–13 Seater',
    category: VehicleCategory.URBANIA,
    badge: 'Youth & Tech Favorite',
    badgeStyle: 'primary',
    headerIcon: 'airline_seat_individual_suite',
    passengerCapacity: 13,
    seatLabel: '10–13 Recliners',
    luggageLabel: 'Deep Rear Boot',
    description:
      'European monocoque styling, individual executive recliners, panoramic sealed glass, and whisper-quiet cruise for young road trippers and tech teams.',
    imageUrl: STITCH_URBANIA_13_IMG,
    imageAlt: 'Pearl white Force Urbania luxury van on expressway at golden hour',
    featured: true,
    specs: [
      { icon: 'airline_seat_recline_normal', label: '13 Recliners' },
      { icon: 'lightbulb', label: 'RGB Mood Lights' },
      { icon: 'tv', label: 'Smart TV Screen' },
      { icon: 'power', label: 'USB & Type-C Ports' },
    ],
  },
  {
    id: 'urbania-17',
    name: 'Force Urbania (17 Seater)',
    shortName: 'Urbania 17 Seater',
    category: VehicleCategory.URBANIA,
    badge: 'VIP Club Lounger',
    badgeStyle: 'gold',
    headerIcon: 'airport_shuttle',
    passengerCapacity: 17,
    seatLabel: '17 Luxury Pushbacks',
    luggageLabel: 'Massive Rear Boot',
    description:
      'First-class group road travel with ambient lighting, individual AC vents, and plush leather recliners for wedding parties, college squads, and startup offsites.',
    imageUrl: STITCH_URBANIA_17_IMG,
    imageAlt: 'White 17-seater Force Urbania luxury van with custom leather interior',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '17 Luxury Seats' },
      { icon: 'luggage', label: 'Massive Boot' },
      { icon: 'airplay', label: 'Bluetooth Surround' },
      { icon: 'sos', label: 'GPS Live Tracking' },
    ],
  },
  {
    id: 'traveller-9-12',
    name: '9–12 Seater Tempo Traveller',
    shortName: '9–12 Seater Traveller',
    category: VehicleCategory.TEMPO,
    badge: 'Road Trip Cruiser',
    badgeStyle: 'secondary',
    headerIcon: 'groups',
    passengerCapacity: 12,
    seatLabel: '9 to 12 Pushback',
    luggageLabel: 'Dedicated Carrier',
    description:
      'Dynamic compact traveller ideal for friends trekking to Manali, Rishikesh, or Kasol with extra legroom, roof luggage carrier, and crisp sound system.',
    imageUrl: STITCH_TEMPO_IMG,
    imageAlt: 'White Force Tempo Traveller 12-seater tourist van',
    featured: true,
    specs: [
      { icon: 'airline_seat_recline_normal', label: '12 Passengers' },
      { icon: 'luggage', label: 'Roof + Boot Space' },
      { icon: 'ac_unit', label: 'Chilled Roof AC' },
      { icon: 'curtains', label: 'Privacy Curtains' },
    ],
  },
  {
    id: 'traveller-16',
    name: '16 Seater Tempo Traveller',
    shortName: '16 Seater Traveller',
    category: VehicleCategory.TEMPO,
    badge: 'Squad Expedition',
    badgeStyle: 'secondary',
    headerIcon: 'groups',
    passengerCapacity: 16,
    seatLabel: '16 Pushback Seats',
    luggageLabel: 'Roof Carrier + Boot',
    description:
      'The trusted mountain king for group expeditions, Char Dham Darshan, and Himachal adventures with high-torque hill-certified chauffeurs.',
    imageUrl: STITCH_TEMPO_IMG,
    imageAlt: 'Force Tempo Traveller 16-seater parked near Haridwar temple gate',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '16 Passengers' },
      { icon: 'terrain', label: 'Hill Climbing Pro' },
      { icon: 'mic', label: 'Karaoke / PA Mic' },
      { icon: 'power', label: 'Fast Chargers' },
    ],
  },
  {
    id: 'traveller-20',
    name: '20 Seater Maharaja Traveller',
    shortName: '20 Seater Traveller',
    category: VehicleCategory.TEMPO,
    badge: 'Maharaja Luxury 2x1',
    badgeStyle: 'primary',
    headerIcon: 'groups_3',
    passengerCapacity: 20,
    seatLabel: '20 Pushback Seats',
    luggageLabel: 'Full Roof Carrier',
    description:
      'Spacious 2x1 aisle configuration engineered for joint-family yatras, destination weddings, and extended holiday circuits across North India.',
    imageUrl: STITCH_TEMPO_IMG,
    imageAlt: '20-seater Maharaja Tempo Traveller for group tours',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '20 Passengers' },
      { icon: 'luggage', label: 'Heavy Luggage Bay' },
      { icon: 'tv', label: 'Smart LED Display' },
      { icon: 'curtains', label: 'Tinted Privacy' },
    ],
  },
  {
    id: 'mini-bus',
    name: 'AC Luxury Mini Bus (22–27 Seater)',
    shortName: 'Mini Bus',
    category: VehicleCategory.BUS,
    badge: 'Party & Event Coach',
    badgeStyle: 'secondary',
    headerIcon: 'directions_bus',
    passengerCapacity: 27,
    seatLabel: '22–27 Pushback',
    luggageLabel: 'Underbody + Rear Boot',
    description:
      'Air-cushioned mini coach bridging the gap for 25-passenger groups, bachelor squads, college fests, and corporate retreats.',
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
    badge: 'Air-Suspension Liner',
    badgeStyle: 'primary',
    headerIcon: 'directions_bus',
    passengerCapacity: 40,
    seatLabel: '35–40 Pushback',
    luggageLabel: 'Belly Luggage Bays',
    description:
      'BharatBenz & Ashok Leyland air-suspension liners built for destination wedding baraat logistics, corporate conventions, and university road trips.',
    imageUrl: STITCH_BUS_IMG,
    imageAlt: '35-40 seater BharatBenz luxury tourist coach bus on expressway',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '40 Passengers' },
      { icon: 'air', label: 'Smooth Air Ride' },
      { icon: 'videocam', label: 'Dual LED Screens' },
      { icon: 'luggage', label: 'Huge Belly Bays' },
    ],
  },
  {
    id: 'bus-45-50',
    name: '45–50 Seater Volvo / BharatBenz Coach',
    shortName: '45–50 Seater Bus',
    category: VehicleCategory.BUS,
    badge: 'Flagship Luxury Coach',
    badgeStyle: 'gold',
    headerIcon: 'directions_bus',
    passengerCapacity: 50,
    seatLabel: '45–50 Recliner Coach',
    luggageLabel: 'Dual Belly Compartments',
    description:
      'Flagship multi-axle air-suspension highway charter for mega weddings, tech conclaves, and large-scale expeditions.',
    imageUrl: STITCH_BUS_IMG,
    imageAlt: '45-50 seater Volvo and BharatBenz luxury highway coach bus',
    specs: [
      { icon: 'airline_seat_recline_normal', label: '50 Passengers' },
      { icon: 'air', label: 'Full Air Suspension' },
      { icon: 'tv', label: 'Cinema Surround LED' },
      { icon: 'luggage', label: 'Massive Underbody' },
    ],
  },
];
