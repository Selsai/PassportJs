import { lazy, Suspense, useEffect, useState, useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { DataProvider } from "./context/DataContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCompass,
  faArrowUp,
  faVolumeHigh,
  faVolumeXmark
} from "@fortawesome/free-solid-svg-icons";

import {
  faGithub,
  faLinkedin,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";

const Login = lazy(() => import("./pages/Login"));
const Post = lazy(() => import("./pages/Post"));
const Profile = lazy(() => import("./pages/Profile"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Create = lazy(() => import("./pages/Create"));

const App = () => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showScrollTop, setShowScrollTop] = useState(false);

  const audioRef = useRef(null);

  const [muted, setMuted] = useState(true);

  useEffect(() => {

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

        if (response.status === 200)

          return response.json();

        throw new Error("authentication has been failed!");

      })

      .then((resObject) => {

        setUser(resObject.user);

      })

      .catch(console.log)

      .finally(() => {

        setLoading(false);

      });

  }, []);

  useEffect(() => {

    const onScroll = () => {

      setShowScrollTop(window.scrollY > 500);

    };

    window.addEventListener("scroll", onScroll);

    return () =>

      window.removeEventListener("scroll", onScroll);

  }, []);

  useEffect(() => {

    if (!audioRef.current) return;

    audioRef.current.volume = 0.25;

    audioRef.current.play().catch(() => {

      // Chrome bloque parfois l'autoplay.

    });

  }, []);

  const toggleSound = () => {

    if (!audioRef.current) return;

    if (muted) {

      audioRef.current.muted = false;

      audioRef.current.play();

    } else {

      audioRef.current.muted = true;

    }

    setMuted(!muted);

  };

  return (

    <DataProvider>

      <BrowserRouter>

        <Navbar user={user} />

        <audio
          ref={audioRef}
          src="/audio/background.mp3"
          autoPlay
          loop
          muted
        />

        {!loading && (

          <Suspense fallback={null}>

            <Routes>

              <Route

                path="/"

                element={<Home user={user} />}

              />

              <Route

                path="/login"

                element={

                  user ?

                  <Navigate to="/" />

                  :

                  <Login />

                }

              />

              <Route

                path="/post/:id"

                element={

                  user ?

                  <Post />

                  :

                  <Navigate to="/login" />

                }

              />

              <Route

                path="/profil"

                element={

                  user ?

                  <Profile user={user} />

                  :

                  <Navigate to="/login" />

                }

              />

              <Route

                path="/favoris"

                element={

                  user ?

                  <Favorites />

                  :

                  <Navigate to="/login" />

                }

              />

              <Route

                path="/creer"

                element={

                  user ?

                  <Create />

                  :

                  <Navigate to="/login" />

                }

              />

            </Routes>

          </Suspense>

        )}

        <footer className="siteFooter">

          <div className="footerGrid">

            <div className="footerBrand">

              <div className="logo">

                <FontAwesomeIcon icon={faCompass} />

                <span className="link">

                  Tunisia Explorer

                </span>

              </div>

              <p>

                Beaches, architecture and Mediterranean culture —

                a curated guide to Tunisia,

                secured behind a real OAuth 2.0 login.

              </p>

              <div className="footerSocials">

                <a

                  href="https://instagram.com"

                  target="_blank"

                  rel="noreferrer"

                >

                  <FontAwesomeIcon icon={faInstagram} />

                </a>

                <a

                  href="https://github.com"

                  target="_blank"

                  rel="noreferrer"

                >

                  <FontAwesomeIcon icon={faGithub} />

                </a>

                <a

                  href="https://linkedin.com"

                  target="_blank"

                  rel="noreferrer"

                >

                  <FontAwesomeIcon icon={faLinkedin} />

                </a>

              </div>

            </div>

          </div>

          <div className="footerCredit">

            Démo OAuth 2.0 · PassportJS · Google & GitHub

          </div>

        </footer>

        <button

          className="audioBtn"

          onClick={toggleSound}

          aria-label="Audio"

        >

          <FontAwesomeIcon

            icon={

              muted

              ?

              faVolumeXmark

              :

              faVolumeHigh

            }

          />

        </button>

        <button

          className={`scrollTopBtn${showScrollTop ? " visible" : ""}`}

          onClick={() =>

            window.scrollTo({

              top: 0,

              behavior: "smooth"

            })

          }

          aria-label="Retour en haut"

        >

          <FontAwesomeIcon icon={faArrowUp} />

        </button>

      </BrowserRouter>

    </DataProvider>

  );

};

export default App;