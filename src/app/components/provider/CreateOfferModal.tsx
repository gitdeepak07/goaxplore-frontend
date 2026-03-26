import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CreateOfferModalProps {
  isOpen: boolean
  onClose: () => void
  activities: any[]
  onSaveOffer: (offer: any) => void
  editingOffer?: any
  providerId?: number | string
}

export function CreateOfferModal({
  isOpen,
  onClose,
  activities,
  onSaveOffer,
  editingOffer,
  providerId,
}: CreateOfferModalProps) {

  const blank = {
    offerName: '',
    discountType: 'percentage',
    discountValue: '',
    activityId: '',
    validFrom: '',
    validTo: '',
    minBookings: '',
    maxUsage: '',
    description: ''
  };

  const [formData, setFormData] = useState(blank);

  // Reset form whenever modal opens or editingOffer changes
  useEffect(() => {
    if (!isOpen) return;
    if (editingOffer) {
      setFormData({
        offerName:     editingOffer.offerName     || editingOffer.offer_name     || '',
        discountType:  editingOffer.discountType  || editingOffer.discount_type  || 'percentage',
        discountValue: String(editingOffer.discountValue ?? editingOffer.discount_value ?? ''),
        activityId:    String(editingOffer.activityId    ?? editingOffer.activity_id    ?? ''),
        validFrom:     (editingOffer.validFrom    || editingOffer.valid_from     || '').slice(0, 10),
        validTo:       (editingOffer.validTo      || editingOffer.valid_to       || '').slice(0, 10),
        minBookings:   String(editingOffer.minBookings   ?? ''),
        maxUsage:      String(editingOffer.maxUsage      ?? editingOffer.max_usage ?? ''),
        description:   editingOffer.description   || '',
      });
    } else {
      setFormData(blank);
    }
  }, [isOpen, editingOffer]);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    const payload = {
      provider_id:    providerId,
      activity_id:    formData.activityId && formData.activityId !== '' ? formData.activityId : null,
      offer_name:     formData.offerName,
      discount_type:  formData.discountType,
      discount_value: parseFloat(formData.discountValue),
      valid_from:     formData.validFrom,
      valid_to:       formData.validTo,
      max_usage:      formData.maxUsage ? parseInt(formData.maxUsage) : null,
      description:    formData.description,
    };

    try {
      if (editingOffer) {
        const realId = editingOffer.offer_id || editingOffer.id;
        const res = await fetch(`http://localhost:5000/api/offers/${realId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          setSaveError(err.message || 'Failed to update offer');
          setSaving(false);
          return;
        }
        onSaveOffer({ ...editingOffer, ...formData, discount_value: payload.discount_value, valid_from: formData.validFrom, valid_to: formData.validTo });
      } else {
        const res = await fetch('http://localhost:5000/api/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          setSaveError(data.message || 'Failed to create offer');
          setSaving(false);
          return;
        }
        onSaveOffer({
          ...formData,
          offer_id:      data.offer_id,
          id:            String(data.offer_id),
          discountValue: payload.discount_value,
          validFrom:     formData.validFrom,
          validTo:       formData.validTo,
          maxUsage:      payload.max_usage,
          usedCount:     0,
          status:        'active',
        });
      }
      onClose();
    } catch (err: any) {
      setSaveError(err.message || 'Network error');
    }
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {editingOffer ? 'Edit Offer' : 'Create New Offer'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-white font-semibold mb-2 block">Offer Name *</label>
            <input
              type="text"
              value={formData.offerName}
              onChange={(e) => setFormData({ ...formData, offerName: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="e.g., Weekend Special"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold mb-2 block">Discount Type *</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">
                Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder={formData.discountType === 'percentage' ? '20' : '300'}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">Apply to Activity</label>
            <select
              value={formData.activityId}
              onChange={(e) => setFormData({ ...formData, activityId: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">All Activities</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>{activity.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold mb-2 block">Valid From *</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <div>
              <label className="text-white font-semibold mb-2 block">Valid To *</label>
              <input
                type="date"
                value={formData.validTo}
                onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold mb-2 block">Minimum Bookings</label>
              <input
                type="number"
                value={formData.minBookings}
                onChange={(e) => setFormData({ ...formData, minBookings: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-white font-semibold mb-2 block">Maximum Usage</label>
              <input
                type="number"
                value={formData.maxUsage}
                onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Unlimited"
              />
            </div>
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Describe your offer..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-md transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-3 rounded-md transition-colors font-semibold"
            >
              {saving ? 'Saving...' : editingOffer ? 'Update Offer' : 'Create Offer'}
            </button>
          </div>
          {saveError && (
            <p className="text-red-400 text-sm text-center">{saveError}</p>
          )}
        </form>
      </div>
    </div>
  );
}