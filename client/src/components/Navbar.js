import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faRightFromBracket,
  faRightToBracket,
  faUser,
  faChevronDown,
  faBookmark,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const logout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  // close the dropdown on outside click, so it behaves like a real menu
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <FontAwesomeIcon icon={faCompass} />
        <Link className="link" to="/">
          Tunisia Explorer
        </Link>
      </div>

      {user ? (
        <div className="navRight">
          <Link className="navCreateBtn link" to="/creer">
            <FontAwesomeIcon icon={faPlus} />
            <span>Créer</span>
          </Link>

          <div className="userMenu" ref={menuRef}>
            <button
              className={`userTrigger${open ? " open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={open}
            >
              <img
                src={user.photos ? user.photos[0].value : ""}
                alt={user.displayName}
                className="avatar"
              />
              <span className="userName">{user.displayName}</span>
              <FontAwesomeIcon icon={faChevronDown} className="chev" />
            </button>

            <div className={`dropdown${open ? " open" : ""}`}>
              <div className="dropdownHeader">
                <strong>{user.displayName}</strong>
                <span>Connecté</span>
              </div>
              <Link
                className="dropdownItem link"
                to="/profil"
                onClick={() => setOpen(false)}
              >
                <FontAwesomeIcon icon={faUser} />
                Mon profil
              </Link>
              <Link
                className="dropdownItem link"
                to="/favoris"
                onClick={() => setOpen(false)}
              >
                <FontAwesomeIcon icon={faBookmark} />
                Mes favoris
              </Link>
              <button className="dropdownItem danger" onClick={logout}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link className="loginBtn link" to="/login">
          <FontAwesomeIcon icon={faRightToBracket} />
          Connexion
        </Link>
      )}
    </nav>
  );
};

export default Navbar;