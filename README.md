# MathGen — frontend (React + Vite)

Exercices de maths générés automatiquement pour le **lycée** (2nde, 1ère, Tle), avec correction automatique.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
```

Par défaut le projet tourne en **mode démo** (`VITE_USE_MOCK=true` dans `.env`) : 12 chapitres, exercices et correction simulés, sans backend.

## Brancher Django

1. Dans `.env` : `VITE_USE_MOCK=false`
2. Lance Django sur le port **8000**. En dev, Vite redirige `/api` vers `http://localhost:8000` (voir `vite.config.js`), donc pas de CORS à configurer. En production, si front et back sont sur des domaines différents, installe `django-cors-headers`.
3. Authentification : si `localStorage.token` existe, chaque requête envoie `Authorization: Bearer <token>`. Les écrans de connexion ne sont pas encore faits.

## Contrat d’API (v1)

| Méthode | URL | Corps | Réponse |
|---|---|---|---|
| GET | `/api/chapters/` | — | `[{ "id": 6, "name": "Dérivation", "level": "1ère" }]` (`level` : `2nde`, `1ère` ou `Tle`) |
| POST | `/api/exercises/generate/` | `{ "chapter_id": 6, "difficulty": 2 }` | `{ "id": 128, "statement_latex": "…", "answer_type": "expression", "hint": "…" }` |
| POST | `/api/exercises/{id}/answer/` | `{ "answer": "3x^2 - 6x" }` | `{ "correct": true, "explanation_latex": "…" }` |
| GET | `/api/progress/` | — | `[{ "chapter_id": 6, "attempts": 24, "correct": 17, "success_rate": 0.71 }]` |

- `difficulty` : 1 (facile), 2 (moyen) ou 3 (difficile).
- Ne renvoie **jamais** la solution dans `generate`.
- `statement_latex` et `explanation_latex` : texte avec formules LaTeX entre `$...$` (rendu KaTeX).
- En cas d’erreur, un JSON `{ "detail": "message" }` (format DRF par défaut).

### Types de réponse (`answer_type`) et format saisi par l’élève

| Type | Exemple saisi | Vérification conseillée (SymPy) |
|---|---|---|
| `number` | `5`, `-2,5`, `7/2` | comparer les valeurs numériques |
| `interval` | `]-∞ ; 3[` | normaliser (`inf`, `+∞`, espaces) puis comparer |
| `set` | `{-1 ; 4}` | extraire les nombres, comparer les ensembles |
| `vector` | `(2 ; -3)` | extraire les nombres, comparer dans l’ordre |
| `expression` | `3x^2 - 6x`, `3x(x-2)` | `simplify(élève - attendu) == 0` avec `parse_expr` (jamais `eval`) |

La logique du mode démo (`src/api/mock.js`) montre un exemple de chaque générateur et de chaque vérification.

## Structure

```
src/
├── api/
│   ├── client.js      # appels HTTP + bascule démo / Django
│   └── mock.js        # chapitres et générateurs simulés
├── components/
│   ├── Latex.jsx      # rendu des formules (KaTeX)
│   └── AnswerInput.jsx# champ de saisie + touches selon answer_type
├── pages/
│   ├── Home.jsx       # niveau, chapitre, difficulté
│   ├── Exercise.jsx   # énoncé, réponse, correction
│   └── Progress.jsx   # progression par chapitre
├── constants.js       # niveaux (2nde, 1ère, Tle)
├── App.jsx            # navigation entre les 3 écrans
├── styles.css
└── main.jsx
```
