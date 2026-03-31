import { Link, NavLink } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

export default function NavBar({ dark, toggleDark }) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        {/*Logo*/}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center ">
            <span className="text-white text-xs font-black">SP</span>
          </div>

          <span
            className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Sport<span className="text-green-500">Pulse</span>
          </span>
        </Link>

        {/*Navigation Links*/}

        <div>
          <NavLink
            to = "/" className=
            {({ isActive }) =>
              `text-sm px-3 py-1.5 rounded-lg transition-colors duration-150 font-medium ${
                isActive
                  ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`
            }>
                Matchs
          </NavLink>

           <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `text-sm px-3 py-1.5 rounded-lg transition-colors duration-150 font-medium ${
                isActive
                  ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`
            }
          >
            Classement
          </NavLink>

           <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-2" />

           {/* dark mode toggle*/}


            <button
                onClick={toggleDark}
                 className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150"
            aria-label="Toggle dark mode">
                 {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>


            {/*connexion*/}
            <Link to="/login" className="ml-1 text-sm px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-80 transition-opacity duration-150">
              Connexion
            </Link>

        </div>
      </div>
    </header>
  );
}
