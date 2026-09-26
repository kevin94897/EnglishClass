"use client";

import { useState } from "react";
import {
  BookA,
  Grid2x2,
  Headphones,
  Layers,
  LayoutGrid,
  ListChecks,
  Moon,
  PenLine,
  Puzzle,
  Sun,
} from "lucide-react";
import { VIEWS } from "@/data/vocabulary";
import { useStudy } from "@/lib/study-context";
import CardsView from "./views/CardsView";
import QuizView from "./views/QuizView";
import ClozeView from "./views/ClozeView";
import MatchView from "./views/MatchView";
import WriteView from "./views/WriteView";
import ListenView from "./views/ListenView";
import GlossaryView from "./views/GlossaryView";
import Station from "./Station";
import TopicPicker from "./TopicPicker";

const VIEW_ICON = {
  cards: Layers,
  quiz: ListChecks,
  cloze: Puzzle,
  match: Grid2x2,
  write: PenLine,
  listen: Headphones,
  glossary: BookA,
} as const;

export default function StudyApp() {
  const { topic, leaveTopic, view, setView, deck, setDeck, decks, ready } =
    useStudy();
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  // La clave fuerza el reinicio de la ronda al cambiar de mazo o de vista.
  const roundKey = `${topic?.id}-${view}-${deck}`;

  return (
    <div className="wrap">
      <header className="rail">
        <div className="mark">
          {/* <div className="burner" aria-hidden="true" /> */}
          <div style={{ minWidth: 0 }}>
            <b>Mise en Place</b>
            <span>
              {topic
                ? `${topic.title} · ${topic.level}`
                : "Inglés práctico, paso a paso"}
            </span>
          </div>
        </div>
        {topic && (
          <button
            className="icon-btn"
            onClick={leaveTopic}
            aria-label="Cambiar temario"
            title="Cambiar temario"
          >
            <LayoutGrid size={18} />
          </button>
        )}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label="Modo claro u oscuro"
          title="Modo claro u oscuro"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {!ready ? (
        <div className="panel center">Cargando tu progreso…</div>
      ) : !topic ? (
        <TopicPicker />
      ) : (
        <>
          <nav className="views" aria-label="Modo de estudio">
            {VIEWS.map((v) => {
              const Icon = VIEW_ICON[v.id];
              return (
                <button
                  key={v.id}
                  aria-pressed={view === v.id}
                  onClick={() => setView(v.id)}
                >
                  <Icon size={16} aria-hidden="true" />
                  {v.label}
                </button>
              );
            })}
          </nav>

          <nav className="decks" aria-label="Grupo de vocabulario">
            {decks.map((d) => (
              <button
                key={d.id}
                aria-pressed={deck === d.id}
                onClick={() => setDeck(d.id)}
              >
                {d.label}
              </button>
            ))}
          </nav>

          <main>
            {view === "cards" ? (
              <CardsView key={roundKey} />
            ) : view === "quiz" ? (
              <QuizView key={roundKey} />
            ) : view === "cloze" ? (
          <ClozeView key={roundKey} />
        ) : view === "match" ? (
              <MatchView key={roundKey} />
            ) : view === "write" ? (
              <WriteView key={roundKey} />
            ) : view === "listen" ? (
              <ListenView key={roundKey} />
            ) : (
              <GlossaryView />
            )}
          </main>

          <Station />
        </>
      )}
    </div>
  );
}
