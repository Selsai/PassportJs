require('dotenv').config();

const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');

require('./passport');

const app = express();
const PORT = process.env.PORT || 5000;

// On retire un éventuel slash final ("http://localhost:3000/" -> "http://localhost:3000") :
// pour CORS, ces deux valeurs sont deux origines différentes, une simple faute
const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/+$/, '');

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_KEY || 'change_this_secret_key'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

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
    origin: CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

const authRoute = require('./routes/auth');
app.use('/auth', authRoute);

app.listen(PORT, () => {
  console.log(`hello from express server localhost port ${PORT}`);
});