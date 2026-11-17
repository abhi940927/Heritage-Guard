import { Destination, VisitingTimeSlot, TicketCategory, CrowdReport } from "@/types";

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    slug: "taj-mahal",
    name: "Taj Mahal",
    location: "Dharmapuri, Forest Colony, Babarpur, Agra",
    state: "Uttar Pradesh",
    category: "Mausoleum",
    short_description:
      "An ivory-white marble mausoleum on the south bank of the Yamuna river, recognized as the jewel of Mughal art in India.",
    historical_background:
      "Commissioned in 1631 by Emperor Shah Jahan to house the tomb of Mumtaz Mahal. Built over 20 years with 20,000 artisans under architect Ustad Ahmad Lahori, representing the emotional and architectural zenith of the Mughal Empire.",
    cultural_importance:
      "A designated UNESCO World Heritage Site since 1983 and voted one of the New 7 Wonders of the World, welcoming over 6 million tourists annually.",
    architecture_details:
      "Constructed entirely from Makrana white marble resting on an elevated plinth with an onion dome rising 73 meters, four 40-meter minarets, intricate pietra dura inlays, and geometric Charbagh gardens.",
    cover_image_url:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85",
    opening_time: "06:00:00",
    closing_time: "18:30:00",
    closed_days: ["Friday"],
    visitor_guidelines: [
      "Strict security check at Eastern and Western Gates",
      "Shoe covers or barefoot mandatory on upper marble plinth",
      "Drone cameras and tripods strictly prohibited on grounds",
      "Silence must be maintained inside the main cenotaph chamber",
    ],
    facilities: [
      "Wheelchair access ramps",
      "Audio guide counter in 8 languages",
      "Official ASI licensed guides",
      "Cloakroom & baggage lockers",
      "Clean RO drinking water stations",
    ],
    recommended_visit_duration: "2.5 - 3 hours",
    best_visiting_hours: "Sunrise (06:00 - 08:30) or Golden Hour (16:30 - 18:30)",
    base_ticket_price: 50,
    current_crowd_level: "High",
    current_crowd_percentage: 78,
    crowd_trend: "rising",
    is_featured: true,
  },
  {
    id: "a2222222-2222-2222-2222-222222222222",
    slug: "red-fort",
    name: "Red Fort (Lal Qila)",
    location: "Netaji Subhash Marg, Chandni Chowk, Old Delhi",
    state: "Delhi",
    category: "Fort",
    short_description:
      "The massive red sandstone fortress that served as the primary residence and ceremonial seat of Mughal emperors for two centuries.",
    historical_background:
      "Constructed by Emperor Shah Jahan between 1638 and 1648 when he relocated the imperial capital from Agra to Delhi. It witnessed the 1857 First War of Independence and India's declaration of independence in 1947.",
    cultural_importance:
      "A UNESCO World Heritage Site and the symbolic heart of independent India, where the Prime Minister addresses the nation every Independence Day.",
    architecture_details:
      "Enclosed by 2.41 km of red sandstone ramparts. Highlights include Lahori Gate, Chhatta Chowk, Diwan-i-Aam, and Diwan-i-Khas marble pavilion.",
    cover_image_url:
      "https://images.unsplash.com/photo-1708394011246-8f3691b66c75?auto=format&fit=crop&w=1600&q=85",
    opening_time: "09:30:00",
    closing_time: "17:30:00",
    closed_days: ["Monday"],
    visitor_guidelines: [
      "Mandatory metal detection scanner at Lahori Gate",
      "Keep digital QR ticket ready on mobile phone",
      "Stay on designated visitor pathways",
    ],
    facilities: [
      "Sound & Light show amphitheater",
      "Archaeological museum & Kranti Mandir",
      "Golf carts for senior citizens",
      "First aid assistance center",
    ],
    recommended_visit_duration: "2 - 2.5 hours",
    best_visiting_hours: "Morning (09:30 - 11:30) or Late Afternoon (15:00 - 17:00)",
    base_ticket_price: 35,
    current_crowd_level: "Moderate",
    current_crowd_percentage: 52,
    crowd_trend: "stable",
    is_featured: true,
  },
  {
    id: "a3333333-3333-3333-3333-333333333333",
    slug: "qutub-minar",
    name: "Qutub Minar Complex",
    location: "Seth Sarai, Mehrauli, New Delhi",
    state: "Delhi",
    category: "Monument",
    short_description:
      "A 72.5-meter tapering victory tower and minaret constructed of red sandstone and marble, anchoring Delhi’s oldest Islamic enclave.",
    historical_background:
      "Commenced in 1199 CE by Qutb-ud-din Aibak and expanded by Iltutmish and Firoz Shah Tughlaq. The complex encapsulates over five centuries of early Indo-Islamic rule in Northern India.",
    cultural_importance:
      "A UNESCO World Heritage Site featuring ancient epigraphy and the 4th-century CE Iron Pillar of Chandragupta II, which has resisted corrosion for over 1,600 years.",
    architecture_details:
      "Fluted five-story minaret with balconies supported by ornate stalactite corbels, Quranic calligraphy, and geometric rosettes carved into sandstone bands.",
    cover_image_url:
      "/images/destinations/qutub-minar.jpg",
    opening_time: "07:00:00",
    closing_time: "19:00:00",
    closed_days: [],
    visitor_guidelines: [
      "Night illumination viewing permitted until 21:00 on select days",
      "Do not lean against protective barriers around historical ruins",
    ],
    facilities: [
      "Illuminated evening walking park",
      "Tactile braille markers for visually impaired",
      "Luggage cloakroom",
    ],
    recommended_visit_duration: "1.5 - 2 hours",
    best_visiting_hours: "Late Afternoon / Golden Hour (16:00 - 18:30)",
    base_ticket_price: 35,
    current_crowd_level: "Low",
    current_crowd_percentage: 28,
    crowd_trend: "falling",
    is_featured: true,
  },
  {
    id: "a4444444-4444-4444-4444-444444444444",
    slug: "hawa-mahal",
    name: "Hawa Mahal (Palace of Winds)",
    location: "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur",
    state: "Rajasthan",
    category: "Palace",
    short_description:
      "An extraordinary five-story pyramidal palace facade with 953 delicately carved jharokha honeycomb casements in pink sandstone.",
    historical_background:
      "Built in 1799 by Maharaja Sawai Pratap Singh and designed by Lal Chand Ustad in the likeness of Lord Krishna's crown to allow royal women to observe city life unseen.",
    cultural_importance:
      "An iconic landmark of Jaipur's UNESCO World Heritage Walled City and a masterpiece of natural air-conditioned palace architecture.",
    architecture_details:
      "Five tiers with 953 miniature latticed windows that create a natural cooling Venturi breeze during hot Rajasthani summers.",
    cover_image_url:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85",
    opening_time: "09:00:00",
    closing_time: "17:00:00",
    closed_days: [],
    visitor_guidelines: [
      "Upper levels connected by ramps rather than stairs",
      "Composite heritage passes accepted at turnstile",
    ],
    facilities: [
      "Historical miniature museum",
      "Opposite street heritage viewing cafes",
      "Filtered water dispenser",
    ],
    recommended_visit_duration: "1 - 1.5 hours",
    best_visiting_hours: "Morning (09:00 - 10:30) for eastern golden sunlight on facade",
    base_ticket_price: 50,
    current_crowd_level: "High",
    current_crowd_percentage: 82,
    crowd_trend: "rising",
    is_featured: true,
  },
  {
    id: "a5555555-5555-5555-5555-555555555555",
    slug: "amer-fort",
    name: "Amer Fort & Palace",
    location: "Devisinghpura, Amer, Jaipur",
    state: "Rajasthan",
    category: "Fort",
    short_description:
      "A majestic hilltop fortress overlooking Maota Lake, famous for its grand courtyards and the radiant Sheesh Mahal mirror hall.",
    historical_background:
      "Constructed by Raja Man Singh I in 1592 CE on the rugged Aravalli ridge, later enhanced by Mirza Raja Jai Singh before the Kachwaha capital transitioned to Jaipur.",
    cultural_importance:
      "A core part of the UNESCO World Heritage serial site 'Hill Forts of Rajasthan', illustrating the peak of Rajput military might and royal luxury.",
    architecture_details:
      "Yellow and pink sandstone with white marble. Four major courtyards including Jaleb Chowk, Ganesh Pol, and the Sheesh Mahal embedded with imported convex mirrors.",
    cover_image_url:
      "/images/destinations/amer-fort.jpg",
    opening_time: "08:00:00",
    closing_time: "17:30:00",
    closed_days: [],
    visitor_guidelines: [
      "Wear sturdy walking shoes for stone inclines and ramparts",
      "Night viewing available 18:30 - 21:15",
      "Audio guides recommended to explore extensive multi-level palaces",
    ],
    facilities: [
      "Jeep transport service from base station",
      "Sound & Light show amphitheater",
      "Heritage dining options inside fort",
    ],
    recommended_visit_duration: "3 - 4 hours",
    best_visiting_hours: "Early Morning (08:00 - 10:30) or Evening Sound Show (17:00 - 19:30)",
    base_ticket_price: 100,
    current_crowd_level: "Moderate",
    current_crowd_percentage: 64,
    crowd_trend: "stable",
    is_featured: true,
  },
  {
    id: "a6666666-6666-6666-6666-666666666666",
    slug: "india-gate",
    name: "India Gate & Kartavya Path",
    location: "Kartavya Path, Central Secretariat, New Delhi",
    state: "Delhi",
    category: "Memorial",
    short_description:
      "A grand 42-meter triumphal arch war memorial commemorating 84,000 soldiers who laid down their lives during the First World War.",
    historical_background:
      "Designed by British architect Sir Edwin Lutyens, laid down in 1921 and dedicated in 1931. Following the 1971 war, the Amar Jawan Jyoti was consecrated beneath its arch.",
    cultural_importance:
      "The premier public gathering plaza of New Delhi and anchor of the ceremonial Kartavya Path boulevard, drawing tens of thousands of citizens daily.",
    architecture_details:
      "Built of red and pale Bharatpur sandstone in triumphal arch form, inscribed with over 13,300 fallen servicemen's names.",
    cover_image_url:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85",
    opening_time: "00:00:00",
    closing_time: "23:59:59",
    closed_days: [],
    visitor_guidelines: [
      "Accessible 24 hours daily with security surveillance",
      "Strict pedestrian-only zones along Kartavya Path canals",
    ],
    facilities: [
      "Underground smart parking complex",
      "Lawn seating & children park zones",
      "Canal water features & public promenades",
    ],
    recommended_visit_duration: "1 - 1.5 hours",
    best_visiting_hours: "Dusk to Night (18:30 - 21:30) when illuminated with tri-color LEDs",
    base_ticket_price: 0,
    current_crowd_level: "Very High",
    current_crowd_percentage: 91,
    crowd_trend: "rising",
    is_featured: true,
  },
  {
    id: "a7777777-7777-7777-7777-777777777777",
    slug: "ajanta-caves",
    name: "Ajanta Rock-Cut Caves",
    location: "Ajanta Caves Rd, Aurangabad District, Chhatrapati Sambhaji Nagar",
    state: "Maharashtra",
    category: "Cave Temple",
    short_description:
      "A serene horseshoe canyon with 30 ancient rock-cut Buddhist cave sanctuaries containing world-renowned fresco paintings.",
    historical_background:
      "Hewn between the 2nd century BCE and 480 CE during the Satavahana and Vakataka dynasties. Lost to the jungle until accidentally rediscovered by a British officer in 1819.",
    cultural_importance:
      "A UNESCO World Heritage Site recognized as the crowning achievement of ancient Buddhist religious art, influencing mural traditions throughout Asia.",
    architecture_details:
      "Monolithic sanctuaries carved into volcanic basalt cliff face overlooking the Waghora river canyon, containing prayer chaityas and viharas.",
    cover_image_url:
      "/images/destinations/ajanta-caves.jpg",
    opening_time: "09:00:00",
    closing_time: "17:30:00",
    closed_days: ["Monday"],
    visitor_guidelines: [
      "Camera flash strictly prohibited inside caves to protect ancient pigments",
      "Take mandatory eco-friendly government shuttle bus from visitor center",
    ],
    facilities: [
      "World-class Ajanta Visitor Interpretation Centre",
      "Air-conditioned shuttle buses",
      "Sedan chair assistance (Doli) for elderly and disabled visitors",
    ],
    recommended_visit_duration: "3.5 - 4.5 hours",
    best_visiting_hours: "Morning (09:00 - 11:30) to avoid afternoon gorge heat",
    base_ticket_price: 40,
    current_crowd_level: "Low",
    current_crowd_percentage: 24,
    crowd_trend: "falling",
    is_featured: false,
  },
  {
    id: "a8888888-8888-8888-8888-888888888888",
    slug: "ellora-caves",
    name: "Ellora Caves & Kailash Temple",
    location: "Ellora Cave Rd, Chhatrapati Sambhaji Nagar",
    state: "Maharashtra",
    category: "Cave Temple",
    short_description:
      "An awe-inspiring complex of 34 multi-religious cave temples featuring Cave 16 (Kailasa), the world's largest monolithic rock excavation.",
    historical_background:
      "Excavated between the 6th and 10th centuries CE under Rashtrakuta and Yadava patronages. The monolithic Kailash temple was carved top-down from a single cliff face under King Krishna I in the 8th century.",
    cultural_importance:
      "A UNESCO World Heritage Site celebrating religious harmony, housing Hindu, Buddhist, and Jain monuments carved side-by-side in unbroken sequence.",
    architecture_details:
      "Over 200,000 tons of solid volcanic basalt removed entirely by hand chiseling. The Kailasa temple is twice the area of the Parthenon in Athens.",
    cover_image_url:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85",
    opening_time: "06:00:00",
    closing_time: "18:00:00",
    closed_days: ["Tuesday"],
    visitor_guidelines: [
      "Carry ample water and sun protection when walking between cave clusters",
      "Do not climb upon delicate relief sculptures",
    ],
    facilities: [
      "Golf cart shuttles connecting caves 1 to 34",
      "MTDC heritage cafeteria",
      "Clean restrooms near Cave 16 central plaza",
    ],
    recommended_visit_duration: "3.5 - 5 hours",
    best_visiting_hours: "Early Morning (06:30 - 09:30) or Late Afternoon (15:00 - 17:30)",
    base_ticket_price: 40,
    current_crowd_level: "Moderate",
    current_crowd_percentage: 48,
    crowd_trend: "stable",
    is_featured: false,
  },
  {
    id: "a9999999-9999-9999-9999-999999999999",
    slug: "gateway-of-india",
    name: "Gateway of India",
    location: "Apollo Bandar, Colaba, Mumbai",
    state: "Maharashtra",
    category: "Monument",
    short_description:
      "An iconic 26-meter basalt triumphal arch overlooking Mumbai Harbour, symbolizing India's colonial maritime gateway and freedom.",
    historical_background:
      "Erected to commemorate the landing of King George V and Queen Mary in December 1911. Completed in 1924, it later served as the ceremonial departure point for the last British troops in 1948.",
    cultural_importance:
      "The undisputed emblem of Mumbai and departure point for ferries to the UNESCO World Heritage Elephanta Island Caves.",
    architecture_details:
      "Designed by Scottish architect George Wittet in the Indo-Saracenic style, blending 16th-century Gujarati architecture with Muslim triumphal arches.",
    cover_image_url:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=85",
    opening_time: "00:00:00",
    closing_time: "23:59:59",
    closed_days: [],
    visitor_guidelines: [
      "Security scanning prior to entering waterfront promenade",
      "Licensed ferry counters operate until 17:30 daily",
    ],
    facilities: [
      "Maritime harbor promenade",
      "Elephanta Island ferry boarding pontoons",
      "Heritage walking tour starting point",
    ],
    recommended_visit_duration: "1 - 1.5 hours",
    best_visiting_hours: "Sunrise (06:30 - 08:00) or Sunset (17:30 - 19:30)",
    base_ticket_price: 0,
    current_crowd_level: "Very High",
    current_crowd_percentage: 88,
    crowd_trend: "rising",
    is_featured: true,
  },
  {
    id: "b1111111-1111-1111-1111-111111111111",
    slug: "konark-sun-temple",
    name: "Konark Sun Temple (Black Pagoda)",
    location: "Konark, Puri District",
    state: "Odisha",
    category: "Monument",
    short_description:
      "A colossal 13th-century stone chariot dedicated to Surya the Sun God, featuring 24 intricately sculpted celestial wheels.",
    historical_background:
      "Built around 1250 CE by King Narasimhadeva I of the Eastern Ganga dynasty. Conceived as a cosmic sun chariot drawn across the skies by seven galloping horses.",
    cultural_importance:
      "A UNESCO World Heritage Site celebrated as the pinnacle of Kalinga architectural stone carving, with celestial musicians and erotic sculptures.",
    architecture_details:
      "Constructed from Khondalite stone. The 24 monumental wheels function as sundials capable of calculating exact solar time down to minutes.",
    cover_image_url:
      "https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1600&q=85",
    opening_time: "06:00:00",
    closing_time: "18:00:00",
    closed_days: [],
    visitor_guidelines: [
      "Do not touch or climb the carved sundial stone wheels",
      "Sound & Light show held daily after 18:30",
    ],
    facilities: [
      "Konark Interpretation Centre and Museum",
      "Audio guides available in English, Hindi, and Odia",
      "Electric battery car transit",
    ],
    recommended_visit_duration: "2 - 3 hours",
    best_visiting_hours: "Sunrise (06:00 - 08:30) when first rays strike the temple axis",
    base_ticket_price: 40,
    current_crowd_level: "Moderate",
    current_crowd_percentage: 58,
    crowd_trend: "stable",
    is_featured: true,
  },
  {
    id: "b2222222-2222-2222-2222-222222222222",
    slug: "hampi-monuments",
    name: "Hampi Group of Monuments",
    location: "Hampi, Vijayanagara District",
    state: "Karnataka",
    category: "Archaeological Site",
    short_description:
      "The majestic ruins of the medieval Vijayanagara Empire set against a surreal landscape of giant granite boulders and Tungabhadra riverbanks.",
    historical_background:
      "Capital of the glorious Vijayanagara Empire from 1336 to 1565 CE. Described by Portuguese and Persian chroniclers as one of the wealthiest cities in the world.",
    cultural_importance:
      "A UNESCO World Heritage Site featuring over 1,600 surviving monuments including the Virupaksha Temple, Lotus Mahal, and the iconic monolithic Stone Chariot.",
    architecture_details:
      "Dravidian style infused with Vijayanagara stone masonry. Features musical pillars at Vittala Temple, colossal monolithic statues of Narasimha and Ganesha.",
    cover_image_url:
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1600&q=85",
    opening_time: "06:00:00",
    closing_time: "18:00:00",
    closed_days: [],
    visitor_guidelines: [
      "Bicycle and electric cart rentals recommended across 41 sq km site",
      "Dress respectfully when entering active sanctum of Virupaksha Temple",
    ],
    facilities: [
      "ASI Archaeological Museum at Kamalapura",
      "Bicycle rental depots across bazaar",
      "Certified archaeological guides",
    ],
    recommended_visit_duration: "1 - 2 Full Days",
    best_visiting_hours: "Early Morning (06:00 - 09:30) or Sunset atop Matanga Hill",
    base_ticket_price: 40,
    current_crowd_level: "Low",
    current_crowd_percentage: 32,
    crowd_trend: "stable",
    is_featured: true,
  },
  {
    id: "b3333333-3333-3333-3333-333333333333",
    slug: "meenakshi-temple",
    name: "Meenakshi Amman Temple",
    location: "Madurai Main, Madurai",
    state: "Tamil Nadu",
    category: "Monument",
    short_description:
      "A sacred historic Hindu temple complex on the Vaigai River, renowned for its 14 soaring gopuram towers covered in thousands of vibrant mythological sculptures.",
    historical_background:
      "Mentioned in Tamil Sangam literature dating back over 2,500 years; rebuilt and expanded by the Nayak dynasty in the 16th and 17th centuries under King Thirumalai Nayak.",
    cultural_importance:
      "The spiritual heart of Madurai and one of India's greatest living temple cities, welcoming over 15,000 pilgrims and cultural visitors daily.",
    architecture_details:
      "Classic Dravidian architecture featuring the Hall of Thousand Pillars, sacred Golden Lotus tank (Potramarai Kulam), and 14 towering gateway gopurams.",
    cover_image_url:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85",
    opening_time: "05:00:00",
    closing_time: "21:30:00",
    closed_days: [],
    visitor_guidelines: [
      "Strict traditional dress code enforced at temple gates",
      "Mobile phones and leather items must be deposited at security counter",
    ],
    facilities: [
      "Shoe deposit & locker counters",
      "Special darshan queue management queues",
      "Temple heritage art museum",
    ],
    recommended_visit_duration: "2 - 3 hours",
    best_visiting_hours: "Early Morning (05:00 - 07:30) or Evening Ceremony (18:30 - 20:30)",
    base_ticket_price: 50,
    current_crowd_level: "High",
    current_crowd_percentage: 84,
    crowd_trend: "rising",
    is_featured: true,
  },
  {
    id: "b4444444-4444-4444-4444-444444444444",
    slug: "victoria-memorial",
    name: "Victoria Memorial Hall",
    location: "1, Queen's Way, Maidan, Kolkata",
    state: "West Bengal",
    category: "Monument",
    short_description:
      "A magnificent white Makrana marble monument and national museum set amidst 64 acres of landscaped gardens in the heart of Kolkata.",
    historical_background:
      "Conceived by Lord Curzon in 1901 following Queen Victoria's death; designed by Sir William Emerson and opened to the public in 1921.",
    cultural_importance:
      "The premier architectural landmark of Kolkata housing 25 galleries containing rare oil paintings, historical manuscripts, and colonial archives.",
    architecture_details:
      "Indo-Saracenic revivalist style using the same white Makrana marble as the Taj Mahal. Topped by a 16-foot bronze Angel of Victory on a rotating ball bearing.",
    cover_image_url:
      "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1600&q=85",
    opening_time: "10:00:00",
    closing_time: "17:00:00",
    closed_days: ["Monday"],
    visitor_guidelines: [
      "Garden grounds open earlier from 06:00 to 18:00 daily",
      "Photography prohibited inside central museum gallery halls",
    ],
    facilities: [
      "Landscaped garden promenades and reflection ponds",
      "Sound & Light evening show",
      "Air-conditioned gallery wings & cafeteria",
    ],
    recommended_visit_duration: "2 - 2.5 hours",
    best_visiting_hours: "Late Afternoon (14:30 - 17:00)",
    base_ticket_price: 50,
    current_crowd_level: "Moderate",
    current_crowd_percentage: 60,
    crowd_trend: "stable",
    is_featured: false,
  },
  {
    id: "b5555555-5555-5555-5555-555555555555",
    slug: "golden-temple",
    name: "Golden Temple (Sri Harmandir Sahib)",
    location: "Golden Temple Rd, Atta Mandi, Amritsar",
    state: "Punjab",
    category: "Monument",
    short_description:
      "The holiest gurdwara of Sikhism, a gilded two-story spiritual sanctuary floating in the center of the sacred pool of nectar (Amrit Sarovar).",
    historical_background:
      "Founded in 1577 by the fourth Sikh Guru, Guru Ram Das. Maharaja Ranjit Singh overlaid the upper sanctum with 750 kg of pure gold leaf in 1830.",
    cultural_importance:
      "A universal beacon of equality, humility, and spiritual peace. Its free community kitchen (Guru ka Langar) feeds over 100,000 visitors daily regardless of faith.",
    architecture_details:
      "Unique blend of Hindu and Islamic architectural motifs. Four open entrances in all cardinal directions symbolize welcome to all humankind.",
    cover_image_url:
      "/images/destinations/golden-temple.jpg",
    opening_time: "00:00:00",
    closing_time: "23:59:59",
    closed_days: [],
    visitor_guidelines: [
      "Head covering mandatory for all visitors inside complex",
      "Remove footwear and wash feet in running water channel at entrance",
      "Tobacco, alcohol, and non-vegetarian items strictly forbidden",
    ],
    facilities: [
      "24-hour Guru ka Langar community dining hall",
      "Information office and complimentary luggage storage",
      "Wheelchair assistance for elderly devotees",
    ],
    recommended_visit_duration: "2 - 3 hours",
    best_visiting_hours: "Night / Dawn (04:00 - 06:00 or 21:00 - 23:00) during Palki Sahib ceremony",
    base_ticket_price: 0,
    current_crowd_level: "Very High",
    current_crowd_percentage: 94,
    crowd_trend: "rising",
    is_featured: true,
  },
  {
    id: "b6666666-6666-6666-6666-666666666666",
    slug: "sanchi-stupa",
    name: "Buddhist Monuments at Sanchi",
    location: "Sanchi, Raisen District",
    state: "Madhya Pradesh",
    category: "Monument",
    short_description:
      "The oldest stone structure in India, a 3rd-century BCE hemispherical Buddhist dome commissioned by Emperor Ashoka.",
    historical_background:
      "Commissioned in the 3rd century BCE by Mauryan Emperor Ashoka over relics of Lord Buddha. Expanded under the Shunga and Satavahana dynasties.",
    cultural_importance:
      "A UNESCO World Heritage Site recognized as the epicenter of early Buddhist sacred art and architectural evolution.",
    architecture_details:
      "Hemispherical stone dome crowned by a chhatri umbrella and surrounded by four ceremonial gateways (toranas) carved with Jataka legends.",
    cover_image_url:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85",
    opening_time: "06:30:00",
    closing_time: "18:30:00",
    closed_days: [],
    visitor_guidelines: [
      "Proceed around the Great Stupa in clockwise pradakshina direction",
      "Archaeological museum open 10:00 - 17:00 (closed Fridays)",
    ],
    facilities: [
      "Sanchi Archaeological Site Museum",
      "Shaded tree-lined walking avenues",
      "Clean drinking water stations",
    ],
    recommended_visit_duration: "2 - 3 hours",
    best_visiting_hours: "Morning (07:00 - 10:00) or Sunset (16:30 - 18:30)",
    base_ticket_price: 40,
    current_crowd_level: "Low",
    current_crowd_percentage: 22,
    crowd_trend: "falling",
    is_featured: false,
  },
  {
    id: "b7777777-7777-7777-7777-777777777777",
    slug: "padmanabhaswamy-temple",
    name: "Sree Padmanabhaswamy Temple",
    location: "Fort, East Fort, Thiruvananthapuram",
    state: "Kerala",
    category: "Monument",
    short_description:
      "An ancient gold-adorned temple dedicated to Lord Vishnu in Anantha Shayana posture, renowned for its Dravidian-Kerala architecture and vaults.",
    historical_background:
      "Celebrated in Sangam literature and Divya Prabandham. The royal Travancore dynasty pledged their sovereignty to the deity, ruling as 'Padmanabhadasa'.",
    cultural_importance:
      "Considered the wealthiest temple in the world with historic subterranean vaults holding vast treasures of diamonds, gold, and ancient coins.",
    architecture_details:
      "Fusion of Chera and Dravidian architecture featuring a 100-foot, 7-tiered gopuram and a stone corridor supported by 365 carved granite pillars.",
    cover_image_url:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85",
    opening_time: "03:30:00",
    closing_time: "19:30:00",
    closed_days: [],
    visitor_guidelines: [
      "Strict traditional Kerala dress code (Dhoti for men, Saree for women)",
      "Strict electronic ban inside temple inner perimeter",
    ],
    facilities: [
      "Traditional dhoti rental counters at East Fort",
      "Cloakroom and safe deposit lockers",
      "Special queue lanes for senior citizens",
    ],
    recommended_visit_duration: "1.5 - 2 hours",
    best_visiting_hours: "Early Morning (03:30 - 05:00) or Evening (17:00 - 19:00)",
    base_ticket_price: 50,
    current_crowd_level: "High",
    current_crowd_percentage: 76,
    crowd_trend: "rising",
    is_featured: false,
  },
];

export const INITIAL_TIME_SLOTS: VisitingTimeSlot[] = [
  // Taj Mahal
  {
    id: "ts-taj-1",
    destination_id: "a1111111-1111-1111-1111-111111111111",
    start_time: "06:00:00",
    end_time: "08:30:00",
    label: "Sunrise Slot (06:00 - 08:30)",
    max_capacity: 3000,
    expected_crowd_level: "Moderate",
  },
  {
    id: "ts-taj-2",
    destination_id: "a1111111-1111-1111-1111-111111111111",
    start_time: "09:00:00",
    end_time: "12:00:00",
    label: "Morning Peak (09:00 - 12:00)",
    max_capacity: 5000,
    expected_crowd_level: "Very High",
  },
  {
    id: "ts-taj-3",
    destination_id: "a1111111-1111-1111-1111-111111111111",
    start_time: "12:30:00",
    end_time: "15:30:00",
    label: "Afternoon Slot (12:30 - 15:30)",
    max_capacity: 4500,
    expected_crowd_level: "High",
  },
  {
    id: "ts-taj-4",
    destination_id: "a1111111-1111-1111-1111-111111111111",
    start_time: "16:00:00",
    end_time: "18:30:00",
    label: "Sunset Golden Hour (16:00 - 18:30)",
    max_capacity: 4000,
    expected_crowd_level: "Moderate",
  },

  // Red Fort
  {
    id: "ts-red-1",
    destination_id: "a2222222-2222-2222-2222-222222222222",
    start_time: "09:30:00",
    end_time: "12:00:00",
    label: "Morning Batch (09:30 - 12:00)",
    max_capacity: 3500,
    expected_crowd_level: "Moderate",
  },
  {
    id: "ts-red-2",
    destination_id: "a2222222-2222-2222-2222-222222222222",
    start_time: "12:30:00",
    end_time: "15:00:00",
    label: "Midday Batch (12:30 - 15:00)",
    max_capacity: 4000,
    expected_crowd_level: "High",
  },
  {
    id: "ts-red-3",
    destination_id: "a2222222-2222-2222-2222-222222222222",
    start_time: "15:30:00",
    end_time: "17:30:00",
    label: "Evening Batch (15:30 - 17:30)",
    max_capacity: 3000,
    expected_crowd_level: "Moderate",
  },
];

export const INITIAL_TICKET_CATEGORIES: TicketCategory[] = [
  // Taj Mahal
  {
    id: "tc-taj-1",
    destination_id: "a1111111-1111-1111-1111-111111111111",
    category_name: "Indian Citizen",
    price: 50,
    currency: "INR",
    description: "Standard entry for citizens of India (Government ID required)",
  },
  {
    id: "tc-taj-2",
    destination_id: "a1111111-1111-1111-1111-111111111111",
    category_name: "Foreign Tourist",
    price: 1100,
    currency: "INR",
    description: "Includes shoe covers, bottled mineral water, and priority lane",
  },
  {
    id: "tc-taj-3",
    destination_id: "a1111111-1111-1111-1111-111111111111",
    category_name: "Child (Below 15 Years)",
    price: 0,
    currency: "INR",
    description: "Complimentary entry with valid age verification proof",
  },
];

export const INITIAL_CROWD_REPORTS: CrowdReport[] = [
  {
    id: "cr-1",
    destination_id: "a1111111-1111-1111-1111-111111111111",
    destination_name: "Taj Mahal",
    recorded_at: "2026-11-17T08:30:00Z",
    crowd_level: "High",
    crowd_percentage: 78,
    wait_time_minutes: 25,
    entry_rate_per_hour: 1280,
    data_source: "Optical Turnstile & IoT Sensor Stream (Simulated Demo)",
    is_simulated: true,
  },
  {
    id: "cr-2",
    destination_id: "a2222222-2222-2222-2222-222222222222",
    destination_name: "Red Fort (Lal Qila)",
    recorded_at: "2026-11-17T08:30:00Z",
    crowd_level: "Moderate",
    crowd_percentage: 52,
    wait_time_minutes: 14,
    entry_rate_per_hour: 720,
    data_source: "Ticketing Gate Telemetry (Simulated Demo)",
    is_simulated: true,
  },
  {
    id: "cr-3",
    destination_id: "a3333333-3333-3333-3333-333333333333",
    destination_name: "Qutub Minar Complex",
    recorded_at: "2026-11-17T08:30:00Z",
    crowd_level: "Low",
    crowd_percentage: 28,
    wait_time_minutes: 5,
    entry_rate_per_hour: 380,
    data_source: "Smart Gate RFID Stream (Simulated Demo)",
    is_simulated: true,
  },
  {
    id: "cr-4",
    destination_id: "a4444444-4444-4444-4444-444444444444",
    destination_name: "Hawa Mahal (Palace of Winds)",
    recorded_at: "2026-11-17T08:30:00Z",
    crowd_level: "High",
    crowd_percentage: 82,
    wait_time_minutes: 20,
    entry_rate_per_hour: 940,
    data_source: "Jaipur Smart City Sensor Node (Simulated Demo)",
    is_simulated: true,
  },
  {
    id: "cr-5",
    destination_id: "a5555555-5555-5555-5555-555555555555",
    destination_name: "Amer Fort & Palace",
    recorded_at: "2026-11-17T08:30:00Z",
    crowd_level: "Moderate",
    crowd_percentage: 64,
    wait_time_minutes: 18,
    entry_rate_per_hour: 810,
    data_source: "Turnstile Gate Flow Sensor (Simulated Demo)",
    is_simulated: true,
  },
  {
    id: "cr-6",
    destination_id: "a6666666-6666-6666-6666-666666666666",
    destination_name: "India Gate & Kartavya Path",
    recorded_at: "2026-11-17T08:30:00Z",
    crowd_level: "Very High",
    crowd_percentage: 91,
    wait_time_minutes: 0,
    entry_rate_per_hour: 2400,
    data_source: "Pedestrian Density Camera Analytics (Simulated Demo)",
    is_simulated: true,
  },
];
