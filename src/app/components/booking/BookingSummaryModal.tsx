import { useState } from "react";
import { CalendarDays, Clock3, CreditCard, MapPin, ShieldCheck, Users, X, ArrowLeft, Tag, CheckCircle } from "lucide-react";
import { formatDisplayDate, formatMoney } from "../../config/bookingFlow";

interface BookingSummaryModalProps {
  isOpen: boolean;
  activity: any;
  provider: any;
  participants: number;
  date: string;
  time: string;
  appliedOffer: any;
  publicOffers: any[];
  onApplyOffer: (offer: any) => void;
  onRemoveOffer: () => void;
  onClose: () => void;
  onCloseFlow: () => void;
  onContinue: () => void;
}

export function BookingSummaryModal({
  isOpen, activity, provider, participants, date, time,
  appliedOffer, publicOffers, onApplyOffer, onRemoveOffer,
  onClose, onCloseFlow, onContinue,
}: BookingSummaryModalProps) {
  const [showOffers, setShowOffers] = useState(false);

  if (!isOpen || !activity || !provider) return null;

  const baseTotal = Number(activity.price || 0) * participants;

  const calcDiscount = (offer: any) => {
    if (!offer) return 0;
    if (offer.discount_type === 'Percent' || offer.discount_type === 'percentage')
      return Math.round(baseTotal * offer.discount_value / 100);
    return Math.min(offer.discount_value, baseTotal);
  };

  const discount = calcDiscount(appliedOffer);
  const total = baseTotal - discount;

  // Filter offers relevant to this provider/activity
  const relevantOffers = publicOffers.filter(o =>
    o.provider_id === provider.provider_id || o.provider_id === provider.id
  );

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
                <button onClick={onClose} className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40" title="Back">
                  <ArrowLeft size={20} />
                </button>
                <button onClick={onCloseFlow} className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1726]">
              <img src={activity.image} alt={activity.name} className="h-64 w-full object-cover" />
              <div className="p-6">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">{activity.category}</div>
                <h3 className="mb-3 text-2xl font-bold text-white">{activity.name}</h3>
                <p className="text-sm leading-6 text-slate-400">{activity.description}</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Order Details */}
            <div className="mb-6 rounded-[28px] border border-white/10 bg-[#0d1726] p-6">
              <h3 className="mb-5 text-xl font-semibold text-white">Order details</h3>
              <div className="space-y-3 text-sm">
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
                  <strong className="text-white">{formatDisplayDate(date)}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-300">
                  <span className="flex items-center gap-2"><Clock3 size={16} className="text-cyan-300" />Time slot</span>
                  <strong className="text-white">{time}</strong>
                </div>
              </div>
            </div>

            {/* Offers Section */}
            <div className="mb-6 rounded-[28px] border border-white/10 bg-[#0d1726] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Tag size={18} className="text-cyan-300" /> Offers
                </h3>
                {relevantOffers.length > 0 && !appliedOffer && (
                  <button onClick={() => setShowOffers(!showOffers)} className="text-sm text-cyan-400 hover:text-cyan-300">
                    {showOffers ? 'Hide' : 'View offers'}
                  </button>
                )}
              </div>

              {appliedOffer ? (
                <div className="flex items-center justify-between rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3">
                  <div className="flex items-center gap-2 text-emerald-300 text-sm">
                    <CheckCircle size={16} />
                    <span className="font-semibold">{appliedOffer.offer_name}</span>
                    <span>— {appliedOffer.discount_type === 'Percent' || appliedOffer.discount_type === 'percentage' ? `${appliedOffer.discount_value}% OFF` : `₹${appliedOffer.discount_value} OFF`}</span>
                  </div>
                  <button onClick={onRemoveOffer} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              ) : relevantOffers.length === 0 ? (
                <p className="text-sm text-slate-500">No offers available for this provider.</p>
              ) : showOffers ? (
                <div className="space-y-2">
                  {relevantOffers.map((offer) => (
                    <div key={offer.offer_id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{offer.offer_name}</p>
                        <p className="text-xs text-slate-400">
                          {offer.discount_type === 'Percent' || offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                          {offer.valid_to && ` · Valid till ${new Date(offer.valid_to).toLocaleDateString('en-IN')}`}
                        </p>
                      </div>
                      <button onClick={() => { onApplyOffer(offer); setShowOffers(false); }} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 cursor-pointer hover:text-slate-300" onClick={() => setShowOffers(true)}>
                  {relevantOffers.length} offer{relevantOffers.length > 1 ? 's' : ''} available — tap to view
                </p>
              )}
            </div>

            {/* Price Breakdown */}
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
                  <span>Subtotal</span>
                  <strong>{formatMoney(baseTotal)}</strong>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Discount ({appliedOffer.offer_name})</span>
                    <strong>- {formatMoney(discount)}</strong>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Booking fee</span>
                  <strong>Rs. 0</strong>
                </div>
                <div className="border-t border-white/10 pt-4 text-base text-white">
                  <div className="flex items-center justify-between">
                    <span>Total amount</span>
                    <strong className={discount > 0 ? 'text-emerald-400' : ''}>{formatMoney(total)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <ShieldCheck size={16} />
                Booking confirmation note
              </div>
              The slot is held only after payment is completed.
            </div>

            <button onClick={onContinue} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-500">
              <CreditCard size={18} />
              Continue to payment · {formatMoney(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}