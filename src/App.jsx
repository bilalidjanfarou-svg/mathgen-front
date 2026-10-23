import { useEffect, useState } from "react";
import { api, USE_MOCK, setSessionExpiredHandler } from "./api/client";
import Home from "./pages/Home";
import Exercise from "./pages/Exercise";
import Progress from "./pages/Progress";
import History from "./pages/History";
import Login from "./pages/Login";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState(null);
  // En mode API, on vérifie d'abord si une session existe déjà (jetons dans le navigateur).
  const [checking, setChecking] = useState(!USE_MOCK && api.hasSession());
  const [view, setView] = useState("home");
  const [chapters, setChapters] = useState([]);
  const [level, setLevel] = useState("1ère");
  const [chapterId, setChapterId] = useState(null);
  const [difficulty, setDifficulty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (USE_MOCK) return;
    setSessionExpiredHandler(() => setUser(null));
    if (api.hasSession()) {
      api.me().then(setUser).catch(() => {}).finally(() => setChecking(false));
    }
  }, []);

  useEffect(() => {
    api.chapters().then(setChapters)
      .catch((e) => setError("Impossible de charger les chapitres. Vérifie que Django est lancé. (" + e.message + ")"));
  }, []);

  const logout = () => {
    api.logout();
    setUser(null);
    setView("home");
    setChapterId(null);
  };

  const chapter = chapters.find((c) => c.id === chapterId);
  const loggedIn = USE_MOCK || user;

  return (
    <div className="app">
      <header>
        <span className="logo">MathGen</span>
        {loggedIn && (
          <nav className="userbox">
            <button className={view === "home" || view === "exercise" ? "tab on" : "tab"} onClick={() => setView("home")}>Exercices</button>
            <button className={view === "progress" ? "tab on" : "tab"} onClick={() => setView("progress")}>Progression</button>
            <button className={view === "history" ? "tab on" : "tab"} onClick={() => setView("history")}>Historique</button>
            {user && (
              <>
                <span className="muted">{user.username}</span>
                <button className="link" onClick={logout}>Déconnexion</button>
              </>
            )}
          </nav>
        )}
      </header>
      <main>
        {checking && <p className="muted">Chargement…</p>}
        {!checking && !loggedIn && <Login onLogged={setUser} />}
        {!checking && loggedIn && view === "home" && (
          <Home chapters={chapters} level={level} setLevel={setLevel} chapterId={chapterId} setChapterId={setChapterId}
            difficulty={difficulty} setDifficulty={setDifficulty} error={error}
            onStart={() => setView("exercise")} />
        )}
        {!checking && loggedIn && view === "exercise" && chapter && (
          <Exercise key={chapter.id + "-" + difficulty} chapter={chapter}
            difficulty={difficulty} onBack={() => setView("home")} />
        )}
        {!checking && loggedIn && view === "progress" && <Progress chapters={chapters} />}
        {!checking && loggedIn && view === "history" && <History />}
      </main>
      {USE_MOCK && <footer>Mode démo : données simulées, sans backend.</footer>}
    </div>
  );
}
