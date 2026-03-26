import { Clock3, Filter, Heart, MapPin, Search, Star, X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { formatMoney } from "../config/bookingFlow";
import API from "../config/api";

const API_BASE = `${API}/api`;

interface Activity {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  duration: string;
  difficulty?: string;
  category: string;
  location?: string;
}

interface AllActivitiesPageProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (activity: any) => void;
  onBookNow: (activity: any) => void;
  activities: Activity[];
  currentUserId?: string | number | null;
}

export function AllActivitiesPage({
  isOpen,
  onClose,
  onViewDetails,
  onBookNow,
  activities,
  currentUserId,
}: AllActivitiesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [apiLocations, setApiLocations] = useState<{ location_id: number; name: string }[]>([]);

  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    if (!currentUserId) return;
    const stored = localStorage.getItem(`user_${currentUserId}_wishlist`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const ids = parsed.map((item: any) => typeof item === "object" ? item.id : item);
        setWishlist(ids.map(Number));
      } catch { setWishlist([]); }
    }
  }, [currentUserId]);

  const toggleWishlist = async (activity: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) { toast.error("Login to save to wishlist"); return; }
    const stored = localStorage.getItem(`user_${currentUserId}_wishlist`);
    let items: any[] = stored ? JSON.parse(stored) : [];
    const alreadyIn = items.some((item: any) =>
      (typeof item === "object" ? Number(item.id) : Number(item)) === Number(activity.id)
    );
    if (alreadyIn) {
      const existing = items.find((item: any) =>
        (typeof item === "object" ? Number(item.id) : Number(item)) === Number(activity.id)
      );
      const wishlistId = existing?.wishlist_id;
      if (wishlistId) {
        try {
          await fetch(`${API_BASE}/wishlist/${wishlistId}`, { method: 'DELETE' });
        } catch { /* silent */ }
      }
      items = items.filter((item: any) =>
        (typeof item === "object" ? Number(item.id) : Number(item)) !== Number(activity.id)
      );
      setWishlist((prev) => prev.filter((id) => id !== activity.id));
      toast.success("Removed FROM wishlist");
    } else {
      let wishlistId: number | null = null;
      try {
        await fetch(`${API_BASE}/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUserId, activity_id: activity.id }),
        });
        const listRes = await fetch(`${API_BASE}/wishlist/${currentUserId}`);
        if (listRes.ok) {
          const list = await listRes.json();
          const match = list.find((w: any) => Number(w.activity_id) === Number(activity.id));
          wishlistId = match?.wishlist_id || null;
        }
      } catch { /* silent */ }
      items.unshift({
        id: String(activity.id),
        wishlist_id: wishlistId,
        activityName: activity.name,
        price: activity.price,
        image: activity.image,
        rating: activity.rating,
        location: activity.location || "Goa",
      });
      setWishlist((prev) => [...prev, activity.id]);
      toast.success("Added to wishlist!");
    }
    localStorage.setItem(`user_${currentUserId}_wishlist`, JSON.stringify(items));
  };

  useEffect(() => {
    fetch(`${API_BASE}/locations`)
      .then((r) => r.json())
      .then((data) => setApiLocations(Array.isArray(data) ? data : []))
      .catch(() => setApiLocations([]));
  }, []);

  if (!isOpen) return null;

  if (!activities || activities.length === 0) {
    return <div className="text-white p-10">Loading activities...</div>;
  }

  const categories = ["All", ...Array.from(new Set(activities.map((a) => a.category)))];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || activity.category === selectedCategory;
    const matchesLocation = selectedLocation === "All" || activity.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#030712]">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#030712]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Activity browser
              </div>
              <h1 className="text-4xl font-bold text-white">Explore all activities</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40"
                title="Back"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={onClose}
                className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search activities"
                className="w-full rounded-2xl border border-white/10 bg-[#091321] py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-red-500"
              />
            </div>

            {/* Category filter */}
            <div className="relative">
              <Filter size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#091321] py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-red-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Location filter */}
            <div className="relative">
              <MapPin size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#091321] py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-red-500"
              >
                <option value="All">All Locations</option>
                {apiLocations.map((loc) => (
                  <option key={loc.location_id} value={loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-slate-400">
          Showing <span className="font-semibold text-white">{filteredActivities.length}</span> activities
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="overflow-hidden rounded-[28px] border border-white/10 bg-[#091321] transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <button
                onClick={() => { onViewDetails(activity); onClose(); }}
                className="block w-full text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    {activity.category}
                  </div>
                </div>
              </button>

              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold text-white">{activity.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-300">
                      <Star size={12} className="fill-current" />
                      {activity.rating.toFixed(1)}
                    </div>
                    <button
                      onClick={(e) => toggleWishlist(activity, e)}
                      className={`rounded-full p-1.5 transition-colors ${wishlist.includes(activity.id)
                          ? "bg-red-500/20 text-red-400"
                          : "bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        }`}
                    >
                      <Heart size={14} className={wishlist.includes(activity.id) ? "fill-current" : ""} />
                    </button>
                  </div>
                </div>

                <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  <Clock3 size={14} className="text-cyan-300" />
                  {activity.duration}
                </div>

                {activity.location && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
                    <MapPin size={14} className="text-cyan-300" />
                    {activity.location}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Starts from</div>
                    <div className="mt-1 text-xl font-bold text-white">{formatMoney(activity.price)}</div>
                  </div>
                  <button
                    onClick={() => { onBookNow(activity); onClose(); }}
                    className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                  >
                    Book now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
