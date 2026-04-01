import { ArrowRight, CalendarDays, LifeBuoy, MapPin, Waves } from "lucide-react";

import { formatMoney } from "../config/bookingFlow";

interface HeroProps {
  categories: Array<{
    id: string | number;
    name: string;
    category: string;
    image: string;
    price: number;
    duration: string;
    tagline: string;
  }>;
  onExploreActivities: () => void;
  onSelectCategory: (categoryName: string) => void;
}

export function Hero({
  categories,
  onExploreActivities,
  onSelectCategory,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(239,68,68,0.18),_transparent_30%),linear-gradient(180deg,_#030712_0%,_#08111d_48%,_#030712_100%)] pt-24"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              <Waves size={14} />
              Goa's Best Activities
            </div>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Explore the Adventure of Goa with GoaXplore!
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Select the adventure first, then continue through provider, Book your Slot and Enjoy the Adventure!.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onExploreActivities}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-500"
              >
                Explore all activities
                <ArrowRight size={18} />
              </button>
              <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-6 py-3 text-sm text-slate-300">
                <LifeBuoy size={18} className="text-cyan-300" />
                {"From Boat Riding -> Para Sailing"}
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-black/25 p-6 shadow-2xl backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  Featured categories
                </div>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Start from the activity type
                </h2>
              </div>
              <button
                onClick={onExploreActivities}
                className="flex items-center gap-1 text-sm font-semibold text-cyan-400 transition-colors hover:text-white cursor-pointer underline-offset-2 hover:underline"
              >
                View all
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {categories.slice(0, 4).map((category) => (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.name)}
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#0a1321] text-left transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/25 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                      {category.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-2 text-xl font-semibold text-white">
                      {category.name}
                    </div>
                    <p className="mb-4 text-sm leading-6 text-slate-400">
                      {category.tagline}
                    </p>

                    <div className="grid gap-2 text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-cyan-300" />
                          Duration
                        </span>
                        <strong>{category.duration}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <MapPin size={14} className="text-cyan-300" />
                          Starts from
                        </span>
                        <strong>{formatMoney(category.price)}</strong>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
