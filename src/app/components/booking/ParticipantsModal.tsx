import { Minus, Plus, Users, X, ArrowLeft } from "lucide-react";

import { formatMoney } from "../../config/bookingFlow";

interface ParticipantsModalProps {
  isOpen: boolean;
  activity: any;
  provider: any;
  participants: number;
  onClose: () => void;
  onCloseFlow: () => void;
  onChange: (value: number) => void;
  onContinue: () => void;
}

export function ParticipantsModal({
  isOpen,
  activity,
  provider,
  participants,
  onClose,
  onCloseFlow,
  onChange,
  onContinue,
}: ParticipantsModalProps) {
  if (!isOpen || !activity || !provider) {
    return null;
  }

  const minParticipants = Number(activity.minParticipants || 1);
  const maxParticipants = Number(activity.maxParticipants || 6);
  const total = participants * Number(activity.price || 0);

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#091321] p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Step 1 of 4
            </div>
            <h2 className="text-2xl font-bold text-white">Select number of people</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {provider.name} allows {minParticipants} to {maxParticipants} guests for {activity.name}.
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

        <div className="mb-6 rounded-3xl border border-white/10 bg-black/20 p-5">
          <div className="mb-4 flex items-center gap-3 text-slate-300">
            <Users size={20} className="text-cyan-300" />
            <span className="text-sm font-medium">Guest count</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => onChange(Math.max(minParticipants, participants - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1726] text-white transition-colors hover:border-cyan-400/40"
            >
              <Minus size={18} />
            </button>

            <div className="text-center">
              <div className="text-5xl font-bold text-white">{participants}</div>
              <div className="mt-2 text-sm text-slate-400">
                {participants === 1 ? "person" : "people"}
              </div>
            </div>

            <button
              onClick={() => onChange(Math.min(maxParticipants, participants + 1))}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1726] text-white transition-colors hover:border-cyan-400/40"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-3 rounded-3xl border border-white/10 bg-[#0d1726] p-5 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Price per guest</span>
            <strong>{formatMoney(activity.price)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Provider</span>
            <strong>{provider.name}</strong>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base text-white">
            <span>Estimated total</span>
            <strong>{formatMoney(total)}</strong>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-500"
        >
          Continue to slot selection
        </button>
      </div>
    </div>
  );
}
