# Tunisia Explorer — Backend (backend/)

Serveur Express qui gère l'authentification OAuth 2.0 (Google et GitHub) via PassportJS, et expose les routes que le frontend React interroge pour savoir "qui est connecté".

## Démarrage

```
cd backend
npm install
npm run start        # ou: node index.js / nodemon index.js
```

Le serveur écoute sur `http://localhost:5000` (variable `PORT`, `5000` par défaut).

## Arborescence

```
backend/
├── index.js          → point d'entrée : middlewares + démarrage du serveur
├── passport.js        → configuration des stratégies OAuth (Google, GitHub)
└── routes/
    └── auth.js          → toutes les routes liées à l'authentification
```

---

## `index.js`

Assemble l'application Express :

- `express()` crée l'app, `PORT` est lu depuis `process.env.PORT` (sinon `5000`).
- `cookieSession({ name: "session", keys: [...], maxAge: 24*60*60*100 })` : stocke la session **dans un cookie signé** côté client (pas de base de données de sessions nécessaire). `keys` sert à signer/vérifier ce cookie — à remplacer par une vraie clé secrète en production, jamais commitée sur Git.
- `passport.initialize()` puis `passport.session()` : branchent PassportJS sur Express pour qu'il puisse lire/écrire l'utilisateur dans la session à chaque requête.
- `cors({ origin: "http://localhost:3000", methods: "GET,POST,PUT,DELETE", credentials: true })` : autorise le frontend (autre port donc autre origine) à appeler ce serveur, **et** à envoyer/recevoir le cookie de session (`credentials: true` est indispensable pour ça — côté frontend, le `fetch` doit aussi avoir `credentials: "include"`, ce qui est déjà le cas dans `App.js`).
- `require("./passport")` charge la configuration des stratégies (effet de bord : enregistre les stratégies Google/GitHub auprès de Passport).
- `app.use("/auth", authRoute)` : toutes les routes de `routes/auth.js` sont préfixées par `/auth` (donc `/auth/google`, `/auth/logout`, etc.).
- `app.listen(PORT, ...)` démarre le serveur.

## `passport.js`

Déclare **comment** on se connecte avec chaque fournisseur :

- `GoogleStrategy` et `GithubStrategy` sont configurées avec `clientID`, `clientSecret` (récupérés depuis la console Google Cloud / les paramètres OAuth GitHub) et `callbackURL` (l'URL que le fournisseur doit appeler après connexion, ex. `/auth/google/callback`).
- Le callback `function(accessToken, refreshToken, profile, done)` reçoit le profil renvoyé par Google/GitHub. Ici, `done(null, profile)` transmet directement ce profil à Passport (dans un vrai projet, c'est typiquement ici qu'on ferait `User.findOrCreate(...)` pour créer/retrouver l'utilisateur en base).
- `passport.serializeUser((user, done) => done(null, user))` : détermine ce qu'on stocke dans la session (ici, l'objet utilisateur complet).
- `passport.deserializeUser((user, done) => done(null, user))` : reconstruit `req.user` à partir de ce qui est stocké en session, à chaque requête.

## `routes/auth.js`

Toutes les routes exposées sous `/auth` :

| Route | Rôle |
|---|---|
| `GET /auth/login/success` | Si `req.user` existe (session valide), renvoie `{ success: true, user }` en JSON. C'est cette route que le frontend appelle au démarrage (`App.js`) pour savoir qui est connecté. |
| `GET /auth/login/failed` | Renvoie une erreur 401 JSON, utilisée comme `failureRedirect` par Passport si l'authentification échoue. |
| `GET /auth/logout` | Appelle `req.logout()` (détruit la session PassportJS) puis redirige vers `CLIENT_URL` (le frontend). |
| `GET /auth/google` | Démarre le flux OAuth Google (`passport.authenticate("google", { scope: ["profile"] })`) — redirige l'utilisateur vers l'écran de connexion Google. |
| `GET /auth/google/callback` | URL de retour après Google : si succès, redirige vers `CLIENT_URL` ; si échec, vers `/login/failed`. |
| `GET /auth/github` | Démarre le flux OAuth GitHub (scope `profile`). |
| `GET /auth/github/callback` | URL de retour après GitHub, même logique que pour Google. |
| `GET /auth/` | Route de test simple (`{ message: "route ok" }"`). |

`CLIENT_URL` (généralement `http://localhost:3000`) est l'adresse du frontend vers laquelle on redirige une fois la connexion réussie (ou après déconnexion).

---

## Schéma du flux d'authentification

1. Le frontend ouvre `http://localhost:5000/auth/google` (ou `/auth/github`) dans la fenêtre courante.
2. Passport redirige vers l'écran de connexion Google/GitHub.
3. Une fois l'utilisateur authentifié, le fournisseur redirige vers `.../auth/google/callback` (ou `github/callback`).
4. Passport crée la session (cookie signé) et redirige vers `CLIENT_URL` (le frontend, `/`).
5. Le frontend (dans `App.js`) appelle `GET /auth/login/success` avec `credentials: "include"` → reçoit le profil utilisateur → l'app affiche l'état "connecté".
6. À la déconnexion, le frontend ouvre `/auth/logout`, qui détruit la session et redirige vers le frontend.

## Points d'attention pour la suite

- `clientID` / `clientSecret` sont actuellement en dur dans `passport.js` : à déplacer dans des variables d'environnement (`.env` + `dotenv`) avant tout partage de code ou déploiement.
- Aucune base de données n'est utilisée : les profils OAuth ne sont pas persistés, ils vivent uniquement dans le cookie de session.