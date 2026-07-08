require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;

// --- Stratégie Google OAuth 2.0 ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // Dans un vrai projet, on chercherait/créerait l'utilisateur en base ici
      // (ex: User.findOrCreate({ googleId: profile.id }, ...)).
      // Pour cette démo pédagogique, on garde directement le "profile" renvoyé par Google.
      done(null, profile);
    }
  )
);

// --- Stratégie GitHub OAuth ---
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // Contrairement à Google, GitHub ne renvoie `displayName` que si
      // l'utilisateur a rempli le champ "Name" (public) sur son profil.
      // Beaucoup de comptes ne l'ont pas rempli et n'ont que le `username`
      // (le pseudo @...), ce qui faisait apparaître un nom vide côté front.
      // On force ici un repli fiable, une fois pour toutes, côté backend.
      profile.displayName = profile.displayName || profile.username;

      done(null, profile);
    }
  )
);

// --- Sérialisation / désérialisation de l'utilisateur en session ---
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});