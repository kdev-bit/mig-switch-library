import { GameList } from "./GameList";
import { useMemo } from "react";
import type { Game } from "../types";
import { AllGames } from "./AllGames";

type Props = {
    games: Game[];
};


export function MainContent({ games }: Props) {

    const topVotedGames = useMemo(() => {
        return [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 25);
    }, [games]);

    const latestReleases = useMemo(() => {
        return [...games].sort((a, b) => new Date(b.released).getTime() - new Date(a.released).getTime()).slice(0, 25);
    }, [games]);

    const arcadeGames = useMemo(() => {
        return games
            .filter(g => g.genres.includes("Arcade"))
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, 40);
    }, [games]);

    const adventureGames = useMemo(() => {
        return games
            .filter(g => g.genres.includes("Adventure") || g.genres.includes("Action"))
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, 40);
    }, [games]);

    const indieGames = useMemo(() => {
        return games
            .filter(g => g.genres.includes("Indie"))
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, 40);
    }, [games]);


    return (
        <main className="main-content">
            <GameList games={topVotedGames} title="Top Rated"></GameList>
            <GameList games={latestReleases} title="Latest Releases"></GameList>
            <GameList games={arcadeGames} title="Arcade"></GameList>
            <GameList games={adventureGames} title="Action & Adventure"></GameList>
            <GameList games={indieGames} title="Indie"></GameList>
            <AllGames games={games} title="All Games"></AllGames>
        </main>
    );
}