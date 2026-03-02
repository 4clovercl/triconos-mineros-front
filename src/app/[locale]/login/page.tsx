"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/stores/authStore";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils/cn";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
];

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("auth");
  const { login, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${locale}/summary`);
    }
  }, [isAuthenticated, locale, router]);

  const handleLocaleChange = (newLocale: string) => {
    router.push(`/${newLocale}/login`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.push(`/${locale}/summary`);
    } else {
      setError(t("invalidCredentials"));
    }
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col bg-[#101822]">
        {/* Background */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-[#101822]/80 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md mb-4 border border-primary/30 shadow-xl shadow-primary/20">
              <span className="material-symbols-outlined text-primary text-4xl">
                diamond
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              TriconosMineros
            </h1>
            <p className="mt-2 text-slate-300">
              {t("loginSubtitle")}
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-[#1c2027]/90 p-8 shadow-2xl backdrop-blur-md"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              {t("loginTitle")}
            </h2>

            {/* Demo hint */}
            <div className="mb-5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
              <p className="text-xs text-primary/80">{t("demoCredentials")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  {t("emailLabel")}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">
                      person
                    </span>
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className="block w-full rounded-lg border-0 py-3 pl-10 pr-3 bg-slate-800/50 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary text-sm transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  {t("passwordLabel")}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("passwordPlaceholder")}
                    className="block w-full rounded-lg border-0 py-3 pl-10 pr-10 bg-slate-800/50 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary text-sm transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <span className="material-symbols-outlined text-slate-400 hover:text-slate-200 text-[20px] transition-colors">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-primary focus:ring-primary focus:ring-offset-slate-900"
                  />
                  <span className="text-sm text-slate-300">
                    {t("rememberMe")}
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {t("forgotPassword")}
                </button>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2"
                >
                  <p className="text-xs text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "flex w-full justify-center items-center gap-2 rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/30",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {t("signingIn")}
                  </>
                ) : (
                  t("signIn")
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-700/50 pt-5">
              <p className="text-center text-xs text-slate-400">
                {t("restricted")}
              </p>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between text-sm text-slate-400">
              {/* Language selector */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">
                  language
                </span>
                {LOCALES.map((loc, idx) => (
                  <span key={loc.code} className="flex items-center gap-3">
                    {idx > 0 && (
                      <span className="h-4 border-l border-slate-600" />
                    )}
                    <button
                      onClick={() => handleLocaleChange(loc.code)}
                      className={cn(
                        "cursor-pointer hover:text-white transition-colors",
                        locale === loc.code && "text-white font-medium"
                      )}
                    >
                      {loc.label}
                    </button>
                  </span>
                ))}
              </div>

              {/* Support */}
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  support_agent
                </span>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("contactSupport")}
                </a>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} TriconosMineros. v1.0.0
            </div>
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
}
