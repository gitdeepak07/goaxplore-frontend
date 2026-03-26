import { CalendarDays, Clock3, MapPin, Users, X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

import {
  formatDisplayDate,
  formatMoney,
  getFutureDates,
} from "../../config/bookingFlow";

const API_BASE = "${API}/api";

interface SlotSelectionModalProps {
  isOpen: boolean;
  activity: any;
  provider: any;
  participants: number;
  selectedDate: string;
  selectedTime: string;
  bookedSlots: string[];
  onClose: () => void;
  onCloseFlow: () => void;
  onDateChange: (value: string) => void;
  onTimeChange: (time: string, slotId: number) => void;
  onContinue: () => void;
}

const formatSlotTime = (time: string): string => {
  if (!time) return time;
  if (time.includes("AM") || time.includes("PM")) return time;
  const [hourStr, minuteStr] = time.split(":");
  let hours = parseInt(hourStr);
  const minutes = minuteStr || "00";
  const modifier = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${modifier}`;
};

export function SlotSelectionModal({
  isOpen,
  activity,
  provider,
  participants,
  selectedDate,
  selectedTime,
  onClose,
  onCloseFlow,
  onDateChange,
  onTimeChange,
  onContinue,
}: SlotSelectionModalProps) {

  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch slots directly inside this component — no dependency on parent state
  useEffect(() => {
    if (!isOpen || !activity) return;

    const activityId = activity.activity_id || activity.id;
    if (!activityId) return;

    setLoadingSlots(true);
    setSlots([]);

    fetch(`${API_BASE}/slots/${activityId}?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        const fetched = Array.isArray(data) ? data : [];
        setSlots(fetched);
        console.log("SLOTS FETCHED IN MODAL:", fetched.length, fetched);
      })
      .catch((err) => {
        console.error("Slot fetch error:", err);
        setSlots([]);
      })
      .finally(() => setLoadingSlots(false));

  }, [isOpen, activity?.activity_id, selectedDate]);

  if (!isOpen || !activity || !provider) return null;

  const dates = getFutureDates(7);
  const total = Number(activity.price || 0) * participants;

  const bookedTimes = slots
    .filter((s) => s.capacity_available <= 0 || s.slot_status === "Closed")
    .map((s) => s.start_time);

  return (
    <div className="fixed inset-0 z-[56] bg-black/80 p-4 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
        <div className="w-full max-h-[90vh] overflow-y-auto rounded-[30px] border border-white/10 bg-[#07111f] shadow-2xl">
          <div className="grid md:grid-cols-[1.1fr,0.9fr]">
            <div className="border-b border-white/10 bg-gradient-to-br from-[#0c1b2d] via-[#0a1321] to-[#07111f] p-6 md:border-b-0 md:border-r md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    Step 2 of 4
                  </div>
                  <h2 className="text-3xl font-bold text-white">Select your slot</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={onClose} className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40" title="Back">
                    <ArrowLeft size={20} />
                  </button>
                  <button onClick={onCloseFlow} className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Date Picker */}
              <div className="mb-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="mb-3 flex items-center gap-3 text-slate-300">
                  <CalendarDays size={18} className="text-cyan-300" />
                  <span className="font-medium">Choose a date</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {dates.map((date) => {
                    const isSelected = selectedDate === date.value;
                    return (
                      <button
                        key={date.value}
                        onClick={() => onDateChange(date.value)}
                        className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-400/10 text-white"
                            : "border-white/10 bg-[#0c1726] text-slate-300 hover:border-white/30"
                        }`}
                      >
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          {new Date(`${date.value}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short" })}
                        </div>
                        <div className="mt-2 text-base font-semibold">
                          {formatDisplayDate(date.value)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Picker */}
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="mb-3 flex items-center gap-3 text-slate-300">
                  <Clock3 size={18} className="text-cyan-300" />
                  <span className="font-medium">Pick a time slot</span>
                </div>

                {loadingSlots ? (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#0c1726]" />
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4">
                    No slots available for this date yet.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {slots.map((slot) => {
                      const isBooked = bookedTimes.includes(slot.start_time);
                      const isSelected = selectedTime === slot.start_time;

                      return (
                        <button
                          key={slot.slot_id}
                          disabled={isBooked}
                          onClick={() => {
                            console.log("SLOT CLICKED:", slot.slot_id, slot.start_time);
                            onTimeChange(slot.start_time, slot.slot_id);
                          }}
                          className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                            isBooked
                              ? "cursor-not-allowed border-red-500/20 bg-red-500/10 text-red-200 opacity-60"
                              : isSelected
                              ? "border-emerald-400 bg-emerald-400/10 text-white"
                              : "border-white/10 bg-[#0c1726] text-slate-300 hover:border-white/30"
                          }`}
                        >
                          <div className="text-sm font-semibold">{formatSlotTime(slot.start_time)}</div>
                          <div className="mt-2 text-xs uppercase tracking-[0.16em]">
                            {isBooked ? "Booked" : `${slot.capacity_available} left`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right panel */}
            <div className="p-6 md:p-8">
              <div className="rounded-[28px] border border-white/10 bg-[#0d1726] p-6">
                <div className="mb-6 overflow-hidden rounded-3xl">
                  <img src={activity.image} alt={activity.name} className="h-56 w-full object-cover" />
                </div>

                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  {activity.category}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">{activity.name}</h3>
                <p className="mb-6 text-sm leading-6 text-slate-400">{activity.description}</p>

                <div className="mb-6 grid gap-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-300">
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-cyan-300" />Provider</span>
                    <strong className="text-white">{provider.name}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-300">
                    <span className="flex items-center gap-2"><Users size={16} className="text-cyan-300" />Guests</span>
                    <strong className="text-white">{participants}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-300">
                    <span className="flex items-center gap-2"><CalendarDays size={16} className="text-cyan-300" />Date</span>
                    <strong className="text-white">{selectedDate ? formatDisplayDate(selectedDate) : "Pick a date"}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-300">
                    <span className="flex items-center gap-2"><Clock3 size={16} className="text-cyan-300" />Time</span>
                    <strong className="text-white">{selectedTime ? formatSlotTime(selectedTime) : "Pick a slot"}</strong>
                  </div>
                </div>

                <div className="mb-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="mb-2 text-sm text-slate-400">Estimated payable</div>
                  <div className="text-3xl font-bold text-white">{formatMoney(total)}</div>
                </div>

                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={onContinue}
                  className="w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  Continue to booking summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}