import { useEffect, useState } from "react";
import { api } from "../api/client";
import Latex from "../components/Latex";
import "../history.css";

const DIFFICULTY = ["Facile", "Moyen", "Difficile"];
const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

export default function History() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [onlyWrong, setOnlyWrong] = useState(false);

  useEffect(() => {
    api.history().then(setRows).catch((e) => setError(e.message));
  }, []);

  const shown = rows?.filter((r) => !onlyWrong || !r.is_correct);

  return (
    <section>
      <h1>Ton historique</h1>
      {error && <p className="error">{error}</p>}
      {rows && rows.length === 0 && (
        <p className="muted">Pas encore d’exercice terminé. Tes derniers exercices apparaîtront ici.</p>
      )}
      {rows && rows.length > 0 && (
        <div className="row">
          <button className={"pill" + (!onlyWrong ? " on" : "")} onClick={() => setOnlyWrong(false)}>Tout</button>
          <button className={"pill" + (onlyWrong ? " on" : "")} onClick={() => setOnlyWrong(true)}>Mes erreurs</button>
        </div>
      )}
      {shown && rows.length > 0 && shown.length === 0 && (
        <p className="muted">Aucune erreur dans tes derniers exercices, bravo !</p>
      )}
      {shown?.map((r) => (
        <article key={r.id} className="entry">
          <div className="entryTop">
            <span className="muted">
              {r.chapter} ({r.level}) · {DIFFICULTY[r.difficulty - 1]} · {dateFormat.format(new Date(r.created_at))}
            </span>
            <span className={"badge " + (r.is_correct ? "ok" : "ko")}>{r.is_correct ? "Juste" : "Faux"}</span>
          </div>
          <p className="entryStatement"><Latex text={r.statement_latex} /></p>
          <p className="entryAnswer">Ta réponse : <code>{r.answer}</code></p>
          <details>
            <summary>Voir la correction</summary>
            <p><Latex text={r.explanation_latex} /></p>
          </details>
        </article>
      ))}
    </section>
  );
}
