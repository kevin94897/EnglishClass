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
import { type DeckId, type Term, type ViewId } from "@/data/vocabulary";
import { findTopic, LAST_TOPIC_KEY, storageKeyFor, type Topic } from "@/data/topics";
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
  /** Temario activo; null mientras se muestra el selector de inicio. */
  topic: Topic | null;
  lastTopicId: string | null;
  selectTopic: (id: string) => void;
  leaveTopic: () => void;
  view: ViewId;
  deck: DeckId;
  setView: (v: ViewId) => void;
  setDeck: (d: DeckId) => void;
  /** Filtros del temario activo: Todo, sus categorías y Por repasar. */
  decks: { id: DeckId; label: string }[];
  catLabel: (cat: string) => string;
  /** Todos los términos del temario activo. */
  all: Term[];
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

// El progreso viaja junto con el id de su temario para no guardar nunca
// el estado de un temario bajo la clave de otro.
type Store = { topicId: string | null; state: StudyState };

export function StudyProvider({ children }: { children: ReactNode }) {
  const [topicId, setTopicId] = useState<string | null>(null);
  const [lastTopicId, setLastTopicId] = useState<string | null>(null);
  const [store, setStore] = useState<Store>({ topicId: null, state: emptyState() });
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<ViewId>("cards");
  const [deck, setDeck] = useState<DeckId>("all");

  const topic = useMemo(() => findTopic(topicId), [topicId]);

  // localStorage solo en el cliente, después del montaje (evita mismatch de hidratación).
  useEffect(() => {
    try {
      setLastTopicId(window.localStorage.getItem(LAST_TOPIC_KEY));
    } catch {
      /* almacenamiento bloqueado */
    }
    setReady(true);
  }, []);

  // Al elegir un temario se carga su progreso.
  useEffect(() => {
    if (!topic) return;
    setStore({ topicId: topic.id, state: loadState(storageKeyFor(topic)) });
  }, [topic]);

  useEffect(() => {
    if (topic && store.topicId === topic.id) saveState(storageKeyFor(topic), store.state);
  }, [store, topic]);

  const selectTopic = useCallback((id: string) => {
    setTopicId(id);
    setLastTopicId(id);
    setView("cards");
    setDeck("all");
    try {
      window.localStorage.setItem(LAST_TOPIC_KEY, id);
    } catch {
      /* almacenamiento bloqueado */
    }
  }, []);

  const leaveTopic = useCallback(() => setTopicId(null), []);

  const state = store.topicId === topic?.id ? store.state : emptyState();
  const all = useMemo(() => topic?.terms ?? [], [topic]);

  const decks = useMemo<{ id: DeckId; label: string }[]>(
    () => [
      { id: "all", label: "Todo" },
      ...(topic?.categories ?? []),
      { id: "review", label: "Por repasar" },
    ],
    [topic],
  );

  const catLabel = useCallback(
    (cat: string) => topic?.categories.find((c) => c.id === cat)?.label ?? cat,
    [topic],
  );

  const items = useMemo(() => {
    if (deck === "review") {
      return all.filter((t) => {
        const stat = state.progress[t.id];
        return stat && stat.box <= REVIEW_BOX;
      });
    }
    if (deck === "all") return all;
    return all.filter((t) => t.cat === deck);
  }, [all, deck, state.progress]);

  const box = useCallback((id: string) => boxOf(state.progress, id), [state.progress]);

  const buildQueue = useCallback(
    (limit?: number) => {
      const ordered = shuffle(items).sort((a, b) => box(a.id) - box(b.id));
      return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
    },
    [items, box],
  );

  const answer = useCallback((id: string, correct: boolean) => {
    setStore((prev) => ({ ...prev, state: applyAnswer(prev.state, id, correct) }));
  }, []);

  const reset = useCallback(() => setStore((prev) => ({ ...prev, state: emptyState() })), []);

  const scope = deck === "review" ? all : items;
  const mastered = scope.filter((t) => box(t.id) >= MASTERED_BOX).length;

  const value: StudyContextValue = {
    topic,
    lastTopicId,
    selectTopic,
    leaveTopic,
    view,
    deck,
    setView,
    setDeck,
    decks,
    catLabel,
    all,
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
