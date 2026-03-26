import { X, Mail, Lock, Shield, Loader2 } from "lucide-react";
import { useState } from "react";
import API from "../../config/api";

interface AdminAuthModalsProps {
  isLoginOpen: boolean;
  onCloseLogin: () => void;
  onLoginSuccess: (admin: any) => void;
}

export function AdminAuthModals({
  isLoginOpen,
  onCloseLogin,
  onLoginSuccess,
}: AdminAuthModalsProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.message || "Invalid email or password");
        return;
      }

      const adminData = data.admin;

      // Store admin info
      localStorage.setItem(
        "goaxplore_current_admin",
        JSON.stringify(adminData)
      );
      // Trigger login success
      onLoginSuccess(adminData);

      // Cleanup
      setLoginEmail("");
      setLoginPassword("");

      onCloseLogin();
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoginOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="border-b border-gray-800 p-6 flex items-center justify-between bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
              <Shield size={22} className="text-white" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Admin Portal</h2>
              <p className="text-xs text-gray-400">Authorized access only</p>
            </div>
          </div>

          <button
            onClick={onCloseLogin}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="p-6 space-y-5">
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Admin Email</label>

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white"
                placeholder="admin@goaxplore.com"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Password</label>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Verifying...
              </>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

        <div className="p-4 bg-gray-800/30 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            Forgot credentials? Contact system super-admin.
          </p>
        </div>
      </div>
    </div>
  );
}
