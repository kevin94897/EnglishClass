"use client";

import { useEffect, useState } from "react";
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

const THEME_KEY = "chefen.theme";

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
  // Tema efectivo (el elegido o, si no hay, el del sistema) para que el
  // primer clic siempre cambie algo y el icono muestre el estado real.
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(THEME_KEY);
    } catch {
      /* almacenamiento bloqueado */
    }
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(saved === "dark" || saved === "light" ? saved : system);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      /* almacenamiento bloqueado */
    }
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
