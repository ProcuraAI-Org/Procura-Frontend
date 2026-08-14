import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Shield } from "lucide-react";
import { authMe, clearAuthToken, getAuthToken } from "../../api/client";

export function AuthAndWalletSection() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAuth = async () => {
    setLoading(true);
    try {
      if (getAuthToken()) {
        const res = await authMe().then((r) => r.userId).catch(() => null);
        setAuthUser(res);
      } else {
        setAuthUser(null);
      }
    } catch {
      if (getAuthToken()) clearAuthToken();
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuth();
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setAuthUser(null);
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Account
        </h2>
        <p className="text-slate-500 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-400" />
        Account
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Your sign-in status for this app.
      </p>
      {authUser ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-green-400 text-sm font-medium">Signed in as {authUser}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-400 text-sm">You are not signed in.</span>
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
