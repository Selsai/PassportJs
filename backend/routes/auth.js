const router = require('express').Router();
const passport = require('passport');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// --- Vérifie si l'utilisateur est connecté (appelé par le frontend React) ---
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'successfull',
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Vous n\'êtes pas authentifié',
    });
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure',
  });
});

// --- Déconnexion ---
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(CLIENT_URL);
  });
});

router.get('/', (req, res) => {
  res.json({ message: 'route ok' });
});

// --- Authentification Google ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
  })
);

// --- Authentification GitHub ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
  })
);

module.exports = router;