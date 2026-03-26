import { CalendarDays, Clock3, CreditCard, MapPin, ShieldCheck, Users, X, ArrowLeft } from "lucide-react";

import { formatDisplayDate, formatMoney } from "../../config/bookingFlow";

interface BookingSummaryModalProps {
  isOpen: boolean;
  activity: any;
  provider: any;
  participants: number;
  date: string;
  time: string;
  onClose: () => void;
  onCloseFlow: () => void;
  onContinue: () => void;
}

export function BookingSummaryModal({
  isOpen,
  activity,
  provider,
  participants,
  date,
  time,
  onClose,
  onCloseFlow,
  onContinue,
}: BookingSummaryModalProps) {
  if (!isOpen || !activity || !provider) {
    return null;
  }

  const subtotal = Number(activity.price || 0) * participants;
  const total = subtotal;

  return (
    <div className="fixed inset-0 z-[57] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 bg-[#07111f] shadow-2xl">
        <div className="grid lg:grid-cols-[1.15fr,0.85fr]">
          <div className="border-b border-white/10 bg-gradient-to-br from-[#0c1a2c] via-[#091321] to-[#07111f] p-6 md:p-8 lg:border-b-0 lg:border-r">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  Step 3 of 4
                </div>
                <h2 className="text-3xl font-bold text-white">Booking window</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Review all booking details before moving to payment.
                </p>
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
                  onClick={onCloseFlow}
                  className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1726]">
              <img
                src={activity.image}
                alt={activity.name}
                className="h-64 w-full object-cover"
              />
              <div className="p-6">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  {activity.category}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">{activity.name}</h3>
                <p className="text-sm leading-6 text-slate-400">
                  {activity.description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-6 rounded-[28px] border border-white/10 bg-[#0d1726] p-6">
              <h3 className="mb-5 text-xl font-semibold text-white">Order details</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-300">
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-cyan-300" />
                    Provider
                  </span>
                  <strong className="text-white">{provider.name}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-300">
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-cyan-300" />
                    Guests
                  </span>
                  <strong className="text-white">{participants}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-300">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-cyan-300" />
                    Date
                  </span>
                  <strong className="text-white">{formatDisplayDate(date)}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-300">
                  <span className="flex items-center gap-2">
                    <Clock3 size={16} className="text-cyan-300" />
                    Time slot
                  </span>
                  <strong className="text-white">{time}</strong>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-[28px] border border-white/10 bg-[#0d1726] p-6">
              <h3 className="mb-5 text-xl font-semibold text-white">Price breakdown</h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Activity rate</span>
                  <strong>{formatMoney(activity.price)}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Guests</span>
                  <strong>x {participants}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Booking fee</span>
                  <strong>Rs. 0</strong>
                </div>
                <div className="border-t border-white/10 pt-4 text-base text-white">
                  <div className="flex items-center justify-between">
                    <span>Total amount</span>
                    <strong>{formatMoney(total)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <ShieldCheck size={16} />
                Booking confirmation note
              </div>
              The slot is held only after payment is completed. Once payment succeeds, the same activity and time will be locked from future selection in this browser and also synced to the lightweight slot API when available.
            </div>

            <button
              onClick={onContinue}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-500"
            >
              <CreditCard size={18} />
              Continue to payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
