import { LEVELS } from "../constants";

export default function Home({ chapters, level, setLevel, chapterId, setChapterId, difficulty, setDifficulty, onStart, error }) {
  const labels = ["Facile", "Moyen", "Difficile"];
  const list = chapters.filter((c) => c.level === level);
  return (
    <section>
      <h1>Quel chapitre veux-tu travailler ?</h1>
      {error && <p className="error">{error}</p>}
      <div className="row">
        {LEVELS.map((l) => (
          <button key={l} className={"pill" + (level === l ? " on" : "")}
            onClick={() => { setLevel(l); setChapterId(null); }}>{l}</button>
        ))}
      </div>
      <div className="chapters" style={{ marginTop: 16 }}>
        {list.map((c) => (
          <button key={c.id} className={"chapter" + (c.id === chapterId ? " on" : "")}
            onClick={() => setChapterId(c.id)}>
            <strong>{c.name}</strong>
            <span>{c.level}</span>
          </button>
        ))}
      </div>
      <h2>Difficulté</h2>
      <div className="row">
        {labels.map((l, i) => (
          <button key={l} className={"pill" + (difficulty === i + 1 ? " on" : "")}
            onClick={() => setDifficulty(i + 1)}>{l}</button>
        ))}
      </div>
      <button className="primary" disabled={!chapterId} onClick={onStart}>
        Commencer la série
      </button>
    </section>
  );
}
