import { todayKey, yesterdayKey } from "./utils";

/** Cajón Leitner: 1 = recién fallada, 5 = dominada. */
export type Stat = { box: number; hits: number; misses: number };
export type Progress = Record<string, Stat>;

export type StudyState = {
  progress: Progress;
  streak: number;
  lastDay: string | null;
};

export const MASTERED_BOX = 4;
export const REVIEW_BOX = 2;

export const emptyState = (): StudyState => ({ progress: {}, streak: 0, lastDay: null });

export function boxOf(progress: Progress, id: string): number {
  return progress[id]?.box ?? 1;
}

/** Acertar sube un cajón; fallar devuelve la palabra al cajón 1. */
export function applyAnswer(state: StudyState, id: string, correct: boolean): StudyState {
  const prev: Stat = state.progress[id] ?? { box: 1, hits: 0, misses: 0 };
  const next: Stat = correct
    ? { box: Math.min(5, prev.box + 1), hits: prev.hits + 1, misses: prev.misses }
    : { box: 1, hits: prev.hits, misses: prev.misses + 1 };

  const today = todayKey();
  const streak = state.lastDay === today ? state.streak : state.streak + 1;

  return {
    progress: { ...state.progress, [id]: next },
    streak,
    lastDay: today,
  };
}

/** Al abrir la app: si se saltó un día, la racha vuelve a cero. */
export function refreshStreak(state: StudyState): StudyState {
  const today = todayKey();
  if (state.lastDay === today) return state;
  if (state.lastDay === yesterdayKey()) return state;
  return { ...state, streak: 0 };
}

export function loadState(key: string): StudyState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<StudyState>;
    return refreshStreak({ ...emptyState(), ...parsed });
  } catch {
    return emptyState();
  }
}

export function saveState(key: string, state: StudyState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* modo privado o almacenamiento lleno: la sesión sigue funcionando */
  }
}
