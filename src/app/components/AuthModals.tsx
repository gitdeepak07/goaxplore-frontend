import { Loader2, Lock, Mail, Phone, User, X } from "lucide-react";
import { useState } from "react";
import {
  type CustomerSession,
  loginCustomer,
  persistCustomerSession,
  registerCustomer,
} from "../../utils/auth";

interface AuthModalsProps {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  onCloseLogin: () => void;
  onCloseSignup: () => void;
  onSwitchToSignup: () => void;
  onSwitchToLogin: () => void;
  onAuthSuccess: (user: CustomerSession) => void;
}

export function AuthModals({
  isLoginOpen,
  isSignupOpen,
  onCloseLogin,
  onCloseSignup,
  onSwitchToSignup,
  onSwitchToLogin,
  onAuthSuccess,
}: AuthModalsProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const resetLoginForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
  };

  const resetSignupForm = () => {
    setSignupData({ fullName: "", email: "", password: "", confirmPassword: "", phone: "" });
    setSignupError("");
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const { token, user } = await loginCustomer(loginEmail, loginPassword);
      persistCustomerSession(user, token);
      onAuthSuccess(user);
      resetLoginForm();
      onCloseLogin();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Unable to login right now.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setSignupError("");
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }
    if (signupData.password.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }
    setSignupLoading(true);
    try {
      const { token, user } = await registerCustomer(
        signupData.fullName,
        signupData.email,
        signupData.password,
        signupData.phone,
      );
      persistCustomerSession(user, token);
      onAuthSuccess(user);
      resetSignupForm();
      onCloseSignup();
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setSignupLoading(false);
    }
  };

  if (!isLoginOpen && !isSignupOpen) return null;

  return (
    <>
      {/* ── LOGIN MODAL ── */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 p-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Customer Login</h2>
                <p className="mt-1 text-sm text-gray-400">Access bookings, receipts, and your dashboard.</p>
              </div>
              <button onClick={() => { resetLoginForm(); onCloseLogin(); }} className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 p-6">
              {loginError && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{loginError}</div>
              )}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white" placeholder="Enter your password" required />
                </div>
              </div>
              <button type="submit" disabled={loginLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold text-white transition-colors hover:bg-red-500 disabled:bg-red-800">
                {loginLoading ? <><Loader2 className="animate-spin" size={18} />Logging in...</> : "Login"}
              </button>
              <p className="text-center text-sm text-gray-400">
                Need an account?{" "}
                <button type="button" onClick={() => { resetLoginForm(); onSwitchToSignup(); }} className="font-medium text-red-400 transition-colors hover:text-red-300">Sign up</button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ── SIGNUP MODAL ── */}
      {isSignupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 p-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Create Account</h2>
                <p className="mt-1 text-sm text-gray-400">Set up a customer account for bookings and receipts.</p>
              </div>
              <button onClick={() => { resetSignupForm(); onCloseSignup(); }} className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSignup} className="space-y-4 p-6">
              {signupError && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{signupError}</div>
              )}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="text" value={signupData.fullName}
                    onChange={(e) => setSignupData((c) => ({ ...c, fullName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white" placeholder="Your name" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="email" value={signupData.email}
                    onChange={(e) => setSignupData((c) => ({ ...c, email: e.target.value }))}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Phone <span className="text-gray-500 text-xs">(optional — needed for SMS updates)</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="tel" value={signupData.phone}
                    onChange={(e) => setSignupData((c) => ({ ...c, phone: e.target.value }))}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white" placeholder="10-digit mobile number" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="password" value={signupData.password}
                      onChange={(e) => setSignupData((c) => ({ ...c, password: e.target.value }))}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white" placeholder="Minimum 6 characters" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="password" value={signupData.confirmPassword}
                      onChange={(e) => setSignupData((c) => ({ ...c, confirmPassword: e.target.value }))}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white" placeholder="Repeat password" required />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={signupLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold text-white transition-colors hover:bg-red-500 disabled:bg-red-800">
                {signupLoading ? <><Loader2 className="animate-spin" size={18} />Creating account...</> : "Create account"}
              </button>
              <p className="text-center text-sm text-gray-400">
                Already registered?{" "}
                <button type="button" onClick={() => { resetSignupForm(); onSwitchToLogin(); }} className="font-medium text-red-400 transition-colors hover:text-red-300">Login</button>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}