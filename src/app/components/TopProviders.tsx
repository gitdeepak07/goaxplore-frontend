import { MapPin, ShieldCheck, Star } from "lucide-react";

interface Provider {
  id: number;
  name: string;
  location: string;
  activities: number;
  logo: string;
  verified: boolean;
  rating?: number;
}

interface TopProvidersProps {
  providers: Provider[];
  onViewProfile: (provider: Provider) => void;
  onBookNow?: (provider: Provider) => void;
  isLoading?: boolean;
}

export function TopProviders({
  providers,
  onViewProfile,
  onBookNow,
  isLoading,
}: TopProvidersProps) {
  return (
    <section id="providers" className="bg-[#050c16] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Provider network
          </div>
          <h2 className="text-4xl font-bold text-white">Top sports providers</h2>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-white/10 bg-[#0c1726] p-6"
              >
                <div className="mb-6 flex animate-pulse items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded bg-slate-800" />
                    <div className="h-4 rounded bg-slate-800" />
                  </div>
                </div>
                <div className="mb-4 h-4 animate-pulse rounded bg-slate-800" />
                <div className="h-11 animate-pulse rounded-2xl bg-slate-800" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="rounded-[28px] border border-white/10 bg-[#0c1726] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 text-lg font-bold text-white">
                    {provider.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        {provider.name}
                      </h3>
                      <button
                        onClick={() => onViewProfile(provider)}
                        className="flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition-colors"
                      >
                        <Star size={12} className="fill-current" />
                        {(provider.rating || 4.7).toFixed(1)}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <MapPin size={14} />
                      {provider.location}
                    </div>
                  </div>
                </div>

                <div className="mb-4 text-sm text-slate-300">
                  {provider.activities} listed activities
                </div>

                {provider.verified && (
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                    <ShieldCheck size={12} />
                    Verified provider
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewProfile(provider)}
                    className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-semibold text-white transition-colors hover:bg-black/40"
                  >
                    View profile
                  </button>
                  <button
                    onClick={() => onBookNow?.(provider)}
                    className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-500"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
