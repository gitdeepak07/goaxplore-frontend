import { useState, useEffect } from 'react';
import {
  User,
  LogOut,
  Calendar,
  Heart,
  MessageSquare,
  Bell,
  Settings,
  ChevronDown,
  Star,
  MapPin,
  Clock,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  X as XIcon,
  Edit,
  Trash2,
  // FileText,
  // Mail,
  // Phone,
  Lock
} from 'lucide-react';

import API from "../config/api";


interface UserDashboardProps {
  user: any;
  onLogout: () => void;
  onGoHome: () => void;
  initialTab?: string;
}

export function UserDashboard({ user, onLogout, onGoHome, initialTab }: UserDashboardProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedTab, setSelectedTab] = useState(initialTab || 'profile');
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState(user);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [reviewingBooking, setReviewingBooking] = useState<any>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user.full_name || user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || ''
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  // Support form state
  const [supportForm, setSupportForm] = useState({
    subject: '',
    category: 'general',
    bookingId: '',
    description: ''
  });

  // Load data from localStorage and Server
useEffect(() => {
    const userId = user?.user_id || user?.id;

    // Fetch bookings from DB
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API}/api/bookings/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          const raw = data.bookings || data || [];
          const normalized = raw.map((b: any) => ({
            ...b,
            id: String(b.booking_id),
            bookingId: b.bookingId || b.booking_code || `GX${b.booking_id}`,
            activityName: b.activityName || b.title || 'Activity',
            provider: b.provider || b.business_name || '',
            location: b.location || b.location_name || 'Goa',
            date: b.date || b.slot_date || '',
            time: b.time || b.start_time || '',
            participants: b.participants || b.participants_count || 1,
            totalAmount: Number(b.totalAmount || b.total_amount || 0),
            pricePerPerson: Number(b.pricePerPerson || b.price_per_person || 0),
            paymentStatus: (b.paymentStatus || b.payment_status || 'paid').toLowerCase(),
            paymentMethod: b.paymentMethod || b.payment_method || 'online',
            status: (b.status || b.booking_status || 'pending').toLowerCase(),
            createdAt: b.createdAt || b.created_at || new Date().toISOString(),
            reviewed: b.reviewed || 0,
          }));
          setBookings(normalized);
        }
      } catch (err) {
        console.warn("Could not fetch bookings");
        setBookings([]);
      }
    };

    // Fetch wishlist from DB
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${API}/api/wishlist/${userId}`);
        if (response.ok) {
          const data = await response.json();
          const raw = Array.isArray(data) ? data : (data.wishlist || []);
          setWishlist(raw.map((item: any) => ({
            ...item,
            id: String(item.wishlist_id || item.id),
            wishlist_id: item.wishlist_id,
            activityName: item.title || item.activityName || 'Activity',
            price: Number(item.price_per_person || item.price || 0),
            location: item.location_name || item.location || 'Goa',
            rating: item.average_rating || item.rating || 0,
            image: item.image_url || item.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
          })));
        }
      } catch (err) {
        setWishlist([]);
      }
    };

    // Fetch reviews from DB
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API}/api/reviews/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          const raw = Array.isArray(data) ? data : [];
          setReviews(raw.map((r: any) => ({
            ...r,
            id: String(r.review_id || r.id || Date.now()),
            activityName: r.activity_name || r.title || r.activityName || 'Activity',
            provider: r.provider_name || r.business_name || r.provider || '',
            rating: r.rating || 5,
            comment: r.comment || r.review_text || '',
            createdAt: r.created_at || r.createdAt || new Date().toISOString(),
          })));
        }
      } catch (err) {
        setReviews([]);
      }
    };

    // Fetch notifications from DB
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API}/api/notifications/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data || []);
        }
      } catch (err) {
        setNotifications([]);
      }
    };

    fetchBookings();
    // Fetch support tickets from DB
    const fetchSupport = async () => {
      try {
        const response = await fetch(`${API}/api/support/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setSupportTickets(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setSupportTickets([]);
      }
    };

    fetchBookings();
    fetchWishlist();
    fetchReviews();
    fetchNotifications();
    fetchSupport();

    // Poll notifications every 20 seconds for real-time updates
    const notifInterval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(notifInterval);
  }, [user?.user_id || user?.id]);

  const handleUpdateProfile = async () => {
    const userId = user?.user_id || user?.id;
    try {
      const res = await fetch(`${API}/api/auth/update-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          full_name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          address: profileForm.address
        })
      });
      if (res.ok) {
        const updatedProfile = { ...userProfile, name: profileForm.name, full_name: profileForm.name, email: profileForm.email, phone: profileForm.phone, address: profileForm.address };
        setUserProfile(updatedProfile);
        localStorage.setItem('goaxplore_current_user', JSON.stringify(updatedProfile));
      }
    } catch (err) {
      // Save locally if server unreachable
      const updatedProfile = { ...userProfile, ...profileForm };
      setUserProfile(updatedProfile);
      localStorage.setItem('goaxplore_current_user', JSON.stringify(updatedProfile));
    }
    setIsEditingProfile(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const booking = bookings.find(b => b.id === bookingId || b.booking_id === bookingId);
      const realId = booking?.booking_id || bookingId;
      const res = await fetch(`${API}/api/bookings/${realId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        alert('Could not cancel booking. Please try again.');
        return;
      }
    } catch (err) {
      alert('Server unreachable.');
      return;
    }
    setBookings(prev => prev.map(b =>
      (b.id === bookingId || b.booking_id === bookingId) ? { ...b, status: 'cancelled' } : b
    ));
  };

  const handlePayNow = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    const realId = booking?.booking_id || bookingId;
    try {
      await fetch(`${API}/api/bookings/${realId}/pay`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.warn('Pay API error');
    }
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, paymentStatus: 'paid', paymentMethod: 'online' } : b
    ));
  };

  const handleSubmitReview = async () => {
    if (!reviewingBooking) return;

    try {
      const res = await fetch(`${API}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: reviewingBooking.booking_id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to submit review");
        return;
      }

      // Update local bookings list to mark as reviewed
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === reviewingBooking.booking_id
            ? { ...b, reviewed: 1 }
            : b
        )
      );

      // Add to local reviews list for immediate display
      setReviews((prev) => [
        {
          id: Date.now().toString(),
          bookingId: reviewingBooking.bookingId,
          activityName: reviewingBooking.activityName,
          provider: reviewingBooking.provider,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      setIsReviewModalOpen(false);
      setReviewingBooking(null);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      alert("Could not submit review. Please try again.");
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      const item = wishlist.find(i => i.id === itemId || i.wishlist_id === itemId);
      const realId = item?.wishlist_id || itemId;
      await fetch(`${API}/api/wishlist/${realId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Wishlist remove error');
    }
    setWishlist(prev => prev.filter(i => i.id !== itemId && i.wishlist_id !== itemId));
  };

  const handleSubmitSupport = async () => {
    const userId = user?.user_id || user?.id;
    if (!supportForm.subject || !supportForm.description) return;
    try {
      const res = await fetch('${API}/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          subject: supportForm.subject,
          category: supportForm.category,
          description: supportForm.description,
          booking_id: supportForm.bookingId || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const newTicket = {
          ticket_id: data.ticket_id,
          id: String(data.ticket_id),
          subject: supportForm.subject,
          category: supportForm.category,
          description: supportForm.description,
          status: 'open',
          created_at: new Date().toISOString(),
        };
        setSupportTickets(prev => [newTicket, ...prev]);
      }
    } catch (err) {
      console.warn('Support API error');
    }
    setIsSupportModalOpen(false);
    setSupportForm({ subject: '', category: 'general', bookingId: '', description: '' });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'text-yellow-400 bg-yellow-900/20',
      'confirmed': 'text-green-400 bg-green-900/20',
      'rejected': 'text-red-400 bg-red-900/20',
      'cancelled': 'text-gray-400 bg-gray-900/20',
      'completed': 'text-blue-400 bg-blue-900/20'
    };
    return colors[status] || 'text-gray-400 bg-gray-900/20';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={16} />;
      case 'rejected': case 'cancelled': return <XCircle size={16} />;
      case 'pending': return <AlertCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'paid': 'text-green-400',
      'unpaid': 'text-red-400',
      'pending': 'text-yellow-400',
      'failed': 'text-red-600',
      'refunded': 'text-blue-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const unreadNotificationsCount = notifications.filter(n => !n.is_read && !n.read).length;

  const markNotificationRead = async (notifId: string) => {
    try {
      await fetch(`${API}/api/notifications/read/${notifId}`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n =>
        (String(n.notification_id) === String(notifId) || String(n.id) === String(notifId))
          ? { ...n, is_read: true, read: true } : n
      ));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1
                onClick={onGoHome}
                className="text-2xl font-bold cursor-pointer hover:opacity-80 transition"
              >
                Goa<span className="text-red-600">Xplore</span>
              </h1>
              <span className="text-gray-400 hidden md:inline">User Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setSelectedTab('notifications')}
                  className="p-2 hover:bg-gray-800 rounded-lg relative"
                >
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg"
                >
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <span className="hidden md:inline">{userProfile.name}</span>
                  <ChevronDown size={16} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
                    <button
                      onClick={() => {
                        setSelectedTab('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-2">
              <button
                onClick={() => setSelectedTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${selectedTab === 'profile' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                  }`}
              >
                <User size={20} />
                <span>Profile</span>
              </button>

              <button
                onClick={() => setSelectedTab('bookings')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${selectedTab === 'bookings' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                  }`}
              >
                <Calendar size={20} />
                <span>My Bookings</span>
              </button>

              <button
                onClick={() => setSelectedTab('wishlist')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${selectedTab === 'wishlist' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                  }`}
              >
                <Heart size={20} />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="ml-auto bg-gray-800 px-2 py-1 rounded-full text-xs">{wishlist.length}</span>
                )}
              </button>

              <button
                onClick={() => setSelectedTab('reviews')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${selectedTab === 'reviews' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                  }`}
              >
                <Star size={20} />
                <span>My Reviews</span>
              </button>

              <button
                onClick={() => setSelectedTab('support')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${selectedTab === 'support' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                  }`}
              >
                <MessageSquare size={20} />
                <span>Support</span>
                {supportTickets.filter(t => t.status === 'open').length > 0 && (
                  <span className="ml-auto bg-red-600 px-2 py-1 rounded-full text-xs">
                    {supportTickets.filter(t => t.status === 'open').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSelectedTab('notifications')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${selectedTab === 'notifications' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                  }`}
              >
                <Bell size={20} />
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span className="ml-auto bg-red-600 px-2 py-1 rounded-full text-xs">{unreadNotificationsCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            {/* Profile Tab */}
            {selectedTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    {!isEditingProfile ? (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateProfile}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingProfile(false);
                            setProfileForm({
                              name: userProfile.full_name || userProfile.name || '',
                              email: userProfile.email,
                              phone: userProfile.phone || '',
                              address: userProfile.address || ''
                            });
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                        />
                      ) : (
                        <p className="text-white">{userProfile.full_name || userProfile.name || '—'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email</label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                        />
                      ) : (
                        <p className="text-white">{userProfile.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Phone</label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <p className="text-white">{userProfile.phone || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Address</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                          placeholder="Enter address"
                        />
                      ) : (
                        <p className="text-white">{userProfile.address || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Change Password Section */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Security</h3>
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Lock size={18} />
                    <span>Change Password</span>
                  </button>
                </div>

                {/* Account Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Bookings</p>
                        <p className="text-2xl font-bold text-white mt-1">{bookings.length}</p>
                      </div>
                      <Calendar size={32} className="text-red-600" />
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Wishlist Items</p>
                        <p className="text-2xl font-bold text-white mt-1">{wishlist.length}</p>
                      </div>
                      <Heart size={32} className="text-red-600" />
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Reviews Given</p>
                        <p className="text-2xl font-bold text-white mt-1">{reviews.length}</p>
                      </div>
                      <Star size={32} className="text-red-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {selectedTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Bookings</h2>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                    <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{booking.activityName}</h3>
                            <p className="text-gray-400">Booking ID: {booking.bookingId}</p>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 md:mt-0">
                            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="capitalize">{booking.status}</span>
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-400">
                            <MapPin size={16} />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Calendar size={16} />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Clock size={16} />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Users size={16} />
                            <span>{booking.participants} {booking.participants > 1 ? 'Participants' : 'Participant'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard size={16} className="text-gray-400" />
                            <span className={getPaymentStatusColor(booking.paymentStatus || 'paid')}>
                              {(booking.paymentStatus || 'paid').charAt(0).toUpperCase() + (booking.paymentStatus || 'paid').slice(1)}
                            </span>
                          </div>
                          <div className="text-gray-400">
                            <span className="text-white font-bold">₹{booking.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        {booking.status === 'confirmed' && booking.checkInCode && (
                          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                            <p className="text-gray-400 text-sm mb-1">Check-in Code</p>
                            <p className="text-white font-mono text-lg font-bold">{booking.checkInCode}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                            <span>View Details</span>
                          </button>

                          {booking.paymentStatus === 'unpaid' && booking.status === 'confirmed' && (
                            <button
                              onClick={() => handlePayNow(booking.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            >
                              <CreditCard size={16} />
                              <span>Pay Now</span>
                            </button>
                          )}

                          {(booking.status === 'Pending' || booking.status === 'Confirmed' || booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to cancel this booking?')) {
                                  handleCancelBooking(booking.id);
                                }
                              }}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                              <XCircle size={16} />
                              <span>Cancel Booking</span>
                            </button>
                          )}

                          {(booking.status === 'Confirmed' || booking.status === 'confirmed' || booking.status === 'Completed' || booking.status === 'completed') && !booking.reviewed && (
                            <button
                              onClick={() => {
                                setReviewingBooking(booking);
                                setIsReviewModalOpen(true);
                              }}
                              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                            >
                              <Star size={16} />
                              <span>Write Review</span>
                            </button>
                          )}

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {selectedTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Wishlist</h2>
                </div>

                {wishlist.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                    <Heart size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">Your wishlist is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                        <img src={item.image} alt={item.activityName} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-white mb-2">{item.activityName}</h3>
                          <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                            <MapPin size={14} />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-white font-bold">₹{item.price.toLocaleString()}</span>
                            <div className="flex items-center space-x-1">
                              <Star size={14} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-gray-400 text-sm">{item.rating}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                              Book Now
                            </button>
                            <button
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Reviews</h2>
                </div>

                {reviews.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                    <Star size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{review.activityName}</h3>
                            <p className="text-gray-400 text-sm">{review.provider}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 mb-2">{review.comment}</p>
                        <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Support Tab */}
            {selectedTab === 'support' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Support Tickets</h2>
                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Create Ticket
                  </button>
                </div>

                {supportTickets.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                    <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No support tickets</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {supportTickets.map((ticket) => {
                      const ticketId = ticket.ticket_id || ticket.id;
                      const ticketStatus = ticket.status || 'open';
                      return (
                      <div key={ticketId} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{ticket.subject}</h3>
                            <p className="text-gray-400 text-sm capitalize">Category: {ticket.category}</p>
                            {(ticket.booking_id || ticket.bookingId) && (
                              <p className="text-gray-400 text-sm">Booking ID: {ticket.booking_id || ticket.bookingId}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            ticketStatus === 'open' ? 'bg-yellow-900/20 text-yellow-400' :
                            ticketStatus === 'replied' ? 'bg-blue-900/20 text-blue-400' :
                            'bg-green-900/20 text-green-400'
                          }`}>
                            {ticketStatus.charAt(0).toUpperCase() + ticketStatus.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">{ticket.description}</p>
                        {ticket.reply && (
                          <div className="mt-3 bg-gray-800 border border-gray-700 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Admin Reply</p>
                            <p className="text-gray-300 text-sm">{ticket.reply}</p>
                          </div>
                        )}
                        <p className="text-gray-500 text-sm mt-3">{new Date(ticket.created_at || ticket.createdAt).toLocaleDateString()}</p>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {selectedTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Notifications</h2>
                </div>

                {notifications.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                    <Bell size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => {
                      const isRead = notification.is_read || notification.read;
                      const notifId = notification.notification_id || notification.id;
                      return (
                        <div
                          key={notifId}
                          onClick={() => !isRead && markNotificationRead(String(notifId))}
                          className={`bg-gray-900 border rounded-lg p-6 cursor-pointer transition-colors ${isRead ? 'border-gray-800' : 'border-red-600 hover:border-red-400'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-1">{notification.title}</h3>
                              <p className="text-gray-300 mb-2">{notification.message}</p>
                              <p className="text-gray-500 text-sm">
                                {new Date(notification.created_at || notification.timestamp || Date.now()).toLocaleString()}
                              </p>
                            </div>
                            {!isRead && (
                              <div className="w-2 h-2 bg-red-600 rounded-full ml-4 mt-2 flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && reviewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Write a Review</h3>
              <button onClick={() => setIsReviewModalOpen(false)}>
                <XIcon size={24} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold mb-1">{reviewingBooking.activityName}</h4>
              <p className="text-gray-400">{reviewingBooking.provider}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="transition-colors"
                    >
                      <Star
                        size={32}
                        className={star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white min-h-32"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Create Support Ticket</h3>
              <button onClick={() => setIsSupportModalOpen(false)}>
                <XIcon size={24} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={supportForm.category}
                  onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                >
                  <option value="general">General Query</option>
                  <option value="booking">Booking Issue</option>
                  <option value="payment">Payment Issue</option>
                  <option value="refund">Refund Request</option>
                  <option value="complaint">Complaint</option>
                  <option value="technical">Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Booking ID (Optional)</label>
                <input
                  type="text"
                  value={supportForm.bookingId}
                  onChange={(e) => setSupportForm({ ...supportForm, bookingId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  placeholder="Enter booking ID if related"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={supportForm.description}
                  onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white min-h-32"
                  placeholder="Provide detailed information about your issue..."
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSubmitSupport}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Submit Ticket
                </button>
                <button
                  onClick={() => setIsSupportModalOpen(false)}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)}>
                <XIcon size={24} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Booking ID</p>
                  <p className="text-white font-bold">{selectedBooking.bookingId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedBooking.status)}`}>
                    {getStatusIcon(selectedBooking.status)}
                    <span className="capitalize">{selectedBooking.status}</span>
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Activity</p>
                  <p className="text-white">{selectedBooking.activityName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Provider</p>
                  <p className="text-white">{selectedBooking.provider}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white">{selectedBooking.location}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date & Time</p>
                  <p className="text-white">{new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.time}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Participants</p>
                  <p className="text-white">{selectedBooking.participants}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Price per Person</p>
                  <p className="text-white">₹{selectedBooking.pricePerPerson.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Payment Status</p>
                  <p className={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                    {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Payment Method</p>
                  <p className="text-white capitalize">{selectedBooking.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Amount</p>
                  <p className="text-white font-bold text-lg">₹{selectedBooking.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Booked On</p>
                  <p className="text-white">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedBooking.checkInCode && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Check-in Code</p>
                  <p className="text-white font-mono text-2xl font-bold text-center">{selectedBooking.checkInCode}</p>
                  <p className="text-gray-400 text-xs text-center mt-2">Show this code to the provider at check-in</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Change Password</h3>
              <button onClick={() => setShowForgotPassword(false)}>
                <XIcon size={24} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  placeholder="Confirm new password"
                />
              </div>
              {passwordMsg && (
                <p className={`text-sm text-center ${passwordMsg.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordMsg}
                </p>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={async () => {
                    setPasswordMsg('');
                    if (passwordForm.newPass !== passwordForm.confirm) {
                      setPasswordMsg("New passwords don't match");
                      return;
                    }
                    if (passwordForm.newPass.length < 6) {
                      setPasswordMsg("Password must be at least 6 characters");
                      return;
                    }
                    try {
                      const res = await fetch(`${API}/api/auth/change-password/${user.user_id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ current_password: passwordForm.current, new_password: passwordForm.newPass }),
                      });
                      const data = await res.json();
                      setPasswordMsg(data.message);
                      if (data.success) {
                        setTimeout(() => {
                          setShowForgotPassword(false);
                          setPasswordMsg('');
                          setPasswordForm({ current: '', newPass: '', confirm: '' });
                        }, 1500);
                      }
                    } catch {
                      setPasswordMsg("Server error. Please try again.");
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Change Password
                </button>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}