import { useState } from "react";
import { apiFetch } from "../services/api";
import { AuthContext } from "./AuthContextInstance";

export function AuthProvider({ children }) {
  const stored = localStorage.getItem("user");
  const [user, setUser] = useState(stored ? JSON.parse(stored) : null);

  async function login(email, password) {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res || !res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Identifiants incorrects");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    const userObj = { username: data.username };
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  }

  async function register(username, email, password) {
    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    if (!res || !res.ok) {
      const err = await res.json().catch(() => ({}));

      throw new Error(
        err.message || err.error || "Ce pseudo ou email est déjà utilisé",
      );
    }

    const loginRes = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes || !loginRes.ok) {
      throw new Error("Compte créé ! Connecte-toi maintenant.");
    }

    const data = await loginRes.json();
    localStorage.setItem("token", data.token);
    const userObj = { id: data.user_id, username: data.username };
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
