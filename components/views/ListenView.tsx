"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Term } from "@/data/vocabulary";
import { useStudy } from "@/lib/study-context";
import { useSpeech } from "@/lib/speech";
import { shuffle } from "@/lib/utils";
import { Check, Volume2, X } from "lucide-react";
import { AnswerFeedback, Empty, RoundEnd } from "../Feedback";

const ROUND = 10;

export default function ListenView() {
  const { all, items, buildQueue, answer } = useStudy();
  const { speak, supported } = useSpeech();
  const [queue, setQueue] = useState<Term[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const start = useCallback(() => {
    setQueue(buildQueue(ROUND));
    setIndex(0);
    setPicked(null);
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

  const options = useMemo(() => {
    if (!current) return [];
    const sameCat = all.filter((t) => t.id !== current.id && t.cat === current.cat);
    const pool = sameCat.length >= 3 ? sameCat : all.filter((t) => t.id !== current.id);
    return shuffle([current, ...shuffle(pool).slice(0, 3)]);
  }, [current, all]);

  if (!supported) {
    return <Empty message="Este navegador no reproduce audio de voz. Prueba con Chrome o Safari." />;
  }
  if (items.length < 4) return <Empty message="Necesitas al menos 4 palabras en este grupo." />;

  if (!current) {
    return (
      <RoundEnd
        title="Ronda terminada"
        message={`Escuchaste ${queue.length} palabras.`}
        onRestart={start}
      />
    );
  }

  const choose = (id: string) => {
    if (picked) return;
    setPicked(id);
    answer(current.id, id === current.id);
  };

  return (
    <>
      <div className="meta">
        <span>
          Audio {index + 1} de {queue.length}
        </span>
        <span className="tag">Escucha y elige</span>
      </div>

      <div className="panel">
        <div className="prompt">
          <button
            className="btn yes"
            style={{ maxWidth: 200, margin: "0 auto" }}
            onClick={() => speak(current.en)}
          >
            <Volume2 size={18} aria-hidden="true" /> Escuchar
          </button>
          {picked ? (
            <div className="heard mt">
              <div className="emoji">{current.emoji}</div>
              <div className="word">{current.en}</div>
              <div className="hint">Esta fue la palabra que escuchaste</div>
            </div>
          ) : (
            <div className="hint mt">Puedes repetirlo las veces que quieras</div>
          )}
        </div>

        <div className="options">
          {options.map((o) => {
            const state = !picked
              ? ""
              : o.id === current.id
                ? " right"
                : o.id === picked
                  ? " wrong"
                  : "";
            return (
              <button key={o.id} className={`opt${state}`} disabled={!!picked} onClick={() => choose(o.id)}>
                <span>{o.es}</span>
                {state === " right" && (
                  <span className="en-tag">
                    <Check size={13} aria-hidden="true" /> {o.en}
                  </span>
                )}
                {state === " wrong" && (
                  <span className="en-tag">
                    <X size={13} aria-hidden="true" /> {o.en}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {picked && (
          <AnswerFeedback
            term={current}
            picked={options.find((o) => o.id === picked) ?? null}
            onListen={() => speak(current.en)}
            onNext={() => {
              setPicked(null);
              setIndex((i) => i + 1);
            }}
          />
        )}
      </div>
    </>
  );
}
