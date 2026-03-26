import { CheckCircle2, Download, Home, Ticket, X } from "lucide-react";

import { BookingFlowSelection, buildReceiptHtml, formatDisplayDate, formatMoney } from "../../config/bookingFlow";

interface BookingSuccessModalProps {
  isOpen: boolean;
  booking: BookingFlowSelection | null;
  customerName: string;
  customerEmail: string;
  onClose: () => void;
}

export function BookingSuccessModal({
  isOpen,
  booking,
  customerName,
  customerEmail,
  onClose,
}: BookingSuccessModalProps) {
  if (!isOpen || !booking) {
    return null;
  }

  const handleDownloadReceipt = () => {
    const receiptWindow = window.open("", "_blank", "width=900,height=700");

    if (!receiptWindow) {
      window.print();
      return;
    }

    receiptWindow.document.open();
    receiptWindow.document.write(
      buildReceiptHtml(booking, customerName, customerEmail),
    );
    receiptWindow.document.close();
    receiptWindow.focus();
    setTimeout(() => {
      receiptWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#07111f] p-6 text-center shadow-2xl md:p-8">
        <div className="mb-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
            <CheckCircle2 size={64} />
          </div>
        </div>

        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
          Booking confirmed
        </div>
        <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
          Your adventure is locked in
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-slate-400">
          Payment is complete and the selected slot has been recorded. Use the receipt download button below to save a printable confirmation with your full booking details.
        </p>

        <div className="mb-8 grid gap-4 rounded-[28px] border border-white/10 bg-[#0d1726] p-6 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">
              Activity
            </div>
            <div className="font-semibold text-white">{booking.activity?.name}</div>
            <div className="mt-2 text-sm text-slate-400">{booking.provider?.name}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">
              Booking ID
            </div>
            <div className="font-semibold text-white">{booking.bookingCode}</div>
            <div className="mt-2 text-sm text-slate-400">
              {formatDisplayDate(booking.date)} at {booking.time}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">
              Guests
            </div>
            <div className="font-semibold text-white">{booking.participants}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">
              Total paid
            </div>
            <div className="font-semibold text-white">
              {formatMoney(booking.totalPrice)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleDownloadReceipt}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-500"
          >
            <Download size={18} />
            Download receipt
          </button>
          <button
            onClick={onClose}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-semibold text-white transition-colors hover:bg-black/40"
          >
            <Home size={18} />
            Back to home
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Ticket size={14} />
          Save the printed PDF if you want an offline copy of the receipt.
        </div>
      </div>
    </div>
  );
}
