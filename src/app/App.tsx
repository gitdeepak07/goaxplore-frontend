import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import API from "./config/api";

import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PopularAdventures } from "./components/PopularAdventures";
import { TopProviders } from "./components/TopProviders";
import { HowItWorks } from "./components/HowItWorks";
import { SafetyGuide } from "./components/SafetyGuide";
import { Testimonials } from "./components/Testimonials";
import { Footer } from "./components/Footer";
import { AuthModals } from "./components/AuthModals";
import { TermsOfService } from "./components/TermsOfService";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { SafetyGuidelines } from "./components/SafetyGuidelines";
import { AboutUs } from "./components/AboutUs";
import { ContactSection } from "./components/ContactSection";
import { ActivityDetailsModal } from "./components/ActivityDetailsModal";
import { ProviderProfileModal } from "./components/ProviderProfileModal";
import { AllActivitiesPage } from "./components/AllActivitiesPage";

import { PaymentPage } from "./components/PaymentPage";
import { UserDashboard } from "./components/UserDashboard";
import { ProviderDashboard } from "./components/ProviderDashboard";
import { ProviderAuthModals } from "./components/ProviderAuthModals";
import { AdminAuthModals } from "./components/admin/AdminAuthModals";
import { AdminDashboard } from "./components/AdminDashboard";
import { ProviderSelectionModal } from "./components/booking/ProviderSelectionModal";
import { ParticipantsModal } from "./components/booking/ParticipantsModal";
import { SlotSelectionModal } from "./components/booking/SlotSelectionModal";
import { BookingSummaryModal } from "./components/booking/BookingSummaryModal";
import { BookingSuccessModal } from "./components/booking/BookingSuccessModal";

import {
  BookingFlowSelection,
  activityLibrary,
  buildBookingCode,
  enhanceActivity,
  enhanceProvider,
  getCategoryCards,
  getProvidersForActivity,
  mergeBookedSlots,
  savePublicBooking,
} from "./config/bookingFlow";
import { createBooking } from "../utils/api";
import {
  clearCustomerSession,
  type CustomerSession,
  getStoredCustomerSession,
} from "../utils/auth";

const API_BASE = "http://localhost:5000/api";

const fallbackActivities = Object.values(activityLibrary).map((activity, index) =>
  enhanceActivity(
    {
      id: index + 1,
      name: activity.name,
      title: activity.name,
      price: activity.basePrice,
      image: activity.image,
      rating: 4.6 + ((index % 4) * 0.1),
      duration: activity.duration,
      category: activity.category,
    },
    index,
  ),
);

const fallbackProviders = [
  { id: 1, name: "Goa Water Sports", location: "Baga Beach", activities: 6, logo: "GW", verified: true },
  { id: 2, name: "Coastal Adventures", location: "Calangute", activities: 8, logo: "CA", verified: true },
  { id: 3, name: "Aqua Thrills Goa", location: "Candolim", activities: 10, logo: "AT", verified: true },
  { id: 4, name: "Beach Riders", location: "Palolem", activities: 5, logo: "BR", verified: true },
].map(enhanceProvider);

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 5,
    comment: "The new booking flow feels much cleaner. I picked the activity, provider, slot, and payment without guessing what comes next.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    date: "2026-02-10",
  },
  {
    id: 2,
    name: "Priya Singh",
    rating: 5,
    comment: "Provider choice before payment makes the booking feel more trustworthy and easier to compare.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    date: "2026-02-18",
  },
  {
    id: 3,
    name: "Amit Sharma",
    rating: 4,
    comment: "The slot picker and receipt download are much more practical than the older combined screen.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    date: "2026-02-21",
  },
];

const getUserBookingsStorageKey = (userId: string) => `goaxplore_user_bookings_${userId}`;

const saveUserBooking = (userId: string, booking: any) => {
  const existing = JSON.parse(localStorage.getItem(getUserBookingsStorageKey(userId)) || "[]");
  localStorage.setItem(getUserBookingsStorageKey(userId), JSON.stringify([booking, ...existing]));
};

const createInitials = (name: string) =>
  name.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "GX";

const normalizeProviderData = (provider: any) => {
  const name = provider?.name || provider?.business_name || "GoaXplore Provider";
  return enhanceProvider({
    ...provider,
    id: Number(provider?.id ?? provider?.provider_id ?? 0),
    provider_id: provider?.provider_id ?? provider?.id,
    name,
    business_name: provider?.business_name || name,
    location:
      provider?.location ||
      [provider?.city, provider?.state].filter(Boolean).join(", ") ||
      provider?.address ||
      "Goa",
    activities: Number(provider?.activities ?? provider?.total_activities ?? 0),
    logo: provider?.logo || createInitials(name),
    verified: provider?.verified ?? provider?.verification_status === "Approved",
    activitiesOffered: provider?.activitiesOffered || [],
  });
};

const getActivityImage = (title: string = "") => {
  const t = title.toLowerCase();
  if (t.includes("parasail")) return "https://images.unsplash.com/photo-1547581439-24375bb8d904?w=800&q=80";
  if (t.includes("jet ski")) return "https://images.unsplash.com/photo-1602739737584-006b54cabbb3?w=800&q=80";
  if (t.includes("scuba") || t.includes("diving")) return "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80";
  if (t.includes("kayak")) return "https://images.unsplash.com/photo-1617610839501-af0079ef225d?w=800&q=80";
  if (t.includes("banana")) return "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80";
  if (t.includes("windsurf")) return "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80";
  if (t.includes("surf")) return "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80";
  if (t.includes("boat") || t.includes("cruise")) return "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80";
  if (t.includes("snorkel")) return "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80";
  if (t.includes("swim")) return "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80";
  return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
};

const normalizeActivityData = (activity: any, index: number) => {
  return {
    id: Number(activity?.activity_id ?? index + 1),
    activity_id: activity?.activity_id,
    provider_id: activity?.provider_id,
    name: activity?.title || activity?.name || `Activity ${index + 1}`,
    title: activity?.title || activity?.name || `Activity ${index + 1}`,
    description: activity?.description || "A fun water sports activity in Goa.",
    category: activity?.category_name || activity?.category || "Water Sports",
    price: Number(activity?.price_per_person ?? activity?.price ?? 0),
    rating: Number(activity?.average_rating ?? 4.7),
    duration: activity?.duration_minutes ? `${activity.duration_minutes} minutes` : "30 minutes",
    minParticipants: Number(activity?.min_participants ?? 1),
    maxParticipants: Number(activity?.max_participants ?? 10),
    image: activity?.image_url || activity?.image || getActivityImage(activity?.title),
    slotTimes: ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"],
    difficulty: activity?.difficulty || "All Levels",
    minAge: activity?.min_age || 8,
    meetingPoint: activity?.meeting_point || "Beach entrance",
    includes: ["Safety equipment", "Instructor support"],
    location: activity?.location_name || activity?.location || "Goa",
    locations: [activity?.location_name || "Goa"],
    latitude: activity?.custom_latitude ? Number(activity.custom_latitude)
      : activity?.latitude ? Number(activity.latitude) : null,
    longitude: activity?.custom_longitude ? Number(activity.custom_longitude)
      : activity?.longitude ? Number(activity.longitude) : null,
    address: activity?.address || null,
  };
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState<CustomerSession | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isProviderLoginOpen, setIsProviderLoginOpen] = useState(false);
  const [isProviderSignupOpen, setIsProviderSignupOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<{
    admin_id: number; full_name: string; email: string; role: string;
  } | null>(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [dynamicProviders, setDynamicProviders] = useState<any[]>([]);
  const [currentProvider, setCurrentProvider] = useState<any>(null);
  const [showProviderDashboard, setShowProviderDashboard] = useState(false);
  const [isProviderSelectionOpen, setIsProviderSelectionOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSlotSelectionOpen, setIsSlotSelectionOpen] = useState(false);
  const [isBookingSummaryOpen, setIsBookingSummaryOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isActivityDetailsOpen, setIsActivityDetailsOpen] = useState(false);
  const [isProviderProfileOpen, setIsProviderProfileOpen] = useState(false);
  const [isAllActivitiesOpen, setIsAllActivitiesOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedParticipants, setSelectedParticipants] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState("");
  const [pendingBooking, setPendingBooking] = useState<BookingFlowSelection | null>(null);
  const [lastCompletedBooking, setLastCompletedBooking] = useState<BookingFlowSelection | null>(null);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [userDashboardTab, setUserDashboardTab] = useState('profile');
  const [providers, setProviders] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]); // kept for mergeBookedSlots after booking
  const [isLoading, setIsLoading] = useState(false);
  const [publicOffers, setPublicOffers] = useState<any[]>([]);

  // ─── useEffect 1: Session restore ──────────────────────────────────────────
  useEffect(() => {
    const storedCustomer = getStoredCustomerSession();
    if (storedCustomer) setCurrentUser(storedCustomer);

    const storedAdmin = localStorage.getItem("goaxplore_current_admin");
    if (storedAdmin) {
      try {
        const admin = JSON.parse(storedAdmin);
        setCurrentAdmin(admin);
        setShowAdminDashboard(true);
      } catch {
        localStorage.removeItem("goaxplore_current_admin");
      }
    }

    const storedProvider = localStorage.getItem("goaxplore_current_provider");
    if (storedProvider) {
      try {
        const provider = normalizeProviderData(JSON.parse(storedProvider));
        setCurrentProvider(provider);
        setShowProviderDashboard(true);
      } catch {
        localStorage.removeItem("goaxplore_current_provider");
      }
    }
  }, []);

  // ─── useEffect 2: Fetch activities + providers from DB ─────────────────────
  useEffect(() => {
    fetch(`${API}/api/offers/public`)
      .then(r => r.json())
      .then(data => setPublicOffers(data.offers || []))
      .catch(() => { });
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [providersResponse, activitiesResponse] = await Promise.all([
          fetch(`${API_BASE}/providers`),
          fetch(`${API_BASE}/activities`),
        ]);

        const providersPayload = await providersResponse.json();
        const activitiesPayload = await activitiesResponse.json();

        console.log("RAW ACTIVITIES FROM DB:", activitiesPayload);
        console.log("RAW PROVIDERS FROM DB:", providersPayload);

        const mappedActivities = Array.isArray(activitiesPayload?.data)
          ? activitiesPayload.data.map(normalizeActivityData)
          : [];

        const mappedProviders = Array.isArray(providersPayload?.data)
          ? providersPayload.data.map(normalizeProviderData)
          : [];

        console.log("MAPPED ACTIVITIES:", mappedActivities.length, mappedActivities);
        console.log("MAPPED PROVIDERS:", mappedProviders.length, mappedProviders);

        setActivities(mappedActivities);
        setProviders(mappedProviders);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Using fallback content while server data is unavailable.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Slots are now fetched inside SlotSelectionModal directly

  // ─── useEffect: Browser back/forward button support ────────────────────────
  useEffect(() => {
    // Define modal priority order (highest = deepest in flow)
    const getActiveModal = () => {
      if (isSuccessOpen) return "success";
      if (isPaymentOpen) return "payment";
      if (isBookingSummaryOpen) return "summary";
      if (isSlotSelectionOpen) return "slots";
      if (isParticipantsOpen) return "participants";
      if (isProviderSelectionOpen) return "providers";
      if (isActivityDetailsOpen) return "activity";
      if (isAllActivitiesOpen) return "activities";
      if (isProviderProfileOpen) return "providerProfile";
      return "home";
    };

    const modal = getActiveModal();

    // Push a new history state whenever a modal opens
    if (modal !== "home") {
      window.history.pushState({ modal }, "", window.location.pathname);
    }
  }, [
    isAllActivitiesOpen,
    isActivityDetailsOpen,
    isProviderProfileOpen,
    isProviderSelectionOpen,
    isParticipantsOpen,
    isSlotSelectionOpen,
    isBookingSummaryOpen,
    isPaymentOpen,
    isSuccessOpen,
  ]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const modal = e.state?.modal;

      // Close the current deepest modal and go back one step
      if (isSuccessOpen) {
        setIsSuccessOpen(false);
        resetBookingFlow();
      } else if (isPaymentOpen) {
        setIsPaymentOpen(false);
        setIsBookingSummaryOpen(true);
      } else if (isBookingSummaryOpen) {
        setIsBookingSummaryOpen(false);
        setIsSlotSelectionOpen(true);
      } else if (isSlotSelectionOpen) {
        setIsSlotSelectionOpen(false);
        setIsParticipantsOpen(true);
      } else if (isParticipantsOpen) {
        setIsParticipantsOpen(false);
        setIsProviderSelectionOpen(true);
      } else if (isProviderSelectionOpen) {
        setIsProviderSelectionOpen(false);
        setIsActivityDetailsOpen(true);
      } else if (isActivityDetailsOpen) {
        setIsActivityDetailsOpen(false);
        setIsAllActivitiesOpen(true);
      } else if (isAllActivitiesOpen) {
        setIsAllActivitiesOpen(false);
      } else if (isProviderProfileOpen) {
        setIsProviderProfileOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [
    isSuccessOpen,
    isPaymentOpen,
    isBookingSummaryOpen,
    isSlotSelectionOpen,
    isParticipantsOpen,
    isProviderSelectionOpen,
    isActivityDetailsOpen,
    isAllActivitiesOpen,
    isProviderProfileOpen,
  ]);

  // ─── Derived state ─────────────────────────────────────────────────────────
  const visibleActivities = activities.length > 0 ? activities : fallbackActivities;
  const visibleProviders = providers.length > 0 ? providers : fallbackProviders;
  const categoryCards = getCategoryCards(visibleActivities);
  const providerChoices = (() => {
    if (!selectedActivity) return [];
    if (dynamicProviders.length > 0) return dynamicProviders;
    if (selectedActivity.provider_id) {
      const matched = visibleProviders.filter(
        (p) =>
          Number(p.provider_id) === Number(selectedActivity.provider_id) ||
          Number(p.id) === Number(selectedActivity.provider_id)
      );
      if (matched.length > 0) return matched;
    }
    const byActivity = getProvidersForActivity(visibleProviders, selectedActivity?.name);
    return byActivity.length > 0 ? byActivity : visibleProviders;
  })();

  // ─── Booking flow handlers ─────────────────────────────────────────────────
  const resetBookingFlow = () => {
    setIsProviderSelectionOpen(false);
    setIsParticipantsOpen(false);
    setIsSlotSelectionOpen(false);
    setIsBookingSummaryOpen(false);
    setIsPaymentOpen(false);
    setBookedSlots([]);
    setSelectedTime("");
    setSelectedActivity(null);
    setSelectedProvider(null);
    setPendingBooking(null);
    setSelectedSlotId(null);
    setDynamicProviders([]);
  };

  const handleCloseBookingFlow = () => resetBookingFlow();

  const openProviderSelection = async (activity: any) => {
    const normalized = enhanceActivity(activity, 0);
    setSelectedActivity(normalized);
    setSelectedProvider(null);
    setSelectedParticipants(normalized.minParticipants || 1);
    setSelectedDate(new Date().toISOString().slice(0, 10));
    setSelectedTime("");
    setSelectedSlotId(null);
    setIsProviderSelectionOpen(true);
    setIsActivityDetailsOpen(false);
    setIsParticipantsOpen(false);
    setIsSlotSelectionOpen(false);
    setIsBookingSummaryOpen(false);
    setIsPaymentOpen(false);

    const activityTitle = activity.title || activity.name;
    if (activityTitle) {
      try {
        const res = await fetch(`${API_BASE}/providers/by-activity/${encodeURIComponent(activityTitle)}`);
        const data = await res.json();
        console.log("PROVIDERS FOR ACTIVITY:", data);
        if (Array.isArray(data?.data) && data.data.length > 0) {
          setDynamicProviders(data.data.map(normalizeProviderData));
        } else {
          setDynamicProviders([]);
        }
      } catch (err) {
        console.warn("Could not fetch providers for activity:", err);
        setDynamicProviders([]);
      }
    }
  };

  const handleBookNow = (activity?: any) => {
    if (!activity) { setIsAllActivitiesOpen(true); return; }
    if (!selectedProvider || selectedActivity?.name !== activity.name) {
      openProviderSelection(activity);
      return;
    }
    setSelectedParticipants(activity.minParticipants || 1);
    setIsParticipantsOpen(true);
  };

  const handleCategorySelect = (activityName: string) => {
    const activity =
      visibleActivities.find((item) => item.name === activityName) ||
      fallbackActivities.find((item) => item.name === activityName);
    if (!activity) { toast.error("Activity not found for this category."); return; }
    openProviderSelection(activity);
  };

  const handleViewActivityDetails = (activity: any) => {
    setSelectedActivity(enhanceActivity(activity, 0));
    setSelectedProvider(null);
    setIsActivityDetailsOpen(true);
  };

  const handleSelectProviderForBooking = (provider: any) => {
    setSelectedProvider(provider);
    setIsProviderSelectionOpen(false);
    setSelectedParticipants(selectedActivity?.minParticipants || 1);
    setIsParticipantsOpen(true);
  };

  const handleContinueToSlotSelection = () => {
    setIsParticipantsOpen(false);
    setIsSlotSelectionOpen(true);
  };

  const handleContinueToSummary = () => {
    if (!selectedActivity || !selectedProvider || !selectedDate || !selectedTime) {
      toast.error("Select a date and available time slot first.");
      return;
    }

    if (!selectedSlotId) {
      toast.error("Please select a time slot.");
      return;
    }

    console.log("CONTINUING TO SUMMARY — slot_id:", selectedSlotId, "time:", selectedTime);

    const bookingDraft: BookingFlowSelection = {
      activity: selectedActivity,
      provider: selectedProvider,
      participants: selectedParticipants,
      date: selectedDate,
      time: selectedTime,
      slot_id: selectedSlotId,
      totalPrice: Number(selectedActivity.price || 0) * selectedParticipants,
    };

    setPendingBooking(bookingDraft);
    setIsSlotSelectionOpen(false);
    setIsBookingSummaryOpen(true);
  };

  const handleContinueToPayment = async () => {
    if (!currentUser) {
      toast.error("Please login before proceeding to payment.");
      setIsLoginOpen(true);
      return;
    }

    const activeUserId = Number(currentUser?.user_id) || Number(localStorage.getItem("user_id"));
    const slotId = Number(selectedSlotId || pendingBooking?.slot_id);

    if (!slotId) {
      toast.error("Could not identify the slot. Please select again.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        user_id: activeUserId,
        activity_id: Number(pendingBooking?.activity?.activity_id || pendingBooking?.activity?.id),
        slot_id: slotId,
        provider_id: Number(pendingBooking?.provider?.provider_id || pendingBooking?.provider?.id),
        participants: pendingBooking?.participants,
      };

      const result = await createBooking(payload);

      if (result?.message?.includes("Slot Full")) {
        toast.error("This slot is fully booked. Please select a different time slot.");
        setIsSlotSelectionOpen(true);
        setIsLoading(false);
        return;
      }

      // Store booking_id in pendingBooking
      setPendingBooking(prev => prev ? { ...prev, booking_id: result.booking_id } as any : null);

      setIsBookingSummaryOpen(false);
      setIsPaymentOpen(true);
    } catch (err) {
      console.error("Pre-payment booking failed:", err);
      toast.error("Could not create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (
    paymentMethod: "card" | "upi" | "netbanking",
    paidAmount: number,
  ) => {
    if (!pendingBooking) return;

    const activeUserId = Number(currentUser?.user_id) || Number(localStorage.getItem("user_id"));
    if (!activeUserId) {
      toast.error("Your login session is missing. Please login again.");
      setIsPaymentOpen(false);
      setIsLoginOpen(true);
      return;
    }

    const bookingCode = buildBookingCode();
    const completedBooking: BookingFlowSelection = {
      ...pendingBooking,
      paymentMethod,
      bookingCode,
      bookedAt: new Date().toLocaleString("en-IN"),
      totalPrice: paidAmount,
    };

    setIsLoading(true);

    try {
      const slotId = Number(
        selectedSlotId ||
        completedBooking.slot_id ||
        pendingBooking.slot_id
      );

      if (!slotId) {
        toast.error("Could not identify the slot. Please select a time slot again.");
        setIsPaymentOpen(false);
        setIsSlotSelectionOpen(true);
        setIsLoading(false);
        return;
      }

      const payload = {
        user_id: activeUserId,
        activity_id: Number(completedBooking.activity.activity_id || completedBooking.activity.id),
        slot_id: slotId,
        provider_id: Number(completedBooking.provider.provider_id || completedBooking.provider.id),
        participants: completedBooking.participants,
      };

      console.log("SENDING BOOKING TO DB:", payload);



      savePublicBooking({
        id: `public-${Date.now()}`,
        activityName: completedBooking.activity.name,
        providerName: completedBooking.provider.name,
        date: completedBooking.date,
        time: completedBooking.time,
        participants: completedBooking.participants,
        totalAmount: completedBooking.totalPrice,
        customerName: currentUser?.full_name || "GoaXplore User",
        customerEmail: currentUser?.email || "customer@goaxplore.local",
        bookingCode: completedBooking.bookingCode || bookingCode,
        paymentMethod,
        createdAt: new Date().toISOString(),
      });

      saveUserBooking(String(activeUserId), {
        id: `local-${Date.now()}`,
        bookingId: completedBooking.bookingCode || bookingCode,
        activityName: completedBooking.activity.name,
        providerName: completedBooking.provider.name,
        location: completedBooking.provider.location || completedBooking.activity.location || "Goa",
        date: completedBooking.date,
        time: completedBooking.time,
        participants: completedBooking.participants,
        totalAmount: completedBooking.totalPrice,
        paymentStatus: "paid",
        status: "confirmed",
      });

      setLastCompletedBooking(completedBooking);
      setIsPaymentOpen(false);
      setIsSuccessOpen(true);
      setSelectedSlotId(null);
      setBookedSlots((current) => mergeBookedSlots([...current, completedBooking.time]));
      toast.success("Booking confirmed successfully.");

    } catch (error) {
      console.error("Booking flow failed:", error);
      toast.error("Unable to finalize the booking right now.");
    } finally {
      setPendingBooking(null);
      setIsLoading(false);
    }
  };

  // ─── Other handlers ────────────────────────────────────────────────────────
  const handleViewProviderProfile = (provider: any) => {
    setSelectedProvider(provider);
    setIsProviderProfileOpen(true);
  };

  const handleExploreActivities = () => setIsAllActivitiesOpen(true);

  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleBecomeProvider = () => {
    if (currentProvider) setShowProviderDashboard(true);
    else setIsProviderLoginOpen(true);
  };

  const handleListActivity = () => {
    if (currentProvider) setShowProviderDashboard(true);
    else setIsProviderLoginOpen(true);
  };

  const handleAffiliateProgram = () => {
    if (currentProvider) setShowProviderDashboard(true);
    else setIsProviderLoginOpen(true);
  };

  const handleCustomerAuthSuccess = (user: CustomerSession) => {
    setCurrentUser(user);
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    toast.success(`Welcome, ${user.full_name}.`);
  };

  const handleAdminLoginSuccess = (admin: any) => {
    setCurrentAdmin(admin);
    localStorage.setItem("goaxplore_current_admin", JSON.stringify(admin));
    setShowAdminDashboard(true);
    toast.success(`Welcome back, ${admin.full_name || admin.name}.`);
  };

  const handleProviderLoginSuccess = (provider: any) => {
    const normalizedProvider = normalizeProviderData(provider);
    setCurrentProvider(normalizedProvider);
    localStorage.setItem("goaxplore_current_provider", JSON.stringify(normalizedProvider));
    setShowProviderDashboard(true);
    toast.success(`Welcome back, ${normalizedProvider.name}.`);
  };

  const handleProviderLogout = () => {
    localStorage.removeItem("goaxplore_current_provider");
    setCurrentProvider(null);
    setShowProviderDashboard(false);
    toast.success("Logged out successfully.");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("goaxplore_current_admin");
    setCurrentAdmin(null);
    setShowAdminDashboard(false);
    toast.success("Logged out successfully.");
  };

  const handleUserLogout = () => {
    clearCustomerSession();
    setCurrentUser(null);
    setShowUserDashboard(false);
    toast.success("Logged out successfully.");
  };

  // ─── Dashboard views ───────────────────────────────────────────────────────
  if (showAdminDashboard && currentAdmin) {
    return (
      <AdminDashboard
        admin={currentAdmin}
        onLogout={handleAdminLogout}
        onBackToHome={() => setShowAdminDashboard(false)}
      />
    );
  }

  if (showProviderDashboard && currentProvider) {
    return (
      <ProviderDashboard
        provider={currentProvider}
        onLogout={handleProviderLogout}
        onBackToHome={() => setShowProviderDashboard(false)}
      />
    );
  }

  if (showUserDashboard) {
    return (
      <UserDashboard
        user={currentUser}
        onLogout={handleUserLogout}
        onGoHome={() => setShowUserDashboard(false)}
        initialTab={userDashboardTab}
      />
    );
  }

  // ─── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#07111f",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />

      <div className="min-h-screen bg-[#030712]">
        <Header
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenSignup={() => setIsSignupOpen(true)}
          onOpenProviderLogin={() => setIsProviderLoginOpen(true)}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          currentUser={currentUser}
          onBookNow={() => handleBookNow()}
          onOpenUserDashboardTab={(tab) => {
            setUserDashboardTab(tab);
            setShowUserDashboard(true);
          }}
          onOpenProviderDashboard={() => setShowProviderDashboard(true)}
          onOpenAdminDashboard={() => setShowAdminDashboard(true)}
          onUserLogout={handleUserLogout}
          onNavigate={handleNavigate}
        />

        <AuthModals
          isLoginOpen={isLoginOpen}
          isSignupOpen={isSignupOpen}
          onCloseLogin={() => setIsLoginOpen(false)}
          onCloseSignup={() => setIsSignupOpen(false)}
          onSwitchToSignup={() => { setIsLoginOpen(false); setIsSignupOpen(true); }}
          onSwitchToLogin={() => { setIsSignupOpen(false); setIsLoginOpen(true); }}
          onAuthSuccess={handleCustomerAuthSuccess}
        />

        <ProviderAuthModals
          isLoginOpen={isProviderLoginOpen}
          isSignupOpen={isProviderSignupOpen}
          onCloseLogin={() => setIsProviderLoginOpen(false)}
          onCloseSignup={() => setIsProviderSignupOpen(false)}
          onLoginSuccess={handleProviderLoginSuccess}
          onSwitchToSignup={() => { setIsProviderLoginOpen(false); setIsProviderSignupOpen(true); }}
          onSwitchToLogin={() => { setIsProviderSignupOpen(false); setIsProviderLoginOpen(true); }}
        />

        <AdminAuthModals
          isLoginOpen={isAdminLoginOpen}
          onCloseLogin={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={handleAdminLoginSuccess}
        />

        <ProviderSelectionModal
          isOpen={isProviderSelectionOpen}
          activity={selectedActivity}
          providers={providerChoices}
          onClose={() => { setIsProviderSelectionOpen(false); setIsActivityDetailsOpen(true); }}
          onCloseFlow={handleCloseBookingFlow}
          onSelectProvider={handleSelectProviderForBooking}
        />

        <ParticipantsModal
          isOpen={isParticipantsOpen}
          activity={selectedActivity}
          provider={selectedProvider}
          participants={selectedParticipants}
          onClose={() => { setIsParticipantsOpen(false); setIsProviderSelectionOpen(true); }}
          onCloseFlow={handleCloseBookingFlow}
          onChange={setSelectedParticipants}
          onContinue={handleContinueToSlotSelection}
        />

        <SlotSelectionModal
          isOpen={isSlotSelectionOpen}
          activity={selectedActivity}
          provider={selectedProvider}
          participants={selectedParticipants}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          bookedSlots={bookedSlots}
          onClose={() => { setIsSlotSelectionOpen(false); setIsParticipantsOpen(true); }}
          onCloseFlow={handleCloseBookingFlow}
          onDateChange={(value) => { setSelectedDate(value); setSelectedTime(""); setSelectedSlotId(null); }}
          onTimeChange={(time, slotId) => {
            setSelectedTime(time);
            setSelectedSlotId(slotId);
            console.log("TIME + SLOT SET:", time, slotId);
          }}
          onContinue={handleContinueToSummary}
        />

        <BookingSummaryModal
          isOpen={isBookingSummaryOpen}
          activity={pendingBooking?.activity || selectedActivity}
          provider={pendingBooking?.provider || selectedProvider}
          participants={pendingBooking?.participants || selectedParticipants}
          date={pendingBooking?.date || selectedDate}
          time={pendingBooking?.time || selectedTime}
          onClose={() => { setIsBookingSummaryOpen(false); setIsSlotSelectionOpen(true); }}
          onCloseFlow={handleCloseBookingFlow}
          onContinue={handleContinueToPayment}
        />

        <PaymentPage
          isOpen={isPaymentOpen}
          onClose={() => { setIsPaymentOpen(false); setIsBookingSummaryOpen(true); }}
          bookingDetails={
            pendingBooking
              ? {
                activity: pendingBooking.activity,
                provider: pendingBooking.provider,
                date: pendingBooking.date,
                time: pendingBooking.time,
                participants: pendingBooking.participants,
                totalPrice: pendingBooking.totalPrice,
                booking_id: (pendingBooking as any).booking_id,
                customer_name: currentUser?.full_name || "GoaXplore User",
                customer_email: currentUser?.email || "user@goaxplore.com",
                customer_phone: currentUser?.phone || "9999999999",
              }
              : null
          }
          onPaymentSuccess={handlePaymentSuccess}
        />

        <BookingSuccessModal
          isOpen={isSuccessOpen}
          booking={lastCompletedBooking}
          customerName={currentUser?.full_name || "GoaXplore User"}
          customerEmail={currentUser?.email || "customer@goaxplore.local"}
          onClose={() => { setIsSuccessOpen(false); resetBookingFlow(); }}
        />

        <ActivityDetailsModal
          isOpen={isActivityDetailsOpen}
          onClose={() => setIsActivityDetailsOpen(false)}
          activity={selectedActivity}
          provider={selectedProvider}
          onBookNow={handleBookNow}
        />

        <ProviderProfileModal
          isOpen={isProviderProfileOpen}
          onClose={() => setIsProviderProfileOpen(false)}
          provider={selectedProvider}
          onBookActivity={(activityName, prov) => {
            const activity =
              visibleActivities.find((a) => a.name === activityName || a.title === activityName) ||
              visibleActivities[0];
            if (activity) {
              setSelectedActivity(enhanceActivity(activity, 0));
              setSelectedProvider(normalizeProviderData(prov));
              setIsProviderProfileOpen(false);
              setSelectedParticipants(activity.minParticipants || 1);
              setIsParticipantsOpen(true);
            }
          }}
        />

        <AllActivitiesPage
          isOpen={isAllActivitiesOpen}
          onClose={() => setIsAllActivitiesOpen(false)}
          onViewDetails={handleViewActivityDetails}
          onBookNow={openProviderSelection}
          activities={visibleActivities}
          currentUserId={currentUser?.user_id || null}
        />

        <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
        <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
        <SafetyGuidelines isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />

        <main className="pt-16">
          <Hero
            categories={categoryCards}
            onExploreActivities={handleExploreActivities}
            onSelectCategory={handleCategorySelect}
          />

          <PopularAdventures
            adventures={visibleActivities}
            onViewDetails={handleViewActivityDetails}
            onBookNow={openProviderSelection}
            isLoading={isLoading}
            currentUserId={currentUser?.user_id || null}
          />
          {publicOffers.length > 0 && (
            <section className="bg-[#050c16] py-10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                    Limited Time
                  </div>
                  <h2 className="text-3xl font-bold text-white">Active Offers</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {publicOffers.map((offer) => (
                    <div key={offer.offer_id} className="rounded-[24px] border border-white/10 bg-[#0c1726] p-5">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-600/20 border border-red-500/30 px-3 py-1 text-sm font-bold text-red-400">
                        {offer.discount_type === 'percentage'
                          ? `${offer.discount_value}% OFF`
                          : `₹${offer.discount_value} OFF`}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{offer.offer_name}</h3>
                      {offer.activity_title && (
                        <p className="text-sm text-slate-400 mb-1">Activity: {offer.activity_title}</p>
                      )}
                      <p className="text-sm text-slate-400 mb-2">By {offer.provider_name}</p>
                      {offer.description && (
                        <p className="text-xs text-slate-500">{offer.description}</p>
                      )}
                      <p className="mt-3 text-xs text-slate-500">
                        Valid till {new Date(offer.valid_to).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          <TopProviders
            providers={visibleProviders}
            onViewProfile={handleViewProviderProfile}
            onBookNow={(provider) => {
              const normalizedProvider = normalizeProviderData(provider);
              setSelectedProvider(normalizedProvider);
              setIsProviderProfileOpen(true);
            }}
            isLoading={isLoading}
          />

          <HowItWorks />
          <AboutUs onExploreActivities={handleExploreActivities} />
          <ContactSection />
          <SafetyGuide />
          <Testimonials testimonials={testimonials} currentUser={currentUser} />
        </main>

        <Footer
          onTermsClick={() => setIsTermsOpen(true)}
          onPrivacyClick={() => setIsPrivacyOpen(true)}
          onSafetyClick={() => setIsSafetyOpen(true)}
          onNavigate={handleNavigate}
          onBecomeProvider={handleBecomeProvider}
          onListActivity={handleListActivity}
          onAffiliateProgram={handleAffiliateProgram}
        />
      </div>
    </>
  );
}