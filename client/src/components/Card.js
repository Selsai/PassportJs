import { memo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faClock,
  faLocationDot,
  faStar,
  faHeart,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { useData } from "../context/DataContext";

// `onDelete` est optionnel : quand il est fourni (ex. dans "Mon profil"),
// la carte affiche une poubelle à la place du cœur favori. La confirmation
// se fait désormais via une modale gérée par le parent (voir Profile.js) —
// Card se contente de remonter l'article concerné.
const Card = ({ post, onDelete }) => {
  const { isFavorite, toggleFavorite } = useData();
  const fav = isFavorite(post.id);

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(post.id);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(post);
  };

  return (
    <div className="card">
      <div className="cardImage">
        <img
          src={post.img}
          alt={post.title}
          className="img"
          loading="lazy"
          decoding="async"
        />

        <span className="category">{post.category}</span>

        {onDelete ? (
          <button
            className="favBtn deleteBtn"
            onClick={handleDeleteClick}
            aria-label="Supprimer cet article"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        ) : (
          <button
            className={`favBtn${fav ? " active" : ""}`}
            onClick={toggleFav}
            aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
        )}
      </div>

      <div className="cardBody">
        <h2 className="title">{post.title}</h2>

        <p className="desc">{post.desc}</p>

        {post.rating && (
          <div className="ratingStars">
            <FontAwesomeIcon icon={faStar} />
            {post.rating}
            <span className="count">/ 5</span>
          </div>
        )}

        <div className="cardInfos">
          <span>
            <FontAwesomeIcon icon={faLocationDot} />
            {post.location}
          </span>

          <span>
            <FontAwesomeIcon icon={faClock} />
            {post.readingTime}
          </span>
        </div>

        <Link className="link" to={`/post/${post.id}`}>
          <button className="discoverButton">
            Discover
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default memo(Card);