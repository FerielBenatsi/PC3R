import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function LoginPage({ dark }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [erreurs, setErreurs] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  function valider() {
    const errs = {};
    if (!email.trim()) errs.email = "Email requis";
      else if (!email.includes("@")) errs.email = "Email invalide";
    if (!password) errs.password = "Mot de passe requis";
    return errs;
  }

  async function handleSubmit() {
    const errs = valider();
    if (Object.keys(errs).length > 0) {
      setErreurs(errs);
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (e) {
      setErreurs({ global: e.message || "Identifiants incorrects" });
    } finally {
      setLoading(false);
    }
  }

  const inputBase = `w-full text-sm rounded-xl px-4 py-3 pl-10 outline-none transition-all duration-150 ${
    dark
      ? "bg-white/5 border border-white/8 text-white placeholder-zinc-600 focus:border-green-500/50 focus:bg-white/8"
      : "bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/10"
  }`;
  const iconColor = dark ? "text-zinc-600" : "text-zinc-400";

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm fade-up fade-up-1">
        {/* logo centré */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-12 h-12 flex items-center justify-center mb-4">
            <div className="absolute inset-0 rounded-2xl bg-green-500 opacity-20 blur-md" />
            <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/30">
              <Zap size={20} className="text-white fill-white" />
            </div>
          </div>
          <h1
            className={`text-2xl font-black tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Connexion
          </h1>
          <p className={`text-sm mt-1 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Bon retour sur SportPulse
          </p>
        </div>

        <div className={`rounded-2xl p-6 ${dark ? "glass" : "bg-white shadow-xl shadow-zinc-200/80 border border-zinc-100"}`}>
          {/* erreur globale */}
          {erreurs.global && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400">{erreurs.global}</p>
            </div>
          )}

          {/* champ email */}
          <div className="mb-4">
            <label
              className={`block text-xs font-semibold mb-1.5 ${dark ? "text-zinc-400" : "text-zinc-600"}`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Email
            </label>
            <div className="relative">
              <Mail size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
              <input
                type="email"
                placeholder="email@gmail.com"
                autoComplete="off"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErreurs((p) => ({ ...p, email: null })); }}
                className={`${inputBase} ${erreurs.email ? "border-red-500/50" : ""}`}
              />
            </div>
            {erreurs.email && <p className="text-xs text-red-400 mt-1.5">{erreurs.email}</p>}
          </div>

          {/* champ password */}
          <div className="mb-6">
            <label
              className={`block text-xs font-semibold mb-1.5 ${dark ? "text-zinc-400" : "text-zinc-600"}`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Mot de passe
            </label>
            <div className="relative">
              <Lock size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="off"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErreurs((p) => ({ ...p, password: null })); }}
                className={`${inputBase} pr-10 ${erreurs.password ? "border-red-500/50" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${iconColor} hover:text-zinc-400`}
              >
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {erreurs.password && <p className="text-xs text-red-400 mt-1.5">{erreurs.password}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-lg shadow-green-500/25"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Se connecter <ArrowRight size={14} /></>
            )}
          </button>
        </div>

        <p className={`text-center text-sm mt-5 ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-green-500 font-semibold hover:text-green-400 transition-colors">
            S'inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}