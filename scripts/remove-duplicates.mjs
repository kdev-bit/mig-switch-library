import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Per avere __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function main() {

    const inputGamesPath = path.join(__dirname, "..", "public", "games.json");
    const outputGamesPath = path.join(__dirname, "..", "public", "games_deduplicated.json");

    const fileContent = await readFile(inputGamesPath, "utf-8");
    const games = JSON.parse(fileContent);
    const uniqueGamesMap = new Map();
    for (const game of games) {
        const key = `${game.name}`;
        if (!uniqueGamesMap.has(key)) {
            uniqueGamesMap.set(key, game);
        }
    }
    const uniqueGames = Array.from(uniqueGamesMap.values());
    await writeFile(outputGamesPath, JSON.stringify(uniqueGames, null, 2), "utf-8");
    console.log(`Rimosso ${games.length - uniqueGames.length} duplicati. Totale giochi unici: ${uniqueGames.length}`);
}



main().catch((err) => {
    console.error("Errore generale:", err);
    process.exit(1);
});