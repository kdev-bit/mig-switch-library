type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export function NavBar({ searchTerm, onSearchChange }: Props) {
  return (
    <nav id="navbar" className="navbar">
      <div className="nav-left">
        <a href="#" className="logo">MIG SWITCH LIBRARY</a>
      </div>

      <div className="nav-right">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search for games..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
}