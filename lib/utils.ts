export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Compara respuestas escritas ignorando mayúsculas, tildes, "to " y puntuación. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/^to\s+/, "")
    .replace(/[.,!?¡¿'"]/g, "")
    .replace(/\s+/g, " ");
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function yesterdayKey(): string {
  return todayKey(new Date(Date.now() - 86_400_000));
}
