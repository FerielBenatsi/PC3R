import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Trophy,
  Zap,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
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

export default function NavBar({ dark, toggleDark }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ferme le dropdown si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-xl font-medium transition-all duration-150 ${
      isActive
        ? dark
          ? "text-white bg-white/8"
          : "text-zinc-900 bg-zinc-100"
        : dark
          ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
          : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
    }`;

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`border-b transition-colors duration-500 ${
          dark
            ? "bg-[#080a0f]/80 border-white/5 backdrop-blur-2xl"
            : "bg-white/70 border-black/5 backdrop-blur-2xl shadow-sm"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-green-500 opacity-20 group-hover:opacity-30 blur-sm transition-opacity" />
              <div className="relative w-8 h-8 rounded-xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <Zap size={14} className="text-white fill-white" />
              </div>
            </div>
            <span
              className="text-[17px] font-black tracking-tight"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              <span className={dark ? "text-white" : "text-zinc-900"}>
                Sport
              </span>
              <span className="text-green-500">Pulse</span>
            </span>
          </Link>

          {/* nav centre */}
          <nav className="flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>
              Matchs
            </NavLink>
            <NavLink to="/leaderboard" className={navLinkClass}>
              <Trophy size={13} />
              Classement
            </NavLink>
          </nav>

          {/* droite */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 ${
                dark
                  ? "text-zinc-500 hover:text-yellow-400 hover:bg-white/5"
                  : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <div
              className={`w-px h-5 ${dark ? "bg-white/8" : "bg-zinc-200"}`}
            />

            {user ? (
              /* ── avatar + dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen((o) => !o)}
                  className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl transition-all duration-150 ${
                    open
                      ? dark
                        ? "bg-white/10"
                        : "bg-zinc-100"
                      : dark
                        ? "hover:bg-white/8"
                        : "hover:bg-zinc-100"
                  }`}
                >
                  {/* avatar */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0"
                    style={{
                      background: avatarColor(user.username),
                      fontFamily: "Syne, sans-serif",
                    }}
                  >
                    {user.username[0].toUpperCase()}
                  </div>
                  <span
                    className={`text-sm font-semibold max-w-24 truncate ${dark ? "text-zinc-200" : "text-zinc-800"}`}
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {user.username}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-150 ${open ? "rotate-180" : ""} ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                  />
                </button>

                {/* dropdown */}
                {open && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-44 rounded-2xl overflow-hidden shadow-2xl border z-50 ${
                      dark
                        ? "bg-[#0f1117] border-white/10"
                        : "bg-white border-zinc-200"
                    }`}
                  >
                    <Link
                      to="/me"
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        dark
                          ? "text-zinc-300 hover:bg-white/5 hover:text-white"
                          : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      <User size={14} className="text-green-500 shrink-0" />
                      Mon profil
                    </Link>

                    <div
                      className={`mx-3 h-px ${dark ? "bg-white/8" : "bg-zinc-100"}`}
                    />

                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        dark
                          ? "text-zinc-500 hover:bg-red-500/8 hover:text-red-400"
                          : "text-zinc-400 hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <LogOut size={14} className="shrink-0" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── bouton connexion ── */
              <Link
                to="/login"
                className="text-sm px-4 py-2 rounded-xl font-semibold bg-green-500 hover:bg-green-400 text-white transition-all duration-150 shadow-lg shadow-green-500/20"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
