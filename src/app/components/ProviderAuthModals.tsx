import { X} from "lucide-react";
import { useState } from "react";
import API from "../config/api";

const API_BASE = `${API}/api`;

const normalizeProvider = (provider: any) => ({
  ...provider,
  id: provider?.id ?? provider?.provider_id,
  provider_id: provider?.provider_id ?? provider?.id,
  name: provider?.name ?? provider?.business_name,
  business_name: provider?.business_name ?? provider?.name,
  verified:
    provider?.verified ?? provider?.verification_status === "Approved",
  location: provider?.location ?? provider?.address ?? "Goa",
});

interface ProviderAuthModalsProps {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  onCloseLogin: () => void;
  onCloseSignup: () => void;
  onSwitchToSignup: () => void;
  onSwitchToLogin: () => void;
  onLoginSuccess: (provider: any) => void;
}

export function ProviderAuthModals({
  isLoginOpen,
  isSignupOpen,
  onCloseLogin,
  onCloseSignup,
  onSwitchToSignup,
  onSwitchToLogin,
  onLoginSuccess,
}: ProviderAuthModalsProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupData, setSignupData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  /* ===============================
   PROVIDER LOGIN
================================ */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch(`${API}/api/providers/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();

      if (!data.success) {
        setLoginError(data.message || "Login failed");
        return;
      }

      const rawProvider = data.provider ?? data.data ?? data
      const provider = normalizeProvider(rawProvider);

      localStorage.setItem("provider_token", data.token);
      localStorage.setItem(
        "goaxplore_current_provider",
        JSON.stringify(provider),
      );

      onLoginSuccess(provider);
      onCloseLogin();

      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      setLoginError("Server error. Try again.");
    }
  };

  /* ===============================
   PROVIDER SIGNUP
================================ */

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/providers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: signupData.businessName,
          owner_name: signupData.ownerName,
          email: signupData.email,
          phone: signupData.phone,
          password: signupData.password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setSignupError(data.message);
        return;
      }

      alert("Registration successful. Waiting for admin approval.");

      onCloseSignup();

      setSignupData({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setSignupError("Server error. Try again.");
    }
  };

  return (
    <>
      {/* LOGIN MODAL */}

      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md">
            <div className="border-b border-gray-700 p-6 flex justify-between">
              <h2 className="text-2xl font-bold text-white">Provider Login</h2>

              <button onClick={onCloseLogin}>
                <X className="text-gray-400 hover:text-white" size={24} />
              </button>
            </div>

            <form onSubmit={handleLogin} className="p-6 space-y-4">
              {loginError && (
                <div className="bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
                  {loginError}
                </div>
              )}

              <input
                type="email"
                placeholder="Business Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
              />

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold"
              >
                Login
              </button>

              <p className="text-center text-gray-400 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-red-500"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}

      {isSignupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-lg">
            <div className="border-b border-gray-700 p-6 flex justify-between">
              <h2 className="text-2xl font-bold text-white">
                Register as Provider
              </h2>

              <button onClick={onCloseSignup}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSignup} className="p-6 space-y-4">
              {signupError && (
                <div className="bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
                  {signupError}
                </div>
              )}

              <input
                type="text"
                placeholder="Business Name"
                required
                value={signupData.businessName}
                onChange={(e) =>
                  setSignupData({ ...signupData, businessName: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
              />

              <input
                type="text"
                placeholder="Owner Name"
                required
                value={signupData.ownerName}
                onChange={(e) =>
                  setSignupData({ ...signupData, ownerName: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
              />

              <input
                type="email"
                placeholder="Email"
                required
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
              />

              <input
                type="tel"
                placeholder="Phone"
                required
                value={signupData.phone}
                onChange={(e) =>
                  setSignupData({ ...signupData, phone: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
              />

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold"
              >
                Create Provider Account
              </button>

              <p className="text-center text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-red-500"
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
