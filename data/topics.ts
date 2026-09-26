import { CATEGORY_LABEL, VOCAB, type Term } from "./vocabulary";
import { WH_CATEGORIES, WH_TERMS } from "./wh-questions";

/**
 * Un temario es un conjunto de términos con sus propias categorías y su
 * propio progreso guardado. Para agregar uno nuevo basta con crear su
 * archivo de términos (como data/vocabulary.ts) y añadir un objeto aquí:
 * el selector de inicio, los filtros y todos los modos se alimentan de esta lista.
 */
export type Topic = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  level: string;
  categories: { id: string; label: string }[];
  terms: Term[];
  /** Clave de localStorage; si se omite se deriva del id. */
  storageKey?: string;
};

export const TOPICS: Topic[] = [
  {
    id: "kitchen",
    title: "Inglés de cocina",
    subtitle: "Verbos, utensilios, ingredientes y frases de cocina",
    emoji: "👨‍🍳",
    level: "Principiante · A1–A2",
    // Clave histórica: conserva el progreso guardado antes de existir los temarios.
    storageKey: "chefen.beginner.v1",
    categories: Object.entries(CATEGORY_LABEL).map(([id, label]) => ({ id, label })),
    terms: VOCAB,
  },
  {
    id: "wh-questions",
    title: "WH questions",
    subtitle: "What, Where, When, Who, Why, Which, Whose, How… con preguntas para completar",
    emoji: "❓",
    level: "Principiante · A1–A2",
    categories: WH_CATEGORIES,
    terms: WH_TERMS,
  },
];

/** Último temario elegido, para destacarlo en el selector. */
export const LAST_TOPIC_KEY = "chefen.topic";

export const storageKeyFor = (t: Topic) => t.storageKey ?? `chefen.${t.id}.v1`;

export const findTopic = (id: string | null | undefined) =>
  TOPICS.find((t) => t.id === id) ?? null;
