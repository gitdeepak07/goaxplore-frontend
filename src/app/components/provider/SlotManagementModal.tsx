import { X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const API = '${API}/api';

interface SlotManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: any;
  onSaveSlots: (slots: any[]) => void;
}

export function SlotManagementModal({ isOpen, onClose, activity, onSaveSlots }: SlotManagementModalProps) {

  const [slots, setSlots] = useState<any[]>([
    { id: '1', date: '', timeSlots: [{ time: '', capacity: '' }] }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ success: number; failed: number } | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const addDateSlot = () => setSlots([...slots, {
    id: Date.now().toString(), date: '', timeSlots: [{ time: '', capacity: '' }]
  }]);

  const removeDateSlot = (id: string) => setSlots(slots.filter(s => s.id !== id));

  const updateDate = (id: string, date: string) =>
    setSlots(slots.map(s => s.id === id ? { ...s, date } : s));

  const addTimeSlot = (id: string) =>
    setSlots(slots.map(s => s.id === id
      ? { ...s, timeSlots: [...s.timeSlots, { time: '', capacity: '' }] }
      : s));

  const removeTimeSlot = (id: string, idx: number) =>
    setSlots(slots.map(s => s.id === id
      ? { ...s, timeSlots: s.timeSlots.filter((_: any, i: number) => i !== idx) }
      : s));

  const updateTimeSlot = (id: string, idx: number, field: string, val: string) =>
    setSlots(slots.map(s => s.id === id
      ? { ...s, timeSlots: s.timeSlots.map((ts: any, i: number) => i === idx ? { ...ts, [field]: val } : ts) }
      : s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const activityId = activity?.activity_id ?? activity?.id;
    if (!activityId) {
      alert("No activity selected.");
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);
    let ok = 0, fail = 0;

    for (const slot of slots) {
      for (const ts of slot.timeSlots) {
        if (!slot.date || !ts.time || !ts.capacity) continue;
        try {
          const res = await fetch(`${API}/slots`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              activity_id: activityId,
              slot_date: slot.date,
              start_time: ts.time.length === 5 ? ts.time + ":00" : ts.time,
              end_time: ts.time.length === 5 ? ts.time + ":00" : ts.time,
              capacity_total: parseInt(ts.capacity),
            })
          });
          res.ok ? ok++ : fail++;
        } catch { fail++; }
      }
    }

    setIsSaving(false);
    setSaveStatus({ success: ok, failed: fail });

    if (fail === 0 && ok > 0) {
      onSaveSlots(slots);
      setTimeout(() => {
        onClose();
        setSlots([{ id: '1', date: '', timeSlots: [{ time: '', capacity: '' }] }]);
        setSaveStatus(null);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Manage Availability</h2>
            <p className="text-gray-400 text-sm mt-1">{activity?.name || activity?.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>

        {saveStatus && (
          <div className={`mx-6 mt-4 px-4 py-3 rounded-lg border ${
            saveStatus.failed === 0
              ? 'bg-green-900/30 border-green-600 text-green-400'
              : 'bg-yellow-900/30 border-yellow-600 text-yellow-400'
          }`}>
            {saveStatus.failed === 0
              ? `✓ ${saveStatus.success} slot(s) saved to database!`
              : `${saveStatus.success} saved, ${saveStatus.failed} failed. Check console.`}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <label className="text-white font-semibold mb-2 block">Date</label>
                  <input
                    type="date"
                    value={slot.date}
                    min={today}
                    onChange={(e) => updateDate(slot.id, e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
                {slots.length > 1 && (
                  <button type="button" onClick={() => removeDateSlot(slot.id)}
                    className="ml-4 mt-8 text-red-400 hover:text-red-300">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white font-semibold">Time Slots</label>
                  <button type="button" onClick={() => addTimeSlot(slot.id)}
                    className="text-red-600 hover:text-red-500 flex items-center gap-1 text-sm">
                    <Plus size={16} /> Add Time Slot
                  </button>
                </div>

                {slot.timeSlots.map((ts: any, i: number) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Start Time</label>
                      <input
                        type="time"
                        value={ts.time}
                        onChange={(e) => updateTimeSlot(slot.id, i, 'time', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-gray-400 text-xs mb-1 block">Capacity</label>
                        <input
                          type="number"
                          value={ts.capacity}
                          onChange={(e) => updateTimeSlot(slot.id, i, 'capacity', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          placeholder="e.g. 5"
                          min="1"
                          required
                        />
                      </div>
                      {slot.timeSlots.length > 1 && (
                        <button type="button" onClick={() => removeTimeSlot(slot.id, i)}
                          className="text-red-400 hover:text-red-300 mt-5">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button type="button" onClick={addDateSlot}
            className="w-full bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white py-3 rounded-md flex items-center justify-center gap-2">
            <Plus size={20} /> Add More Dates
          </button>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-md font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={isSaving}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold disabled:opacity-60">
              {isSaving ? 'Saving to DB...' : 'Save Availability'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}