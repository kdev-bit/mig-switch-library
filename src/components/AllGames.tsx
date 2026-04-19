import type { Game } from "../types";
import { GameCard } from "./GameCard";
import { useMemo, useState } from "react";

type Props = {
    games: Game[];
    title: string;
};

type SortOption = "rating" | "name" | "year";

export function AllGames({ games, title }: Props) {
    const [sortBy, setSortBy] = useState<SortOption>("name");
    const [showAll, setShowAll] = useState(false);

    const sortedGames = useMemo(() => {
        const result = [...games];

        result.sort((a, b) => {
            if (sortBy === "rating") {
                return (b.rating ?? 0) - (a.rating ?? 0);
            }

            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            }

            if (sortBy === "year") {
                return new Date(b.released).getTime() - new Date(a.released).getTime();
            }

            return 0;
        });

        return result;
    }, [games, sortBy]);

    const visibleGames = useMemo(() => {
        return showAll ? sortedGames : sortedGames.slice(0, 30);
    }, [sortedGames, showAll]);

    if (!games.length) {
        return <p>Nessun gioco trovato.</p>;
    }

    return (
        <section className="game-section">
            <div className="section-header-allgames">
                <h2 className="section-title">{title}</h2>

                <div className="sort-dropdown">
                    <select
                        id="sortSelect"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                        <option value="name">Name (A-Z)</option>
                        <option value="rating">Top Rated</option>
                        <option value="year">Latest Releases</option>
                    </select>
                </div>
            </div>

            <div className="slider-container">
                <div className="slider-track-grid">
                    {visibleGames.map((g) => (
                        <GameCard key={g.name} game={g} />
                    ))}
                </div>
            </div>

            {sortedGames.length > 30 && (
                <div className="show-all-wrapper">
                    <button
                        className="show-all-button"
                        onClick={() => setShowAll((prev) => !prev)}
                    >
                        {showAll ? "Show Less" : "Show All"}
                    </button>
                </div>
            )}
        </section>
    );
}