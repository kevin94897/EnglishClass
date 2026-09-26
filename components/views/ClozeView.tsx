"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Keyboard, ListChecks, Volume2, X } from "lucide-react";
import { useStudy } from "@/lib/study-context";
import { useSpeech } from "@/lib/speech";
import { blankOf, clozeOptions, makeCloze, sameWord, type Cloze } from "@/lib/cloze";
import { AnswerFeedback, Empty, RoundEnd } from "../Feedback";

const ROUND = 10;
type Mode = "choose" | "write";

/** Completar: el ejemplo del término con un hueco, por alternativas o escribiendo. */
export default function ClozeView() {
  const { all, items, buildQueue, answer } = useStudy();
  const { speak } = useSpeech();
  const [queue, setQueue] = useState<Cloze[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<Mode>("choose");
  const [picked, setPicked] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const start = useCallback(() => {
    // Solo entran los términos cuyo ejemplo permite un hueco con sentido.
    const exercises = buildQueue()
      .map(makeCloze)
      .filter((c): c is Cloze => c !== null)
      .slice(0, ROUND);
    setQueue(exercises);
    setIndex(0);
    setScore(0);
    setPicked(null);
    setReveal(false);
    setValue("");
  }, [buildQueue]);

  useEffect(() => {
    start();
  }, [start]);

  const current = queue[index];

  const options = useMemo(() => (current ? clozeOptions(current, all) : []), [current, all]);

  // Tras responder: primero se ve la corrección en el hueco y luego la explicación.
  useEffect(() => {
    if (!picked || !current) return;
    const correct = sameWord(picked, current.answer);
    const t = setTimeout(() => setReveal(true), correct ? 1600 : 3000);
    return () => clearTimeout(t);
  }, [picked, current]);

  useEffect(() => {
    if (mode === "write" && !picked) inputRef.current?.focus({ preventScroll: true });
  }, [mode, index, picked]);

  if (items.length < 4) return <Empty message="Necesitas al menos 4 palabras en este grupo." />;
  if (!queue.length) return <Empty message="Este grupo no tiene ejemplos para completar." />;

  if (!current) {
    return (
      <RoundEnd
        title={`${score} de ${queue.length} correctas`}
        message={score === queue.length ? "Ronda perfecta." : "Las que fallaste vuelven en el grupo “Por repasar”."}
        onRestart={start}
        label="Otra ronda"
      />
    );
  }

  const correct = picked !== null && sameWord(picked, current.answer);

  const submit = (word: string) => {
    if (picked !== null || !word.trim()) return;
    const ok = sameWord(word, current.answer);
    setPicked(word);
    setReveal(false);
    if (ok) setScore((s) => s + 1);
    answer(current.term.id, ok);
    speak(current.term.exEn);
  };

  const next = () => {
    setPicked(null);
    setReveal(false);
    setValue("");
    setIndex((i) => i + 1);
  };

  // Término al que corresponde la alternativa elegida (para explicar el error).
  const pickedTerm =
    picked && !correct ? (all.find((t) => sameWord(blankOf(t), picked)) ?? null) : null;

  return (
    <>
      <div className="meta">
        <span>
          Ejercicio {index + 1} de {queue.length} · {score} correctas
        </span>
        <button
          className="tag"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setMode((m) => (m === "choose" ? "write" : "choose"));
            setValue("");
          }}
          disabled={picked !== null}
        >
          {mode === "choose" ? (
            <>
              <Keyboard size={13} aria-hidden="true" /> Escribir
            </>
          ) : (
            <>
              <ListChecks size={13} aria-hidden="true" /> Alternativas
            </>
          )}
        </button>
      </div>

      <div className="panel">
        <div className="prompt">
          <div className="emoji">{current.term.emoji}</div>
          <p className="cloze" aria-label={`${current.before} espacio en blanco ${current.after}`}>
            {current.before}
            <span className={`gap${picked === null ? "" : correct ? " ok" : " bad"}`}>
              {picked === null ? (value || "____") : correct ? current.answer : picked}
            </span>
            {picked !== null && !correct && <span className="gap fix">{current.answer}</span>}
            {current.after}
          </p>
          <div className="cloze-es">{current.term.exEs}</div>
          {picked !== null && (
            <button className="spk cloze-spk" onClick={() => speak(current.term.exEn)} aria-label="Escuchar la frase">
              <Volume2 size={16} />
            </button>
          )}
        </div>

        {mode === "choose" ? (
          <div className="options">
            {options.map((o, i) => {
              const state =
                picked === null ? "" : sameWord(o, current.answer) ? " right" : sameWord(o, picked) ? " wrong" : "";
              return (
                <button key={o} className={`opt${state}`} disabled={picked !== null} onClick={() => submit(o)}>
                  <span className="k">{i + 1}</span>
                  <span>{o}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="pad">
            <input
              ref={inputRef}
              className="write-in"
              value={value}
              disabled={picked !== null}
              placeholder="escribe la palabra que falta"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              enterKeyHint="done"
              spellCheck={false}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(value);
              }}
            />
            {picked === null && (
              <div className="row mt">
                <button className="btn yes" onClick={() => submit(value)} disabled={!value.trim()}>
                  <Check size={18} aria-hidden="true" /> Revisar
                </button>
              </div>
            )}
          </div>
        )}

        {picked !== null && !reveal && (
          <div className={`pause${correct ? "" : " bad"}`} aria-live="polite">
            {correct ? (
              <>
                <Check size={16} aria-hidden="true" /> ¡Correcto! Mira la frase completa…
              </>
            ) : (
              <>
                <X size={16} aria-hidden="true" /> Incorrecto. La palabra era “{current.answer}”…
              </>
            )}
          </div>
        )}

        {picked !== null && reveal && (
          <AnswerFeedback term={current.term} picked={pickedTerm} onListen={() => speak(current.term.exEn)} onNext={next} />
        )}
      </div>

      {picked !== null && reveal && mode === "write" && (
        <div className="hint mt" style={{ textAlign: "center" }}>
          Enter también pasa al siguiente <ArrowRight size={12} aria-hidden="true" />
        </div>
      )}
    </>
  );
}
