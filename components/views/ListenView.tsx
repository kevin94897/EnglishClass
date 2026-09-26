"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { VOCAB, type Term } from "@/data/vocabulary";
import { useStudy } from "@/lib/study-context";
import { useSpeech } from "@/lib/speech";
import { shuffle } from "@/lib/utils";
import { Empty, RoundEnd } from "../Feedback";

const ROUND = 10;

export default function ListenView() {
  const { items, buildQueue, answer } = useStudy();
  const { speak, supported } = useSpeech();
  const [queue, setQueue] = useState<Term[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const start = useCallback(() => {
    setQueue(buildQueue(ROUND));
    setIndex(0);
    setPicked(null);
  }, [buildQueue]);

  useEffect(() => {
    start();
  }, [start]);

  const current = queue[index];

  useEffect(() => {
    if (current) speak(current.en);
  }, [current, speak]);

  const options = useMemo(() => {
    if (!current) return [];
    const sameCat = VOCAB.filter((t) => t.id !== current.id && t.cat === current.cat);
    const pool = sameCat.length >= 3 ? sameCat : VOCAB.filter((t) => t.id !== current.id);
    return shuffle([current, ...shuffle(pool).slice(0, 3)]);
  }, [current]);

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
            🔊 Escuchar
          </button>
          <div className="hint mt">Puedes repetirlo las veces que quieras</div>
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
              </button>
            );
          })}
        </div>

        {picked && (
          <div className={`verdict${picked === current.id ? "" : " bad"}`}>
            <b>{current.en}</b> — {current.es}
            <div className="row mt">
              <button
                className="btn"
                autoFocus
                onClick={() => {
                  setPicked(null);
                  setIndex((i) => i + 1);
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
