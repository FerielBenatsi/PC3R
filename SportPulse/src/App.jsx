import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <BrowserRouter>
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}
