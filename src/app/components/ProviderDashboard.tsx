import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  // User,
  LogOut,
  Plus,
  Calendar,
  Clock,
  IndianRupee,
  Edit,
  Trash2,
  // Star,
  TrendingUp,
  Package,
  ChevronDown,
  Settings,
  CheckCircle,
  // XCircle,
  AlertCircle,
  Check,
  X as XIcon,
  // Eye,
  Tag,
  BarChart3,
  // Users,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { AddActivityModal } from "./provider/AddActivityModal";
import { SlotManagementModal } from "./provider/SlotManagementModal";
import { CreateOfferModal } from "./provider/CreateOfferModal";

interface ProviderDashboardProps {
  provider: any;
  onLogout: () => void;
  onBackToHome?: () => void;
}

export function ProviderDashboard({ provider, onLogout, onBackToHome }: ProviderDashboardProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isSlotManagementOpen, setIsSlotManagementOpen] = useState(false);
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [providerProfile, setProviderProfile] = useState({
    ...provider,
    name: provider?.business_name || provider?.name || '',
    email: provider?.email || '',
    phone: provider?.phone || '',
    location: provider?.location || provider?.address || '',
    description: provider?.description || '',
    verification_status: provider?.verification_status || 'Pending',
  });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [analyticsFilter, setAnalyticsFilter] = useState<'7d'|'1m'|'3m'|'6m'|'all'>('6m');

  // Load data from localStorage
  const providerId = provider?.provider_id ?? provider?.id

  useEffect(() => {
    // Load activities from API
    if (providerId) {
      fetch(`http://localhost:5000/api/providers/${providerId}/activities`)
        .then(r => r.json())
        .then(data => {
          const arr = Array.isArray(data) ? data : []
          setActivities(arr.map((a: any) => ({
            ...a,
            id: a.activity_id,
            name: a.title,
            price: a.price_per_person,
            maxParticipants: a.max_participants,
            status: (a.status || 'Active').toLowerCase(),
            image: a.image_url || a.image || `https://images.unsplash.com/photo-1602739737584-006b54cabbb3?w=600&q=80`,
          })))
        })
        .catch(() => {
          const stored = localStorage.getItem(`provider_${providerId}_activities`)
          if (stored) setActivities(JSON.parse(stored))
        })

      // Load bookings from API
      fetch(`http://localhost:5000/api/bookings/provider/${providerId}`)
        .then(r => r.json())
        .then(data => {
          const arr = Array.isArray(data) ? data : []
          setBookings(arr.map((b: any) => ({
            ...b,
            id: String(b.booking_id),
            bookingId: b.booking_code || `GX${b.booking_id}`,
            customer: b.full_name || 'Customer',
            service: b.title || 'Activity',
            date: b.slot_date ? new Date(b.slot_date).toISOString().slice(0, 10) : '',
            time: b.start_time || '',
            participants: b.participants_count || 1,
            amount: Number(b.total_amount) || 0,
            status: (b.booking_status || 'pending').toLowerCase(),
            paymentStatus: (b.payment_status || 'Paid').toLowerCase(),
            createdAt: b.created_at || new Date().toISOString(),
          })))
        })
        .catch(() => {
          const stored = localStorage.getItem(`provider_${providerId}_bookings`)
          if (stored) setBookings(JSON.parse(stored))
        })
      // Load offers from API
      fetch(`http://localhost:5000/api/offers/provider/${providerId}`)
        .then(r => r.json())
        .then(data => {
          const arr = Array.isArray(data) ? data : []
          setOffers(arr.map((o: any) => ({
            ...o,
            id: String(o.offer_id || o.id),
            offerName: o.offer_name || o.offerName || '',
            discountType: o.discount_type || o.discountType || 'percentage',
            discountValue: o.discount_value || o.discountValue || 0,
            validFrom: o.valid_from || o.validFrom || '',
            validTo: o.valid_to || o.validTo || '',
            activityId: String(o.activity_id || o.activityId || ''),
            maxUsage: o.max_usage || o.maxUsage || null,
            usedCount: o.used_count || o.usedCount || 0,
            description: o.description || '',
            status: o.status || 'active',
          })))
        })
        .catch(() => {
          const stored = localStorage.getItem(`provider_${providerId}_offers`)
          if (stored) setOffers(JSON.parse(stored))
        })

      // Load provider notifications from API
      fetch(`http://localhost:5000/api/notifications/provider/${providerId}`)
        .then(r => r.json())
        .then(data => setNotifications(Array.isArray(data) ? data : []))
        .catch(() => setNotifications([]))

      // Fetch fresh provider profile (including verification_status)
      fetch(`http://localhost:5000/api/providers/${providerId}/profile`)
        .then(r => r.json())
        .then(data => {
          if (data && !data.error) {
            setProviderProfile({
              ...data,
              name: data.business_name || data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              location: data.location || data.address || '',
              description: data.description || '',
              verification_status: data.verification_status || 'Pending',
            });
          }
        })
        .catch(() => {})

      // Poll notifications every 20s
      const fetchProviderNotifs = () => {
        fetch(`http://localhost:5000/api/notifications/provider/${providerId}`)
          .then(r => r.json())
          .then(data => setNotifications(Array.isArray(data) ? data : []))
          .catch(() => {})
      }
      // Poll bookings every 30s for new pending requests
      const fetchProviderBookings = () => {
        fetch(`http://localhost:5000/api/bookings/provider/${providerId}`)
          .then(r => r.json())
          .then(data => {
            const arr = Array.isArray(data) ? data : []
            setBookings(arr.map((b: any) => ({
              ...b,
              id: String(b.booking_id),
              bookingId: b.booking_code || `GX${b.booking_id}`,
              customer: b.full_name || 'Customer',
              service: b.title || 'Activity',
              date: b.slot_date ? new Date(b.slot_date).toISOString().slice(0, 10) : '',
              time: b.start_time || '',
              participants: b.participants_count || 1,
              amount: Number(b.total_amount) || 0,
              status: (b.booking_status || 'pending').toLowerCase(),
              paymentStatus: (b.payment_status || 'Paid').toLowerCase(),
              createdAt: b.created_at || new Date().toISOString(),
            })))
          })
          .catch(() => {})
      }
      const notifInterval = setInterval(fetchProviderNotifs, 20000)
      const bookingInterval = setInterval(fetchProviderBookings, 30000)
      return () => { clearInterval(notifInterval); clearInterval(bookingInterval) }
    }
  }, [providerId]);

  // Save activities to localStorage
  const saveActivities = (newActivities: any[]) => {
    setActivities(newActivities);
    localStorage.setItem(`provider_${providerId}_activities`, JSON.stringify(newActivities));
  };

  // Save bookings to localStorage
  const saveBookings = (newBookings: any[]) => {
    setBookings(newBookings);
    localStorage.setItem(`provider_${providerId}_bookings`, JSON.stringify(newBookings));
  };

  // Save offers to localStorage
  const saveOffers = (newOffers: any[]) => {
    setOffers(newOffers);
    localStorage.setItem(`provider_${providerId}_offers`, JSON.stringify(newOffers));
  };

  const handleSaveActivity = async (activity: any) => {
    if (editingActivity) {
      const realId = activity.activity_id || activity.id
      try {
        await fetch(`http://localhost:5000/api/activities/${realId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: activity.name || activity.title,
            description: activity.description,
            price_per_person: activity.price || activity.price_per_person,
            max_participants: activity.maxParticipants || activity.max_participants,
            duration_minutes: activity.duration || activity.duration_minutes,
            image_url: activity.image_url || activity.image || '',
            category_id: activity.category_id || null,
            location_id: activity.location_id || null,
          })
        })
      } catch (err) { console.warn('Update activity error:', err) }
      saveActivities(activities.map(a => (a.id === activity.id || a.activity_id === realId) ? { ...a, ...activity } : a))
    } else {
      saveActivities([...activities, activity])
    }
    setEditingActivity(null)
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity? This cannot be undone.')) return;

    // Find real activity_id from DB
    const activity = activities.find(a => a.id === activityId || a.activity_id === activityId);
    const realId = activity?.activity_id || activityId;

    try {
      const res = await fetch(`http://localhost:5000/api/activities/${realId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Could not delete activity.");
        return;
      }

      // Remove from local state immediately
      saveActivities(activities.filter(a =>
        a.id !== activityId && a.activity_id !== realId
      ));

    } catch (err) {
      alert("Server error. Could not delete activity.");
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId)
    const realId = booking?.booking_id ?? bookingId
    try {
      await fetch(`http://localhost:5000/api/bookings/${realId}/approve`, { method: "PATCH" })
    } catch (err) { console.warn("Approve API error:", err) }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b))
  };

  const handleRejectBooking = async (bookingId: string) => {
    const reason = prompt('Enter reason for rejection (will be sent to user):');
    if (reason === null) return; // user cancelled prompt
    const booking = bookings.find(b => b.id === bookingId)
    const realId = booking?.booking_id ?? bookingId
    try {
      await fetch(`http://localhost:5000/api/bookings/${realId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || 'Provider declined' })
      })
    } catch (err) { console.warn("Reject API error:", err) }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'rejected' } : b))
  };

  const handleCompleteBooking = async (bookingId: string) => {
  const booking = bookings.find(b => b.id === bookingId);
  const realId = booking?.booking_id ?? bookingId;
  try {
    await fetch(`http://localhost:5000/api/bookings/${realId}/complete`, { method: 'PATCH' });
  } catch (err) { console.warn('Complete API error:', err); }
  setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'completed' } : b));
};

  const handleUpdatePaymentStatus = (bookingId: string, status: string) => {
    saveBookings(bookings.map(b =>
      b.id === bookingId ? { ...b, paymentStatus: status } : b
    ));
  };

  const handleSaveOffer = async (offer: any) => {
    if (editingOffer) {
      const realId = offer.offer_id || offer.id
      try {
        await fetch(`http://localhost:5000/api/offers/${realId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(offer)
        })
      } catch (err) { console.warn('Update offer error') }
      saveOffers(offers.map(o => (o.id === offer.id || o.offer_id === realId) ? { ...o, ...offer } : o))
    } else {
      // createOffer API call is handled inside CreateOfferModal — just refresh
      try {
        const res = await fetch(`http://localhost:5000/api/offers/provider/${providerId}`)
        const data = await res.json()
        const arr = Array.isArray(data) ? data : []
        setOffers(arr.map((o: any) => ({
          ...o,
          id: String(o.offer_id || o.id),
          offerName: o.offer_name || o.offerName || '',
          discountType: o.discount_type || o.discountType || 'percentage',
          discountValue: o.discount_value || o.discountValue || 0,
          validFrom: o.valid_from || o.validFrom || '',
          validTo: o.valid_to || o.validTo || '',
          activityId: String(o.activity_id || o.activityId || ''),
          maxUsage: o.max_usage || o.maxUsage || null,
          usedCount: o.used_count || o.usedCount || 0,
          description: o.description || '',
          status: o.status || 'active',
        })))
      } catch { saveOffers([...offers, offer]) }
    }
    setEditingOffer(null)
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return
    const offer = offers.find(o => o.id === offerId || o.offer_id === offerId)
    const realId = offer?.offer_id || offerId
    try {
      await fetch(`http://localhost:5000/api/offers/${realId}`, { method: 'DELETE' })
    } catch (err) { console.warn('Delete offer error') }
    saveOffers(offers.filter(o => o.id !== offerId && o.offer_id !== realId))
  };

  // Analytics calculations
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
  const totalEarnings = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  // Monthly summary
  const currentMonth = new Date().getMonth();
  const monthlyBookings = bookings.filter(b => {
    const bookingDate = new Date(b.createdAt);
    return bookingDate.getMonth() === currentMonth;
  });
  const monthlyEarnings = monthlyBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  // Most booked activity
  const activityBookingCounts: Record<string, number> = {};
  bookings.forEach(b => {
    activityBookingCounts[b.service] = (activityBookingCounts[b.service] || 0) + 1;
  });
  const mostBookedActivity = Object.entries(activityBookingCounts).sort(([, a], [, b]) => b - a)[0];


  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (selectedTab !== 'analytics' || !chartRef.current) return;
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const months: string[] = [];
    const counts: number[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(d.toLocaleString('default', { month: 'short' }));
      counts.push(bookings.filter(b => {
        const bd = new Date(b.createdAt);
        return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear();
      }).length);
    }
    const max = Math.max(...counts, 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barW = (canvas.width / months.length) * 0.5;
    months.forEach((month, i) => {
      const barH = (counts[i] / max) * (canvas.height - 40);
      const x = i * (canvas.width / months.length) + barW * 0.5;
      const y = canvas.height - 30 - barH;
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x, y, barW, barH);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(month, x + barW / 2, canvas.height - 8);
      ctx.fillStyle = '#ffffff';
      if (counts[i] > 0) ctx.fillText(String(counts[i]), x + barW / 2, y - 5);
    });
  }, [selectedTab, bookings]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Modals */}
      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => { setIsAddActivityOpen(false); setEditingActivity(null); }}
        onSave={handleSaveActivity}
        editingActivity={editingActivity}
        providerId={provider?.provider_id ?? provider?.id}  // ADD THIS
      />
      <SlotManagementModal
        isOpen={isSlotManagementOpen}
        onClose={() => {
          setIsSlotManagementOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
        onSaveSlots={(slots) => {
          console.log('Saved slots:', slots);
          // In a real app, save to database
        }}
      />

      <CreateOfferModal
        isOpen={isCreateOfferOpen}
        onClose={() => {
          setIsCreateOfferOpen(false);
          setEditingOffer(null);
        }}
        activities={activities}
        onSaveOffer={handleSaveOffer}
        editingOffer={editingOffer}
        providerId={provider?.provider_id ?? provider?.id}
      />

      {/* Top Navigation Bar */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={onBackToHome}
                className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40 mr-2"
                title="Back to Home"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center hover:opacity-80 transition-opacity"
                title="Return to Homepage"
              >
                <h1 className="text-2xl font-bold text-red-600">GoaXplore</h1>
              </button>
              <span className="ml-3 text-gray-400 text-sm">Provider Dashboard</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Bell size={24} />
                  {notifications.filter((n: any) => !n.is_read).length > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                      {notifications.filter((n: any) => !n.is_read).length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-white font-semibold">Notifications</h3>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        No notifications yet
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-700">
                        {notifications.slice(0, 5).map((notification: any) => (
                          <div
                            key={notification.notification_id}
                            className={`p-4 hover:bg-gray-700/50 transition-colors ${!notification.is_read ? 'bg-blue-900/20' : ''
                              }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-white font-medium text-sm">
                                  {notification.title}
                                </h4>
                                <p className="text-gray-400 text-sm mt-1">
                                  {notification.message}
                                </p>
                                <span className="text-xs text-gray-500 mt-2 block">
                                  {new Date(notification.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {notifications.length > 5 && (
                      <div className="p-4 border-t border-gray-700 text-center">
                        <button className="text-red-400 hover:text-red-300 text-sm">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {provider.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-white font-semibold">{provider.name}</div>
                    <div className="text-gray-400 text-xs">Provider Account</div>
                  </div>
                  <ChevronDown size={20} className="text-gray-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    <button
                      onClick={() => setSelectedTab('profile')}
                      className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Settings size={18} />
                      Account Settings
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2 border-t border-gray-700"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-800/50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {provider.name}!</h2>
              <p className="text-gray-300">Manage your water sports services and bookings</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${provider.verified
              ? 'bg-green-900/30 border-green-600'
              : 'bg-yellow-900/30 border-yellow-600'
              }`}>
              {provider.verified ? (
                <>
                  <CheckCircle size={20} className="text-green-400" />
                  <span className="text-green-400 font-semibold">Verified Provider</span>
                </>
              ) : (
                <>
                  <AlertCircle size={20} className="text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Pending Verification</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setIsAddActivityOpen(true)}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-600 transition-colors text-left group"
          >
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={24} className="text-white" />
            </div>
            <h3 className="text-white font-semibold mb-1">Add Service</h3>
            <p className="text-gray-400 text-sm">Create new activity</p>
          </button>

          <button
            onClick={() => setSelectedTab('bookings')}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-600 transition-colors text-left group"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar size={24} className="text-white" />
            </div>
            <h3 className="text-white font-semibold mb-1">View Bookings</h3>
            <p className="text-gray-400 text-sm">{pendingBookings} pending</p>
          </button>

          <button
            onClick={() => setSelectedTab('activities')}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-600 transition-colors text-left group"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock size={24} className="text-white" />
            </div>
            <h3 className="text-white font-semibold mb-1">Manage Activities</h3>
            <p className="text-gray-400 text-sm">{activities.length} active</p>
          </button>

          <button
            onClick={() => setSelectedTab('analytics')}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-600 transition-colors text-left group"
          >
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <IndianRupee size={24} className="text-white" />
            </div>
            <h3 className="text-white font-semibold mb-1">Earnings</h3>
            <p className="text-gray-400 text-sm">₹{totalEarnings.toLocaleString()}</p>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-800 overflow-x-auto">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`pb-3 px-1 font-semibold whitespace-nowrap ${selectedTab === 'overview' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('activities')}
            className={`pb-3 px-1 font-semibold whitespace-nowrap ${selectedTab === 'activities' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-white'}`}
          >
            Activities
          </button>
          <button
            onClick={() => setSelectedTab('bookings')}
            className={`pb-3 px-1 font-semibold whitespace-nowrap ${selectedTab === 'bookings' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-white'}`}
          >
            Bookings {pendingBookings > 0 && <span className="ml-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{pendingBookings}</span>}
          </button>
          <button
            onClick={() => setSelectedTab('offers')}
            className={`pb-3 px-1 font-semibold whitespace-nowrap ${selectedTab === 'offers' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-white'}`}
          >
            Offers
          </button>
          <button
            onClick={() => setSelectedTab('analytics')}
            className={`pb-3 px-1 font-semibold whitespace-nowrap ${selectedTab === 'analytics' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-white'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setSelectedTab('profile')}
            className={`pb-3 px-1 font-semibold whitespace-nowrap ${selectedTab === 'profile' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-white'}`}
          >
            Profile
          </button>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Total Bookings</span>
                  <TrendingUp size={20} className="text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">{totalBookings}</div>
                <div className="text-gray-400 text-sm mt-1">{confirmedBookings} confirmed</div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Active Services</span>
                  <Package size={20} className="text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white">{activities.length}</div>
                <div className="text-gray-400 text-sm mt-1">total services</div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Pending</span>
                  <AlertCircle size={20} className="text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white">{pendingBookings}</div>
                <div className="text-gray-400 text-sm mt-1">awaiting response</div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Total Earnings</span>
                  <IndianRupee size={20} className="text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">₹{totalEarnings.toLocaleString()}</div>
                <div className="text-gray-400 text-sm mt-1">{completedBookings} completed</div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Bookings</h3>
              {bookings.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          {booking.customer.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{booking.customer}</div>
                          <div className="text-gray-400 text-sm">{booking.service} • {booking.participants} person(s)</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">₹{booking.amount.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">{booking.date} at {booking.time}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-900/30 text-green-400' :
                          booking.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                            booking.status === 'completed' ? 'bg-blue-900/30 text-blue-400' :
                              'bg-red-900/30 text-red-400'
                          }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {selectedTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Your Activities</h3>
              <button
                onClick={() => setIsAddActivityOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <Plus size={20} />
                Add New Activity
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                <Package size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">No activities yet</p>
                <button
                  onClick={() => setIsAddActivityOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Create Your First Activity
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map(activity => (
                  <div key={activity.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                    <img src={activity.image} alt={activity.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold text-lg">{activity.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activity.status === 'active'
                          ? 'bg-green-900/30 text-green-400 border border-green-600'
                          : 'bg-gray-700 text-gray-400 border border-gray-600'
                          }`}>
                          {activity.status}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm mb-1">{activity.category}</div>
                      <div className="text-gray-400 text-sm mb-2">{activity.location} • {activity.duration}</div>
                      <div className="text-white text-xl font-bold mb-3">₹{activity.price.toLocaleString()}</div>
                      <div className="text-gray-400 text-sm mb-4">Max {activity.maxParticipants} participants</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingActivity(activity);
                            setIsAddActivityOpen(true);
                          }}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedActivity(activity);
                            setIsSlotManagementOpen(true);
                          }}
                          className="flex-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 py-2 rounded-lg flex items-center justify-center gap-2 border border-blue-800"
                        >
                          <Calendar size={16} />
                          Slots
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 px-3 rounded-lg flex items-center justify-center border border-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {selectedTab === 'bookings' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Booking Management</h3>

            {/* Pending Approvals Banner */}
            {bookings.filter(b => b.status === 'pending').length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <AlertCircle size={20} /> {bookings.filter(b => b.status === 'pending').length} Booking(s) Awaiting Your Approval
                </h4>
                <div className="space-y-3">
                  {bookings.filter(b => b.status === 'pending').map(booking => (
                    <div key={booking.id} className="bg-gray-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <p className="text-white font-semibold">{booking.customer} — <span className="text-gray-300">{booking.service}</span></p>
                        <p className="text-gray-400 text-sm">{booking.bookingId} · {booking.date} {booking.time} · {booking.participants} pax · ₹{booking.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAcceptBooking(booking.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold text-sm flex items-center gap-1">
                          <Check size={16} /> Approve
                        </button>
                        <button onClick={() => handleRejectBooking(booking.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm flex items-center gap-1">
                          <XIcon size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bookings.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No bookings yet</p>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Booking ID</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Customer</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Service</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Date & Time</th>
                        <th className="text-center py-4 px-4 text-gray-400 font-semibold">Amount</th>
                        <th className="text-center py-4 px-4 text-gray-400 font-semibold">Payment</th>
                        <th className="text-center py-4 px-4 text-gray-400 font-semibold">Status</th>
                        <th className="text-center py-4 px-4 text-gray-400 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id} className="border-b border-gray-800 hover:bg-gray-800">
                          <td className="py-4 px-4 text-white font-mono">{booking.bookingId}</td>
                          <td className="py-4 px-4">
                            <div className="text-white font-semibold">{booking.customer}</div>
                            <div className="text-gray-400 text-sm">{booking.customerEmail}</div>
                          </td>
                          <td className="py-4 px-4 text-gray-300">{booking.service}</td>
                          <td className="py-4 px-4 text-gray-300">
                            <div>{booking.date}</div>
                            <div className="text-sm text-gray-500">{booking.time}</div>
                          </td>
                          <td className="py-4 px-4 text-center text-white font-semibold">₹{booking.amount.toLocaleString()}</td>
                          <td className="py-4 px-4 text-center">
                            <select
                              value={booking.paymentStatus}
                              onChange={(e) => handleUpdatePaymentStatus(booking.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${booking.paymentStatus === 'paid'
                                ? 'bg-green-900/30 text-green-400 border-green-600'
                                : 'bg-yellow-900/30 text-yellow-400 border-yellow-600'
                                }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-900/30 text-green-400 border border-green-600' :
                              booking.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-600' :
                                booking.status === 'completed' ? 'bg-blue-900/30 text-blue-400 border border-blue-600' :
                                  'bg-red-900/30 text-red-400 border border-red-600'
                              }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleAcceptBooking(booking.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                                    title="Accept"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleRejectBooking(booking.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                                    title="Reject"
                                  >
                                    <XIcon size={16} />
                                  </button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => handleCompleteBooking(booking.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  Complete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Offers Tab */}
        {selectedTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Offers & Discounts</h3>
              <button
                onClick={() => setIsCreateOfferOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <Plus size={20} />
                Create Offer
              </button>
            </div>

            {offers.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                <Tag size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">No offers yet</p>
                <button
                  onClick={() => setIsCreateOfferOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Create Your First Offer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map(offer => (
                  <div key={offer.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-white font-bold text-xl mb-2">{offer.offerName}</h4>
                        <p className="text-gray-400 text-sm">{offer.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${offer.status === 'active'
                        ? 'bg-green-900/30 text-green-400 border border-green-600'
                        : 'bg-gray-700 text-gray-400 border border-gray-600'
                        }`}>
                        {offer.status}
                      </span>
                    </div>

                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
                      <div className="text-red-400 text-3xl font-bold">
                        {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-gray-400 text-sm">
                        Valid: {offer.validFrom} to {offer.validTo}
                      </div>
                      {offer.activityId && (
                        <div className="text-gray-400 text-sm">
                          Applied to: {activities.find(a => a.id === offer.activityId)?.name || 'Specific Activity'}
                        </div>
                      )}
                      {offer.maxUsage && (
                        <div className="text-gray-400 text-sm">
                          Used: {offer.usedCount || 0} / {offer.maxUsage}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingOffer(offer);
                          setIsCreateOfferOpen(true);
                        }}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 rounded-lg flex items-center justify-center gap-2 border border-red-800"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedTab === 'analytics' && (() => {
  

  const getFilteredBookings = () => {
    const now = new Date();
    return bookings.filter(b => {
      const d = new Date(b.createdAt);
      if (analyticsFilter === '7d') return (now.getTime() - d.getTime()) <= 7*86400000;
      if (analyticsFilter === '1m') return (now.getTime() - d.getTime()) <= 30*86400000;
      if (analyticsFilter === '3m') return (now.getTime() - d.getTime()) <= 90*86400000;
      if (analyticsFilter === '6m') return (now.getTime() - d.getTime()) <= 180*86400000;
      return true;
    });
  };
  const filtered = getFilteredBookings();

  // Pie chart data
  const activityCounts: Record<string, number> = {};
  filtered.forEach(b => { activityCounts[b.service] = (activityCounts[b.service] || 0) + 1; });
  const pieData = Object.entries(activityCounts);
  const pieTotal = pieData.reduce((s, [,v]) => s + v, 0);
  const PIE_COLORS = ['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899'];

  // Line chart data — group by date
  const dateCounts: Record<string, number> = {};
  filtered.forEach(b => {
    const d = b.createdAt?.slice(0,10) || '';
    if (d) dateCounts[d] = (dateCounts[d] || 0) + 1;
  });
  const lineData = Object.entries(dateCounts).sort(([a],[b]) => a.localeCompare(b));
  const maxLine = Math.max(...lineData.map(([,v]) => v), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-2xl font-bold text-white">Analytics Dashboard</h3>
        <div className="flex gap-2 flex-wrap">
          {(['7d','1m','3m','6m','all'] as const).map(f => (
            <button key={f} onClick={() => setAnalyticsFilter(f)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${analyticsFilter === f ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {f === '7d' ? '7 Days' : f === '1m' ? '1 Month' : f === '3m' ? '3 Months' : f === '6m' ? '6 Months' : 'Overall'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: filtered.length, color: 'bg-blue-600' },
          { label: 'Confirmed', value: filtered.filter(b => b.status === 'confirmed' || b.status === 'completed').length, color: 'bg-green-600' },
          { label: 'Pending', value: filtered.filter(b => b.status === 'pending').length, color: 'bg-yellow-600' },
          { label: 'Revenue', value: `₹${filtered.filter(b => b.paymentStatus === 'paid').reduce((s,b) => s + b.amount, 0).toLocaleString()}`, color: 'bg-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <div className={`w-10 h-10 ${color} rounded-lg mb-3`} />
            <div className="text-gray-400 text-sm">{label}</div>
            <div className="text-white text-2xl font-bold mt-1">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Activity Breakdown</h4>
          {pieData.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No booking data yet</p>
          ) : (
            <div className="flex items-center gap-6">
              <svg viewBox="0 0 120 120" className="w-32 h-32 flex-shrink-0">
                {(() => {
                  let angle = 0;
                  return pieData.map(([name, count], i) => {
                    const slice = (count / pieTotal) * 360;
                    const startAngle = angle;
                    angle += slice;
                    const r = 50, cx = 60, cy = 60;
                    const toRad = (deg: number) => (deg - 90) * Math.PI / 180;
                    const x1 = cx + r * Math.cos(toRad(startAngle));
                    const y1 = cy + r * Math.sin(toRad(startAngle));
                    const x2 = cx + r * Math.cos(toRad(angle));
                    const y2 = cy + r * Math.sin(toRad(angle));
                    const large = slice > 180 ? 1 : 0;
                    return (
                      <path key={name}
                        d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                        stroke="#111827" strokeWidth="1"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="space-y-2 flex-1 min-w-0">
                {pieData.map(([name, count], i) => (
                  <div key={name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-gray-300 truncate">{name}</span>
                    <span className="text-gray-400 ml-auto flex-shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Line Graph */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Bookings Over Time</h4>
          {lineData.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No booking data yet</p>
          ) : (
            <div className="relative h-40">
              <svg viewBox={`0 0 ${Math.max(lineData.length * 30, 300)} 120`} className="w-full h-full" preserveAspectRatio="none">
                <polyline
                  points={lineData.map(([,v], i) => `${i * 30 + 15},${110 - (v / maxLine) * 90}`).join(' ')}
                  fill="none" stroke="#ef4444" strokeWidth="2"
                />
                {lineData.map(([,v], i) => (
                  <circle key={i} cx={i * 30 + 15} cy={110 - (v / maxLine) * 90} r="3" fill="#ef4444" />
                ))}
              </svg>
              <div className="flex justify-between mt-1 overflow-hidden">
                {lineData.slice(0, 6).map(([d]) => (
                  <span key={d} className="text-gray-500 text-xs truncate">{d.slice(5)}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
})()}

        {/* Profile Tab */}
        {selectedTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Business Profile</h3>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Business Name</label>
                  <input
                    type="text"
                    value={providerProfile.name || providerProfile.business_name || ''}
                    onChange={(e) => setProviderProfile({ ...providerProfile, name: e.target.value, business_name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Email</label>
                  <input
                    type="email"
                    value={providerProfile.email}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    disabled
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Location</label>
                  <input
                    type="text"
                    value={providerProfile.location || providerProfile.address || ''}
                    onChange={(e) => setProviderProfile({ ...providerProfile, location: e.target.value, address: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Phone</label>
                  <input
                    type="tel"
                    value={providerProfile.phone || ''}
                    onChange={(e) => setProviderProfile({ ...providerProfile, phone: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-gray-400 text-sm mb-2 block">Business Description</label>
                  <textarea
                    value={providerProfile.description || ''}
                    onChange={(e) => setProviderProfile({ ...providerProfile, description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    rows={4}
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold mb-1">Verification Status</h4>
                    <p className="text-gray-400 text-sm">Your account verification status</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${(providerProfile.verification_status === 'Approved' || providerProfile.verified)
                      ? 'bg-green-900/30 text-green-400 border border-green-600'
                      : providerProfile.verification_status === 'Rejected'
                        ? 'bg-red-900/30 text-red-400 border border-red-600'
                        : 'bg-yellow-900/30 text-yellow-400 border border-yellow-600'
                    }`}>
                    {providerProfile.verification_status === 'Approved' || providerProfile.verified
                      ? 'Verified'
                      : providerProfile.verification_status === 'Rejected'
                        ? 'Rejected'
                        : 'Pending Verification'}
                  </span>
                </div>
                {providerProfile.verification_status !== 'Approved' && !providerProfile.verified && (
                  <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      Your account is pending verification. Our team will review your profile within 24-48 hours.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <span id="profile-save-msg" className="text-sm"></span>
                <button
                  onClick={async () => {
                    const msgEl = document.getElementById('profile-save-msg');
                    if (msgEl) { msgEl.textContent = 'Saving...'; msgEl.className = 'text-sm text-gray-400'; }
                    try {
                      const res = await fetch(`http://localhost:5000/api/providers/${providerId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          business_name: providerProfile.name || providerProfile.business_name,
                          phone: providerProfile.phone,
                          address: providerProfile.location || providerProfile.address,
                          description: providerProfile.description
                        })
                      });
                      if (res.ok) {
                        if (msgEl) { msgEl.textContent = '✓ Saved!'; msgEl.className = 'text-sm text-green-400'; }
                        // Re-fetch fresh profile including verification_status
                        const fresh = await fetch(`http://localhost:5000/api/providers/${providerId}/profile`);
                        if (fresh.ok) {
                          const data = await fresh.json();
                          setProviderProfile({
                            ...data,
                            name: data.business_name || data.name || '',
                            email: data.email || '',
                            phone: data.phone || '',
                            location: data.location || data.address || '',
                            description: data.description || '',
                            verification_status: data.verification_status || 'Pending',
                          });
                        }
                        setTimeout(() => { if (msgEl) msgEl.textContent = ''; }, 3000);
                      } else {
                        if (msgEl) { msgEl.textContent = 'Failed to save.'; msgEl.className = 'text-sm text-red-400'; }
                      }
                    } catch (err) {
                      if (msgEl) { msgEl.textContent = 'Server unreachable.'; msgEl.className = 'text-sm text-red-400'; }
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}