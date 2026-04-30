import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trophy,
  MessageCircle,
  Send,
  Star,
  Lock,
  Check,
  Minus,
  Target,
  AlertCircle,
} from "lucide-react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/useAuth";

const TEAM_COLORS = {
  "Inter Milan": "#010E80",
  Juventus: "#222222",
  PSG: "#004170",
  "Olympique Lyonnais": "#BB1515",
  Arsenal: "#EF0107",
  Chelsea: "#034694",
  "Manchester City": "#6CABDD",
  Liverpool: "#C8102E",
  "Real Madrid": "#FEBE10",
  Barcelona: "#A50044",
  "Bayern Munich": "#DC052D",
  Dortmund: "#FDE100",
  Marseille: "#2faee0",
  Monaco: "#E8192C",
};
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
const TEAM_INITIALS = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

function Avatar({ username, size = "md" }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sz} rounded-xl shrink-0 flex items-center justify-center font-black text-white`}
      style={{
        background: avatarColor(username),
        fontFamily: "Syne, sans-serif",
      }}
    >
      {(username || "?")[0].toUpperCase()}
    </div>
  );
}

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

function ScoreInput({ value, onChange, dark }) {
  const num = value === "" ? 0 : parseInt(value);
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(String(num + 1))}
        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-green-500/20 hover:border-green-500/40 text-zinc-400 hover:text-green-400 transition-all flex items-center justify-center text-sm font-bold"
      >
        +
      </button>
      <div
        className={`w-16 h-14 rounded-2xl border-2 flex items-center justify-center ${dark ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"}`}
      >
        <span
          className={`text-2xl font-black tabular-nums ${dark ? "text-white" : "text-zinc-900"}`}
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          {value === "" ? "–" : value}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onChange(String(Math.max(0, num - 1)))}
        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 transition-all flex items-center justify-center text-sm font-bold"
      >
        −
      </button>
    </div>
  );
}

const fmt = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
const fmtComment = (d) =>
  new Date(d).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function MatchDetailPage({ dark }) {
  const { id } = useParams();
  const { user } = useAuth();

  const [match, setMatch] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [comments, setComments] = useState([]);
  const [myPrediction, setMyPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [homeInput, setHomeInput] = useState("");
  const [awayInput, setAwayInput] = useState("");
  const [pronoSent, setPronoSent] = useState(false);
  const [pronoLoading, setPronoLoading] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [mRes, pRes, cRes] = await Promise.all([
          apiFetch(`/api/matches/${id}`),
          apiFetch(`/api/matches/${id}/predictions`),
          apiFetch(`/api/matches/${id}/comments`),
        ]);
        if (!mRes?.ok) throw new Error("Match introuvable");
        const mData = await mRes.json();
        setMatch(mData);

        if (pRes?.ok) {
          const pData = await pRes.json();
          const list = Array.isArray(pData) ? pData : (pData.predictions ?? []);
          setPredictions(list);
          if (user) {
            const mine = list.find(
              (p) => p.user_id === user.id || p.username === user.username,
            );
            if (mine) {
              setMyPrediction(mine);
              setPronoSent(true);
            }
          }
        }
        if (cRes?.ok) {
          const cData = await cRes.json();
          setComments(Array.isArray(cData) ? cData : (cData.comments ?? []));
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  async function handleProno() {
    if (homeInput === "" || awayInput === "" || !user) return;
    setPronoLoading(true);
    try {
      const res = await apiFetch(`/api/matches/${id}/predictions`, {
        method: "POST",
        body: JSON.stringify({
          home_score_pred: parseInt(homeInput),
          away_score_pred: parseInt(awayInput),
        }),
      });
      if (!res?.ok) throw new Error("Erreur lors de l'envoi du pronostic");
      setPronoSent(true);
    } catch (e) {
      alert(e.message);
    } finally {
      setPronoLoading(false);
    }
  }

  async function handleComment() {
    if (!commentText.trim() || !user) return;
    setCommentLoading(true);
    try {
      const res = await apiFetch(`/api/matches/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: commentText }),
      });
      if (!res?.ok) throw new Error("Erreur lors de l'envoi");
      const newC = await res.json();
      setComments((c) => [...c, newC]);
      setCommentText("");
    } catch (e) {
      alert(e.message);
    } finally {
      setCommentLoading(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <span className="w-8 h-8 rounded-full border-2 border-white/10 border-t-green-500 animate-spin" />
      </div>
    );

  if (error || !match)
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-8"
        >
          <ArrowLeft size={14} />
          Retour
        </Link>
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <AlertCircle size={16} className="text-red-400" />
          <p className="text-sm text-red-400">{error || "Match introuvable"}</p>
        </div>
      </main>
    );

  const isFinished = match.status === "FINISHED";
  const isLive = match.status === "IN_PLAY";
  const isScheduled = match.status === "SCHEDULED";
  const homeColor = TEAM_COLORS[match.home_team] || "#6b7280";
  const awayColor = TEAM_COLORS[match.away_team] || "#6b7280";

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8 fade-up fade-up-1"
      >
        <ArrowLeft size={14} />
        Retour aux matchs
      </Link>

      {/* hero */}
      <div
        className={`rounded-3xl p-8 mb-6 relative overflow-hidden fade-up fade-up-2 ${dark ? "glass" : "bg-white shadow-xl border border-zinc-100"}`}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div
            className="absolute -left-24 -top-24 w-72 h-72 rounded-full blur-3xl opacity-25"
            style={{ background: homeColor }}
          />
          <div
            className="absolute -right-24 -top-24 w-72 h-72 rounded-full blur-3xl opacity-25"
            style={{ background: awayColor }}
          />
        </div>
        <div className="flex items-center justify-between mb-10 relative">
          <div className="flex items-center gap-2">
            <Trophy size={12} className="text-green-500" />
            <span
              className="text-xs font-bold text-green-500 uppercase tracking-widest"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {match.competition}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isLive && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 border border-green-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-400">
                  En direct
                </span>
              </div>
            )}
            {isFinished && (
              <span className="text-xs font-medium text-zinc-500 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-700/40">
                Terminé
              </span>
            )}
            <span
              className={`text-xs ${dark ? "text-zinc-600" : "text-zinc-400"} flex items-center gap-1`}
            >
              <Calendar size={11} />
              {fmt(match.match_date)}
            </span>
            <span
              className={`text-xs ${dark ? "text-zinc-600" : "text-zinc-400"} flex items-center gap-1`}
            >
              <Clock size={11} />
              {fmtTime(match.match_date)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between relative">
          {[
            { team: match.home_team, color: homeColor, label: "Domicile" },
            null,
            { team: match.away_team, color: awayColor, label: "Extérieur" },
          ].map((side, i) => {
            if (i === 1)
              return (
                <div
                  key="score"
                  className="flex flex-col items-center gap-2 px-8"
                >
                  {isScheduled ? (
                    <span
                      className={`text-3xl font-black ${dark ? "text-zinc-700" : "text-zinc-300"}`}
                      style={{ fontFamily: "Syne, sans-serif" }}
                    >
                      VS
                    </span>
                  ) : (
                    <div className="flex items-center gap-5">
                      <span
                        className={`text-6xl font-black tabular-nums ${isLive ? "text-green-400" : dark ? "text-white" : "text-zinc-900"}`}
                        style={{ fontFamily: "Syne, sans-serif" }}
                      >
                        {match.home_score}
                      </span>
                      <span
                        className={`text-2xl font-light ${dark ? "text-zinc-700" : "text-zinc-300"}`}
                      >
                        —
                      </span>
                      <span
                        className={`text-6xl font-black tabular-nums ${isLive ? "text-green-400" : dark ? "text-white" : "text-zinc-900"}`}
                        style={{ fontFamily: "Syne, sans-serif" }}
                      >
                        {match.away_score}
                      </span>
                    </div>
                  )}
                </div>
              );
            return (
              <div
                key={side.team}
                className="flex flex-col items-center gap-3 flex-1"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-2xl"
                  style={{
                    background: side.color,
                    boxShadow: `0 8px 32px ${side.color}55`,
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  {TEAM_INITIALS(side.team)}
                </div>
                <span
                  className={`text-base font-black text-center ${dark ? "text-white" : "text-zinc-900"}`}
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {side.team}
                </span>
                <span
                  className={`text-xs ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                >
                  {side.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* pronostic */}
      <div
        className={`rounded-2xl p-6 mb-6 fade-up fade-up-3 ${dark ? "glass" : "bg-white shadow-lg border border-zinc-100"}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Target size={14} className="text-green-500" />
          <h2
            className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-zinc-500"}`}
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Mon pronostic
          </h2>
        </div>

        {!user ? (
          <div className="flex items-center gap-2.5 text-sm text-zinc-500">
            <Lock size={13} />
            <span>
              <Link to="/login" className="text-green-500 hover:text-green-400">
                Connecte-toi
              </Link>{" "}
              pour pronostiquer.
            </span>
          </div>
        ) : isFinished || isLive ? (
          <div className="flex items-center gap-2.5 text-sm text-zinc-500">
            <Lock size={13} />
            <span>
              Pronostics fermés — le match{" "}
              {isLive ? "est en cours" : "est terminé"}.
            </span>
          </div>
        ) : pronoSent ? (
          <div className="flex items-center gap-4 py-1">
            <div className="w-9 h-9 rounded-xl bg-green-500/15 border border-green-500/25 flex items-center justify-center shrink-0">
              <Check size={15} className="text-green-400" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${dark ? "text-white" : "text-zinc-900"}`}
              >
                Pronostic enregistré —{" "}
                <span
                  className="text-green-400"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {myPrediction
                    ? `${myPrediction.home_score_pred} : ${myPrediction.away_score_pred}`
                    : `${homeInput} : ${awayInput}`}
                </span>
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Points calculés après le match
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <span
              className={`text-sm font-bold flex-1 text-right ${dark ? "text-zinc-300" : "text-zinc-700"}`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {match.home_team}
            </span>
            <div className="flex items-center gap-3">
              <ScoreInput
                value={homeInput}
                onChange={setHomeInput}
                dark={dark}
              />
              <span
                className={`text-xl font-light ${dark ? "text-zinc-600" : "text-zinc-400"}`}
              >
                :
              </span>
              <ScoreInput
                value={awayInput}
                onChange={setAwayInput}
                dark={dark}
              />
            </div>
            <span
              className={`text-sm font-bold flex-1 ${dark ? "text-zinc-300" : "text-zinc-700"}`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {match.away_team}
            </span>
            <button
              onClick={handleProno}
              disabled={homeInput === "" || awayInput === "" || pronoLoading}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-green-500 hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/20"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {pronoLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
              ) : (
                "Valider"
              )}
            </button>
          </div>
        )}
      </div>

      {/* tabs */}
      <div className="fade-up fade-up-4">
        <div
          className={`flex gap-1 p-1 rounded-2xl mb-4 w-fit ${dark ? "bg-white/5" : "bg-zinc-100"}`}
        >
          {[
            {
              key: "comments",
              icon: MessageCircle,
              label: `Commentaires (${comments.length})`,
            },
            {
              key: "predictions",
              icon: Trophy,
              label: `Pronostics (${predictions.length})`,
            },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150 ${
                activeTab === key
                  ? dark
                    ? "bg-white/10 text-white"
                    : "bg-white text-zinc-900 shadow-sm"
                  : dark
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-zinc-400 hover:text-zinc-600"
              }`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* commentaires */}
        {activeTab === "comments" && (
          <div
            className={`rounded-2xl overflow-hidden ${dark ? "glass" : "bg-white shadow-lg border border-zinc-100"}`}
          >
            <div className="divide-y divide-white/4">
              {comments.length === 0 && (
                <p
                  className={`text-sm text-center py-8 ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                >
                  Aucun commentaire pour l'instant.
                </p>
              )}
              {comments.map((c, i) => (
                <div
                  key={c.id ?? i}
                  className={`flex gap-3.5 px-5 py-4 fade-up fade-up-${Math.min(i + 1, 7)}`}
                >
                  <Avatar username={c.username} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-sm font-bold ${dark ? "text-white" : "text-zinc-900"}`}
                        style={{ fontFamily: "Syne, sans-serif" }}
                      >
                        {c.username}
                      </span>
                      <span
                        className={`text-xs ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                      >
                        {fmtComment(c.created_at)}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${dark ? "text-zinc-300" : "text-zinc-600"}`}
                    >
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {user && (
              <div
                className={`px-5 py-4 border-t ${dark ? "border-white/4" : "border-zinc-100"}`}
              >
                <div className="flex gap-3 items-center">
                  <Avatar username={user.username} size="sm" />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Ajouter un commentaire..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleComment()}
                      className={`flex-1 text-sm rounded-xl px-4 py-2.5 outline-none transition-all ${
                        dark
                          ? "bg-white/4 border border-white/8 text-white placeholder-zinc-600 focus:border-green-500/50"
                          : "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-green-400"
                      }`}
                    />
                    <button
                      onClick={handleComment}
                      disabled={!commentText.trim() || commentLoading}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white shadow-lg shadow-green-500/20"
                    >
                      {commentLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* pronostics */}
        {activeTab === "predictions" && (
          <div
            className={`rounded-2xl overflow-hidden ${dark ? "glass" : "bg-white shadow-lg border border-zinc-100"}`}
          >
            <div className="divide-y divide-white/4">
              {predictions.length === 0 && (
                <p
                  className={`text-sm text-center py-8 ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                >
                  Aucun pronostic pour l'instant.
                </p>
              )}
              {predictions.map((p, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <Avatar username={p.username} size="sm" />
                  <span
                    className={`text-sm font-bold flex-1 ${dark ? "text-zinc-200" : "text-zinc-700"}`}
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {p.username}
                  </span>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tabular-nums ${dark ? "bg-white/5 border border-white/8" : "bg-zinc-50 border border-zinc-200"}`}
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    <span
                      className={`text-sm font-black tabular-nums ${dark ? "text-zinc-200" : "text-zinc-800"}`}
                    >
                      {p.home_score_pred}
                    </span>
                    <span
                      className={`text-xs ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      —
                    </span>
                    <span
                      className={`text-sm font-black tabular-nums ${dark ? "text-zinc-200" : "text-zinc-800"}`}
                    >
                      {p.away_score_pred}
                    </span>
                  </div>
                  {p.points != null && <PointsBadge points={p.points} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
