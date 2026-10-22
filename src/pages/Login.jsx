import { useState } from "react";
import { api } from "../api/client";
import "../auth.css";

export default function Login({ onLogged }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = isLogin
        ? await api.login(username.trim(), password)
        : await api.register(username.trim(), password);
      onLogged(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth">
      <h1>{isLogin ? "Connexion" : "Créer un compte"}</h1>
      <form onSubmit={submit}>
        <label htmlFor="username">Nom d’utilisateur</label>
        <input id="username" className="field" value={username} autoFocus required
          autoComplete="username" onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="password">Mot de passe</label>
        <input id="password" className="field" type="password" value={password} required
          autoComplete={isLogin ? "current-password" : "new-password"}
          onChange={(e) => setPassword(e.target.value)} />
        {!isLogin && <p className="hint">Au moins 8 caractères, pas uniquement des chiffres.</p>}
        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={busy}>
          {busy ? "Un instant…" : isLogin ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>
      <p className="muted">
        {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
        <button type="button" className="link"
          onClick={() => { setMode(isLogin ? "register" : "login"); setError(""); }}>
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>
      </p>
    </section>
  );
}
