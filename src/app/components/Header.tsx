import {
  Menu,
  X,
  User,
  LogOut,
  Briefcase,
  Shield,
  LayoutDashboard,
  Home,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  currentUser: any;
  onBookNow?: () => void;
  onOpenProviderLogin?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenUserDashboard?: () => void;
  onOpenUserDashboardTab?: (tab: string) => void;
  onOpenAdminDashboard?: () => void;
  onOpenProviderDashboard?: () => void;
  onUserLogout?: () => void;
  onNavigate?: (section: string) => void;
}

export function Header({
  onOpenLogin,
  onOpenSignup,
  currentUser,
  onBookNow,
  onOpenProviderLogin,
  onOpenAdminLogin,
  onOpenUserDashboard,
  onOpenUserDashboardTab,
  onOpenAdminDashboard,
  onOpenProviderDashboard,
  onUserLogout,
  onNavigate,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  /* ================= CHECK ADMIN LOGIN ================= */
  useEffect(() => {
    const storedAdmin = localStorage.getItem("goaxplore_current_admin");
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (e) {
        console.error("Failed to parse admin data");
      }
    }
  }, []);

  /* ================= CHECK SCROLL POSITION ================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= USER LOGOUT ================= */
  const handleUserLogout = () => {
    setShowUserMenu(false);

    if (isProvider) {
      localStorage.removeItem("goaxplore_current_provider");
      window.location.reload();
      return;
    }

    onUserLogout?.();
  };

  /* ================= ADMIN LOGOUT ================= */
  const handleAdminLogout = () => {
    localStorage.removeItem("goaxplore_current_admin");
    setAdmin(null);
    window.location.reload();
  };

  /* ================= NAVIGATION HANDLER ================= */
  const handleNavigation = (section: string) => {
    setIsMenuOpen(false);
    if (onNavigate) {
      onNavigate(section);
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  /* ================= DETERMINE USER TYPE ================= */
  const isAdmin = !!admin;
  const isProvider = currentUser?.role === "provider";
  const isCustomer = currentUser && !isProvider && !isAdmin;
  const customerName =
    currentUser?.full_name ||
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.email ||
    "User";
  const customerInitial = customerName.charAt(0).toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-black/95 backdrop-blur-md border-b border-white/10 py-2"
        : "bg-black/80 backdrop-blur-sm border-b border-white/10"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("hero")}
          >
            <h1 className="text-2xl font-bold text-white">
              Goa<span className="text-red-600">Xplore</span>
            </h1>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNavigation("services")}
              className="text-white hover:text-red-600 transition-colors text-sm font-medium"
            >
              Services
            </button>
            <button
              onClick={() => handleNavigation("providers")}
              className="text-white hover:text-red-600 transition-colors text-sm font-medium"
            >
              Providers
            </button>
            <button
              onClick={() => handleNavigation("locations")}
              className="text-white hover:text-red-600 transition-colors text-sm font-medium"
            >
              Locations
            </button>
            <button
              onClick={() => handleNavigation("about")}
              className="text-white hover:text-red-600 transition-colors text-sm font-medium"
            >
              About
            </button>
            <button
              onClick={() => handleNavigation("contact")}
              className="text-white hover:text-red-600 transition-colors text-sm font-medium"
            >
              Contact
            </button>

            {/* ================= USER SECTIONS ================= */}
            <div className="flex items-center space-x-4 ml-4">
              {/* ADMIN USER */}
              {isAdmin && (
                <>
                  <div className="flex items-center space-x-2 text-red-400 bg-red-950/30 px-3 py-1.5 rounded-full">
                    <Shield size={16} />
                    <span className="text-sm font-medium">
                      {admin.name || "Admin"}
                    </span>
                  </div>
                  <button
                    onClick={onOpenAdminDashboard}
                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {/* PROVIDER USER */}
              {isProvider && (
                <>
                  <div className="flex items-center space-x-2 text-blue-400 bg-blue-950/30 px-3 py-1.5 rounded-full">
                    <Briefcase size={16} />
                    <span className="text-sm font-medium">
                      {currentUser.business_name || "Provider"}
                    </span>
                  </div>
                  <button
                    onClick={onOpenProviderDashboard}
                    className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={handleUserLogout}
                    className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {/* CUSTOMER USER */}
              {isCustomer && (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors"
                    >
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        {customerInitial}
                      </div>
                      <span className="text-sm font-medium">
                        {customerName}
                      </span>
                      <ChevronDown size={16} />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenUserDashboardTab?.('profile');
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-white hover:bg-gray-800"
                        >
                          <LayoutDashboard size={16} />
                          <span>Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenUserDashboardTab?.("bookings");
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-white hover:bg-gray-800"
                        >
                          <Briefcase size={16} />
                          <span>My Bookings</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false)
                            onOpenUserDashboardTab?.("profile");
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-white hover:bg-gray-800"
                        >
                          <User size={16} />
                          <span>Profile</span>
                        </button>
                        <div className="border-t border-gray-800 my-1"></div>
                        <button
                          onClick={handleUserLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-400 hover:bg-gray-800"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* GUEST USER */}
              {!currentUser && !admin && (
                <>
                  <button
                    onClick={onOpenLogin}
                    className="text-white hover:text-red-600 transition-colors text-sm font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={onOpenSignup}
                    className="text-white hover:text-red-600 transition-colors text-sm font-medium"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={onOpenProviderLogin}
                    className="flex items-center space-x-2 text-white border border-white/20 hover:border-blue-400 hover:text-blue-400 px-4 py-2 rounded-md transition-all text-sm"
                  >
                    <Briefcase size={16} />
                    <span>Provider</span>
                  </button>
                  <button
                    onClick={onOpenAdminLogin}
                    className="flex items-center space-x-2 text-white border border-red-600/50 hover:border-red-600 hover:bg-red-600/10 px-4 py-2 rounded-md transition-all text-sm"
                  >
                    <Shield size={16} />
                    <span>Admin</span>
                  </button>
                </>
              )}

              {/* BOOK NOW BUTTON - Always visible for everyone */}
              <button
                onClick={onBookNow}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md text-white font-medium transition-colors text-sm"
              >
                Book Now
              </button>
            </div>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-white hover:text-red-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 mt-2">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleNavigation("services")}
                className="text-white hover:text-red-600 transition-colors py-2 text-left"
              >
                Services
              </button>
              <button
                onClick={() => handleNavigation("providers")}
                className="text-white hover:text-red-600 transition-colors py-2 text-left"
              >
                Providers
              </button>
              <button
                onClick={() => handleNavigation("locations")}
                className="text-white hover:text-red-600 transition-colors py-2 text-left"
              >
                Locations
              </button>
              <button
                onClick={() => handleNavigation("about")}
                className="text-white hover:text-red-600 transition-colors py-2 text-left"
              >
                About
              </button>
              <button
                onClick={() => handleNavigation("contact")}
                className="text-white hover:text-red-600 transition-colors py-2 text-left"
              >
                Contact
              </button>

              <div className="border-t border-white/10 my-2"></div>

              {/* Mobile User Sections */}
              {isAdmin && (
                <>
                  <div className="flex items-center space-x-2 text-red-400 py-2">
                    <Shield size={18} />
                    <span className="font-medium">{admin.name || "Admin"}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAdminDashboard?.();
                    }}
                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors py-2"
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin Dashboard</span>
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors py-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {isProvider && (
                <>
                  <div className="flex items-center space-x-2 text-blue-400 py-2">
                    <Briefcase size={18} />
                    <span className="font-medium">
                      {currentUser.business_name || "Provider"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenProviderDashboard?.();
                    }}
                    className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors py-2"
                  >
                    <LayoutDashboard size={18} />
                    <span>Provider Dashboard</span>
                  </button>
                  <button
                    onClick={handleUserLogout}
                    className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors py-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {isCustomer && (
                <>
                  <div className="flex items-center space-x-2 text-white py-2">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      {customerInitial}
                    </div>
                    <span className="font-medium">{customerName}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenUserDashboard?.();
                    }}
                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors py-2"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenUserDashboardTab?.("bookings");
                    }}
                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors py-2"
                  >
                    <Briefcase size={18} />
                    <span>My Bookings</span>
                  </button>
                  <button
                    onClick={handleUserLogout}
                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors py-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!currentUser && !admin && (
                <>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="text-white hover:text-red-600 transition-colors py-2 text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenSignup();
                    }}
                    className="text-white hover:text-red-600 transition-colors py-2 text-left"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenProviderLogin?.();
                    }}
                    className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors py-2"
                  >
                    <Briefcase size={18} />
                    <span>Provider Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAdminLogin?.();
                    }}
                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors py-2"
                  >
                    <Shield size={18} />
                    <span>Admin Login</span>
                  </button>
                </>
              )}

              {/* Book Now Button in Mobile Menu */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onBookNow?.();
                }}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md text-white font-medium transition-colors text-center mt-2"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
