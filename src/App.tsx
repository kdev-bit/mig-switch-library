import { useMemo, useState } from "react";
import gamesData from "./data/games_deduplicated.json";
import type { Game } from "./types";
import { HeroSection } from "./components/HeroSection";
import { NavBar } from "./components/NavBar";
import { MainContent } from "./components/MainContent";
import { SearchResults } from "./components/SearchResults";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const games = gamesData as Game[];

  const filteredGames = useMemo(() => {
    const term = normalizeText(searchTerm.trim());

    if (!term) return [];

    return games.filter((game) =>
      normalizeText(game.name).includes(term)
    );
  }, [games, searchTerm]);

  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="app">
      <NavBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {!isSearching && <HeroSection />}

      {isSearching ? (
        <SearchResults games={filteredGames} searchTerm={searchTerm} />
      ) : (
        <MainContent games={games} />
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo"></div>
          <div className="footer-links"></div>
          <p className="copyright">© 2026 MIG SWITCH.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;