import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const COMPETITION_FLAGS = {
  FL1: "🇫🇷",
  PL: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  PD: "🇪🇸",
  BL1: "🇩🇪",
  SA: "🇮🇹",
  CL: "⭐",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MatchCard({ match }) {
  const {
    id,
    home_team,
    away_team,
    match_date,
    competition,
    status,
    home_score,
    away_score,
  } = match;

  const isFinished = status === "FINISHED";
  const isLive = status === "IN_PLAY";
  const isScheduled = status === "SCHEDULED";

  return (
    <Link to={`/match/${id}`} className="block group">
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-5 py-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 overflow-hidden">
        {/* barre verte côté gauche si live */}
        {isLive && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-500 rounded-l-2xl" />
        )}

        <div className="flex items-center gap-4">
          {/* équipe domicile */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-zinc-900 dark:text-white truncate text-sm">
              {home_team}
            </p>
          </div>

          {/* centre — score ou heure */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            {isScheduled ? (
              <>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                  {formatDate(match_date)}
                </span>
                <span className="text-base font-bold text-zinc-700 dark:text-zinc-200 tabular-nums">
                  {formatTime(match_date)}
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-xl font-black tabular-nums ${isLive ? "text-green-500" : "text-zinc-900 dark:text-white"}`}
                  >
                    {home_score}
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-600 text-sm font-light">
                    —
                  </span>
                  <span
                    className={`text-xl font-black tabular-nums ${isLive ? "text-green-500" : "text-zinc-900 dark:text-white"}`}
                  >
                    {away_score}
                  </span>
                </div>
                {isLive && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </span>
                )}
                {isFinished && (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    Terminé
                  </span>
                )}
              </>
            )}
          </div>

          {/* équipe extérieur */}
          <div className="flex-1 min-w-0 text-right">
            <p className="font-semibold text-zinc-900 dark:text-white truncate text-sm">
              {away_team}
            </p>
          </div>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <ChevronRight
            size={14}
            className="text-zinc-400 dark:text-zinc-500"
          />
        </div>
      </div>
    </Link>
  );
}
