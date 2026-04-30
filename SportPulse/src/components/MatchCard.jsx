import { Link } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";

const TEAM_INITIALS = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

const TEAM_COLORS = {
  PSG: "#004170",
  "Olympique Lyonnais": "#BB1515",
  Marseille: "#2faee0",
  Monaco: "#E8192C",
  Arsenal: "#EF0107",
  Chelsea: "#034694",
  "Manchester City": "#6CABDD",
  Liverpool: "#C8102E",
  "Inter Milan": "#010E80",
  Juventus: "#000000",
  "Real Madrid": "#FEBE10",
  Barcelona: "#A50044",
  "Bayern Munich": "#DC052D",
  Dortmund: "#FDE100",
};

function TeamBadge({ name, dark }) {
  const color = TEAM_COLORS[name] || "#6b7280";
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-black shrink-0"
      style={{
        background: color,
        boxShadow: `0 4px 12px ${color}40`,
        fontFamily: "Syne, sans-serif",
      }}
    >
      {TEAM_INITIALS(name)}
    </div>
  );
}

// ✅ parse correctement le format "2026-05-01 20:45:00" du backend
function parseDate(dateStr) {
  if (!dateStr) return new Date();
  // si déjà au format ISO avec T, on laisse tel quel
  if (dateStr.includes("T")) return new Date(dateStr);
  // sinon on convertit "2026-05-01 20:45:00" → "2026-05-01T20:45:00Z"
  return new Date(dateStr.replace(" ", "T") + "Z");
}

function formatDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(dateStr) {
  return parseDate(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MatchCard({ match, dark, index = 0 }) {
  const {
    id,
    home_team,
    away_team,
    match_date,
    status,
    home_score,
    away_score,
  } = match;

  const isFinished = status === "FINISHED";
  const isLive = status === "IN_PLAY";
  // ✅ TIMED = matchs programmés côté football-data.org
  const isScheduled = status === "SCHEDULED" || status === "TIMED";

  return (
    <Link
      to={`/match/${id}`}
      className={`block card-hover rounded-2xl group fade-up fade-up-${Math.min(index + 1, 7)}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl p-4 ${
          dark ? "glass" : "glass-light shadow-sm"
        } ${isLive ? "border-green-500/30" : ""}`}
      >
        {isLive && (
          <div className="absolute left-0 top-4 bottom-4 w-0.75 bg-linear-to-b from-green-400 to-emerald-600 rounded-full" />
        )}
        {isLive && (
          <div className="absolute inset-0 bg-green-500/3 rounded-2xl pointer-events-none" />
        )}

        <div className="flex items-center gap-3 pl-1">
          {/* équipe domicile */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <TeamBadge name={home_team} dark={dark} />
            <span
              className={`text-sm font-semibold truncate ${
                dark ? "text-zinc-100" : "text-zinc-800"
              }`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {home_team}
            </span>
          </div>

          {/* centre — heure ou score */}
          <div className="flex flex-col items-center gap-0.5 shrink-0 px-2">
            {isScheduled ? (
              <div className="flex flex-col items-center">
                <span
                  className={`text-[10px] font-medium uppercase tracking-wider ${
                    dark ? "text-zinc-600" : "text-zinc-400"
                  }`}
                >
                  {formatDate(match_date)}
                </span>
                <div
                  className={`flex items-center gap-1 mt-0.5 px-3 py-1 rounded-lg ${
                    dark ? "bg-white/5" : "bg-zinc-100"
                  }`}
                >
                  <Clock
                    size={10}
                    className={dark ? "text-zinc-400" : "text-zinc-500"}
                  />
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      dark ? "text-zinc-200" : "text-zinc-700"
                    }`}
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {formatTime(match_date)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-2xl font-black tabular-nums ${
                      isLive
                        ? "text-green-400"
                        : dark
                          ? "text-white"
                          : "text-zinc-900"
                    }`}
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {home_score}
                  </span>
                  <span
                    className={`text-xs font-light ${dark ? "text-zinc-600" : "text-zinc-300"}`}
                  >
                    —
                  </span>
                  <span
                    className={`text-2xl font-black tabular-nums ${
                      isLive
                        ? "text-green-400"
                        : dark
                          ? "text-white"
                          : "text-zinc-900"
                    }`}
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {away_score}
                  </span>
                </div>
                {isLive && (
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                      Live
                    </span>
                  </div>
                )}
                {isFinished && (
                  <span
                    className={`text-[10px] uppercase tracking-wider font-medium ${
                      dark ? "text-zinc-600" : "text-zinc-400"
                    }`}
                  >
                    Terminé
                  </span>
                )}
              </div>
            )}
          </div>

          {/* équipe extérieure */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            <span
              className={`text-sm font-semibold truncate text-right ${
                dark ? "text-zinc-100" : "text-zinc-800"
              }`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {away_team}
            </span>
            <TeamBadge name={away_team} dark={dark} />
          </div>
        </div>
      </div>
    </Link>
  );
}
