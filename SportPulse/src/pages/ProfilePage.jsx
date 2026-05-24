import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  Target,
  Star,
  TrendingUp,
  MessageCircle,
  Check,
  Minus,
  Calendar,
  AlertCircle,
  Clock,
} from "lucide-react";
import { apiFetch } from "../services/api";

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
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 w-16 justify-center">
        <Star size={9} className="text-blue-500 fill-blue-500" />
        <span
          className="text-[8px] font-black text-blue-500"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
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
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          1 pt
        </span>
      </div>
    );
  if (points === 0)
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/15 border border-red-500/30 w-16 justify-center">
        <Minus size={9} className="text-red-400" />
        <span
          className="text-[8px] font-black text-red-400"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          0 pt
        </span>
      </div>
    );
  // null = en attente
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-500/15 border border-zinc-500/30 w-16 justify-center">
      <Clock size={9} className="text-zinc-400" />
      <span
        className="text-[8px] font-black text-zinc-400"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        attente
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
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        {value}
      </p>
    </div>
  );
}

export default function ProfilePage({ dark }) {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch(`/api/users/${id}`);
        if (!res?.ok) throw new Error("Utilisateur introuvable");
        const d = await res.json();
        setProfile(d);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <span className="w-8 h-8 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
      </div>
    );

  if (error || !profile)
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8"
        >
          <ArrowLeft size={14} />
          Retour au classement
        </Link>
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <AlertCircle size={16} className="text-red-400" />
          <p className="text-sm text-red-400">
            {error || "Utilisateur introuvable"}
          </p>
        </div>
      </main>
    );

  const p = profile;
  const total = p.stats?.total_predictions ?? 0;
  const correct = p.stats?.correct ?? 0;
  const wrong = p.stats?.wrong ?? 0; // vrais ratés
  const pending = p.stats?.pending ?? 0; // en attente
  const taux = Math.round(p.stats?.success_rate ?? 0);
  const color = avatarColor(p.username);
  const history = p.history ?? [];

  const joinDate = p.created_at
    ? new Date(p.created_at).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <Link
        to="/leaderboard"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8 fade-up fade-up-1"
      >
        <ArrowLeft size={14} />
        Retour au classement
      </Link>

      {/* carte profil */}
      <div
        className={`rounded-3xl p-8 mb-6 relative overflow-hidden fade-up fade-up-2 ${dark ? "glass" : "bg-white shadow-xl border border-zinc-100"}`}
      >
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: color }}
        />
        <div className="flex items-center gap-6 relative">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shrink-0"
            style={{
              background: color,
              boxShadow: `0 12px 40px ${color}50`,
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            {p.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1
              className={`text-3xl font-black tracking-tight mb-1 ${dark ? "text-white" : "text-zinc-900"}`}
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {p.username}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              {p.rank && (
                <div className="flex items-center gap-1.5">
                  <Trophy size={12} className="text-yellow-400" />
                  <span
                    className={`text-sm font-semibold ${dark ? "text-zinc-300" : "text-zinc-600"}`}
                  >
                    #{p.rank} au classement
                  </span>
                </div>
              )}
              <span
                className={`text-xs ${dark ? "text-zinc-600" : "text-zinc-400"}`}
              >
                ·
              </span>
              <div className="flex items-center gap-1.5">
                <Calendar
                  size={12}
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
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
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
        <div className="mt-6">
          <div
            className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/8" : "bg-zinc-100"}`}
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all"
              style={{ width: `${taux}%` }}
            />
          </div>
          <p
            className={`text-xs mt-1.5 ${dark ? "text-zinc-600" : "text-zinc-400"}`}
          >
            {taux}% de réussite sur matchs évalués
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
          label="Corrects"
          value={correct}
          color="text-blue-400"
          dark={dark}
        />
        <StatCard
          icon={Check}
          label="Ratés"
          value={wrong}
          color="text-red-400"
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
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Répartition des pronostics
          </h2>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
            <div
              className="bg-blue-500 rounded-l-full"
              style={{ width: `${(correct / total) * 100}%` }}
            />
            <div
              className="bg-red-500/60"
              style={{ width: `${(wrong / total) * 100}%` }}
            />
            <div
              className="bg-zinc-500/60 rounded-r-full"
              style={{ width: `${(pending / total) * 100}%` }}
            />
          </div>
          <div className="flex gap-5 flex-wrap">
            {[
              {
                label: "Corrects",
                value: correct,
                color: "bg-blue-500",
                text: "text-blue-400",
              },
              {
                label: "Ratés",
                value: wrong,
                color: "bg-red-500/60",
                text: "text-red-400",
              },
              {
                label: "En attente",
                value: pending,
                color: "bg-zinc-500/60",
                text: "text-zinc-400",
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
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle
            size={14}
            className={dark ? "text-zinc-500" : "text-zinc-400"}
          />
          <h2
            className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Historique des pronostics
          </h2>
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
                  className={`flex items-center gap-4 px-5 py-3.5 fade-up fade-up-${Math.min(i + 1, 7)}`}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${dark ? "text-zinc-200" : "text-zinc-800"}`}
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
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
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    <span className={dark ? "text-zinc-500" : "text-zinc-400"}>
                      Prono
                    </span>
                    <span className={dark ? "text-zinc-200" : "text-zinc-800"}>
                      {h.home_score_pred}-{h.away_score_pred}
                    </span>
                  </div>

                  {/* résultat réel */}
                  {h.home_score != null && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tabular-nums ${dark ? "bg-white/5 border border-white/8" : "bg-zinc-50 border border-zinc-200"}`}
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
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

                  <PointsBadge points={h.points_earned} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
