
export function HeroSection() {
    return (
        <header className="hero">
            <div className="hero-bg" ></div>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <div className="hero-meta">
                    <span className="year"><i className="fa-solid fa-user"></i> 1-4 Players</span>
                    <span className="card-rating rating-excellent"><i className="fa-solid fa-star"></i> 9.2 </span>
                </div>
                <p className="hero-desc">Burn rubber across Mushroom Kingdom raceways—underwater, in the sky, upside-down in zero-g, and past the finish—for the win! Get revved up for local multiplayer, a revamped battle mode, and more!</p>
                <div className="hero-genres">
                    <span className="genre">Party</span>
                    <span className="genre">Racing</span>
                    <span className="genre">Casual</span>
                </div>
            </div>
        </header>
    );
}