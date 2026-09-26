"use client";

import { useCallback, useEffect, useState } from "react";
import { CATEGORY_LABEL, type Term } from "@/data/vocabulary";
import { useStudy } from "@/lib/study-context";
import { useSpeech } from "@/lib/speech";
import { Empty, RoundEnd } from "../Feedback";

export default function CardsView() {
  const { buildQueue, answer } = useStudy();
  const { speak } = useSpeech();
  const [queue, setQueue] = useState<Term[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const start = useCallback(() => {
    setQueue(buildQueue());
    setIndex(0);
    setFlipped(false);
  }, [buildQueue]);

  useEffect(() => {
    start();
  }, [start]);

  const current = queue[index];

  useEffect(() => {
    if (current) speak(current.en);
  }, [current, speak]);

  if (!queue.length) {
    return <Empty message="Estudia un poco en otro modo y las palabras difíciles aparecerán aquí." />;
  }

  if (!current) {
    return (
      <RoundEnd
        title="Ronda terminada"
        message={`Revisaste ${queue.length} tarjetas de este grupo.`}
        onRestart={start}
      />
    );
  }

  const next = (correct: boolean) => {
    answer(current.id, correct);
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  return (
    <>
      <div className="meta">
        <span>
          Tarjeta {index + 1} de {queue.length}
        </span>
        <span className="tag">{CATEGORY_LABEL[current.cat]}</span>
      </div>

      <div className="card-stage">
        <button
          className={`card${flipped ? " flipped" : ""}`}
          onClick={() => setFlipped((f) => !f)}
          aria-label="Voltear tarjeta"
        >
          <div className="face front">
            <div className="emoji">{current.emoji}</div>
            <div className="word">{current.en}</div>
            <div className="hint">Toca para ver el significado</div>
          </div>
          <div className="face back">
            <div className="word-es">{current.es}</div>
            <div className="ex">
              {current.exEn}
              <i>{current.exEs}</i>
            </div>
          </div>
        </button>
      </div>

      <div className="row">
        <button className="btn ghost" onClick={() => speak(current.en)} aria-label="Escuchar" title="Escuchar">
          🔊
        </button>
        <button className="btn no" onClick={() => next(false)}>
          Todavía no
        </button>
        <button className="btn yes" onClick={() => next(true)}>
          La sé
        </button>
      </div>
    </>
  );
}
