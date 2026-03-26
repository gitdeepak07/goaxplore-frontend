import { Clock3, MapPin, ShieldCheck, Star, Users, X, ArrowLeft } from "lucide-react";
import { LocationMap } from "./LocationMap";
import { formatMoney } from "../config/bookingFlow";


interface ActivityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: any;
  provider?: any;
  onBookNow: (activity: any) => void;
}

export function ActivityDetailsModal({ isOpen, onClose, activity, provider, onBookNow }: ActivityDetailsModalProps) {
  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-[52] bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-start justify-center">
        <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[32px] border border-white/10 bg-[#07111f] shadow-2xl">
          <div className="relative h-72 md:h-96">
            <img src={activity.image} alt={activity.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/20 to-transparent" />

            <div className="absolute right-4 top-4 flex gap-2">
              <button onClick={onClose} className="rounded-full border border-white/10 bg-black/30 p-2 text-white transition-colors hover:bg-black/50" title="Back">
                <ArrowLeft size={20} />
              </button>
              <button onClick={onClose} className="rounded-full border border-white/10 bg-black/30 p-2 text-white transition-colors hover:bg-black/50">
                <X size={22} />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="mb-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                {activity.category}
              </div>
              <h2 className="text-4xl font-bold text-white">{activity.name}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-200">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1">
                  <Star size={14} className="fill-current text-amber-300" />
                  {(activity.rating || 4.7).toFixed(1)}
                </div>
                {provider && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1">
                    <ShieldCheck size={14} className="text-cyan-300" />
                    {provider.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-[1.1fr,0.9fr] md:p-8">
            <div>
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-[#0d1726] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <Clock3 size={18} />
                  </div>
                  <div className="text-sm text-slate-400">Duration</div>
                  <div className="mt-2 font-semibold text-white">{activity.duration}</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-[#0d1726] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <Users size={18} />
                  </div>
                  <div className="text-sm text-slate-400">Group size</div>
                  <div className="mt-2 font-semibold text-white">{activity.minParticipants} to {activity.maxParticipants} guests</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-[#0d1726] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-sm text-slate-400">Difficulty</div>
                  <div className="mt-2 font-semibold text-white">{activity.difficulty}</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="mb-3 text-2xl font-bold text-white">About this activity</h3>
                <p className="text-sm leading-7 text-slate-400">{activity.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="mb-3 text-2xl font-bold text-white">Included</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {(activity.includes || []).map((item: string) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-[#0d1726] px-4 py-3 text-sm text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location + Google Map */}
              <div>
                <h3 className="mb-3 text-2xl font-bold text-white">Meeting location</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {(activity.locations || []).map((location: string) => (
                    <div key={location} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1726] px-4 py-2 text-sm text-slate-300">
                      <MapPin size={14} className="text-cyan-300" />
                      {location}
                    </div>
                  ))}
                </div>

                {activity.latitude && activity.longitude ? (
                  <LocationMap
                    latitude={Number(activity.latitude)}
                    longitude={Number(activity.longitude)}
                    locationName={activity.location || "Meeting point"}
                  />
                ) : (
                  <div className="flex h-[240px] items-center justify-center rounded-2xl border border-white/10 bg-[#0d1726] text-sm text-slate-500">
                    Map not available for this location yet
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="rounded-[28px] border border-white/10 bg-[#0d1726] p-6">
                <div className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Next step</div>
                <h3 className="mb-3 text-2xl font-bold text-white">Continue the booking flow</h3>
                <p className="mb-6 text-sm leading-7 text-slate-400">
                  After this screen, the user goes to the people popup, then slot selection, booking summary, and payment.
                </p>

                <div className="mb-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="mb-2 text-sm text-slate-400">Starts from</div>
                  <div className="text-4xl font-bold text-white">{formatMoney(activity.price)}</div>
                  <div className="mt-2 text-sm text-slate-400">per person</div>
                </div>

                <div className="mb-6 rounded-3xl border border-white/10 bg-black/20 p-5 text-sm text-slate-300">
                  <div className="mb-3 flex items-center justify-between">
                    <span>Meeting point</span>
                    <strong className="text-white">{activity.meetingPoint}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Minimum age</span>
                    <strong className="text-white">{activity.minAge}+</strong>
                  </div>
                </div>

                <button
                  onClick={() => { onBookNow(activity); onClose(); }}
                  className="w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-500"
                >
                  {provider ? "Continue to people selection" : "Choose provider and continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}