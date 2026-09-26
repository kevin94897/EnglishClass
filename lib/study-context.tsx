"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { VOCAB, type DeckId, type Term, type ViewId } from "@/data/vocabulary";
import {
  applyAnswer,
  boxOf,
  emptyState,
  loadState,
  saveState,
  MASTERED_BOX,
  REVIEW_BOX,
  type StudyState,
} from "./srs";
import { shuffle } from "./utils";

type StudyContextValue = {
  view: ViewId;
  deck: DeckId;
  setView: (v: ViewId) => void;
  setDeck: (d: DeckId) => void;
  /** Palabras del mazo activo. */
  items: Term[];
  /** Cola de estudio: primero lo menos dominado, con algo de azar. */
  buildQueue: (limit?: number) => Term[];
  box: (id: string) => number;
  answer: (id: string, correct: boolean) => void;
  streak: number;
  mastered: number;
  total: number;
  ready: boolean;
  reset: () => void;
};

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudyState>(emptyState);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<ViewId>("cards");
  const [deck, setDeck] = useState<DeckId>("all");

  // localStorage solo en el cliente, después del montaje (evita mismatch de hidratación).
  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const items = useMemo(() => {
    if (deck === "review") {
      return VOCAB.filter((t) => {
        const stat = state.progress[t.id];
        return stat && stat.box <= REVIEW_BOX;
      });
    }
    if (deck === "all") return VOCAB;
    return VOCAB.filter((t) => t.cat === deck);
  }, [deck, state.progress]);

  const box = useCallback((id: string) => boxOf(state.progress, id), [state.progress]);

  const buildQueue = useCallback(
    (limit?: number) => {
      const ordered = shuffle(items).sort((a, b) => box(a.id) - box(b.id));
      return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
    },
    [items, box],
  );

  const answer = useCallback((id: string, correct: boolean) => {
    setState((prev) => applyAnswer(prev, id, correct));
  }, []);

  const reset = useCallback(() => setState(emptyState()), []);

  const scope = deck === "review" ? VOCAB : items;
  const mastered = scope.filter((t) => box(t.id) >= MASTERED_BOX).length;

  const value: StudyContextValue = {
    view,
    deck,
    setView,
    setDeck,
    items,
    buildQueue,
    box,
    answer,
    streak: state.streak,
    mastered,
    total: scope.length,
    ready,
    reset,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyContextValue {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy debe usarse dentro de <StudyProvider>");
  return ctx;
}
