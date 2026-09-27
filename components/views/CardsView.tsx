"use client";

import { useCallback, useEffect, useState } from "react";
import type { Term } from "@/data/vocabulary";
import { useStudy } from "@/lib/study-context";
import { useSpeech } from "@/lib/speech";
import { Check, RotateCw, Volume2, X } from "lucide-react";
import { Empty, RoundEnd } from "../Feedback";

export default function CardsView() {
  const { buildQueue, answer, catLabel } = useStudy();
  const { speak } = useSpeech();
  const [queue, setQueue] = useState<Term[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const start = useCallback(() => {
    setQueue(buildQueue());
    setIndex(0);
    setFlipped(false);
  }, [buildQueue]);

  // Solo al montar: responder cambia el progreso (y con él buildQueue) y no
  // debe reiniciar la ronda. La vista se remonta por su key al cambiar de
  // temario, modo o grupo.
  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <span className="tag">{catLabel(current.cat)}</span>
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
            <div className="hint">
              <RotateCw size={13} aria-hidden="true" /> Toca para ver el significado
            </div>
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
          <Volume2 size={20} />
        </button>
        <button className="btn no" onClick={() => next(false)}>
          <X size={18} aria-hidden="true" /> Todavía no
        </button>
        <button className="btn yes" onClick={() => next(true)}>
          <Check size={18} aria-hidden="true" /> La sé
        </button>
      </div>
    </>
  );
}
