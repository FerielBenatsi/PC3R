import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Star, TrendingUp, Calendar, Crown, Medal } from "lucide-react";
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
  "#f97316",
  "#06b6d4",
];
const avatarColor = (name) =>
  AVATAR_COLORS[(name || "?").charCodeAt(0) % AVATAR_COLORS.length];

function Avatar({ username }) {
  return (
    <div
      className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-black text-white text-sm"
      style={{
        background: avatarColor(username),
        fontFamily: "Space Grotesk, sans-serif",
      }}
    >
      {(username || "?")[0].toUpperCase()}
    </div>
  );
}

function RankIcon({ rank }) {
  if (rank === 1)
    return <Crown size={14} className="text-yellow-400 fill-yellow-400" />;
  if (rank === 2)
    return <Medal size={14} className="text-zinc-400 fill-zinc-400" />;
  if (rank === 3)
    return <Medal size={14} className="text-amber-600 fill-amber-600" />;
  return null;
}

function RankBadge({ rank, dark }) {
  const configs = {
    1: {
      bg: "bg-yellow-500/15",
      border: "border-yellow-500/30",
      text: "text-yellow-400",
    },
    2: {
      bg: "bg-zinc-400/15",
      border: "border-zinc-400/30",
      text: "text-zinc-400",
    },
    3: {
      bg: "bg-amber-700/15",
      border: "border-amber-700/30",
      text: "text-amber-600",
    },
  };
  const cfg = configs[rank] || {
    bg: dark ? "bg-white/5" : "bg-zinc-100",
    border: dark ? "border-white/8" : "border-zinc-200",
    text: dark ? "text-zinc-500" : "text-zinc-400",
  };
  return (
    <div
      className={`w-8 h-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}
    >
      <span
        className={`text-xs font-black ${cfg.text}`}
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        {rank}
      </span>
    </div>
  );
}

function PodiumCard({ player, dark }) {
  const isFirst = player.rank === 1;
  return (
    <div
      className={`relative flex flex-col items-center gap-3 rounded-2xl p-5 transition-all ${
        isFirst
          ? dark
            ? "bg-yellow-500/8 border border-yellow-500/20"
            : "bg-yellow-50 border border-yellow-200"
          : dark
            ? "glass"
            : "bg-white shadow-md border border-zinc-100"
      } ${isFirst ? "py-7" : ""}`}
    >
      {isFirst && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Crown size={20} className="text-yellow-400 fill-yellow-400" />
        </div>
      )}
      <RankBadge rank={player.rank} dark={dark} />
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-lg"
        style={{
          background: avatarColor(player.username),
          fontFamily: "Space Grotesk, sans-serif",
        }}
      >
        {player.username[0].toUpperCase()}
      </div>
      <div className="text-center">
        <p
          className={`text-sm font-black ${dark ? "text-white" : "text-zinc-900"}`}
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {player.username}
        </p>
        <p
          className={`text-xl font-black mt-1 ${isFirst ? "text-yellow-400" : dark ? "text-white" : "text-zinc-900"}`}
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {player.points}
        </p>
        <p className={`text-xs ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
          points
        </p>
      </div>
    </div>
  );
}

function PlayerRow({ player, dark, isMe, maxPts }) {
  return (
    <Link
      to={`/profile/${player.user_id}`}
      className={`flex items-center gap-4 px-5 py-3.5 transition-all duration-150 group ${
        isMe
          ? dark
            ? "bg-blue-500/5"
            : "bg-blue-50"
          : dark
            ? "hover:bg-white/3"
            : "hover:bg-zinc-50"
      }`}
    >
      <RankBadge rank={player.rank} dark={dark} />
      <Avatar username={player.username} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-bold ${dark ? "text-zinc-200" : "text-zinc-800"}`}
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {player.username}
          </span>
          {isMe && (
            <span className="text-[10px] font-bold text-blue-500 px-1.5 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/25">
              moi
            </span>
          )}
          <RankIcon rank={player.rank} />
        </div>
       
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 hidden sm:block">
          <div
            className={`h-1.5 rounded-full overflow-hidden ${dark ? "bg-white/8" : "bg-zinc-100"}`}
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all"
              style={{
                width: maxPts > 0 ? `${(player.points / maxPts) * 100}%` : "0%",
              }}
            />
          </div>
        </div>
        <span
          className={`text-sm font-black w-12 text-right tabular-nums ${dark ? "text-white" : "text-zinc-900"}`}
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {player.points}
        </span>
        <span className={`text-xs ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
          pts
        </span>
      </div>
    </Link>
  );
}

export default function LeaderboardPage({ dark }) {
  const [tab, setTab] = useState("global");
  const [globalData, setGlobalData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await apiFetch("/api/leaderboard");
        if (res?.ok) {
          const d = await res.json();
          setGlobalData(d.global ?? []);
          setWeeklyData(d.weekly ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const data = tab === "global" ? globalData : weeklyData;
  const maxPts = data[0]?.points ?? 1;
  const me = user
    ? data.find((p) => p.user_id === user.id || p.username === user.username)
    : null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10 fade-up fade-up-1">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={14} className="text-blue-500" />
          <p
            className="text-xs font-bold text-blue-500 uppercase tracking-widest"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Classement
          </p>
        </div>
        <h1
          className={`text-5xl font-black tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Top joueurs
        </h1>
      </div>

      {/* podium */}
      {tab === "global" && !loading && globalData.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-8 fade-up fade-up-2">
          {[globalData[1], globalData[0], globalData[2]].map((p) => (
            <PodiumCard key={p.rank} player={p} dark={dark} maxPts={maxPts} />
          ))}
        </div>
      )}

      {/* tabs */}
      <div
        className={`flex gap-1 p-1 rounded-2xl mb-4 w-fit fade-up fade-up-3 ${dark ? "bg-white/5" : "bg-zinc-100"}`}
      >
        {[
          { key: "global", icon: TrendingUp, label: "Général" },
          { key: "weekly", icon: Calendar, label: "Cette semaine" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150 ${
              tab === key
                ? dark
                  ? "bg-white/10 text-white"
                  : "bg-white text-zinc-900 shadow-sm"
                : dark
                  ? "text-zinc-500 hover:text-zinc-300"
                  : "text-zinc-400 hover:text-zinc-600"
            }`}
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ma position */}
      {me && (
        <div
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl mb-4 border fade-up fade-up-3 ${
            dark
              ? "bg-blue-500/5 border-blue-500/15"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <Star size={13} className="text-blue-500 shrink-0" />
          <p
            className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-zinc-600"}`}
          >
            Tu es <span className="font-black text-blue-500">#{me.rank}</span>{" "}
            avec{" "}
            <span className="font-black text-blue-500">{me.points} pts</span>
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
        </div>
      ) : (
        <div
          className={`rounded-2xl overflow-hidden fade-up fade-up-4 ${dark ? "glass" : "bg-white shadow-lg border border-zinc-100"}`}
        >
          <div
            className={`divide-y ${dark ? "divide-white/4" : "divide-zinc-100"}`}
          >
            {data.length === 0 ? (
              <p
                className={`text-sm text-center py-8 ${dark ? "text-zinc-600" : "text-zinc-400"}`}
              >
                Aucune donnée disponible.
              </p>
            ) : (
              data.map((player, i) => (
                <div
                  key={player.username}
                  className={`fade-up fade-up-${Math.min(i + 1, 7)}`}
                >
                  <PlayerRow
                    player={player}
                    dark={dark}
                    isMe={player.username === user?.username}
                    maxPts={maxPts}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}
