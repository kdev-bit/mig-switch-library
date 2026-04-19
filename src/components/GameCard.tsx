import type { Game } from "../types";

type Props = {
  game: Game;
};

function getRatingColorClass(rating: number | null) {
  if (rating === null) return 'rating-null';
  if (rating >= 9.0) return 'rating-excellent';
  if (rating >= 7.5) return 'rating-high';
  if (rating >= 6.0) return 'rating-med';
  if (rating == 0) return 'rating-zero';
  return 'rating-low';
}

function getGenresString(genres: string[]) {
  return genres.join(' • ');;
}

export function GameCard({ game }: Props) {
  return (
    <div className="game-card">
      <div className="card-image-wrapper">
        <img src={game.background_image} alt="No image available" loading="lazy"></img>
        <div className="card-overlay"></div>
      </div>
      <div className="card-content">
        <h3 className="card-title" title={game.name}>
          {game.name}
        </h3>
        <div className="card-meta">
          <span className="card-year">{game.released}</span>
          <span className={`card-rating ${getRatingColorClass(game.rating)}`}>
            <i className="fa-solid fa-star"></i> {game.rating}
          </span>
        </div>
        <div className="card-genres">
          {getGenresString(game.genres)}
        </div>
      </div>

    </div>
  );
}