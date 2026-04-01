import { useState, useEffect } from "react";
import API from "../config/api";
import {
  Bell,
  LogOut,
  Shield,
  ChevronDown,
  Settings,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Search,
  XCircle,
  RefreshCw,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Award,
  Clock,
  ArrowLeft,
  Home,
  MessageSquare,
  MessageCircle,
  Send,
} from "lucide-react";

interface AdminDashboardProps {
  admin: any;
  onLogout: () => void;
  onBackToHome?: () => void;
}

export const API_BASE = `${API}/api`;

export function AdminDashboard({ admin, onLogout, onBackToHome }: AdminDashboardProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isViewProviderOpen, setIsViewProviderOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [replyingTicket, setReplyingTicket] = useState<any>(null);
  const [replyingContact, setReplyingContact] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  /* ================= LOAD PROVIDERS ================= */
  const loadProviders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/admin/providers`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setProviders(data.data);
      } else {
        setError(data.message || "Failed to load providers");
      }
    } catch (err) {
      console.error("Failed to load providers:", err);
      setError("Failed to load providers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSupport = async () => {
    try {
      const res = await fetch(`${API_BASE}/support/admin/all`);
      if (res.ok) setSupportTickets(await res.json());
    } catch { /* silent */ }
  };

  const loadContact = async () => {
    try {
      const res = await fetch(`${API_BASE}/contact/admin/all`);
      if (res.ok) setContactMessages(await res.json());
    } catch { /* silent */ }
  };

  const handleReplyTicket = async () => {
    if (!replyingTicket || !replyText.trim()) return;
    try {
      await fetch(`${API_BASE}/support/${replyingTicket.ticket_id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText, replied_by: 'admin' }),
      });
      setSupportTickets(prev => prev.map(t =>
        t.ticket_id === replyingTicket.ticket_id ? { ...t, reply: replyText, status: 'replied' } : t
      ));
    } catch { /* silent */ }
    setReplyingTicket(null);
    setReplyText('');
  };

  const handleReplyContact = async () => {
    if (!replyingContact || !replyText.trim()) return;
    try {
      await fetch(`${API_BASE}/contact/${replyingContact.message_id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });
      setContactMessages(prev => prev.map(m =>
        m.message_id === replyingContact.message_id ? { ...m, admin_reply: replyText, status: 'replied' } : m
      ));
    } catch { /* silent */ }
    setReplyingContact(null);
    setReplyText('');
  };

  useEffect(() => {
    loadProviders();
    loadSupport();
    loadContact();
  }, []);

  /* ================= APPROVE PROVIDER ================= */
  const handleVerifyProvider = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/admin/providers/${id}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Provider approved successfully!");
        await loadProviders();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || "Failed to approve provider");
      }
    } catch (err) {
      console.error("Failed to approve provider:", err);
      setError("Failed to approve provider. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= REJECT PROVIDER ================= */
  const handleRejectProvider = async (id: number) => {
    const reason = prompt("Please enter reason for rejection:");
    if (!reason) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/admin/providers/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Provider rejected successfully!");
        await loadProviders();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || "Failed to reject provider");
      }
    } catch (err) {
      console.error("Failed to reject provider:", err);
      setError("Failed to reject provider. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= DELETE PROVIDER ================= */
  const handleDeleteProvider = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this provider? This action cannot be undone.",
      )
    )
      return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/admin/providers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Provider deleted successfully!");
        await loadProviders();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || "Failed to delete provider");
      }
    } catch (err) {
      console.error("Failed to delete provider:", err);
      setError("Failed to delete provider. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= VIEW PROVIDER DETAILS ================= */
  const handleViewProvider = (provider: any) => {
    setSelectedProvider(provider);
    setIsViewProviderOpen(true);
  };

  /* ================= TOGGLE SUSPEND PROVIDER ================= */
  const handleToggleSuspend = async (id: number, currentStatus: boolean) => {
    const action = currentStatus ? "unsuspend" : "suspend";
    if (!confirm(`Are you sure you want to ${action} this provider?`)) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/admin/providers/${id}/${action}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(`Provider ${action}ed successfully!`);
        await loadProviders();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || `Failed to ${action} provider`);
      }
    } catch (err) {
      console.error(`Failed to ${action} provider:`, err);
      setError(`Failed to ${action} provider. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ? true : p.verification_status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  /* ================= STATS ================= */
  const totalProviders = providers.length;
  const verifiedProviders = providers.filter(
    (p) => p.verification_status === "Approved",
  ).length;
  const pendingProviders = providers.filter(
    (p) => p.verification_status === "Pending",
  ).length;
  const rejectedProviders = providers.filter(
    (p) => p.verification_status === "Rejected",
  ).length;
  const suspendedProviders = providers.filter((p) => p.is_suspended).length;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="rounded-full border border-white/10 bg-black/20 p-2 text-white transition-colors hover:bg-black/40 mr-2"
              title="Back to Home"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" />
            </div>
            <div>
              <h1 className="text-red-600 text-xl font-bold">GoaXplore</h1>
              <span className="text-gray-400 text-xs">Admin Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Support + Contact nav tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedTab('support')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedTab === 'support' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <MessageSquare size={15} />
                Support
                {supportTickets.filter(t => t.status === 'open').length > 0 && (
                  <span className="bg-yellow-500 text-black text-xs rounded-full px-1.5 font-semibold">
                    {supportTickets.filter(t => t.status === 'open').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setSelectedTab('contact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedTab === 'contact' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <MessageCircle size={15} />
                Contact
                {contactMessages.filter(m => !m.status || m.status === 'new').length > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 font-semibold">
                    {contactMessages.filter(m => !m.status || m.status === 'new').length}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Bell size={24} />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                    {notifications.filter(n => !n.is_read).length}
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
                          className={`p-4 hover:bg-gray-700/50 transition-colors ${
                            !notification.is_read ? 'bg-blue-900/20' : ''
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

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 text-white"
              >
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold">
                  {admin?.name?.charAt(0) || "A"}
                </div>
                <span className="hidden md:inline">
                  {admin?.name || "Admin"}
                </span>
                <ChevronDown size={18} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg w-48 shadow-xl">
                  <button
                    onClick={() => {
                      setSelectedTab("settings");
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-left text-white hover:bg-gray-700"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-400 hover:bg-gray-700"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 bg-green-900/50 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Providers"
            value={totalProviders}
            icon={<Users className="text-blue-400" />}
            color="blue"
          />
          <StatCard
            title="Verified"
            value={verifiedProviders}
            icon={<CheckCircle className="text-green-400" />}
            color="green"
          />
          <StatCard
            title="Pending"
            value={pendingProviders}
            icon={<Clock className="text-yellow-400" />}
            color="yellow"
          />
          <StatCard
            title="Rejected"
            value={rejectedProviders}
            icon={<XCircle className="text-red-400" />}
            color="red"
          />
          <StatCard
            title="Suspended"
            value={suspendedProviders}
            icon={<AlertCircle className="text-orange-400" />}
            color="orange"
          />
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-red-600"
              placeholder="Search by business name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Approved">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={loadProviders}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-white transition-colors"
              disabled={isLoading}
            >
              <RefreshCw
                size={20}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* PROVIDERS TABLE */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {isLoading && !providers.length ? (
            <div className="text-center py-12">
              <RefreshCw
                size={40}
                className="animate-spin text-gray-600 mx-auto mb-4"
              />
              <p className="text-gray-400">Loading providers...</p>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <Users size={40} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No providers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-4 text-left text-gray-400 font-medium">
                      Provider
                    </th>
                    <th className="p-4 text-left text-gray-400 font-medium">
                      Contact
                    </th>
                    <th className="p-4 text-left text-gray-400 font-medium">
                      Location
                    </th>
                    <th className="p-4 text-center text-gray-400 font-medium">
                      Verification
                    </th>
                    <th className="p-4 text-center text-gray-400 font-medium">
                      Status
                    </th>
                    <th className="p-4 text-center text-gray-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProviders.map((provider) => (
                    <tr
                      key={provider.provider_id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <div className="text-white font-medium">
                            {provider.business_name}
                          </div>
                          <div className="text-sm text-gray-400">
                            Since {new Date(provider.created_at).getFullYear()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Mail size={14} className="text-gray-500" />
                            {provider.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Phone size={14} className="text-gray-500" />
                            {provider.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <MapPin size={14} className="text-gray-500" />
                          {provider.address || provider.city || "N/A"}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                              provider.verification_status === "Approved"
                                ? "bg-green-900 text-green-400"
                                : provider.verification_status === "Rejected"
                                  ? "bg-red-900 text-red-400"
                                  : "bg-yellow-900 text-yellow-400"
                            }`}
                        >
                          {provider.verification_status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {provider.is_suspended ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-900 text-orange-400">
                            Suspended
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-400">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewProvider(provider)}
                            className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          {provider.verification_status !== "Approved" && (
                            <button
                              onClick={() =>
                                handleVerifyProvider(provider.provider_id)
                              }
                              className="bg-green-600 hover:bg-green-700 p-2 rounded transition-colors"
                              title="Approve"
                              disabled={isLoading}
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}

                          {provider.verification_status !== "Rejected" && (
                            <button
                              onClick={() =>
                                handleRejectProvider(provider.provider_id)
                              }
                              className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded transition-colors"
                              title="Reject"
                              disabled={isLoading}
                            >
                              <AlertCircle size={16} />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleToggleSuspend(
                                provider.provider_id,
                                provider.is_suspended,
                              )
                            }
                            className={`${
                              provider.is_suspended
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-orange-600 hover:bg-orange-700"
                            } p-2 rounded transition-colors`}
                            title={
                              provider.is_suspended ? "Unsuspend" : "Suspend"
                            }
                            disabled={isLoading}
                          >
                            <AlertCircle size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteProvider(provider.provider_id)
                            }
                            className="bg-red-600 hover:bg-red-700 p-2 rounded transition-colors"
                            title="Delete"
                            disabled={isLoading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProviders.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Showing {filteredProviders.length} of {providers.length} providers
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                1
              </button>
              <button className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700">
                2
              </button>
              <button className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700">
                3
              </button>
              <button className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        )}

        {/* ================= SUPPORT TAB ================= */}
        {selectedTab === 'support' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Support Tickets</h2>
              <button onClick={loadSupport} className="p-2 text-gray-400 hover:text-white transition-colors">
                <RefreshCw size={18} />
              </button>
            </div>
            {supportTickets.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No support tickets yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {supportTickets.map(ticket => (
                  <div key={ticket.ticket_id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold mb-1">{ticket.subject}</h3>
                        <p className="text-gray-400 text-sm">
                          From: <span className="text-gray-300">{ticket.user_name}</span>
                          {ticket.user_email && <span className="text-gray-500"> ({ticket.user_email})</span>}
                          {' · '}Category: <span className="capitalize">{ticket.category}</span>
                        </p>
                        {ticket.booking_id && (
                          <p className="text-gray-500 text-sm">Booking: {ticket.booking_id}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'open' ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-800' :
                        ticket.status === 'replied' ? 'bg-blue-900/20 text-blue-400 border border-blue-800' :
                        'bg-green-900/20 text-green-400 border border-green-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{ticket.description}</p>
                    {ticket.reply && (
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Your reply</p>
                        <p className="text-gray-300 text-sm">{ticket.reply}</p>
                      </div>
                    )}
                    {replyingTicket?.ticket_id === ticket.ticket_id ? (
                      <div className="space-y-3">
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm min-h-24 focus:outline-none focus:border-red-600"
                          placeholder="Type your reply..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleReplyTicket}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                          >
                            <Send size={14} />
                            Send Reply
                          </button>
                          <button
                            onClick={() => { setReplyingTicket(null); setReplyText(''); }}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setReplyingTicket(ticket); setReplyingContact(null); setReplyText(''); }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <MessageSquare size={14} />
                        {ticket.reply ? 'Update Reply' : 'Reply'}
                      </button>
                    )}
                    <p className="text-gray-600 text-xs mt-4">{new Date(ticket.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= CONTACT TAB ================= */}
        {selectedTab === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
              <button onClick={loadContact} className="p-2 text-gray-400 hover:text-white transition-colors">
                <RefreshCw size={18} />
              </button>
            </div>
            {contactMessages.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                <Mail size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No contact messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map(msg => (
                  <div key={msg.message_id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold mb-1">{msg.subject || '(No subject)'}</h3>
                        <p className="text-gray-400 text-sm">
                          From: <span className="text-gray-300">{msg.name}</span>
                          <span className="text-gray-500"> &lt;{msg.email}&gt;</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        msg.status === 'replied' ? 'bg-blue-900/20 text-blue-400 border border-blue-800' :
                        'bg-yellow-900/20 text-yellow-400 border border-yellow-800'
                      }`}>
                        {msg.status || 'new'}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{msg.message}</p>
                    {msg.admin_reply && (
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Your reply</p>
                        <p className="text-gray-300 text-sm">{msg.admin_reply}</p>
                      </div>
                    )}
                    {replyingContact?.message_id === msg.message_id ? (
                      <div className="space-y-3">
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm min-h-24 focus:outline-none focus:border-red-600"
                          placeholder="Type your reply..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleReplyContact}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                          >
                            <Send size={14} />
                            Send Reply
                          </button>
                          <button
                            onClick={() => { setReplyingContact(null); setReplyText(''); }}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setReplyingContact(msg); setReplyingTicket(null); setReplyText(''); }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <Mail size={14} />
                        {msg.admin_reply ? 'Update Reply' : 'Reply'}
                      </button>
                    )}
                    <p className="text-gray-600 text-xs mt-4">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* View Provider Modal */}
      {isViewProviderOpen && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Provider Details</h2>
              <button
                onClick={() => setIsViewProviderOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">
                      Business Name
                    </label>
                    <p className="text-white">
                      {selectedProvider.business_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white">{selectedProvider.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Phone</label>
                    <p className="text-white">{selectedProvider.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">
                      Alternate Phone
                    </label>
                    <p className="text-white">
                      {selectedProvider.alternate_phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm text-gray-400">Address</label>
                    <p className="text-white">
                      {selectedProvider.address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">City</label>
                    <p className="text-white">
                      {selectedProvider.city || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">State</label>
                    <p className="text-white">
                      {selectedProvider.state || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Pincode</label>
                    <p className="text-white">
                      {selectedProvider.pincode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Business Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">GST Number</label>
                    <p className="text-white">
                      {selectedProvider.gst_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">PAN Number</label>
                    <p className="text-white">
                      {selectedProvider.pan_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">
                      Business Type
                    </label>
                    <p className="text-white">
                      {selectedProvider.business_type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">
                      Years in Business
                    </label>
                    <p className="text-white">
                      {selectedProvider.years_in_business || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Documents
                </h3>
                <div className="space-y-2">
                  {selectedProvider.documents?.map(
                    (doc: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded"
                      >
                        <span className="text-white">{doc.document_type}</span>
                        <a
                          href={doc.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-400 hover:text-red-300"
                        >
                          View Document
                        </a>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Statistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-3 rounded text-center">
                    <div className="text-2xl font-bold text-white">
                      {selectedProvider.total_bookings || 0}
                    </div>
                    <div className="text-sm text-gray-400">Total Bookings</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded text-center">
                    <div className="text-2xl font-bold text-white">
                      {selectedProvider.total_revenue || 0}
                    </div>
                    <div className="text-sm text-gray-400">Revenue (₹)</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded text-center">
                    <div className="text-2xl font-bold text-white">
                      {selectedProvider.average_rating || "N/A"}
                    </div>
                    <div className="text-sm text-gray-400">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setIsViewProviderOpen(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STAT CARD ================= */
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "red" | "orange";
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-900/20 border-blue-800",
    green: "bg-green-900/20 border-green-800",
    yellow: "bg-yellow-900/20 border-yellow-800",
    red: "bg-red-900/20 border-red-800",
    orange: "bg-orange-900/20 border-orange-800",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-400 text-sm">{title}</div>
        {icon}
      </div>
      <div className="text-3xl text-white font-bold">{value}</div>
    </div>
  );
}