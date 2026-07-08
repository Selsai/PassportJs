import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faLocationDot,
  faClock,
  faStar,
  faArrowLeft,
  faHeart
} from "@fortawesome/free-solid-svg-icons";

const Post = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { posts, isFavorite, toggleFavorite } = useData();
  const post = posts.find((item) => item.id.toString() === id);
  const fav = post ? isFavorite(post.id) : false;

  if (!post) {
    return (
      <div className="postContainer">
        <div className="post" style={{ marginTop: 60, textAlign: "center" }}>
          <p>Cette destination est introuvable.</p>
          <Link to="/" className="link">
            <button className="discoverButton" style={{ marginTop: 20 }}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Retour à l'accueil
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="postContainer">
      <Link to="/" className="backLink">
        <FontAwesomeIcon icon={faArrowLeft} />
        Retour aux destinations
      </Link>

      <div className="postHero">
        <img src={post.img} alt={post.title} className="postImg" />

        <button
          className={`postFavBtn${fav ? " active" : ""}`}
          onClick={() => toggleFavorite(post.id)}
          aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>

      <div className="post">
        <span className="postCategory">{post.category}</span>

        <h1 className="postTitle">{post.title}</h1>

        <div className="postInfos">
          <span>
            <FontAwesomeIcon icon={faLocationDot} />
            {post.location}
          </span>

          <span>
            <FontAwesomeIcon icon={faClock} />
            {post.readingTime}
          </span>

          {post.rating && (
            <span>
              <FontAwesomeIcon icon={faStar} />
              {post.rating}
            </span>
          )}
        </div>

        <p className="postDesc">{post.desc}</p>

        <p className="postLongDesc">{post.longDesc}</p>
      </div>
    </div>
  );
};

export default Post;