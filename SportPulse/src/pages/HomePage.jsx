import { Flame, CalendarDays, CheckCircle2 } from "lucide-react";
import MatchCard from "../components/MatchCard";

const FAKE_MATCHES = [
  {
    id: 1,
    home_team: "PSG",
    away_team: "Olympique Lyonnais",
    match_date: "2026-04-05T20:45:00Z",
    competition: "FL1",
    status: "SCHEDULED",
    home_score: null,
    away_score: null,
  },
  {
    id: 2,
    home_team: "Marseille",
    away_team: "Monaco",
    match_date: "2026-04-06T19:00:00Z",
    competition: "FL1",
    status: "SCHEDULED",
    home_score: null,
    away_score: null,
  },
  {
    id: 3,
    home_team: "Arsenal",
    away_team: "Chelsea",
    match_date: "2026-04-04T19:00:00Z",
    competition: "PL",
    status: "FINISHED",
    home_score: 2,
    away_score: 1,
  },
  {
    id: 4,
    home_team: "Manchester City",
    away_team: "Liverpool",
    match_date: "2026-04-03T16:30:00Z",
    competition: "PL",
    status: "FINISHED",
    home_score: 0,
    away_score: 2,
  },
  {
    id: 5,
    home_team: "Inter Milan",
    away_team: "Juventus",
    match_date: "2026-04-05T18:00:00Z",
    competition: "SA",
    status: "IN_PLAY",
    home_score: 1,
    away_score: 0,
  },
  {
    id: 6,
    home_team: "Real Madrid",
    away_team: "Barcelona",
    match_date: "2026-04-06T21:00:00Z",
    competition: "PD",
    status: "SCHEDULED",
    home_score: null,
    away_score: null,
  },
  {
    id: 7,
    home_team: "Bayern Munich",
    away_team: "Dortmund",
    match_date: "2026-04-06T17:30:00Z",
    competition: "BL1",
    status: "SCHEDULED",
    home_score: null,
    away_score: null,
  },
];

const COMPETITION_LABELS = {
  FL1: "Ligue 1",
  PL: "Premier League",
  PD: "La Liga",
  BL1: "Bundesliga",
  SA: "Serie A",
  CL: "Champions League",
};
const COMPETITION_ORDER = ["SA", "FL1", "PL", "PD", "BL1", "CL"];

const STATS = [
  {
    icon: CalendarDays,
    label: "À venir",
    value: FAKE_MATCHES.filter((m) => m.status === "SCHEDULED").length,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Flame,
    label: "En direct",
    value: FAKE_MATCHES.filter((m) => m.status === "IN_PLAY").length,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    icon: CheckCircle2,
    label: "Terminés",
    value: FAKE_MATCHES.filter((m) => m.status === "FINISHED").length,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
  },
];

const DARK_STATS = [
  {
    icon: CalendarDays,
    label: "À venir",
    value: FAKE_MATCHES.filter((m) => m.status === "SCHEDULED").length,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Flame,
    label: "En direct",
    value: FAKE_MATCHES.filter((m) => m.status === "IN_PLAY").length,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    icon: CheckCircle2,
    label: "Terminés",
    value: FAKE_MATCHES.filter((m) => m.status === "FINISHED").length,
    color: "text-zinc-500",
    bg: "bg-zinc-500/10",
    border: "border-zinc-700/40",
  },
];

export default function HomePage({ dark }) {
  const liveMatches = FAKE_MATCHES.filter((m) => m.status === "IN_PLAY");
  const stats = dark ? DARK_STATS : STATS;

  const grouped = FAKE_MATCHES.reduce((acc, m) => {
    if (!acc[m.competition]) acc[m.competition] = [];
    acc[m.competition].push(m);
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
          className={`text-5xl font-black tracking-tight leading-none mb-1 ${
            dark ? "text-white" : "text-zinc-900"
          }`}
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Matchs
        </h1>
        <p
          className={`text-sm mt-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}
        >
          {FAKE_MATCHES.length} rencontres · toutes compétitions
        </p>
      </div>

      
      <div className="grid grid-cols-3 gap-3 mb-10 fade-up fade-up-2">
        {stats.map(({ icon: Icon, label, value, color, bg, border }) => (
          <div
            key={label}
            className={`rounded-2xl p-4 border ${bg} ${border} ${
              dark ? "" : "bg-white/80 shadow-sm"
            }`}
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
              {value}
            </p>
          </div>
        ))}
      </div>


      {liveMatches.length > 0 && (
        <div
          className={`mb-8 flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-green-500/20 bg-green-500/8 fade-up fade-up-3`}
        >
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

      
      <div className="space-y-8">
        {sortedComps.map((comp) => (
          <section key={comp}>
            
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.15em] ${
                  dark ? "text-zinc-600" : "text-zinc-400"
                }`}
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
    </main>
  );
}
