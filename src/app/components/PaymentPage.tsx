import { ArrowLeft, ShieldCheck, CreditCard, Smartphone, Building } from "lucide-react";
import { useState } from "react";
import { formatMoney } from "../config/bookingFlow";

type PaymentMethod = "card" | "upi" | "netbanking";

interface PaymentPageProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    activity: any;
    provider: any;
    date: string;
    time: string;
    participants: number;
    totalPrice: number;
    booking_id?: any;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  } | null;
  onPaymentSuccess: (paymentMethod: PaymentMethod, paidAmount: number) => void;
}

export function PaymentPage({
  isOpen,
  onClose,
  bookingDetails,
  onPaymentSuccess,
}: PaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod] = useState<PaymentMethod>("card");

  if (!isOpen || !bookingDetails) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Step 1 — Create Cashfree order
      const orderRes = await fetch("http://localhost:5000/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingDetails.totalPrice,
          booking_id: (bookingDetails as any).booking_id,
          customer_name: (bookingDetails as any).customer_name || "GoaXplore User",
          customer_email: (bookingDetails as any).customer_email || "user@goaxplore.com",
          customer_phone: (bookingDetails as any).customer_phone || "9999999999",
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Could not initiate payment. Try again.");
        setIsProcessing(false);
        return;
      }

      // Step 2 — Open Cashfree popup
      const cashfree = await (window as any).Cashfree({ mode: "sandbox" });

      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal",
      }).then(async (result: any) => {
        if (result.error) {
          alert("Payment failed: " + result.error.message);
          setIsProcessing(false);
          return;
        }

        // Step 3 — Verify payment
        const verifyRes = await fetch("http://localhost:5000/api/cashfree/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderData.order_id,
            booking_id: (bookingDetails as any).booking_id,
            amount: bookingDetails.totalPrice,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          setIsProcessing(false);
          onPaymentSuccess(paymentMethod, bookingDetails.totalPrice);
        } else {
          alert("Payment verification failed. Contact support.");
          setIsProcessing(false);
        }
      });

    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#030712]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#030712]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Step 4 of 4
            </div>
            <h1 className="text-xl font-bold text-white">Complete Payment</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

        {/* Booking Summary Card */}
        <div className="mb-6 rounded-[28px] border border-white/10 bg-[#091321] p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Booking Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Activity</span>
              <span className="text-white font-medium">{bookingDetails.activity?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Provider</span>
              <span className="text-white">{bookingDetails.provider?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date</span>
              <span className="text-white">{bookingDetails.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time</span>
              <span className="text-white">{bookingDetails.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Guests</span>
              <span className="text-white">{bookingDetails.participants}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="text-white font-semibold text-base">Total Amount</span>
              <span className="text-white font-bold text-xl">{formatMoney(bookingDetails.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* What's Accepted */}
        <div className="mb-6 rounded-[28px] border border-white/10 bg-[#091321] p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Accepted Payment Methods</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: CreditCard, label: "Cards" },
              { icon: Smartphone, label: "UPI" },
              { icon: Building, label: "Net Banking" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                <item.icon size={22} className="text-cyan-300" />
                <span className="text-xs text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500 text-center">
            Powered by Cashfree — all methods available in the secure popup
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-4 py-5 text-lg font-bold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          <ShieldCheck size={20} />
          {isProcessing ? "Opening Payment..." : `Pay Securely ${formatMoney(bookingDetails.totalPrice)}`}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">
          Clicking Pay will open a secure Cashfree payment popup. Your payment is encrypted and safe.
        </p>
      </div>
    </div>
  );
}