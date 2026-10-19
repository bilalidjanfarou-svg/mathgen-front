import { useEffect, useState } from "react";
import { api } from "../api/client";
import Latex from "../components/Latex";
import AnswerInput from "../components/AnswerInput";

export default function Exercise({ chapter, difficulty, onBack }) {
  const [ex, setEx] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState({ done: 0, correct: 0 });

  const load = async () => {
    setEx(null); setAnswer(""); setResult(null); setHint(false); setError("");
    try { setEx(await api.generate(chapter.id, difficulty)); }
    catch (e) { setError("Impossible de générer l’exercice. " + e.message); }
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!answer.trim() || result) return;
    try {
      const r = await api.answer(ex.id, answer);
      setResult(r);
      setSession((s) => ({ done: s.done + 1, correct: s.correct + (r.correct ? 1 : 0) }));
    } catch (e) { setError("Envoi impossible. " + e.message); }
  };

  return (
    <section>
      <div className="bar">
        <button className="link" onClick={onBack}>Changer de chapitre</button>
        <span className="muted">{chapter.name} · {session.correct}/{session.done} réussis</span>
      </div>
      {error && <p className="error">{error}</p>}
      {!ex && !error && <p className="muted">Génération de l’exercice…</p>}
      {ex && (
        <div className="sheet">
          <p className="statement"><Latex text={ex.statement_latex} /></p>
          <AnswerInput type={ex.answer_type} value={answer} onChange={setAnswer}
            onSubmit={submit} disabled={!!result} />
          {!result && (
            <div className="row">
              <button className="primary" onClick={submit} disabled={!answer.trim()}>
                Vérifier ma réponse
              </button>
              {ex.hint && <button className="link" onClick={() => setHint(!hint)}>
                {hint ? "Masquer l’indice" : "Voir un indice"}</button>}
            </div>
          )}
          {hint && !result && <p className="hint">{ex.hint}</p>}
          {result && (
            <div className={"feedback " + (result.correct ? "ok" : "ko")} role="status">
              <strong>{result.correct ? "Bonne réponse." : "Ce n’est pas la bonne réponse."}</strong>
              {result.explanation_latex && (
                <p><Latex text={result.explanation_latex} /></p>
              )}
              <button className="primary" onClick={load}>Exercice suivant</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
