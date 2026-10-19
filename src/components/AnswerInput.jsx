const KEYS = {
  number: ["-", "/", ","],
  interval: ["]", "[", ";", "-", "+", "∞"],
  set: ["{", "}", ";", "-"],
  vector: ["(", ")", ";", "-"],
  expression: ["x", "^2", "^3", "(", ")", "+", "-", "*"],
};

export default function AnswerInput({ type, value, onChange, onSubmit, disabled }) {
  const placeholder = {
    number: "Ex : 5, -2,5 ou 7/2",
    interval: "Ex : ]-∞ ; 3[",
    set: "Ex : {-1 ; 4}",
    vector: "Ex : (2 ; -3)",
    expression: "Ex : 3x^2 - 6x",
  }[type] || "Ta réponse";
  return (
    <div>
      <input
        className="field"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        autoFocus
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        aria-label="Ta réponse"
      />
      <div className="keys">
        {(KEYS[type] || []).map((k) => (
          <button key={k} type="button" className="key" disabled={disabled}
            onClick={() => onChange(value + k)}>{k}</button>
        ))}
      </div>
    </div>
  );
}
