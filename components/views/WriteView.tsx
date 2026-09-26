"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Term } from "@/data/vocabulary";
import { useStudy } from "@/lib/study-context";
import { useSpeech } from "@/lib/speech";
import { normalize } from "@/lib/utils";
import { Empty, RoundEnd } from "../Feedback";

const ROUND = 10;

export default function WriteView() {
  const { buildQueue, answer } = useStudy();
  const { speak } = useSpeech();
  const [queue, setQueue] = useState<Term[]>([]);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [clue, setClue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = useCallback(() => {
    setQueue(buildQueue(ROUND));
    setIndex(0);
    setValue("");
    setChecked(null);
    setClue(false);
  }, [buildQueue]);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  const current = queue[index];

  if (!queue.length) return <Empty message="Elige otro grupo para practicar la escritura." />;

  if (!current) {
    return (
      <RoundEnd
        title="Ronda terminada"
        message={`Escribiste ${queue.length} palabras.`}
        onRestart={start}
      />
    );
  }

  const bare = current.en.replace(/^to /, "");

  const check = () => {
    if (checked !== null) return;
    const correct = normalize(value) === normalize(current.en);
    setChecked(correct);
    answer(current.id, correct);
    speak(current.en);
  };

  const next = () => {
    setValue("");
    setChecked(null);
    setClue(false);
    setIndex((i) => i + 1);
  };

  return (
    <>
      <div className="meta">
        <span>
          Palabra {index + 1} de {queue.length}
        </span>
        <span className="tag">Escríbela en inglés</span>
      </div>

      <div className="panel">
        <div className="prompt">
          <div className="emoji">{current.emoji}</div>
          <div className="word-es">{current.es}</div>
        </div>

        <div className="pad">
          <input
            ref={inputRef}
            className="write-in"
            value={value}
            disabled={checked !== null}
            placeholder="escribe aquí"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (checked === null ? check : next)();
            }}
          />

          {clue && checked === null && (
            <div className="verdict" style={{ padding: "12px 0 0" }}>
              Empieza con <b>{bare[0]}</b> y tiene {bare.length} letras.
            </div>
          )}

          {checked !== null && (
            <div className={`verdict${checked ? "" : " bad"}`} style={{ padding: "12px 0 0" }}>
              <b>{checked ? `Bien escrito: ${current.en}` : `Se escribe ${current.en}`}</b>
              <br />
              {current.exEn} <i>{current.exEs}</i>
            </div>
          )}

          <div className="row mt">
            <button className="btn ghost" onClick={() => setClue(true)} title="Pista" aria-label="Pista">
              💡
            </button>
            <button className="btn yes" onClick={checked === null ? check : next}>
              {checked === null ? "Revisar" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
