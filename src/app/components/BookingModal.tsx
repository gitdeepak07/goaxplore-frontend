import { X, Calendar, MapPin, Users, Clock, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: {
    id?: number;        // FIX: added id
    name: string;
    price: number;
    image: string;
  };
  currentUser: any;
  onOpenLogin: () => void;
  onProceedToPayment: (bookingData: any) => void;
}

export function BookingModal({
  isOpen,
  onClose,
  activity,
  currentUser,
  onOpenLogin,
  onProceedToPayment,
}: BookingModalProps) {
  const [selectedActivity, setSelectedActivity] = useState(activity?.name || '');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [participants, setParticipants] = useState('1');
  const [bookingSuccess, /*setBookingSuccess*/] = useState(false);

  const activities = [
    { name: 'Jet Skiing', price: 1500 },
    { name: 'Parasailing', price: 2000 },
    { name: 'Scuba Diving', price: 3500 },
    { name: 'Kayaking', price: 1200 },
    { name: 'Banana Boat Ride', price: 800 },
    { name: 'Windsurfing', price: 1800 },
    { name: 'White Water Rafting', price: 2500 },
  ];

  const locations = [
    'Baga Beach',
    'Calangute Beach',
    'Anjuna Beach',
    'Palolem Beach',
    'Candolim Beach',
    'Vagator Beach',
  ];

  const timeSlots = [
    '08:00 AM',
    '10:00 AM',
    '12:00 PM',
    '02:00 PM',
    '04:00 PM',
    '06:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      onOpenLogin();
      return;
    }

    const bookingData = {
      activity_id: activity?.id,
      location,
      date,
      time,
      participants: parseInt(participants),
    };

    onProceedToPayment(bookingData);
  };

  if (!isOpen) return null;

  const selectedActivityData = activities.find((a) => a.name === selectedActivity);
  const totalPrice = (activity?.price || selectedActivityData?.price || 0) * parseInt(participants || '1');

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center">
        <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Book Your Adventure</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {bookingSuccess ? (
              <div className="bg-green-900/30 border border-green-600 text-green-400 px-6 py-8 rounded-lg text-center">
                <div className="text-6xl mb-4">✓</div>
                <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                <p>Your adventure has been successfully booked. Check your email for confirmation details.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Activity Selection */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Select Activity *</label>
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  >
                    <option value="">Choose an activity</option>
                    {activities.map((act) => (
                      <option key={act.name} value={act.name}>
                        {act.name} - ₹{act.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    >
                      <option value="">Choose a beach</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-semibold mb-2 block">Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-2 block">Time Slot *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Number of Participants *</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={participants}
                      onChange={(e) => setParticipants(e.target.value)}
                      min="1"
                      max="10"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                </div>

                {/* Price Summary */}
                {selectedActivity && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Activity Price:</span>
                      <span className="text-white">₹{activity?.price || selectedActivityData?.price}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Participants:</span>
                      <span className="text-white">x {participants}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-lg">Total:</span>
                        <span className="text-red-600 font-bold text-2xl">₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-md transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    {currentUser ? 'Confirm Booking' : 'Login to Book'}
                  </button>
                </div>

                {!currentUser && (
                  <p className="text-yellow-400 text-sm text-center">
                    Please login to complete your booking
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}