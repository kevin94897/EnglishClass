"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { storageKeyFor, TOPICS } from "@/data/topics";
import { loadState, MASTERED_BOX } from "@/lib/srs";
import { useStudy } from "@/lib/study-context";

/** Pantalla de inicio: elige qué temario practicar. */
export default function TopicPicker() {
  const { selectTopic, lastTopicId } = useStudy();
  // Dominadas por temario, leídas del almacenamiento solo en el cliente.
  const [mastered, setMastered] = useState<Record<string, number>>({});

  useEffect(() => {
    const m: Record<string, number> = {};
    for (const t of TOPICS) {
      const { progress } = loadState(storageKeyFor(t));
      m[t.id] = t.terms.filter((w) => (progress[w.id]?.box ?? 1) >= MASTERED_BOX).length;
    }
    setMastered(m);
  }, []);

  return (
    <section className="picker" aria-labelledby="picker-title">
      <h2 id="picker-title">¿Qué quieres practicar hoy?</h2>
      <p className="picker-sub">Elige un temario. Tu progreso se guarda por separado en cada uno.</p>

      <div className="topics">
        {TOPICS.map((t) => {
          const done = mastered[t.id] ?? 0;
          const pct = t.terms.length ? (done / t.terms.length) * 100 : 0;
          const isLast = t.id === lastTopicId;
          return (
            <button key={t.id} className="topic" onClick={() => selectTopic(t.id)}>
              <span className="topic-emoji" aria-hidden="true">
                {t.emoji}
              </span>
              <span className="topic-body">
                <span className="topic-head">
                  <b>{t.title}</b>
                  {isLast && <span className="tag">Continuar</span>}
                </span>
                <span className="topic-sub">{t.subtitle}</span>
                <span className="topic-meta">
                  {t.level} · {t.terms.length} términos
                </span>
                <span className="bar" aria-hidden="true">
                  <span style={{ width: `${pct.toFixed(1)}%` }} />
                </span>
                <span className="topic-progress">
                  {done} de {t.terms.length} dominadas
                </span>
              </span>
              <ChevronRight className="topic-arrow" size={22} aria-hidden="true" />
            </button>
          );
        })}

        <div className="topic soon" aria-disabled="true">
          <span className="topic-emoji" aria-hidden="true">
            <Sparkles size={26} />
          </span>
          <span className="topic-body">
            <span className="topic-head">
              <b>Más temarios pronto</b>
            </span>
            <span className="topic-sub">Se irán agregando nuevos temas para practicar.</span>
          </span>
        </div>
      </div>
    </section>
  );
}
