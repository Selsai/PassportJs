require('dotenv').config();

const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');

require('./passport');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_KEY || 'change_this_secret_key'],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// --- Correctif nécessaire : cookie-session n'implémente pas regenerate()/save(),
// mais les versions récentes de Passport (0.6+) les appellent lors du login.
// On ajoute des versions "vides" de ces méthodes (cookie-session n'en a pas besoin,
// puisqu'il stocke tout directement dans le cookie).
app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (callback) => {
      callback();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (callback) => {
      callback();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

const authRoute = require('./routes/auth');
app.use('/auth', authRoute);

app.listen(PORT, () => {
  console.log(`hello from express server localhost port ${PORT}`);
});