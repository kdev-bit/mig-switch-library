import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Per avere __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAWG_API_KEY = process.env.RAWG_API_KEY;

if (!RAWG_API_KEY) {
  console.error("Errore: devi impostare la variabile d'ambiente RAWG_API_KEY.");
  process.exit(1);
}

// Piccola pausa tra le richieste
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 1) Cerca il gioco per titolo e restituisce l'ID del primo risultato
 */
async function searchGameIdByTitle(title) {
  const params = new URLSearchParams({
    key: RAWG_API_KEY,
    search: title,
    page_size: "1",
    search_precise: "true",
  });

  const url = `https://api.rawg.io/api/games?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Errore HTTP RAWG /games: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const game = data.results?.[0];

  if (!game) return null;

  return game.id;
}

/**
 * 2) Recupera i dettagli completi del gioco usando l'ID
 */
async function getGameDetailsById(id) {
  const params = new URLSearchParams({
    key: RAWG_API_KEY,
  });

  const url = `https://api.rawg.io/api/games/${id}?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Errore HTTP RAWG /games/${id}: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

async function main() {
  const titlesPath = path.join(__dirname, "..", "data", "titles.txt");
  const outputGamesPath = path.join(__dirname, "..", "public", "games.json");
  const unmatchedPath = path.join(__dirname, "..", "data", "unmatched.json");

  // assicura che le cartelle esistano
  await mkdir(path.dirname(outputGamesPath), { recursive: true });
  await mkdir(path.dirname(unmatchedPath), { recursive: true });

  const fileContent = await readFile(titlesPath, "utf-8");
  const titles = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  console.log(`Trovati ${titles.length} titoli in titles.txt`);

  const games = [];
  const unmatched = [];

  for (const title of titles) {
    console.log(`\n=== Titolo: ${title} ===`);

    try {
      // Prima chiamata: ottieni l'ID
      const gameId = await searchGameIdByTitle(title);

      if (!gameId) {
        console.warn("  Nessun risultato trovato su RAWG.");
        unmatched.push({ title, reason: "no results" });
        await sleep(300);
        continue;
      }

      console.log(`  ID trovato: ${gameId}`);

      // Seconda chiamata: dettagli completi
      const details = await getGameDetailsById(gameId);

      const game = {
        name: details.name ?? null,
        released: details.released ? details.released.split('-')[0] : null,
        rating:
          typeof details.rating === "number"
            ? Number((details.rating * 2).toFixed(1))
            : null,
        background_image: details.background_image ?? null,
        genres: Array.isArray(details.genres)
          ? details.genres.map((genre) => genre.name)
          : [],
      };

      games.push(game);
      console.log(`  OK → ${game.name}`);

      await sleep(300);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  Errore per "${title}": ${message}`);
      unmatched.push({ title, reason: "exception", error: message });
      await sleep(300);
    }
  }

  await writeFile(outputGamesPath, JSON.stringify(games, null, 2), "utf-8");
  await writeFile(unmatchedPath, JSON.stringify(unmatched, null, 2), "utf-8");

  console.log(`\nSalvato ${games.length} giochi in ${outputGamesPath}`);
  console.log(`Titoli non risolti: ${unmatched.length} (vedi ${unmatchedPath})`);
}

main().catch((err) => {
  console.error("Errore generale:", err);
  process.exit(1);
});