# Tunisia Explorer — Frontend (client/)

Application React qui affiche un catalogue de destinations, protégée par une authentification OAuth 2.0 (Google / GitHub) gérée par le backend PassportJS. Les utilisateurs connectés peuvent aussi publier leurs propres destinations, les mettre en favoris, et les supprimer depuis leur profil.

## Démarrage

```
cd client
npm install
npm start
```

L'app tourne sur `http://localhost:3000` et communique avec le backend sur `http://localhost:5000` (voir `README.md` du backend).

## Arborescence

```
client/src/
├── App.js                    → racine de l'app, routing, session utilisateur
├── App.css                   → tout le design (tokens, layout, composants)
├── data.js                   → les 7 destinations de base (données statiques)
├── context/
│   └── DataContext.js         → état global des destinations, favoris et articles créés
├── components/
│   ├── Navbar.js               → barre de navigation + menu utilisateur
│   ├── Card.js                  → carte "destination" (grille, favoris, profil)
│   └── ConfirmModal.js            → modale de confirmation générique (ex. suppression)
└── pages/
    ├── Home.js                    → page d'accueil (hero, stats, recherche, filtres, grille)
    ├── Login.js                    → écran de connexion (Google / GitHub)
    ├── Post.js                      → page détail d'une destination
    ├── Create.js                     → formulaire de création d'une destination
    ├── Favorites.js                   → liste des destinations mises en favoris
    ├── Profile.js                      → profil utilisateur + gestion de ses articles
    └── DeletedPost.js                   → écran affiché après suppression d'un article
```

**À propos de `DeletedPost.js`** : ce fichier existe mais n'est **pas branché par défaut**. Après suppression, `Profile.js` reste maintenant sur `/profil` et affiche un toast de confirmation (voir plus bas) — c'était le comportement demandé, car naviguer vers `/article-supprime` sans route enregistrée dans `App.js` faisait atterrir sur une page vide (navbar + footer, aucun contenu, faute de route correspondante). Si tu préfères finalement rediriger vers cette page plutôt que d'afficher un toast, ajoute la route protégée suivante dans `App.js` puis remplace le toast par `navigate("/article-supprime", { state: { title } })` dans `Profile.js` :

```jsx
const DeletedPost = lazy(() => import("./pages/DeletedPost"));
// ...
<Route
  path="/article-supprime"
  element={user ? <DeletedPost /> : <Navigate to="/login" />}
/>
```

---

## `App.js`

Le composant racine. Responsable de trois choses :

- **Session utilisateur** : au montage, il appelle `GET /auth/login/success` sur le backend (avec `credentials: "include"` pour envoyer le cookie de session). Si la requête réussit, `user` est rempli avec le profil renvoyé par Google/GitHub ; sinon `user` reste `null`. Tant que cette requête n'est pas terminée, `loading` est `true` et les routes ne sont pas encore affichées (évite un flash de la page de login).
- **Routing** : `/` → `Home` (toujours accessible), `/login` → `Login` (redirige vers `/` si déjà connecté), `/post/:id` → `Post`, `/creer` → `Create`, `/favoris` → `Favorites`, `/profil` → `Profile`, `/article-supprime` → `DeletedPost` — ces cinq dernières redirigent vers `/login` si l'utilisateur n'est pas connecté. Les pages secondaires sont chargées avec `React.lazy` + `Suspense` : leur code n'est téléchargé que quand on en a besoin, ce qui réduit le poids du premier chargement.
- **Éléments globaux** : la `Navbar` (affichée sur toutes les pages), le `footer` (branding, réseaux sociaux, mention légale de la démo), et un bouton flottant "retour en haut" qui apparaît après 500px de scroll (écouteur `scroll` avec `passive: true` pour ne pas bloquer le rendu).
- L'app est enveloppée dans `DataProvider` (voir `context/DataContext.js`) pour que toutes les pages partagent le même état de destinations/favoris.

## `App.css`

Toutes les règles de style, organisées par section : tokens (`:root`), navbar, hero, stats, filtres/recherche, cartes, page article, login, page création, profil, modale de confirmation, page "article supprimé", bouton retour-haut, footer, responsive.

Points clés :
- **Design tokens** en haut du fichier (`--primary`, `--dark`, `--gradient-primary`, `--gradient-danger`, etc.) : changer une couleur ici la change partout.
- **`.submit`** (bouton "Étape suivante" / "Publier" du formulaire de création) a été ajouté au groupe de boutons partagé (`.loginBtn, .logoutBtn, .heroButton, .discoverButton, .oauthBtn, .submit`). C'était en fait la cause du bouton gris et carré : cette classe n'existait nulle part dans le CSS, donc le bouton retombait sur le style par défaut du navigateur. Il a maintenant le même dégradé et le même hover que tous les autres CTA de l'app.
- **`.fileChip`** : bloc d'aperçu affiché une fois qu'une image a été importée dans le formulaire de création (miniature + nom de fichier + bouton pour retirer l'image).
- **`.deleteBtn`** : variante rouge de `.favBtn`, utilisée sur les cartes de la page profil pour supprimer un article.
- **`.modalOverlay` / `.modalBox` / `.dangerBtn`** : la modale de confirmation (fond flouté, carte centrée avec animation d'entrée, bouton rouge "Supprimer").
- **`.toast` / `.toast.success`** : le toast de succès affiché en bas de `/profil` après une suppression, avec animation d'entrée/sortie (`toastIn` / `toastOut`).
- **`.deletedPage` / `.deletedCard`** : l'écran "pleine page" optionnel (`DeletedPost.js`, non branché par défaut).
- **`.card { content-visibility: auto }`** : optimisation de performance, le navigateur ne calcule le style des cartes hors écran que quand elles s'approchent du viewport.
- **`prefers-reduced-motion`** : désactive les animations pour les personnes qui l'ont demandé dans leur système.

## `data.js`

Tableau `posts` : le catalogue de **base**, une entrée par destination avec `id`, `title`, `category`, `location`, `readingTime`, `rating`, `img`, `desc` (résumé sur la carte) et `longDesc` (texte complet sur la page article). Ce fichier n'est jamais modifié par l'app ; les destinations ajoutées par les utilisateurs vivent séparément (voir `DataContext`).

## `context/DataContext.js`

Fournit un état global partagé par toute l'app via `useData()` :

- **`posts`** : la liste complète affichée dans l'app — les articles créés par les utilisateurs (`customPosts`), suivis du catalogue de base (`data.js`).
- **`customPosts`** : uniquement les articles créés depuis `/creer`. C'est la seule liste modifiable ; le catalogue de base n'est jamais touché.
- **`addPost(data)`** : ajoute un nouvel article (appelé depuis `Create.js`), lui donne un `id` unique (`Date.now()`), et le place en tête de liste.
- **`deletePost(id)`** : supprime un article de `customPosts` et retire au passage son `id` des favoris. Utilisé depuis `Profile.js` — seuls les articles créés par l'utilisateur peuvent être supprimés, pas le catalogue de base.
- **`isCustomPost(id)`** : indique si un `id` correspond à un article créé par l'utilisateur.
- **`favorites` / `isFavorite(id)` / `toggleFavorite(id)` / `favoritePosts`** : gestion des favoris.
- **Persistance** : `customPosts` et `favorites` sont sauvegardés dans `localStorage` (clés `tunisia_explorer_custom_posts` et `tunisia_explorer_favorites`) à chaque changement, donc tout survit au rechargement de la page. C'est un stockage **local au navigateur**, pas encore partagé entre appareils/utilisateurs (voir pistes d'amélioration).

## `components/Navbar.js`

- Logo cliquable qui ramène à l'accueil.
- **Si l'utilisateur est connecté** : son avatar + son nom forment un vrai bouton (`userTrigger`) qui ouvre un menu déroulant (`dropdown`) contenant "Mon profil", "Mes favoris" et "Déconnexion". Le menu se ferme automatiquement si on clique en dehors.
- **Sinon** : un bouton "Connexion" qui mène à `/login`.
- La déconnexion ouvre `http://localhost:5000/auth/logout` dans la même fenêtre.

## `components/Card.js`

Carte destination réutilisée à trois endroits : la grille de `Home`, la liste de `Favorites`, et la section "Mes articles" de `Profile`. Contient :
- l'image (`loading="lazy"`),
- le badge de catégorie,
- **soit** un bouton cœur (`favBtn`) qui bascule le favori via `DataContext`, **soit**, si la prop `onDelete` est fournie (cas de la page profil), une poubelle (`deleteBtn`). Dans ce cas, `Card` ne fait que remonter l'article concerné au parent via `onDelete(post)` — c'est le parent (`Profile.js`) qui décide d'afficher une confirmation.
- la note, la localisation et le temps de lecture,
- un bouton "Discover" qui mène vers `/post/:id`.

Le composant est enveloppé dans `memo()`.

## `components/ConfirmModal.js`

Modale de confirmation générique, réutilisable pour toute action destructive (pas seulement la suppression d'articles). Props : `title`, `message` (string ou JSX), `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`.

- Overlay flouté qui ferme la modale au clic (le clic sur la carte elle-même ne se propage pas).
- Se ferme aussi avec la touche `Échap`.
- Bloque le scroll de la page tant qu'elle est ouverte, et restaure le scroll au démontage.
- Bouton "Annuler" au style neutre (`.oauthBtn.secondary`) et bouton d'action au style rouge (`.dangerBtn`).

## `pages/Home.js`

- **Hero**, **Stats** (le nombre d'articles est `posts.length`, base + créés), **Recherche**, **Filtres par catégorie**, **Grille de cartes** avec une carte "Ajouter une destination" pour les utilisateurs connectés.

## `pages/Login.js`

Écran de connexion. Les boutons Google et GitHub ouvrent respectivement `http://localhost:5000/auth/google` et `/auth/github` dans la même fenêtre.

## `pages/Post.js`

Page détail d'une destination, récupérée via `useData()` (base + articles créés). Si l'`id` ne correspond à rien, un message "introuvable" s'affiche.

## `pages/Create.js`

Formulaire de création d'une destination, réservé aux utilisateurs connectés, en deux étapes avec aperçu en direct :

- **Étape 1 — Les infos** : titre, catégorie, lieu, temps de lecture, note, et **image**.
  - L'image se choisit via l'explorateur de fichiers de l'appareil (`<input type="file" accept="image/*">`) au lieu d'une URL collée. Le fichier est lu avec `FileReader` et converti en `data URL` (base64), stocké dans `form.img` — aucune image n'est envoyée à un serveur externe.
  - Rejette les fichiers non-images et ceux de plus de 2 Mo (pour ne pas saturer le `localStorage`).
  - Une fois importée, un `fileChip` affiche la miniature, le nom du fichier, et un bouton pour la retirer.
  - Le bouton "Étape suivante →" est un vrai bouton `submit`, exactement comme "Publier" : les deux utilisent la classe `.submit`, désormais bien stylée (voir la note dans `App.css` ci-dessus).
- **Étape 2 — Le récit** : résumé court et texte complet, avec bouton "← Précédent".
- **Aperçu en direct** : une vraie `Card` mise à jour à chaque frappe.
- À la soumission, `addPost` crée l'article et redirige vers sa page détail après un court délai.

## `pages/Favorites.js`

Liste les destinations mises en favori (`favoritePosts`). État vide si aucun favori.

## `pages/Profile.js`

Page profil de l'utilisateur connecté :

- **En-tête**, **statistiques**, **actions** (favoris, déconnexion) : inchangés.
- **Mes articles** : liste les destinations créées par l'utilisateur (`customPosts`) sous forme de `Card` avec bouton poubelle. Cliquer dessus stocke l'article dans l'état `pendingDelete` et affiche `ConfirmModal` ("Êtes-vous sûr de vouloir supprimer « Titre » ? Cette action est définitive."). À la confirmation, `deletePost(id)` est appelé, `pendingDelete` est vidé, et le titre de l'article passe dans l'état `deletedTitle`, ce qui affiche un **toast** de succès en bas de l'écran (`.toast.success`) — l'utilisateur reste sur `/profil`, la grille se met à jour instantanément puisqu'elle vient de `customPosts`. Le toast disparaît tout seul après ~3,5s (`setTimeout` + animation CSS `toastOut`, synchronisées). Le catalogue de base n'apparaît jamais dans cette section et ne peut pas être supprimé.

## `pages/DeletedPost.js`

Écran de confirmation "pleine page" (non branché par défaut, voir la note sur `App.js` en haut de ce README). Affiche une icône, un message reprenant le titre de l'article supprimé (si transmis via `location.state`), et deux boutons : retour au profil ou retour à l'accueil. Utile si tu préfères ce comportement à la place du toast — il suffit d'ajouter la route et de remplacer l'appel `setDeletedTitle` par `navigate(...)` dans `Profile.js`.

---

## Pistes d'amélioration futures

- Persister les articles, favoris et images côté backend (tables `posts` et `favorites` liées à l'utilisateur, upload d'image vers un stockage de fichiers) plutôt qu'en `localStorage` — ce qui permettrait aussi de partager les articles créés entre appareils et utilisateurs, et d'ajouter une vraie autorisation ("seul l'auteur peut supprimer son article").
- Compresser/redimensionner les images importées côté client avant de les stocker, pour réduire encore la taille des données en `localStorage`.
- Remplacer les hrefs de réseaux sociaux du footer par les vrais comptes du projet.