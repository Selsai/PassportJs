import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useData } from "../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUmbrellaBeach,
  faMountainSun,
  faCamera,
  faCompassDrafting,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

const Home = ({ user }) => {
  const { posts } = useData();
  const [activeCategory, setActiveCategory] = useState("Tout");

  const categories = useMemo(
    () => ["Tout", ...new Set(posts.map((p) => p.category))],
    [posts]
  );

  const filteredPosts = useMemo(() => {
    if (activeCategory === "Tout") return posts;
    return posts.filter((post) => post.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,.55),rgba(15,23,42,.55)),url('/img/img4.png')"
        }}
      >
        <div className="heroGlow g1" />
        <div className="heroGlow g2" />

        <div className="heroContent">
          <span className="heroBadge">Explore Tunisia</span>

          <h1>Discover the beauty of Tunisia</h1>

          <p>
            Beaches, architecture, Mediterranean culture and unforgettable
            landscapes. Connect to unlock all destinations.
          </p>

          <button
            className="heroButton"
            onClick={() =>
              document
                .getElementById("destinations")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore now
          </button>
        </div>
      </section>

      <section className="stats">
        <div className="statCard">
          <FontAwesomeIcon icon={faUmbrellaBeach} />
          <h2>50+</h2>
          <span>Beaches</span>
        </div>

        <div className="statCard">
          <FontAwesomeIcon icon={faMountainSun} />
          <h2>20+</h2>
          <span>Natural Sites</span>
        </div>

        <div className="statCard">
          <FontAwesomeIcon icon={faLocationDot} />
          <h2>300+</h2>
          <span>Places</span>
        </div>

        <div className="statCard">
          <FontAwesomeIcon icon={faCamera} />
          <h2>{posts.length}</h2>
          <span>Articles</span>
        </div>
      </section>

      <section id="destinations" className="sectionTitle">
        <h2>Featured Destinations</h2>
        <p>A selection of the most beautiful places to discover.</p>
      </section>

      <div className="filterBar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filterChip${activeCategory === cat ? " active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredPosts.length > 0 || user ? (
        <div className="home">
          {filteredPosts.map((post) => (
            <Card key={post.id} post={post} />
          ))}

          {user && (
            <Link to="/creer" className="createCard">
              <span className="createCardIcon">
                <FontAwesomeIcon icon={faPlus} />
              </span>
              <strong>Ajouter une destination</strong>
              <span>Partagez votre propre carnet de voyage</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="emptyState">
          <FontAwesomeIcon icon={faCompassDrafting} />
          <p>Aucune destination dans cette catégorie pour le moment.</p>
        </div>
      )}
    </>
  );
};

export default Home;