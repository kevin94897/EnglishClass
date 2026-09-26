"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Term } from "@/data/vocabulary";
import { useStudy } from "@/lib/study-context";
import { useSpeech } from "@/lib/speech";
import { shuffle } from "@/lib/utils";
import { ArrowLeftRight, Check, X } from "lucide-react";
import { AnswerFeedback, Empty, RoundEnd } from "../Feedback";

const ROUND = 10;
type Direction = "en2es" | "es2en";

export default function QuizView() {
  const { all, items, buildQueue, answer } = useStudy();
  const { speak } = useSpeech();
  const [queue, setQueue] = useState<Term[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  // Tras elegir, primero se ven las opciones marcadas y luego la explicación.
  const [reveal, setReveal] = useState(false);
  const [direction, setDirection] = useState<Direction>("en2es");

  const start = useCallback(() => {
    setQueue(buildQueue(ROUND));
    setIndex(0);
    setScore(0);
    setPicked(null);
    setReveal(false);
  }, [buildQueue]);

  useEffect(() => {
    start();
  }, [start]);

  const current = queue[index];

  useEffect(() => {
    if (!picked || !current) return;
    const correct = picked === current.id;
    const t = setTimeout(() => setReveal(true), correct ? 1400 : 2600);
    return () => clearTimeout(t);
  }, [picked, current]);

  // Los distractores salen de la misma categoría para que la pregunta exija saber, no adivinar.
  const options = useMemo(() => {
    if (!current) return [];
    const sameCat = all.filter((t) => t.id !== current.id && t.cat === current.cat);
    const pool = sameCat.length >= 3 ? sameCat : all.filter((t) => t.id !== current.id);
    return shuffle([current, ...shuffle(pool).slice(0, 3)]);
  }, [current, all]);

  if (items.length < 4) return <Empty message="Necesitas al menos 4 palabras en este grupo." />;

  if (!current) {
    return (
      <RoundEnd
        title={`${score} de ${queue.length} correctas`}
        message={
          score === queue.length
            ? "Ronda perfecta."
            : "Las que fallaste vuelven en el grupo “Por repasar”."
        }
        onRestart={start}
        label="Jugar otra vez"
      />
    );
  }

  const ask = direction === "en2es" ? current.en : current.es;
  const optionLabel = (t: Term) => (direction === "en2es" ? t.es : t.en);

  const choose = (id: string) => {
    if (picked) return;
    const correct = id === current.id;
    setPicked(id);
    setReveal(false);
    if (correct) setScore((s) => s + 1);
    answer(current.id, correct);
    speak(current.en);
  };

  return (
    <>
      <div className="meta">
        <span>
          Pregunta {index + 1} de {queue.length} · {score} correctas
        </span>
        <button
          className="tag"
          style={{ cursor: "pointer" }}
          onClick={() => setDirection((d) => (d === "en2es" ? "es2en" : "en2es"))}
        >
          <ArrowLeftRight size={13} aria-hidden="true" /> {direction === "en2es" ? "EN → ES" : "ES → EN"}
        </button>
      </div>

      <div className="panel">
        <div className="prompt">
          <div className="emoji">{current.emoji}</div>
          <div className="word">{ask}</div>
        </div>

        <div className="options">
          {options.map((o, i) => {
            const state = !picked
              ? ""
              : o.id === current.id
                ? " right"
                : o.id === picked
                  ? " wrong"
                  : "";
            return (
              <button
                key={o.id}
                className={`opt${state}`}
                disabled={!!picked}
                onClick={() => choose(o.id)}
              >
                <span className="k">{i + 1}</span>
                <span>{optionLabel(o)}</span>
              </button>
            );
          })}
        </div>

        {picked && !reveal && (
          <div className={`pause${picked === current.id ? "" : " bad"}`} aria-live="polite">
            {picked === current.id ? (
              <>
                <Check size={16} aria-hidden="true" /> ¡Correcto! Mira la respuesta…
              </>
            ) : (
              <>
                <X size={16} aria-hidden="true" /> Incorrecto. Mira cuál era la correcta…
              </>
            )}
          </div>
        )}

        {picked && reveal && (
          <AnswerFeedback
            term={current}
            picked={options.find((o) => o.id === picked) ?? null}
            onListen={() => speak(current.en)}
            onNext={() => {
              setPicked(null);
              setReveal(false);
              setIndex((i) => i + 1);
            }}
          />
        )}
      </div>
    </>
  );
}
