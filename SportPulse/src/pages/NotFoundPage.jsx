import { useNavigate } from "react-router-dom";

export default function NotFoundPage({ dark }) {
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center gap-6 px-4 ${
        dark ? "text-white" : "text-slate-800"
      }`}
    >
      <span
        className="text-8xl font-bold text-blue-500"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        404
      </span>
      <p className="text-xl opacity-60">Cette page n'existe pas.</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/25"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
