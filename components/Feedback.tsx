"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, Check, RotateCcw, Volume2, X } from "lucide-react";
import type { Term } from "@/data/vocabulary";

export function Empty({ message }: { message: string }) {
  return (
    <div className="panel center">
      <h3>Nada por aquí todavía</h3>
      <p>{message}</p>
    </div>
  );
}

export function RoundEnd({
  title,
  message,
  onRestart,
  label = "Otra ronda",
}: {
  title: string;
  message: string;
  onRestart: () => void;
  label?: string;
}) {
  return (
    <div className="panel center">
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="row mt">
        <button className="btn yes" onClick={onRestart}>
          <RotateCcw size={18} aria-hidden="true" /> {label}
        </button>
      </div>
    </div>
  );
}

const CHEERS = ["¡Purrfecto!", "¡Miau-ravilloso!", "¡Excelente!", "¡Lo lograste!", "¡Muy bien, chef!"];
const CATS = ["😸", "😻", "😺"];
const CONFETTI = ["🎉", "✨", "🐾", "⭐", "🎊", "✨", "🐾", "🎉"];

function Highlight({ text, word }: { text: string; word: string }) {
  const bare = word.replace(/^to /, "").trim();
  const safe = bare.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(\\b${safe}\\w*)`, "i"));
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <mark key={i}>{p}</mark> : p))}
    </>
  );
}

/**
 * Corrección didáctica tras elegir una alternativa: muestra la respuesta
 * correcta, qué significa lo que se eligió (si falló) y un ejemplo de uso.
 * Los gatitos celebran cuando se acierta.
 */
export function AnswerFeedback({
  term,
  picked,
  onNext,
  onListen,
}: {
  term: Term;
  picked: Term | null;
  onNext: () => void;
  onListen: () => void;
}) {
  const correct = !picked || picked.id === term.id;
  const cheer = useMemo(() => CHEERS[Math.floor(Math.random() * CHEERS.length)], [term.id]);
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className={`fb ${correct ? "ok" : "miss"}`} role="status">
      {correct ? (
        <div className="cats" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <span key={i} className="confetti" style={{ left: `${6 + i * 12}%`, animationDelay: `${i * 0.08}s` }}>
              {c}
            </span>
          ))}
          {CATS.map((c, i) => (
            <span key={c} className="cat" style={{ animationDelay: `${i * 0.12}s` }}>
              {c}
            </span>
          ))}
        </div>
      ) : (
        <div className="cats" aria-hidden="true">
          <span className="cat soft">🐱</span>
          <span className="cat soft" style={{ animationDelay: "0.15s" }}>📚</span>
        </div>
      )}

      <div className="fb-title">{correct ? cheer : "¡Casi! Aprendamos esta:"}</div>

      {!correct && picked && (
        <div className="fb-picked">
          <span className="x"><X size={14} aria-hidden="true" /></span> Elegiste <b>{picked.es}</b>, que en inglés es <b>{picked.en}</b>.
        </div>
      )}

      <div className="fb-card">
        <div className="fb-emoji">{term.emoji}</div>
        <div className="fb-words">
          <div className="fb-en">
            {term.en}
            <button className="spk" onClick={onListen} aria-label={`Escuchar ${term.en}`}>
              <Volume2 size={16} />
            </button>
          </div>
          <div className="fb-es">
            <span className="check"><Check size={15} aria-hidden="true" /></span> {term.es}
          </div>
        </div>
      </div>

      <div className="fb-ex">
        <div className="fb-label">Ejemplo</div>
        <div>
          <Highlight text={term.exEn} word={term.en} />
        </div>
        <i>{term.exEs}</i>
      </div>

      <div className="row mt">
        <button ref={nextRef} className={`btn${correct ? " yes" : ""}`} onClick={onNext}>
          Siguiente <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
