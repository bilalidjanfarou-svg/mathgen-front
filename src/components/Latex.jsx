import katex from "katex";
import "katex/dist/katex.min.css";

export default function Latex({ text }) {
  return (
    <span>
      {text.split(/(\$[^$]+\$)/g).map((p, i) =>
        p.startsWith("$") ? (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(p.slice(1, -1), { throwOnError: false }),
            }}
          />
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}
