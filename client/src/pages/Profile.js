import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faPen,
  faRightFromBracket,
  faCompass,
  faNewspaper,
  faCompassDrafting,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import Card from "../components/Card";
import ConfirmModal from "../components/ConfirmModal";
import { useData } from "../context/DataContext";

const TOAST_DURATION = 3500;

const Profile = ({ user }) => {
  const { favoritePosts, posts, customPosts, deletePost } = useData();

  // Article en attente de confirmation de suppression (null = modale fermée)
  const [pendingDelete, setPendingDelete] = useState(null);
  // Titre de l'article qui vient d'être supprimé (null = pas de toast)
  const [deletedTitle, setDeletedTitle] = useState(null);

  // Le toast disparaît tout seul après TOAST_DURATION ms
  useEffect(() => {
    if (!deletedTitle) return;
    const timer = setTimeout(() => setDeletedTitle(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [deletedTitle]);

  if (!user) return null;

  const photo = user.photos ? user.photos[0].value : "";
  const email = user.emails && user.emails[0] ? user.emails[0].value : null;

  const logout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deletePost(pendingDelete.id);
    setDeletedTitle(pendingDelete.title);
    setPendingDelete(null);
  };

  return (
    <div className="profilePage">
      <div className="profileHero">
        <div className="profileAvatarRing">
          <img src={photo} alt={user.displayName} className="profileAvatar" />
        </div>
        <h1>{user.displayName}</h1>
        {email && <p className="profileEmail">{email}</p>}
      </div>

      <div className="profileStats">
        <div className="profileStatCard">
          <FontAwesomeIcon icon={faBookmark} />
          <h2>{favoritePosts.length}</h2>
          <span>Favoris</span>
        </div>

        <div className="profileStatCard">
          <FontAwesomeIcon icon={faCompass} />
          <h2>{posts.length}</h2>
          <span>Destinations</span>
        </div>

        <Link to="/creer" className="profileStatCard link featured">
          <FontAwesomeIcon icon={faPen} />
          <h2>Créer</h2>
          <span>Ajouter un article</span>
        </Link>
      </div>

      <div className="profileActions">
        <Link to="/favoris" className="oauthBtn link" style={{ maxWidth: 320 }}>
          <FontAwesomeIcon icon={faBookmark} />
          Voir mes favoris
        </Link>

        <button className="logoutBtn" onClick={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          Se déconnecter
        </button>
      </div>

      <section className="sectionTitle" style={{ marginTop: 60 }}>
        <h2>Mes articles</h2>
        <p>Gérez les destinations que vous avez publiées.</p>
      </section>

      {customPosts.length > 0 ? (
        <div className="home">
          {customPosts.map((post) => (
            <Card key={post.id} post={post} onDelete={setPendingDelete} />
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <FontAwesomeIcon icon={faCompassDrafting} />
          <p>Vous n'avez pas encore publié de destination.</p>
          <Link to="/creer" className="loginBtn link" style={{ marginTop: 20 }}>
            <FontAwesomeIcon icon={faNewspaper} />
            Créer mon premier article
          </Link>
        </div>
      )}

      {pendingDelete && (
        <ConfirmModal
          title="Supprimer cet article ?"
          message={
            <>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong>« {pendingDelete.title} »</strong> ? Cette action est
              définitive.
            </>
          }
          confirmLabel="Oui, supprimer"
          cancelLabel="Annuler"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {deletedTitle && (
        <div className="toast success" role="status">
          <FontAwesomeIcon icon={faCircleCheck} />
          <span>
            <strong>« {deletedTitle} »</strong> a bien été supprimé.
          </span>
        </div>
      )}
    </div>
  );
};

export default Profile;