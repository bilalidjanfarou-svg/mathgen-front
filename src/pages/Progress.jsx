import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Progress({ chapters }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api.progress().then(setRows).catch((e) => setError(e.message));
  }, []);
  const name = (id) => {
    const c = chapters.find((x) => x.id === id);
    return c ? `${c.name} (${c.level})` : `Chapitre ${id}`;
  };
  const total = (rows || []).reduce(
    (t, r) => ({ attempts: t.attempts + r.attempts, correct: t.correct + r.correct }),
    { attempts: 0, correct: 0 }
  );
  return (
    <section>
      <h1>Ta progression</h1>
      {error && <p className="error">{error}</p>}
      {rows && rows.length === 0 && (
        <p className="muted">Aucun exercice fait pour l’instant. Lance une série pour voir tes résultats ici.</p>
      )}
      {rows && rows.length > 0 && (
        <p>
          <strong>{total.correct}/{total.attempts}</strong> exercices réussis au total (
          {Math.round((100 * total.correct) / total.attempts)} %).
        </p>
      )}
      {rows?.map((r) => (
        <div key={r.chapter_id} className="stat">
          <div className="statTop">
            <strong>{name(r.chapter_id)}</strong>
            <span>{r.correct}/{r.attempts} · {Math.round(r.success_rate * 100)} %</span>
          </div>
          <div className="track"><div className="fill" style={{ width: `${r.success_rate * 100}%` }} /></div>
        </div>
      ))}
    </section>
  );
}
