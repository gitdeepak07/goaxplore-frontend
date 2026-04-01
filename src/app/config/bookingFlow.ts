export interface ActivityTemplate {
  name: string;
  category: string;
  tagline: string;
  description: string;
  duration: string;
  difficulty: string;
  minAge: number;
  minParticipants: number;
  maxParticipants: number;
  meetingPoint: string;
  locations: string[];
  includes: string[];
  slotTimes: string[];
  image: string;
  basePrice: number;
}

export interface ProviderTemplate {
  rating: number;
  reviews: number;
  description: string;
  activities: string[];
  certifications: string[];
  contact: {
    phone: string;
    email: string;
  };
}

export interface SlotLockRecord {
  id: string;
  activityName: string;
  providerName: string;
  date: string;
  time: string;
  participants: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  bookingCode: string;
  paymentMethod: string;
  createdAt: string;
}

export interface BookingFlowSelection {
  activity: any
  provider: any
  participants: number
  date: string
  time: string
  slot_id?: number | null   
  totalPrice: number
  appliedOffer?: any | null
  paymentMethod?: string
  bookingCode?: string
  bookedAt?: string
}

const fallbackSlotTimes = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
];

export const activityLibrary: Record<string, ActivityTemplate> = {
  "Jet Skiing": {
    name: "Jet Skiing",
    category: "Speed and Thrills",
    tagline: "Fast-paced beachside rush for first-timers and thrill seekers.",
    description:
      "Ride across the Goa shoreline with a certified guide, safety briefing, and short high-energy session built for quick excitement.",
    duration: "15 to 20 minutes",
    difficulty: "Beginner Friendly",
    minAge: 16,
    minParticipants: 1,
    maxParticipants: 2,
    meetingPoint: "Beach launch counter",
    locations: ["Baga Beach", "Calangute Beach", "Candolim Beach"],
    includes: [
      "Certified instructor",
      "Life jacket",
      "Safety briefing",
      "Equipment handling support",
    ],
    slotTimes: fallbackSlotTimes,
    image:
      "https://images.unsplash.com/photo-1602739737584-006b54cabbb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    basePrice: 1500,
  },
  Parasailing: {
    name: "Parasailing",
    category: "Aerial Adventures",
    tagline: "Panoramic coastline views with a secure harness ride.",
    description:
      "Take off from the shoreline and enjoy wide ocean views with trained beach staff handling launch, landing, and equipment setup.",
    duration: "10 to 15 minutes",
    difficulty: "Beginner Friendly",
    minAge: 12,
    minParticipants: 1,
    maxParticipants: 2,
    meetingPoint: "Parasailing deck",
    locations: ["Baga Beach", "Anjuna Beach", "Calangute Beach"],
    includes: [
      "Safety harness",
      "Life jacket",
      "Launch and landing crew",
      "Brief orientation",
    ],
    slotTimes: fallbackSlotTimes,
    image:
      "https://images.unsplash.com/photo-1547581439-24375bb8d904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    basePrice: 2000,
  },
  "Scuba Diving": {
    name: "Scuba Diving",
    category: "Underwater",
    tagline: "Guided underwater session with equipment and briefing included.",
    description:
      "Explore the underwater side of Goa with instructor-led diving, pre-dive training, and controlled sessions for beginners or repeat visitors.",
    duration: "45 to 60 minutes",
    difficulty: "All Levels",
    minAge: 10,
    minParticipants: 1,
    maxParticipants: 6,
    meetingPoint: "Boat boarding point",
    locations: ["Grande Island", "Suzy's Wreck", "Sail Rock"],
    includes: [
      "Diving gear",
      "Instructor support",
      "Boat transfer",
      "Basic underwater assistance",
    ],
    slotTimes: ["07:30 AM", "09:30 AM", "11:30 AM", "01:30 PM", "03:30 PM"],
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    basePrice: 3500,
  },
  Kayaking: {
    name: "Kayaking",
    category: "Paddling",
    tagline: "Calmer water experience through open sea stretches and backwaters.",
    description:
      "Paddle at a relaxed pace with guided routes that are suitable for families, couples, and small groups looking for scenic sessions.",
    duration: "60 to 90 minutes",
    difficulty: "Easy",
    minAge: 8,
    minParticipants: 1,
    maxParticipants: 4,
    meetingPoint: "Kayak hut",
    locations: ["Palolem Beach", "Agonda Beach", "Zuari River"],
    includes: [
      "Kayak and paddle",
      "Life jacket",
      "Quick training",
      "Route guidance",
    ],
    slotTimes: ["07:00 AM", "09:00 AM", "11:00 AM", "03:00 PM", "05:00 PM"],
    image:
      "https://images.unsplash.com/photo-1617610839501-af0079ef225d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    basePrice: 1200,
  },
  "Banana Boat Ride": {
    name: "Banana Boat Ride",
    category: "Group Fun",
    tagline: "Short, high-energy group ride built for friends and family.",
    description:
      "A fun group activity that combines speed, splashes, and supervised towing for a quick team experience near the shore.",
    duration: "10 to 15 minutes",
    difficulty: "Easy",
    minAge: 8,
    minParticipants: 3,
    maxParticipants: 6,
    meetingPoint: "Water sports kiosk",
    locations: ["Baga Beach", "Candolim Beach", "Calangute Beach"],
    includes: [
      "Life jacket",
      "Tow boat support",
      "Crew assistance",
      "Safety instructions",
    ],
    slotTimes: fallbackSlotTimes,
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    basePrice: 800,
  },
  Windsurfing: {
    name: "Windsurfing",
    category: "Surfing",
    tagline: "Skill-based sailing and balance session for confident riders.",
    description:
      "An instructor-assisted windsurfing session for guests who want a more technical challenge on the water.",
    duration: "30 to 45 minutes",
    difficulty: "Intermediate",
    minAge: 14,
    minParticipants: 1,
    maxParticipants: 2,
    meetingPoint: "Surf board bay",
    locations: ["Vagator Beach", "Candolim Beach"],
    includes: [
      "Board and sail setup",
      "Instructor guidance",
      "Life jacket",
      "Wind check briefing",
    ],
    slotTimes: ["08:00 AM", "10:00 AM", "04:00 PM", "05:30 PM"],
    image:
      "https://images.unsplash.com/photo-1502933691298-84fc14542831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    basePrice: 1800,
  },
};

export const providerLibrary: Record<string, ProviderTemplate> = {
  "Goa Water Sports": {
    rating: 4.8,
    reviews: 1250,
    description:
      "One of the busiest beach operators for entry-level watersports and quick-turnaround bookings around North Goa.",
    activities: ["Jet Skiing", "Parasailing", "Banana Boat Ride"],
    certifications: [
      "Goa Tourism listed",
      "Certified beach crew",
      "Daily equipment checks",
    ],
    contact: {
      phone: "+91 98765 43210",
      email: "info@goawatersports.com",
    },
  },
  "Coastal Adventures": {
    rating: 4.7,
    reviews: 890,
    description:
      "Known for balanced safety, guided briefings, and polished customer handling across adventure sessions.",
    activities: ["Jet Skiing", "Scuba Diving", "Kayaking", "Parasailing"],
    certifications: [
      "Instructor-led activities",
      "First-aid ready staff",
      "Customer safety briefing",
    ],
    contact: {
      phone: "+91 98765 43211",
      email: "hello@coastaladventures.com",
    },
  },
  "Aqua Thrills Goa": {
    rating: 4.9,
    reviews: 1580,
    description:
      "High-volume operator with broad inventory and a strong mix of thrill rides and guided experiences.",
    activities: [
      "Jet Skiing",
      "Parasailing",
      "Scuba Diving",
      "Windsurfing",
      "Kayaking",
    ],
    certifications: [
      "Premium equipment rotation",
      "Safety-compliant launch team",
      "Experienced instructors",
    ],
    contact: {
      phone: "+91 98765 43212",
      email: "contact@aquathrills.com",
    },
  },
  "Beach Riders": {
    rating: 4.6,
    reviews: 675,
    description:
      "South Goa operator focused on smaller groups, smoother scheduling, and more personal support on site.",
    activities: ["Kayaking", "Jet Skiing", "Banana Boat Ride"],
    certifications: [
      "Small-group management",
      "Verified on-ground crew",
      "Family-friendly operations",
    ],
    contact: {
      phone: "+91 98765 43213",
      email: "info@beachriders.com",
    },
  },
};

const publicBookingsStorageKey = "goaxplore_public_bookings";

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const formatMoney = (amount: number) =>
  `Rs. ${Math.max(0, amount || 0).toLocaleString("en-IN")}`;

export const formatDisplayDate = (value: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export const buildBookingCode = () =>
  `GX${Date.now().toString().slice(-8)}`;

export const getFutureDates = (count = 7) => {
  const dates = [];

  for (let index = 0; index < count; index += 1) {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const isoDate = date.toISOString().slice(0, 10);

    dates.push({
      value: isoDate,
      label: formatDisplayDate(isoDate),
    });
  }

  return dates;
};

export const getActivityTemplate = (activityName?: string) =>
  activityLibrary[activityName || ""] || null;

export const getProviderTemplate = (providerName?: string) =>
  providerLibrary[providerName || ""] || null;

export const enhanceActivity = (activity: any, index: number) => {
  const meta =
    activityLibrary[activity?.name] ||
    activityLibrary[activity?.title] ||
    Object.values(activityLibrary)[index % Object.values(activityLibrary).length];

  return {
    ...activity,
    name: activity?.name || meta.name,
    title: activity?.title || activity?.name || meta.name,
    category: activity?.category || meta.category,
    description: activity?.description || meta.description,
    difficulty: activity?.difficulty || meta.difficulty,
    duration: activity?.duration || meta.duration,
    minAge: Number(activity?.minAge ?? meta.minAge),
    minParticipants: Number(
      activity?.minParticipants ?? activity?.min_participants ?? meta.minParticipants,
    ),
    maxParticipants: Number(
      activity?.maxParticipants ?? activity?.max_participants ?? meta.maxParticipants,
    ),
    meetingPoint: activity?.meetingPoint || meta.meetingPoint,
    locations: Array.isArray(activity?.locations) ? activity.locations : meta.locations,
    includes: Array.isArray(activity?.includes) ? activity.includes : meta.includes,
    slotTimes: Array.isArray(activity?.slotTimes) ? activity.slotTimes : meta.slotTimes,
    image: activity?.image || meta.image,
    price: Number(activity?.price ?? activity?.price_per_person ?? meta.basePrice),
  };
};

export const enhanceProvider = (provider: any) => {
  const meta = providerLibrary[provider?.name] || providerLibrary[provider?.business_name || ""];

  return {
    ...provider,
    rating: Number(provider?.rating ?? meta?.rating ?? 4.6),
    reviews: Number(provider?.reviews ?? meta?.reviews ?? 400),
    description: provider?.description || meta?.description || "Trusted Goa watersports provider.",
    certifications: meta?.certifications || ["Verified operator", "Safety briefing included"],
    activitiesOffered: meta?.activities || [],
    contact: meta?.contact || {
      phone: "+91 98765 43200",
      email: "support@goaxplore.com",
    },
  };
};

export const getCategoryCards = (activities: any[]) => {
  const seen = new Set<string>();
  const cards: any[] = [];

  activities.forEach((activity, index) => {
    const enhanced = enhanceActivity(activity, index);
    if (seen.has(enhanced.name)) {
      return;
    }

    seen.add(enhanced.name);
    cards.push({
      id: enhanced.id || enhanced.name,
      name: enhanced.name,
      category: enhanced.category,
      image: enhanced.image,
      price: enhanced.price,
      duration: enhanced.duration,
      tagline: getActivityTemplate(enhanced.name)?.tagline || enhanced.description,
    });
  });

  return cards;
};

export const getProvidersForActivity = (providers: any[], activityName?: string) => {
  if (!activityName) {
    return [];
  }

  return providers
    .map(enhanceProvider)
    .filter((provider) => provider.activitiesOffered.includes(activityName));
};

export const getPublicBookings = () =>
  safeParse<SlotLockRecord[]>(localStorage.getItem(publicBookingsStorageKey), []);

export const savePublicBooking = (booking: SlotLockRecord) => {
  const existing = getPublicBookings();
  localStorage.setItem(
    publicBookingsStorageKey,
    JSON.stringify([booking, ...existing]),
  );
};

export const getBookedSlotsFromStorage = (
  activityName: string,
  providerName: string,
  date: string,
) =>
  getPublicBookings()
    .filter(
      (booking) =>
        booking.activityName === activityName &&
        booking.providerName === providerName &&
        booking.date === date,
    )
    .map((booking) => booking.time);

export const mergeBookedSlots = (slots: string[]) =>
  Array.from(new Set(slots.filter(Boolean)));

export const buildReceiptHtml = (
  booking: BookingFlowSelection,
  customerName: string,
  customerEmail: string,
) => {
  const bookedAt = booking.bookedAt || new Date().toLocaleString("en-IN");
  const paymentMethod = booking.paymentMethod || "Online";

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>GoaXplore Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 32px;
            background: #f4f4f5;
            color: #111827;
          }
          .receipt {
            max-width: 720px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 18px 48px rgba(17, 24, 39, 0.12);
          }
          .brand {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .brand h1 {
            margin: 0;
            font-size: 28px;
          }
          .muted {
            color: #6b7280;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }
          .card {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 16px;
          }
          .line {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .line:last-child {
            border-bottom: 0;
          }
          .total {
            font-size: 22px;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="brand">
            <div>
              <h1>GoaXplore</h1>
              <div class="muted">Water sports booking receipt</div>
            </div>
            <div style="text-align:right">
              <div><strong>Booking ID:</strong> ${booking.bookingCode || "-"}</div>
              <div class="muted">Booked on ${bookedAt}</div>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <strong>Customer</strong>
              <div>${customerName || "Guest User"}</div>
              <div class="muted">${customerEmail || "No email available"}</div>
            </div>
            <div class="card">
              <strong>Provider</strong>
              <div>${booking.provider?.name || "-"}</div>
              <div class="muted">${booking.provider?.location || "Goa"}</div>
            </div>
          </div>

          <div class="card" style="margin-bottom:24px">
            <div class="line"><span>Activity</span><strong>${booking.activity?.name || "-"}</strong></div>
            <div class="line"><span>Date</span><strong>${booking.date}</strong></div>
            <div class="line"><span>Time Slot</span><strong>${booking.time}</strong></div>
            <div class="line"><span>Participants</span><strong>${booking.participants}</strong></div>
            <div class="line"><span>Payment Method</span><strong>${paymentMethod}</strong></div>
            <div class="line total"><span>Total Paid</span><span>${formatMoney(
              booking.totalPrice,
            )}</span></div>
          </div>

          <div class="muted">
            Present this receipt during check-in. Print or save it as PDF if you need a downloadable copy.
          </div>
        </div>
      </body>
    </html>
  `;
};
