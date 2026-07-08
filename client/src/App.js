import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { DataProvider } from "./context/DataContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";

// code-split routes that aren't needed for the very first paint
const Login = lazy(() => import("./pages/Login"));
const Post = lazy(() => import("./pages/Post"));
const Profile = lazy(() => import("./pages/Profile"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Create = lazy(() => import("./pages/Create"));

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:5000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getUser();
  }, []);

  // show the "back to top" button only once the user has scrolled a bit
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <DataProvider>
      <BrowserRouter>
        <Navbar user={user} />

        {!loading && (
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="/post/:id"
                element={user ? <Post /> : <Navigate to="/login" />}
              />
              <Route
                path="/profil"
                element={user ? <Profile user={user} /> : <Navigate to="/login" />}
              />
              <Route
                path="/favoris"
                element={user ? <Favorites /> : <Navigate to="/login" />}
              />
              <Route
                path="/creer"
                element={user ? <Create /> : <Navigate to="/login" />}
              />
            </Routes>
          </Suspense>
        )}

        <footer className="siteFooter">
          <div className="footerGrid">
            <div className="footerBrand">
              <div className="logo">
                <FontAwesomeIcon icon={faCompass} />
                <span className="link">Tunisia Explorer</span>
              </div>
              <p>
                Beaches, architecture and Mediterranean culture — a curated
                guide to Tunisia, secured behind a real OAuth 2.0 login.
              </p>
              <div className="footerSocials">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              </div>
            </div>
          </div>
          <div className="footerCredit">
            Démo OAuth 2.0 · PassportJS · Google &amp; GitHub
          </div>
        </footer>

        <button
          className={`scrollTopBtn${showScrollTop ? " visible" : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Retour en haut de la page"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;