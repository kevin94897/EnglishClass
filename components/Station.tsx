"use client";

import { useStudy } from "@/lib/study-context";

export default function Station() {
  const { mastered, total, streak } = useStudy();
  const pct = total ? (mastered / total) * 100 : 0;

  return (
    <div className="station">
      <span>
        {mastered} de {total} dominadas
      </span>
      <div
        className="bar"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Palabras dominadas"
      >
        <span style={{ width: `${pct.toFixed(1)}%` }} />
      </div>
      <span title="Días seguidos estudiando">🔥 {streak}</span>
    </div>
  );
}
