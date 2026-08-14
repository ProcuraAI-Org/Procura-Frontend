import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Shield,
  CheckCircle2,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { authLogin, authSignup, authGoogle, setAuthToken } from "../api/client";

const GOOGLE_CLIENT_ID = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_CLIENT_ID ?? "";

function getGoogleAccountsId(): { initialize: (cfg: unknown) => void; prompt: () => void } | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.google?.accounts?.id ?? null;
}

type AuthMode = "signin" | "signup";
type NotificationState = "success" | "error" | null;

export default function Auth() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    fullName?: string;
  }>({});
  const [gsiReady, setGsiReady] = useState(false);
  const googleCallbackRef = useRef<((credential: string) => void) | null>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      const g = getGoogleAccountsId();
      if (!g) return;
      g.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential?: string }) => {
          const credential = response?.credential;
          if (credential) googleCallbackRef.current?.(credential);
        },
      });
      setGsiReady(true);
    };
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  const showNotification = (type: NotificationState, message: string) => {
    setNotification(type);
    setNotificationMessage(message);
    setTimeout(() => {
      setNotification(null);
      setNotificationMessage("");
    }, 3000);
  };

  const redirectAfterAuth = () => {
    showNotification("success", "Success. Redirecting to Create Task...");
    setTimeout(() => navigate("/create-task"), 800);
  };

  const clearFieldErrors = () => setFieldErrors({});

  const handleGoogleSignIn = async () => {
    if (!GOOGLE_CLIENT_ID) {
      showNotification("error", "Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to the frontend .env.");
      return;
    }
    if (!gsiReady) {
      showNotification("error", "Google sign-in is still loading. Try again in a moment.");
      return;
    }
    const g = getGoogleAccountsId();
    if (!g) {
      showNotification("error", "Google sign-in failed to load. Use email or Demo.");
      return;
    }
    googleCallbackRef.current = async (credential: string) => {
      setLoading(true);
      try {
        const { token } = await authGoogle(credential);
        setAuthToken(token);
        setLoading(false);
        redirectAfterAuth();
      } catch (e) {
        setLoading(false);
        showNotification("error", e instanceof Error ? e.message : "Google sign-in failed.");
      }
    };
    g.prompt();
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFieldErrors();
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Email is required.";
    if (!password) errs.password = "Password is required.";
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      showNotification("error", "Please fix the errors below.");
      return;
    }
    setLoading(true);
    try {
      const { token } = await authLogin({ email: email.trim(), password });
      setAuthToken(token);
      setLoading(false);
      redirectAfterAuth();
    } catch (e) {
      setLoading(false);
      showNotification("error", e instanceof Error ? e.message : "Sign in failed.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFieldErrors();
    const errs: { fullName?: string; email?: string; password?: string; confirmPassword?: string } = {};
    if (!fullName.trim()) errs.fullName = "Full name is required.";
    if (!email.trim()) errs.email = "Email is required.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      showNotification("error", "Please fix the errors below.");
      return;
    }
    setLoading(true);
    try {
      const { token } = await authSignup({ email: email.trim(), password, fullName: fullName.trim() });
      setAuthToken(token);
      setLoading(false);
      redirectAfterAuth();
    } catch (e) {
      setLoading(false);
      showNotification("error", e instanceof Error ? e.message : "Sign up failed.");
    }
  };

  const handleDemoMode = async () => {
    setLoading(true);
    clearFieldErrors();
    try {
      const { token } = await authLogin({
        email: "demo@procura.local",
        password: "demo123",
      });
      setAuthToken(token);
      setLoading(false);
      redirectAfterAuth();
    } catch (e) {
      setLoading(false);
      showNotification("error", e instanceof Error ? e.message : "Demo mode failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Top Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-br from-[#4F7CFF] to-[#7B61FF] p-2 rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ProcuraAI</span>
          </button>

          {/* Back to Home */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
        </div>
      </nav>

      {/* Notification Banner */}
      {notification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div
            className={`px-6 py-4 rounded-lg border backdrop-blur-xl flex items-center gap-3 ${
              notification === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {notification === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT SIDE - Marketing Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="relative">
                {/* Background Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#4F7CFF]/10 to-[#7B61FF]/10 blur-3xl"></div>

                {/* Content */}
                <div className="relative space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Autonomous Agents.{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F7CFF] to-[#7B61FF]">
                      Controlled Access.
                    </span>
                  </h1>

                  <p className="text-lg text-slate-300 leading-relaxed">
                    Sign in to launch secure, policy-driven AI agents capable of
                    real-world payments with x402, AP2 authorization, and
                    encrypted conditional execution.
                  </p>

                  {/* Feature Points */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#4F7CFF]/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#4F7CFF]" />
                      </div>
                      <span className="text-slate-300">
                        Policy-enforced payments
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#4F7CFF]/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#4F7CFF]" />
                      </div>
                      <span className="text-slate-300">
                        Deterministic execution
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#4F7CFF]/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#4F7CFF]" />
                      </div>
                      <span className="text-slate-300">
                        Encrypted conditional settlement
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#4F7CFF]/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#4F7CFF]" />
                      </div>
                      <span className="text-slate-300">Full audit trail</span>
                    </div>
                  </div>

                  {/* Bottom Note */}
                  <div className="pt-8 text-sm text-slate-500">
                    Built for SKALE Agentic Commerce Hackathon.
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Auth Card */}
            <div className="order-1 lg:order-2">
              <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 md:p-10 space-y-8">
                {/* Card Header */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">
                    {authMode === "signin"
                      ? "Sign in to ProcuraAI"
                      : "Create your account"}
                  </h2>
                  <p className="text-slate-400">
                    {authMode === "signin"
                      ? "Access your dashboard and manage autonomous workflows."
                      : "Start deploying secure AI agents with controlled spending."}
                  </p>
                </div>

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-white hover:bg-gray-50 text-slate-900 rounded-lg font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-950/50 text-slate-500">
                      OR
                    </span>
                  </div>
                </div>

                {/* Email Form */}
                <form
                  onSubmit={authMode === "signin" ? handleEmailSignIn : handleSignUp}
                  className="space-y-5"
                >
                  {/* Full Name (Signup only) */}
                  {authMode === "signup" && (
                    <div className="space-y-2">
                      <label
                        htmlFor="fullName"
                        className="text-sm font-medium text-slate-300"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                          }}
                          placeholder="John Doe"
                          className={`w-full pl-11 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                            fieldErrors.fullName ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-[#4F7CFF]"
                          }`}
                        />
                      </div>
                      {fieldErrors.fullName && (
                        <p className="text-sm text-red-400">{fieldErrors.fullName}</p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-300"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="you@company.com"
                        className={`w-full pl-11 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                          fieldErrors.email ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-[#4F7CFF]"
                        }`}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-sm text-red-400">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-300"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                          fieldErrors.password ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-[#4F7CFF]"
                        }`}
                      />
                    </div>
                    {fieldErrors.password && (
                      <p className="text-sm text-red-400">{fieldErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password (Signup only) */}
                  {authMode === "signup" && (
                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-slate-300"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                          }}
                          placeholder="••••••••"
                          className={`w-full pl-11 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                            fieldErrors.confirmPassword ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-[#4F7CFF]"
                          }`}
                        />
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className="text-sm text-red-400">{fieldErrors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {/* Remember Me (Sign in only) */}
                  {authMode === "signin" && (
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#4F7CFF] focus:ring-[#4F7CFF] focus:ring-offset-0 cursor-pointer"
                      />
                      <label
                        htmlFor="remember"
                        className="ml-2 text-sm text-slate-400 cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#4F7CFF] to-[#7B61FF] rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : authMode === "signin" ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {/* Terms Note (Signup only) */}
                  {authMode === "signup" && (
                    <p className="text-xs text-slate-500 text-center">
                      By signing up, you agree to our{" "}
                      <button className="text-[#4F7CFF] hover:underline cursor-pointer">
                        Terms
                      </button>{" "}
                      &{" "}
                      <button className="text-[#4F7CFF] hover:underline cursor-pointer">
                        Privacy Policy
                      </button>
                      .
                    </p>
                  )}
                </form>

                {/* Toggle Auth Mode */}
                <div className="text-center text-sm">
                  {authMode === "signin" ? (
                    <span className="text-slate-400">
                      Don't have an account?{" "}
                      <button
                        onClick={() => { setAuthMode("signup"); clearFieldErrors(); }}
                        className="text-[#4F7CFF] hover:underline font-medium cursor-pointer"
                      >
                        Create one
                      </button>
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Already have an account?{" "}
                      <button
                        onClick={() => { setAuthMode("signin"); clearFieldErrors(); }}
                        className="text-[#4F7CFF] hover:underline font-medium cursor-pointer"
                      >
                        Sign in
                      </button>
                    </span>
                  )}
                </div>

                {/* Demo Mode Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                </div>

                {/* Demo Mode Button */}
                <button
                  onClick={handleDemoMode}
                  disabled={loading}
                  className="w-full px-6 py-3 border border-slate-700 rounded-lg font-medium hover:border-slate-600 hover:bg-slate-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Enter Demo Mode
                </button>
                <p className="text-xs text-slate-500 text-center -mt-4">
                  Explore a preconfigured autonomous workflow.
                </p>

                {/* Security Indicators */}
                <div className="flex flex-wrap gap-4 justify-center pt-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#4F7CFF]" />
                    Secure OAuth
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#4F7CFF]" />
                    Encrypted Sessions
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#4F7CFF]" />
                    Wallet Connected Separately
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
