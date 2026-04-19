import { useEffect, useMemo, useState } from "react";
import type { Game } from "./types";
import { HeroSection } from "./components/HeroSection";
import { NavBar } from "./components/NavBar";
import { MainContent } from "./components/MainContent";
import { SearchResults } from "./components/SearchResults";

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadGames() {
      try {
        const res = await fetch("/games_deduplicated.json");
        const data = (await res.json()) as Game[];
        setGames(data);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  const filteredGames = useMemo(() => {
    const term = normalizeText(searchTerm.trim());

    if (!term) return [];

    return games.filter((game) =>
      normalizeText(game.name).includes(term)
    );
  }, [games, searchTerm]);

  function normalizeText(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  if (loading) {
    return (
      <span className="loading-screen">
        <i className="fa-solid fa-spinner fa-spin"></i>
        Loading games...
      </span>
    );
  }

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