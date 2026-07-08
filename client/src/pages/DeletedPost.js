import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faCompass, faUser } from "@fortawesome/free-solid-svg-icons";

// Affichée après confirmation de suppression depuis /profil (voir Profile.js,
// navigate("/article-supprime", { state: { title } })). Si la page est
// atteinte sans state (ex. rechargement direct de l'URL), un message
// générique s'affiche à la place.
const DeletedPost = () => {
  const location = useLocation();
  const title = location.state?.title;

  return (
    <div className="deletedPage">
      <div className="deletedCard">
        <div className="deletedIcon">
          <FontAwesomeIcon icon={faTrashCan} />
        </div>

        <h1>Destination supprimée</h1>

        <p>
          {title ? (
            <>
              <strong>{title}</strong> a bien été retirée de votre catalogue.
            </>
          ) : (
            "Cette destination a bien été retirée de votre catalogue."
          )}
        </p>

        <div className="deletedActions">
          <Link to="/profil" className="oauthBtn secondary">
            <FontAwesomeIcon icon={faUser} />
            Retour à mon profil
          </Link>

          <Link to="/" className="submit">
            <FontAwesomeIcon icon={faCompass} />
            Explorer d'autres destinations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeletedPost;