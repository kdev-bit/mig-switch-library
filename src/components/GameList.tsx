import type { Game } from "../types";
import { GameCard } from "./GameCard";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  games: Game[];
  title: string;
};

export function GameList({ games, title }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    setCanScrollPrev(track.scrollLeft > 0);
    setCanScrollNext(track.scrollLeft < maxScrollLeft - 1);
  }, []);

  const scrollSlider = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const scrollAmount = Math.max(300, track.clientWidth * 0.7);

    track.scrollBy({
      left: direction === "prev" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // aggiorna di nuovo i bottoni dopo lo smooth scroll
    window.setTimeout(updateButtons, 350);
  };

  useEffect(() => {
    updateButtons();

    const handleResize = () => updateButtons();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [games, updateButtons]);

  if (!games.length) {
    return <p>No games found.</p>;
  }

  return (
    <section className="game-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>

      <div className="slider-container">
        <button
          className="slider-btn prev"
          onClick={() => scrollSlider("prev")}
          disabled={!canScrollPrev}
          aria-label="Scorri indietro"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <div
          className="slider-track"
          ref={trackRef}
          onScroll={updateButtons}
        >
          {games.map((g) => (
            <GameCard key={g.name} game={g} />
          ))}
        </div>

        <button
          className="slider-btn next"
          onClick={() => scrollSlider("next")}
          disabled={!canScrollNext}
          aria-label="Scorri avanti"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}