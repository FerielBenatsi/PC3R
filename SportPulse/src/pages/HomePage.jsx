import { useState, useEffect } from "react";
import { Flame, CalendarDays, CheckCircle2, AlertCircle } from "lucide-react";
import MatchCard from "../components/MatchCard";
import { apiFetch } from "../services/api";

const COMPETITION_LABELS = {
  FL1: "Ligue 1",
  PL: "Premier League",
  PD: "La Liga",
  BL1: "Bundesliga",
  SA: "Serie A",
  CL: "Champions League",
};
const COMPETITION_ORDER = ["SA", "FL1", "PL", "PD", "BL1", "CL"];

export default function HomePage({ dark }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await apiFetch("/api/matches");
        if (!res || !res.ok)
          throw new Error("Impossible de charger les matchs");
        const data = await res.json();
        setMatches(Array.isArray(data) ? data : (data.matches ?? []));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  const liveMatches = matches.filter((m) => m.status === "IN_PLAY");
  const stats = [
    {
      icon: CalendarDays,
      label: "À venir",
      value: matches.filter(
        (m) => m.status === "SCHEDULED" || m.status === "TIMED",
      ).length,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: Flame,
      label: "En direct",
      value: liveMatches.length,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      icon: CheckCircle2,
      label: "Terminés",
      value: matches.filter((m) => m.status === "FINISHED").length,
      color: dark ? "text-zinc-400" : "text-zinc-400",
      bg: "bg-zinc-500/10",
      border: dark ? "border-zinc-700/40" : "border-zinc-500/20",
    },
  ];

  const grouped = matches.reduce((acc, m) => {
    const comp = m.competition ?? m.competition_code ?? "?";
    if (!acc[comp]) acc[comp] = [];
    acc[comp].push(m);
    return acc;
  }, {});

  const sortedComps = Object.keys(grouped).sort((a, b) => {
    const liveA = grouped[a].some((m) => m.status === "IN_PLAY") ? -1 : 0;
    const liveB = grouped[b].some((m) => m.status === "IN_PLAY") ? -1 : 0;
    if (liveA !== liveB) return liveA - liveB;
    return COMPETITION_ORDER.indexOf(a) - COMPETITION_ORDER.indexOf(b);
  });

  let cardIndex = 0;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 fade-up fade-up-1">
        <p
          className="text-xs font-bold text-green-500 uppercase tracking-[0.2em] mb-3"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          7 prochains jours
        </p>
        <h1
          className={`text-5xl font-black tracking-tight leading-none mb-1 ${dark ? "text-white" : "text-zinc-900"}`}
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Matchs
        </h1>
        {!loading && (
          <p
            className={`text-sm mt-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}
          >
            {matches.length} rencontres · toutes compétitions
          </p>
        )}
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3 mb-10 fade-up fade-up-2">
        {stats.map(({ icon: Icon, label, value, color, bg, border }) => (
          <div
            key={label}
            className={`rounded-2xl p-4 border ${bg} ${border} ${dark ? "" : "bg-white/80 shadow-sm"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className={color} />
              <span
                className={`text-xs font-medium ${dark ? "text-zinc-500" : "text-zinc-400"}`}
              >
                {label}
              </span>
            </div>
            <p
              className={`text-3xl font-black ${dark ? "text-white" : "text-zinc-900"}`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {loading ? "—" : value}
            </p>
          </div>
        ))}
      </div>

      {/* live banner */}
      {liveMatches.length > 0 && (
        <div className="mb-8 flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-green-500/20 bg-green-500/8 fade-up fade-up-3">
          <div className="relative shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-500 block" />
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-60" />
          </div>
          <p
            className={`text-sm font-semibold ${dark ? "text-green-400" : "text-green-600"}`}
          >
            {liveMatches.length} match{liveMatches.length > 1 ? "s" : ""} en
            direct maintenant
          </p>
          <span className="ml-auto text-xs text-green-500/60 font-medium">
            {liveMatches
              .map((m) => `${m.home_team} — ${m.away_team}`)
              .join(" · ")}
          </span>
        </div>
      )}

      {/* états */}
      {loading && (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 rounded-full border-2 border-white/10 border-t-green-500 animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <p
          className={`text-center py-20 text-sm ${dark ? "text-zinc-600" : "text-zinc-400"}`}
        >
          Aucun match disponible pour le moment.
        </p>
      )}

      {/* liste groupée */}
      {!loading && !error && (
        <div className="space-y-8">
          {sortedComps.map((comp) => (
            <section key={comp}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.15em] ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {COMPETITION_LABELS[comp] ?? comp}
                </span>
                {grouped[comp].some((m) => m.status === "IN_PLAY") && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-wider">
                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </span>
                )}
                <div
                  className={`flex-1 h-px ${dark ? "bg-white/5" : "bg-zinc-200"}`}
                />
              </div>
              <div className="space-y-2">
                {grouped[comp].map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    dark={dark}
                    index={cardIndex++}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
