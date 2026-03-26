import { Clock3, Heart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { formatMoney } from "../config/bookingFlow";
import API from "../config/api";

interface Adventure {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  duration?: string;
  category?: string;
}

interface PopularAdventuresProps {
  adventures: Adventure[];
  onViewDetails: (adventure: Adventure) => void;
  onBookNow: (adventure: Adventure) => void;
  isLoading?: boolean;
  currentUserId?: string | number | null;
}

export function PopularAdventures({
  adventures,
  onViewDetails,
  onBookNow,
  isLoading,
  currentUserId,
}: PopularAdventuresProps) {

  const [wishlist, setWishlist] = useState<number[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (!currentUserId) return;
    const stored = localStorage.getItem(`user_${currentUserId}_wishlist`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Support both old format (objects) and new format (id array)
        const ids = parsed.map((item: any) => typeof item === "object" ? item.id : item);
        setWishlist(ids.map(Number));
      } catch {
        setWishlist([]);
      }
    }
  }, [currentUserId]);

  const toggleWishlist = async (adventure: Adventure, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) { toast.error("Login to save to wishlist"); return; }

    const stored = localStorage.getItem(`user_${currentUserId}_wishlist`);
    let items: any[] = stored ? JSON.parse(stored) : [];
    const alreadyIn = items.some((item: any) =>
      (typeof item === "object" ? Number(item.id) : Number(item)) === Number(adventure.id)
    );

    if (alreadyIn) {
      // find wishlist_id for DELETE
      const existing = items.find((item: any) =>
        (typeof item === "object" ? Number(item.id) : Number(item)) === Number(adventure.id)
      );
      const wishlistId = existing?.wishlist_id;
      if (wishlistId) {
        try {
          await fetch(`${API}/api/wishlist/${wishlistId}`, { method: 'DELETE' });
        } catch { /* silent */ }
      }
      items = items.filter((item: any) =>
        (typeof item === "object" ? Number(item.id) : Number(item)) !== Number(adventure.id)
      );
      setWishlist((prev) => prev.filter((id) => id !== adventure.id));
      toast.success("Removed from wishlist");
    } else {
      let wishlistId: number | null = null;
      try {
        const res = await fetch('${API}/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUserId, activity_id: adventure.id }),
        });
        // fetch back to get wishlist_id
        const listRes = await fetch(`${API}/api/wishlist/${currentUserId}`);
        if (listRes.ok) {
          const list = await listRes.json();
          const match = list.find((w: any) => Number(w.activity_id) === Number(adventure.id));
          wishlistId = match?.wishlist_id || null;
        }
      } catch { /* silent */ }
      items.unshift({
        id: String(adventure.id),
        wishlist_id: wishlistId,
        activityName: adventure.name,
        price: adventure.price,
        image: adventure.image,
        rating: adventure.rating,
        location: "Goa",
      });
      setWishlist((prev) => [...prev, adventure.id]);
      toast.success("Added to wishlist!");
    }
    localStorage.setItem(`user_${currentUserId}_wishlist`, JSON.stringify(items));
  };

  return (
    <section
      id="services"
      className="bg-gradient-to-b from-[#030712] via-[#08111d] to-[#030712] py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Activity catalog
            </div>
            <h2 className="text-4xl font-bold text-white">Popular adventures</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Every book action now goes into the new provider-first flow so you can choose the operator before confirming the slot.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1726]">
                <div className="h-56 animate-pulse bg-slate-800" />
                <div className="space-y-4 p-5">
                  <div className="h-6 animate-pulse rounded bg-slate-800" />
                  <div className="h-4 animate-pulse rounded bg-slate-800" />
                  <div className="h-12 animate-pulse rounded bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {adventures.map((adventure) => {
              const isWishlisted = wishlist.includes(adventure.id);
              return (
                <div
                  key={adventure.id}
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1726] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
                >
                  <button
                    onClick={() => onViewDetails(adventure)}
                    className="block w-full text-left"
                  >
                    <div className="relative aspect-[4/4.2] overflow-hidden">
                      <img
                        src={adventure.image}
                        alt={adventure.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/20 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                        {adventure.category || "Featured"}
                      </div>
                    </div>
                  </button>

                  <div className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-semibold text-white">{adventure.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-300">
                          <Star size={12} className="fill-current" />
                          {adventure.rating.toFixed(1)}
                        </div>
                        {/* Wishlist button */}
                        <button
                          onClick={(e) => toggleWishlist(adventure, e)}
                          title={currentUserId ? (isWishlisted ? "Remove from wishlist" : "Add to wishlist") : "Login to add to wishlist"}
                          className={`rounded-full p-1.5 transition-colors ${
                            isWishlisted
                              ? "bg-red-500/20 text-red-400"
                              : "bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                          }`}
                        >
                          <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">
                      <Clock3 size={14} className="text-cyan-300" />
                      {adventure.duration || "Flexible timing"}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Starts from</div>
                        <div className="mt-1 text-xl font-bold text-white">{formatMoney(adventure.price)}</div>
                      </div>
                      <button
                        onClick={() => onBookNow(adventure)}
                        className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                      >
                        Book now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}