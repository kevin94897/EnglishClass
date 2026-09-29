import type { Term } from "@/data/vocabulary";
import { normalize, shuffle } from "./utils";

/** Ejemplo con un hueco: `before` + ____ + `after`. */
export type Cloze = {
  term: Term;
  before: string;
  answer: string;
  after: string;
  /** El hueco está al inicio de una oración: las opciones van con mayúscula. */
  atStart: boolean;
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Palabra que se practica de un término (sin el "to " de los verbos). */
export const blankOf = (t: Term) => (t.blank ?? t.en).replace(/^to /i, "").trim();

/**
 * Convierte el ejemplo de un término en un ejercicio de completar.
 * Devuelve null si la palabra no aparece en el ejemplo o si el hueco se
 * comería casi toda la frase (no habría nada que leer).
 */
export function makeCloze(term: Term): Cloze | null {
  const word = blankOf(term);
  if (!word) return null;
  // Límites que también funcionan si la palabra termina en signo ("don't", "Yes, I do.")
  const pattern = `(?<![\\p{L}\\p{N}])${escape(word)}(?![\\p{L}\\p{N}])`;
  const m =
    new RegExp(pattern, "u").exec(term.exEn) ?? new RegExp(pattern, "iu").exec(term.exEn);
  if (!m) return null;
  if (word.length / term.exEn.length > 0.5) return null;
  const before = term.exEn.slice(0, m.index);
  return {
    term,
    before,
    answer: m[0],
    after: term.exEn.slice(m.index + m[0].length),
    atStart: before.trim() === "" || /[.!?—]\s*$/.test(before),
  };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const low = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Cuatro alternativas para el hueco: la correcta y tres de la misma categoría. */
export function clozeOptions(cloze: Cloze, all: Term[]): string[] {
  const shape = cloze.atStart ? cap : low;
  const answer = shape(cloze.answer);
  const seen = new Set([normalize(answer)]);
  const pick = (pool: Term[]) =>
    shuffle(pool)
      .map((t) => shape(blankOf(t)))
      .filter((w) => {
        const k = normalize(w);
        if (!w || seen.has(k)) return false;
        seen.add(k);
        return true;
      });

  const sameCat = pick(all.filter((t) => t.cat === cloze.term.cat && t.id !== cloze.term.id));
  const rest = sameCat.length >= 3 ? [] : pick(all.filter((t) => t.id !== cloze.term.id));
  return shuffle([answer, ...[...sameCat, ...rest].slice(0, 3)]);
}

export const sameWord = (a: string, b: string) => normalize(a) === normalize(b);
