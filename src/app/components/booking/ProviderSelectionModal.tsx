import { MapPin, ShieldCheck, Star, Users, X, ArrowLeft } from "lucide-react";

import { formatMoney, getActivityTemplate } from "../../config/bookingFlow";

interface ProviderSelectionModalProps {
  isOpen: boolean;
  activity: any;
  providers: any[];
  onClose: () => void;
  onCloseFlow: () => void;
  onSelectProvider: (provider: any) => void;
}

export function ProviderSelectionModal({
  isOpen,
  activity,
  providers,
  onClose,
  onCloseFlow,
  onSelectProvider,
}: ProviderSelectionModalProps) {
  if (!isOpen || !activity) {
    return null;
  }

  const activityMeta = getActivityTemplate(activity.name);
  const enhancedProviders = providers || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
        <div className="w-full max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#07111f] shadow-2xl">
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#0d2036] via-[#0a1626] to-[#130d18] px-6 py-6 md:px-8">
            <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />

            <div className="absolute right-4 top-4 flex gap-2">
              <button
                onClick={onClose}
                className="rounded-full border border-white/10 bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
                title="Back"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={onCloseFlow}
                className="rounded-full border border-white/10 bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative grid gap-6 md:grid-cols-[1.2fr,0.8fr] md:items-end">
              <div>
                <div className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  Choose Provider
                </div>
                <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
                  {activity.name}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  {activityMeta?.description || activity.description}
                </p>
              </div>

              <div className="grid gap-3 rounded-3xl border border-white/10 bg-black/25 p-4 text-sm text-slate-200">
                <div className="flex items-center justify-between">
                  <span>Category</span>
                  <strong>{activity.category}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Starting price</span>
                  <strong>{formatMoney(activity.price)}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Group size</span>
                  <strong>
                    {activity.minParticipants} to {activity.maxParticipants} guests
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-6 md:px-8">
            {enhancedProviders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-black/20 px-6 py-12 text-center">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  No providers matched this activity yet
                </h3>
                <p className="text-sm text-slate-400">
                  Add provider activity mapping in the dashboard or update the activity catalog if you want this category to surface providers here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {enhancedProviders.map((provider) => (
                  <div
                    key={provider.id || provider.name}
                    className="rounded-3xl border border-white/10 bg-[#0d1726] p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-cyan-400/40"
                  >
                    <div className="mb-5 flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 text-lg font-bold text-white">
                        {provider.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold text-white">
                            {provider.name}
                          </h3>
                          <div className="flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-300">
                            <Star size={12} className="fill-current" />
                            {(provider?.rating || 4.5).toFixed(1)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MapPin size={14} />
                          <span>{provider.location}</span>
                        </div>
                      </div>
                    </div>

                    <p className="mb-5 text-sm leading-6 text-slate-300">
                      {provider.description}
                    </p>

                    <div className="mb-5 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Reviews</span>
                        <strong>{provider.reviews}+</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Supports</span>
                        <strong>{activity.name}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Capacity window</span>
                        <strong>
                          {activity.minParticipants} to {activity.maxParticipants}
                        </strong>
                      </div>
                    </div>

                    <div className="mb-5 flex flex-wrap gap-2">
                      {provider.certifications.slice(0, 2).map((item: string) => (
                        <div
                          key={item}
                          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                        >
                          <ShieldCheck size={12} />
                          {item}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onSelectProvider(provider)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-500"
                    >
                      <Users size={16} />
                      Book with this provider
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
