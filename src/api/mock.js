// Données simulées (mode démo) : mêmes formats que l’API Django.
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[rnd(0, arr.length - 1)];
const nz = (m) => rnd(1, m) * pick([-1, 1]);
const sgn = (n) => (n < 0 ? `- ${-n}` : `+ ${n}`);
const par = (n) => (n < 0 ? `(${n})` : `${n}`);
const poly = (cs) => {
  let out = "";
  for (const p of [3, 2, 1, 0]) {
    const c = cs[p] || 0;
    if (!c) continue;
    const m = Math.abs(c);
    const body = p === 0 ? `${m}` : `${m === 1 ? "" : m}x${p > 1 ? `^{${p}}` : ""}`;
    out += out ? (c < 0 ? " - " : " + ") + body : (c < 0 ? "-" : "") + body;
  }
  return out || "0";
};

const CHAPTERS = [
  { id: 1, name: "Équations et inéquations", level: "2nde" },
  { id: 2, name: "Fonctions affines", level: "2nde" },
  { id: 3, name: "Équations du second degré", level: "2nde" },
  { id: 4, name: "Vecteurs", level: "2nde" },
  { id: 5, name: "Second degré", level: "1ère" },
  { id: 6, name: "Dérivation", level: "1ère" },
  { id: 7, name: "Suites numériques", level: "1ère" },
  { id: 8, name: "Trigonométrie", level: "1ère" },
  { id: 9, name: "Limites de fonctions", level: "Tle" },
  { id: 10, name: "Étude de fonctions", level: "Tle" },
  { id: 11, name: "Logarithme et exponentielle", level: "Tle" },
  { id: 12, name: "Intégrales", level: "Tle" },
];

const GENERATORS = {
  1: (d) => {
    const a = pick([2, 3, 4, 5]) * (d === 3 ? pick([-1, 1]) : 1);
    const b = nz(5 * d), x0 = rnd(-5, 5), c = a * x0 + b;
    const S = a > 0 ? `]-∞;${x0}[` : `]${x0};+∞[`;
    return {
      statement: `Résoudre dans $\\mathbb{R}$ : $${a}x ${sgn(b)} < ${c}$`,
      type: "interval",
      hint: "Si tu divises par un nombre négatif, le sens de l’inégalité change.",
      kind: "interval",
      expected: S,
      explanation: `$${a}x < ${c - b}$ donc $x ${a > 0 ? "<" : ">"} ${x0}$, soit $S = ${S.replaceAll("∞", "\\infty")}$`,
    };
  },
  2: (d) => {
    const m = rnd(-3 * d, 3 * d) || 2;
    const x1 = rnd(-3, 3), dx = rnd(1, 4), y1 = rnd(-5, 5), x2 = x1 + dx, y2 = y1 + m * dx;
    return {
      statement: `Calculer le coefficient directeur de la droite $(AB)$ avec $A(${x1}\\,;\\,${y1})$ et $B(${x2}\\,;\\,${y2})$.`,
      type: "number",
      hint: "m = (yB − yA) / (xB − xA)",
      kind: "number",
      expected: m,
      explanation: `$m = \\frac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = ${m}$`,
    };
  },
  3: (d) => {
    const r1 = nz(3 * d + 1), r2 = nz(3 * d + 1), S = r1 + r2, P = r1 * r2;
    const eq = `x^{2} ${S === 0 ? "" : sgn(-S) + "x "}${sgn(P)} = 0`;
    const sol = [...new Set([r1, r2])].sort((a, b) => a - b);
    return {
      statement: `Résoudre dans $\\mathbb{R}$ : $${eq}$ (solutions séparées par des points-virgules)`,
      type: "set",
      hint: "Cherche deux nombres de somme S et de produit P, ou utilise le discriminant.",
      kind: "set",
      expected: sol,
      explanation: `$(x ${sgn(-r1)})(x ${sgn(-r2)}) = 0$ donc $S = \\{${sol.join(" ; ")}\\}$`,
    };
  },
  4: (d) => {
    const r = () => rnd(-4 * d, 4 * d);
    const [a, b, c, e] = [r(), r(), r(), r()], k = d === 1 ? 1 : rnd(2, 3);
    const X = k * a + c, Y = k * b + e;
    return {
      statement: `Soit $\\vec{u}(${a}\\,;\\,${b})$ et $\\vec{v}(${c}\\,;\\,${e})$. Calculer les coordonnées de $${k === 1 ? "" : k}\\vec{u} + \\vec{v}$.`,
      type: "vector",
      hint: "Calcule l’abscisse, puis l’ordonnée. Réponse sous la forme (x ; y).",
      kind: "vector",
      expected: [X, Y],
      explanation: `$(${k}\\times${par(a)} + ${par(c)}\\,;\\,${k}\\times${par(b)} + ${par(e)}) = (${X}\\,;\\,${Y})$`,
    };
  },
  5: (d) => {
    const a = nz(2 * d), b = nz(6 * d), c = nz(3 * d), D = b * b - 4 * a * c;
    return {
      statement: `Calculer le discriminant du trinôme $${poly({ 2: a, 1: b, 0: c })}$.`,
      type: "number",
      hint: "Δ = b² − 4ac",
      kind: "number",
      expected: D,
      explanation: `$\\Delta = ${par(b)}^{2} - 4\\times${par(a)}\\times${par(c)} = ${D}$`,
    };
  },
  6: (d) => {
    const cs = d === 1 ? { 2: nz(4), 1: nz(5), 0: nz(6) }
      : d === 2 ? { 3: nz(3), 2: nz(4), 0: nz(6) }
      : { 3: nz(3), 2: nz(4), 1: nz(5), 0: nz(6) };
    const ds = {};
    for (const p of [3, 2, 1]) if (cs[p]) ds[p - 1] = p * cs[p];
    return {
      statement: `Calculer la dérivée de la fonction $f(x) = ${poly(cs)}$.`,
      type: "expression",
      hint: "Écris x^2 pour x². La dérivée de x^n est n·x^(n−1).",
      kind: "expr",
      expected: (x) => Object.entries(ds).reduce((s, [p, c]) => s + c * x ** +p, 0),
      explanation: `$f'(x) = ${poly(ds)}$`,
    };
  },
  7: (d) => {
    if (d < 3) {
      const u0 = rnd(-5, 10), r = nz(2 * d), n = rnd(5, 10 + 5 * d), v = u0 + n * r;
      return {
        statement: `La suite $(u_n)$ est arithmétique, de premier terme $u_0 = ${u0}$ et de raison $r = ${r}$. Calculer $u_{${n}}$.`,
        type: "number",
        hint: "u_n = u_0 + n × r",
        kind: "number",
        expected: v,
        explanation: `$u_{${n}} = ${u0} + ${n}\\times${par(r)} = ${v}$`,
      };
    }
    const u0 = rnd(1, 3), q = pick([2, 3]), n = rnd(3, 5), v = u0 * q ** n;
    return {
      statement: `La suite $(u_n)$ est géométrique, de premier terme $u_0 = ${u0}$ et de raison $q = ${q}$. Calculer $u_{${n}}$.`,
      type: "number",
      hint: "u_n = u_0 × q^n",
      kind: "number",
      expected: v,
      explanation: `$u_{${n}} = ${u0}\\times ${q}^{${n}} = ${v}$`,
    };
  },
  8: (d) => {
    const a = d === 1 ? rnd(1, 4) : nz(5), b = d === 1 ? rnd(1, 4) : nz(5), c = nz(4);
    const v = (a + b) / 2 + (d === 3 ? c : 0);
    return {
      statement: `Calculer $${a}\\cos\\frac{\\pi}{3} ${sgn(b)}\\sin\\frac{\\pi}{6}${d === 3 ? ` ${sgn(c)}\\sin\\frac{\\pi}{2}` : ""}$.`,
      type: "number",
      hint: "cos(π/3) = 1/2, sin(π/6) = 1/2, sin(π/2) = 1. Tu peux écrire une fraction, ex : 5/2.",
      kind: "number",
      expected: v,
      explanation: `$${a}\\times\\frac{1}{2} ${sgn(b)}\\times\\frac{1}{2}${d === 3 ? ` ${sgn(c)}\\times 1` : ""} = ${v}$`,
    };
  },
  9: (d) => {
    const a = rnd(1, 3 * d), c = rnd(1, 4), b = nz(5);
    return {
      statement: `Calculer $\\lim_{x\\to+\\infty}\\frac{${a}x^{2} ${sgn(b)}x + 1}{${c}x^{2} - 3}$ (nombre ou fraction).`,
      type: "number",
      hint: "Au numérateur et au dénominateur, seul le terme de plus haut degré compte.",
      kind: "number",
      expected: a / c,
      explanation: `$\\lim = \\frac{${a}}{${c}}$`,
    };
  },
  10: (d) => {
    const a = rnd(1, 3 + 2 * d) * pick([-1, 1]), b = rnd(1, 9);
    return {
      statement: `Soit $f(x) = x^{2} ${sgn(-2 * a)}x + ${b}$. Pour quelle valeur de $x$ la fonction $f$ admet-elle son minimum ?`,
      type: "number",
      hint: "Calcule f′(x) et cherche où elle s’annule.",
      kind: "number",
      expected: a,
      explanation: `$f'(x) = 2x ${sgn(-2 * a)}$ s’annule en $x = ${a}$`,
    };
  },
  11: (d) => {
    const a = rnd(1, 4), b = nz(3 * d), c = d === 3 ? nz(3) : 0, v = a + b + 2 * c;
    return {
      statement: `Simplifier : $\\ln(e^{${b}}) + ${a}\\ln(e)${c ? ` ${sgn(c)}\\ln(e^{2})` : ""} - \\ln(1)$`,
      type: "number",
      hint: "ln(e^k) = k, ln(e) = 1 et ln(1) = 0.",
      kind: "number",
      expected: v,
      explanation: `$${b} + ${a}${c ? ` ${sgn(2 * c)}` : ""} - 0 = ${v}$`,
    };
  },
  12: (d) => {
    const a = rnd(1, 3), c = nz(5), k = rnd(1, 2 + d), v = a * k * k + c * k;
    return {
      statement: `Calculer $\\int_{0}^{${k}} (${2 * a}x ${sgn(c)})\\,dx$.`,
      type: "number",
      hint: "Une primitive de 2ax + c est ax² + cx.",
      kind: "number",
      expected: v,
      explanation: `$\\left[${a}x^{2} ${sgn(c)}x\\right]_{0}^{${k}} = ${v}$`,
    };
  },
};

const parseNum = (str) => {
  const t = str.replace(/\s/g, "").replace(/−/g, "-").replace(",", ".");
  const m = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (m) return +m[1] / +m[2];
  return /^-?\d+(\.\d+)?$/.test(t) ? parseFloat(t) : NaN;
};
const nums = (str) => (str.replace(/−/g, "-").match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
const normI = (t) =>
  t.toLowerCase().replace(/\s/g, "").replace(/−/g, "-").replace(/inf(ini)?/g, "∞").replace(/\+∞/g, "∞");

function evalExpr(str, x) {
  let s = str.toLowerCase().replace(/\s+/g, "").replace(/²/g, "^2").replace(/³/g, "^3")
    .replace(/−/g, "-").replace(/,/g, ".");
  if (!/^[0-9x+\-*/^().]+$/.test(s)) return NaN;
  s = s.replace(/(\d|x|\))(?=x|\()/g, "$1*").replace(/\)(?=\d)/g, ")*").replace(/\^/g, "**");
  if (/^[+-]/.test(s)) s = "0" + s;
  try { return Function("x", `"use strict"; return (${s});`)(x); } catch { return NaN; }
}

function checkMock(ex, raw) {
  const s = raw.trim();
  if (!s) return false;
  if (ex.kind === "number") return Math.abs(parseNum(s) - ex.expected) < 1e-9;
  if (ex.kind === "interval") return normI(s) === normI(ex.expected);
  if (ex.kind === "set" || ex.kind === "vector") {
    let v = nums(s);
    if (ex.kind === "set") v = [...new Set(v)].sort((a, b) => a - b);
    return v.length === ex.expected.length && v.every((t, i) => Math.abs(t - ex.expected[i]) < 1e-9);
  }
  return [-2, -1, 0.5, 1, 2, 3].every((x) => {
    const a = evalExpr(s, x), b = ex.expected(x);
    return Number.isFinite(a) && Math.abs(a - b) < 1e-6 * (1 + Math.abs(b));
  });
}

let nextId = 1;
const store = {};
const stats = {};

const mockApi = {
  chapters: async () => CHAPTERS,
  generate: async (chapter_id, difficulty) => {
    const ex = { ...GENERATORS[chapter_id](difficulty), chapter_id };
    const id = nextId++;
    store[id] = ex;
    return { id, statement_latex: ex.statement, answer_type: ex.type, hint: ex.hint };
  },
  answer: async (id, answer) => {
    const ex = store[id];
    const correct = checkMock(ex, answer);
    const st = (stats[ex.chapter_id] ||= { attempts: 0, correct: 0 });
    st.attempts++;
    if (correct) st.correct++;
    return { correct, explanation_latex: ex.explanation };
  },
  progress: async () =>
    Object.entries(stats).map(([id, s]) => ({
      chapter_id: +id,
      attempts: s.attempts,
      correct: s.correct,
      success_rate: s.correct / s.attempts,
    })),
};

export { CHAPTERS, mockApi };
