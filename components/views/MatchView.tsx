"use client";

import { useCallback, useEffect, useState } from "react";
import { useStudy } from "@/lib/study-context";
import { useSpeech } from "@/lib/speech";
import { shuffle } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { Empty } from "../Feedback";

const PAIRS = 6;

type Tile = { key: string; id: string; side: "en" | "es"; text: string };

export default function MatchView() {
  const { items, buildQueue, answer } = useStudy();
  const { speak } = useSpeech();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<Tile | null>(null);
  const [solved, setSolved] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);

  const start = useCallback(() => {
    const picks = buildQueue(PAIRS);
    setTiles(
      shuffle(
        picks.flatMap((t): Tile[] => [
          { key: `${t.id}-en`, id: t.id, side: "en", text: t.en },
          { key: `${t.id}-es`, id: t.id, side: "es", text: t.es },
        ]),
      ),
    );
    setSelected(null);
    setSolved([]);
    setMissed([]);
  }, [buildQueue]);

  useEffect(() => {
    start();
  }, [start]);

  if (items.length < PAIRS) {
    return <Empty message={`Necesitas al menos ${PAIRS} palabras en este grupo.`} />;
  }

  const done = solved.length === PAIRS;

  const click = (tile: Tile) => {
    if (solved.includes(tile.id)) return;

    if (!selected) {
      setSelected(tile);
      if (tile.side === "en") speak(tile.text);
      return;
    }
    if (selected.key === tile.key) {
      setSelected(null);
      return;
    }

    if (selected.id === tile.id && selected.side !== tile.side) {
      answer(tile.id, true);
      setSolved((s) => [...s, tile.id]);
      setSelected(null);
      const english = selected.side === "en" ? selected.text : tile.text;
      speak(english);
    } else {
      answer(selected.id, false);
      const pair = [selected.key, tile.key];
      setMissed(pair);
      setSelected(null);
      setTimeout(() => setMissed([]), 420);
    }
  };

  return (
    <>
      <div className="meta">
        <span>{done ? "¡Todas las parejas encontradas!" : "Une cada palabra con su significado"}</span>
        <span className="tag">{PAIRS} parejas</span>
      </div>

      <div className="panel">
        <div className="grid">
          {tiles.map((t) => {
            const classes = [
              "tile",
              t.side,
              solved.includes(t.id) ? "done" : "",
              selected?.key === t.key ? "sel" : "",
              missed.includes(t.key) ? "miss" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button key={t.key} className={classes} onClick={() => click(t)}>
                {t.text}
              </button>
            );
          })}
        </div>
      </div>

      {done && (
        <div className="row mt">
          <button className="btn yes" onClick={start}>
            <RotateCcw size={18} aria-hidden="true" /> Otra ronda
          </button>
        </div>
      )}
    </>
  );
}
