import { useEffect, useState } from "react";
import { api, USE_MOCK } from "./api/client";
import Home from "./pages/Home";
import Exercise from "./pages/Exercise";
import Progress from "./pages/Progress";
import "./styles.css";

export default function App() {
  const [view, setView] = useState("home");
  const [chapters, setChapters] = useState([]);
  const [level, setLevel] = useState("1ère");
  const [chapterId, setChapterId] = useState(null);
  const [difficulty, setDifficulty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    api.chapters().then(setChapters)
      .catch((e) => setError("Impossible de charger les chapitres. Vérifie l’API et le CORS. (" + e.message + ")"));
  }, []);

  const chapter = chapters.find((c) => c.id === chapterId);

  return (
    <div className="app">
      <header>
        <span className="logo">MathGen</span>
        <nav>
          <button className={view !== "progress" ? "tab on" : "tab"} onClick={() => setView("home")}>Exercices</button>
          <button className={view === "progress" ? "tab on" : "tab"} onClick={() => setView("progress")}>Progression</button>
        </nav>
      </header>
      <main>
        {view === "home" && (
          <Home chapters={chapters} level={level} setLevel={setLevel} chapterId={chapterId} setChapterId={setChapterId}
            difficulty={difficulty} setDifficulty={setDifficulty} error={error}
            onStart={() => setView("exercise")} />
        )}
        {view === "exercise" && chapter && (
          <Exercise key={chapter.id + "-" + difficulty} chapter={chapter}
            difficulty={difficulty} onBack={() => setView("home")} />
        )}
        {view === "progress" && <Progress chapters={chapters} />}
      </main>
      {USE_MOCK && <footer>Mode démo : données simulées, sans backend.</footer>}
    </div>
  );
}
