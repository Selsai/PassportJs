import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useData } from "../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCrack, faCompass } from "@fortawesome/free-solid-svg-icons";

const Favorites = () => {
  const { favoritePosts } = useData();

  return (
    <div className="postContainer">
      <section className="sectionTitle">
        <h2>Mes favoris</h2>
        <p>Retrouvez ici toutes les destinations que vous avez aimées.</p>
      </section>

      {favoritePosts.length > 0 ? (
        <div className="home">
          {favoritePosts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <FontAwesomeIcon icon={faHeartCrack} />
          <p>
            Vous n'avez pas encore de favoris. Cliquez sur le cœur d'une
            destination pour l'ajouter ici.
          </p>
          <Link to="/" className="loginBtn link" style={{ marginTop: 20 }}>
            <FontAwesomeIcon icon={faCompass} />
            Explorer les destinations
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;