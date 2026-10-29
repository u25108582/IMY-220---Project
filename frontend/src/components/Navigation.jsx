import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function Navigation({searchbar = false, logout = false}) {
  const nav = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    nav('/login');
  };

  if (logout) {
    return (
      <nav>
        <div className="nav-brand">
          <Link to="/Home">TidBit</Link>
        </div>

        <SearchBar visible={searchbar} />

        <button onClick={handleLogout} className="nav-link nav-logout-btn">
          Logout
        </button>
      </nav>
    );
  }

  return (
    <nav>
      <div className="nav-brand">
        <Link to="/Home">TidBit</Link>
      </div>

      <SearchBar visible={searchbar} />

      <div className="nav-links">
        <Link to="/Account" className="nav-link">Account</Link>
      </div>
    </nav>
  );
}

export default Navigation;