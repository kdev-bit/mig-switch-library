import type { Game } from "../types";
import { GameCard } from "./GameCard";

type Props = {
    games: Game[];
    searchTerm: string;
};

export function SearchResults({ games, searchTerm }: Props) {
    if (!games.length) {
        return (
            <section className="search-results-section">
                <div className="section-header">
                    <h2 className="section-title">
                        No results found for "{searchTerm}"
                    </h2>
                </div>
            </section>
        );
    }

    return (
        <section className="search-results-section">
            <div className="section-header">
                <h2 className="section-title">
                    Results for "{searchTerm}" ({games.length})
                </h2>
            </div>

            <div className="slider-container">
                <div className="slider-track-grid">
                    {games.map((game) => (
                        <GameCard key={game.name} game={game} />
                    ))}
                </div>
            </div>

        </section>
    );
}