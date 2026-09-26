"use client";

import { useMemo, useState } from "react";
import { useStudy } from "@/lib/study-context";
import { useSpeech } from "@/lib/speech";

export default function GlossaryView() {
  const { items, box } = useStudy();
  const { speak } = useSpeech();
  const [term, setTerm] = useState("");

  const rows = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) => t.en.toLowerCase().includes(q) || t.es.toLowerCase().includes(q),
    );
  }, [items, term]);

  return (
    <>
      <input
        className="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Buscar en inglés o español…"
        autoComplete="off"
        aria-label="Buscar palabra"
      />

      <div className="panel">
        <ul className="list">
          {rows.length === 0 && (
            <li style={{ color: "var(--ink-soft)" }}>Sin resultados para “{term}”.</li>
          )}
          {rows.map((t) => (
            <li key={t.id}>
              <span className="dot" data-box={box(t.id)} title="Nivel de dominio" />
              <span style={{ fontSize: 20 }}>{t.emoji}</span>
              <span className="txt">
                <span className="en" style={{ display: "block" }}>
                  {t.en}
                </span>
                <span className="es" style={{ display: "block" }}>
                  {t.es}
                </span>
              </span>
              <button className="spk" onClick={() => speak(t.en)} aria-label={`Escuchar ${t.en}`}>
                🔊
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
