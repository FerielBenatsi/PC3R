import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/NavBar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import MyProfilePage from "./pages/MyProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === null ? true : saved === "true";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div
          className={`grain min-h-screen transition-colors duration-500 ${
            dark
              ? "bg-[#080a0f]"
              : "bg-linear-to-br from-slate-100 via-zinc-50 to-slate-200"
          }`}
        >
          {dark && (
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -left-40 w-150 h-150 rounded-full bg-green-500/5 blur-[120px]" />
              <div className="absolute top-1/2 -right-60 w-125 h-125 rounded-full bg-emerald-400/4 blur-[100px]" />
              <div className="absolute -bottom-20 left-1/3 w-100 h-100 rounded-full bg-green-600/4 blur-[120px]" />
            </div>
          )}

          <NavBar dark={dark} toggleDark={() => setDark((d) => !d)} />

          <Routes>
            <Route path="/" element={<HomePage dark={dark} />} />
            <Route path="/login" element={<LoginPage dark={dark} />} />
            <Route path="/register" element={<RegisterPage dark={dark} />} />
            <Route
              path="/match/:id"
              element={<MatchDetailPage dark={dark} />}
            />
            <Route
              path="/leaderboard"
              element={<LeaderboardPage dark={dark} />}
            />
            <Route path="/profile/:id" element={<ProfilePage dark={dark} />} />
            <Route
              path="/me"
              element={
                <PrivateRoute>
                  <MyProfilePage dark={dark} />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFoundPage dark={dark} />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
