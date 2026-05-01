import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Target,
  Star,
  TrendingUp,
  Check,
  Minus,
  Edit2,
  Save,
  X,
  Calendar,
  Crown,
  Zap,
} from "lucide-react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/useAuth";

const AVATAR_COLORS = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];
const avatarColor = (name) =>
  AVATAR_COLORS[(name || "?").charCodeAt(0) % AVATAR_COLORS.length];

function PointsBadge({ points }) {
  if (points === 3)
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/15 border border-green-500/30 w-16 justify-center">
        <Star size={9} className="text-green-500 fill-green-500" />
        <span
          className="text-[8px] font-black text-green-500"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          3 pts
        </span>
      </div>
    );
  if (points === 1)
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 w-16 justify-center">
        <Check size={9} className="text-orange-400" />
        <span
          className="text-[8px] font-black text-orange-400"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          1 pt
        </span>
      </div>
    );
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/15 border border-red-500/30 w-16 justify-center">
      <Minus size={9} className="text-red-400" />
      <span
        className="text-[8px] font-black text-red-400"
        style={{ fontFamily: "Syne, sans-serif" }}
      >
        0 pt
      </span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, dark }) {
  return (
    <div
      className={`rounded-2xl p-4 border ${dark ? "glass" : "bg-white shadow-sm border-zinc-100"}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className={color} />
        <span
          className={`text-xs font-medium ${dark ? "text-zinc-500" : "text-zinc-400"}`}
        >
          {label}
        </span>
      </div>
      <p
        className={`text-2xl font-black ${dark ? "text-white" : "text-zinc-900"}`}
        style={{ fontFamily: "Syne, sans-serif" }}
      >
        {value}
      </p>
    </div>
  );
}

export default function MyProfilePage({ dark }) {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/api/users/me");
        if (res?.ok) {
          const d = await res.json();
          setProfile(d);
          setUsername(d.username);
          setHistory(d.history ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    if (username.trim().length < 3) {
      setUsernameErr("Minimum 3 caractères");
      return;
    }
    setSaveLoading(true);
    try {
      const res = await apiFetch("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({ username }),
      });
      if (!res?.ok) throw new Error("Erreur lors de la mise à jour");
      setProfile((p) => ({ ...p, username }));
      setEditing(false);
      setUsernameErr("");
    } catch (e) {
      setUsernameErr(e.message);
    } finally {
      setSaveLoading(false);
    }
  }

  function handleCancel() {
    setUsername(profile?.username ?? "");
    setUsernameErr("");
    setEditing(false);
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <span className="w-8 h-8 rounded-full border-2 border-white/10 border-t-green-500 animate-spin" />
      </div>
    );

  const p = profile || {};
  const total = p.stats?.total_predictions ?? 0;
  const exact = 0;
  const bon = p.stats?.correct ?? 0;
  const mauvais = total - exact - bon;
  const taux = Math.round(p.stats?.success_rate ?? 0);
  const color = avatarColor(username);
  const joinDate = p.created_at
    ? new Date(p.created_at).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const inputBase = `text-sm rounded-xl px-3 py-2 outline-none transition-all duration-150 ${
    dark
      ? "bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-green-500/50"
      : "bg-zinc-50 border border-zinc-200 text-zinc-900 focus:border-green-400"
  }`;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8 fade-up fade-up-1">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={13} className="text-green-500 fill-green-500" />
          <p
            className="text-xs font-bold text-green-500 uppercase tracking-widest"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Mon profil
          </p>
        </div>
        <h1
          className={`text-5xl font-black tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Tableau de bord
        </h1>
      </div>

      {/* carte profil */}
      <div
        className={`rounded-3xl p-8 mb-6 relative overflow-hidden fade-up fade-up-2 ${dark ? "glass" : "bg-white shadow-xl border border-zinc-100"}`}
      >
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: color }}
        />
        <div className="flex items-start gap-6 relative">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shrink-0"
            style={{
              background: color,
              boxShadow: `0 12px 40px ${color}50`,
              fontFamily: "Syne, sans-serif",
            }}
          >
            {(username || "?")[0].toUpperCase()}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameErr("");
                  }}
                  className={`${inputBase} text-lg font-black w-48`}
                  style={{ fontFamily: "Syne, sans-serif" }}
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-all"
                >
                  {saveLoading ? (
                    <span className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dark ? "bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10" : "bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-zinc-200"}`}
                >
                  <X size={13} />
                </button>
                {usernameErr && (
                  <p className="text-xs text-red-400">{usernameErr}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-2">
                <h1
                  className={`text-2xl font-black tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {username}
                </h1>
                <button
                  onClick={() => setEditing(true)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${dark ? "text-zinc-600 hover:text-zinc-300 hover:bg-white/5" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"}`}
                >
                  <Edit2 size={12} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`text-sm ${dark ? "text-zinc-500" : "text-zinc-400"}`}
              >
                {p.email}
              </span>
              <span
                className={`text-xs ${dark ? "text-zinc-700" : "text-zinc-300"}`}
              >
                ·
              </span>
              {p.rank && (
                <div className="flex items-center gap-1.5">
                  <Crown size={11} className="text-yellow-400" />
                  <span
                    className={`text-sm font-semibold ${dark ? "text-zinc-300" : "text-zinc-600"}`}
                  >
                    #{p.rank} au classement
                  </span>
                </div>
              )}
              <span
                className={`text-xs ${dark ? "text-zinc-700" : "text-zinc-300"}`}
              >
                ·
              </span>
              <div className="flex items-center gap-1.5">
                <Calendar
                  size={11}
                  className={dark ? "text-zinc-600" : "text-zinc-400"}
                />
                <span
                  className={`text-sm ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  Membre depuis {joinDate}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p
              className={`text-5xl font-black tabular-nums ${dark ? "text-white" : "text-zinc-900"}`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {p.points_total ?? 0}
            </p>
            <p
              className={`text-xs font-medium ${dark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              points totaux
            </p>
          </div>
        </div>
        {/* barre réussite */}
        <div className="mt-6">
          <div
            className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/8" : "bg-zinc-100"}`}
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-400 transition-all"
              style={{ width: `${taux}%` }}
            />
          </div>
          <p
            className={`text-xs mt-1.5 ${dark ? "text-zinc-600" : "text-zinc-400"}`}
          >
            {taux}% de réussite globale
          </p>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 fade-up fade-up-3">
        <StatCard
          icon={Target}
          label="Pronostics"
          value={total}
          color="text-blue-400"
          dark={dark}
        />
        <StatCard
          icon={Star}
          label="Score exact"
          value={exact}
          color="text-green-400"
          dark={dark}
        />
        <StatCard
          icon={Check}
          label="Bon résultat"
          value={bon}
          color="text-orange-400"
          dark={dark}
        />
        <StatCard
          icon={TrendingUp}
          label="Réussite"
          value={`${taux}%`}
          color="text-purple-400"
          dark={dark}
        />
      </div>

      {/* répartition */}
      {total > 0 && (
        <div
          className={`rounded-2xl p-5 mb-8 fade-up fade-up-4 ${dark ? "glass" : "bg-white shadow-lg border border-zinc-100"}`}
        >
          <h2
            className={`text-xs font-black uppercase tracking-widest mb-4 ${dark ? "text-zinc-500" : "text-zinc-400"}`}
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Répartition des pronostics
          </h2>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
            <div
              className="bg-green-500 rounded-l-full"
              style={{ width: `${(exact / total) * 100}%` }}
            />
            <div
              className="bg-orange-400"
              style={{ width: `${(bon / total) * 100}%` }}
            />
            <div
              className="bg-red-500/60 rounded-r-full"
              style={{ width: `${(Math.max(0, mauvais) / total) * 100}%` }}
            />
          </div>
          <div className="flex gap-5">
            {[
              {
                label: "Score exact",
                value: exact,
                color: "bg-green-500",
                text: "text-green-400",
              },
              {
                label: "Bon résultat",
                value: bon,
                color: "bg-orange-400",
                text: "text-orange-400",
              },
              {
                label: "Raté",
                value: Math.max(0, mauvais),
                color: "bg-red-500/60",
                text: "text-red-400",
              },
            ].map(({ label, value, color, text }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span
                  className={`text-xs ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  {label}
                </span>
                <span className={`text-xs font-bold ${text}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* historique */}
      <div className="fade-up fade-up-5">
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Mes derniers pronostics
          </h2>
          <Link
            to="/leaderboard"
            className="text-xs font-semibold text-green-500 hover:text-green-400 transition-colors"
          >
            Voir le classement →
          </Link>
        </div>
        <div
          className={`rounded-2xl overflow-hidden ${dark ? "glass" : "bg-white shadow-lg border border-zinc-100"}`}
        >
          <div
            className={`divide-y ${dark ? "divide-white/4" : "divide-zinc-100"}`}
          >
            {history.length === 0 ? (
              <p
                className={`text-sm text-center py-8 ${dark ? "text-zinc-600" : "text-zinc-400"}`}
              >
                Aucun pronostic pour l'instant.
              </p>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-5 py-3.5 fade-up fade-up-${Math.min(i + 1, 7)}`}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${dark ? "text-zinc-200" : "text-zinc-800"}`}
                      style={{ fontFamily: "Syne, sans-serif" }}
                    >
                      {h.home_team} — {h.away_team}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      {new Date(h.match_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  {/* prono */}
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tabular-nums ${dark ? "bg-white/5 border border-white/8" : "bg-zinc-50 border border-zinc-200"}`}
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    <span className={dark ? "text-zinc-500" : "text-zinc-400"}>
                      Prono
                    </span>
                    <span className={dark ? "text-zinc-200" : "text-zinc-800"}>
                      {h.home_score_pred}-{h.away_score_pred}
                    </span>
                  </div>

                  {/* résultat réel — seulement si le match est terminé */}
                  {h.home_score != null && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tabular-nums ${dark ? "bg-white/5 border border-white/8" : "bg-zinc-50 border border-zinc-200"}`}
                      style={{ fontFamily: "Syne, sans-serif" }}
                    >
                      <span
                        className={dark ? "text-zinc-500" : "text-zinc-400"}
                      >
                        Résultat
                      </span>
                      <span
                        className={dark ? "text-zinc-200" : "text-zinc-800"}
                      >
                        {h.home_score}-{h.away_score}
                      </span>
                    </div>
                  )}

                  {/* points */}
                  {h.points_earned != null && (
                    <PointsBadge points={h.points_earned} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* déconnexion */}
      <div className="mt-8 fade-up fade-up-6">
        <button
          onClick={logout}
          className={`text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all ${dark ? "border-white/10 text-zinc-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5" : "border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50"}`}
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Se déconnecter
        </button>
      </div>
    </main>
  );
}
