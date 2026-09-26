"use client";

import { useState } from "react";
import { DECKS, VIEWS } from "@/data/vocabulary";
import { useStudy } from "@/lib/study-context";
import CardsView from "./views/CardsView";
import QuizView from "./views/QuizView";
import MatchView from "./views/MatchView";
import WriteView from "./views/WriteView";
import ListenView from "./views/ListenView";
import GlossaryView from "./views/GlossaryView";
import Station from "./Station";

export default function StudyApp() {
  const { view, setView, deck, setDeck, ready } = useStudy();
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  // La clave fuerza el reinicio de la ronda al cambiar de mazo o de vista.
  const roundKey = `${view}-${deck}`;

  return (
    <div className="wrap">
      <header className="rail">
        <div className="mark">
          <div className="burner" aria-hidden="true" />
          <div style={{ minWidth: 0 }}>
            <b>Mise en Place</b>
            <span>Inglés de cocina · nivel principiante</span>
          </div>
        </div>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
          ◐
        </button>
      </header>

      <nav className="views" aria-label="Modo de estudio">
        {VIEWS.map((v) => (
          <button key={v.id} aria-pressed={view === v.id} onClick={() => setView(v.id)}>
            {v.label}
          </button>
        ))}
      </nav>

      <nav className="decks" aria-label="Grupo de vocabulario">
        {DECKS.map((d) => (
          <button key={d.id} aria-pressed={deck === d.id} onClick={() => setDeck(d.id)}>
            {d.label}
          </button>
        ))}
      </nav>

      <main>
        {!ready ? (
          <div className="panel center">Cargando tu progreso…</div>
        ) : view === "cards" ? (
          <CardsView key={roundKey} />
        ) : view === "quiz" ? (
          <QuizView key={roundKey} />
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
    </div>
  );
}
