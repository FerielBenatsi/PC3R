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

export default function HomePage() {
  const liveCount = FAKE_MATCHES.filter((m) => m.status === "IN_PLAY").length;

  // grouper par compétition
  const grouped = FAKE_MATCHES.reduce((acc, match) => {
    if (!acc[match.competition]) acc[match.competition] = [];
    acc[match.competition].push(match);
    return acc;
  }, {});

  // ordre : live en premier, puis ordre défini
  const sortedComps = Object.keys(grouped).sort((a, b) => {
    const liveA = grouped[a].some((m) => m.status === "IN_PLAY") ? -1 : 0;
    const liveB = grouped[b].some((m) => m.status === "IN_PLAY") ? -1 : 0;
    if (liveA !== liveB) return liveA - liveB;
    return COMPETITION_ORDER.indexOf(a) - COMPETITION_ORDER.indexOf(b);
  });

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* header */}
      <div className="mb-8">
        <p
          className="text-xs font-semibold text-green-500 uppercase tracking-widest mb-2"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          7 prochains jours
        </p>
        <h1
          className="text-4xl font-extrabold text-zinc-900 dark:text-white"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Matchs
        </h1>
      </div>

      {/* banner live */}
      {liveCount > 0 && (
        <div className="mb-8 flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            {liveCount} match{liveCount > 1 ? "s" : ""} en direct
          </p>
        </div>
      )}

      {/* stats rapides */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          {
            label: "Matchs à venir",
            value: FAKE_MATCHES.filter((m) => m.status === "SCHEDULED").length,
          },
          { label: "En direct", value: liveCount },
          {
            label: "Terminés",
            value: FAKE_MATCHES.filter((m) => m.status === "FINISHED").length,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-4 py-3 text-center"
          >
            <p
              className="text-2xl font-black text-zinc-900 dark:text-white"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {value}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* matchs groupés par compétition */}
      <div className="space-y-8">
        {sortedComps.map((comp) => (
          <section key={comp}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                {COMPETITION_LABELS[comp] ?? comp}
              </h2>
              {grouped[comp].some((m) => m.status === "IN_PLAY") && (
                <span className="text-xs font-semibold text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              )}
            </div>
            <div className="space-y-2">
              {grouped[comp].map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
