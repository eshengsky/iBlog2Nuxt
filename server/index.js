const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const consola = require('consola');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { Nuxt, Builder } = require('nuxt');
const app = express();
const dbPath = require('../blog.config')
  .mongoUrl;

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// 连接MongoDB
mongoose.connect(dbPath, {
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', err => {
  console.error(err);
  process.exit(1);
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: "7dc9bb0e0fd4e9a92de9",
  clientSecret: "a3d9f400defcee58bef9ce90f5e8ddf3bb71c6bf",
  callbackURL: "http://localhost:8000/auth/github/callback"
},
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({ secret: 'iblog2commentsauthsecret', resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }),
    function (req, res) {
      // The request will be redirected to GitHub for authentication, so this
      // function will not be called.
    });

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function (req, res) {
      const url = req.headers.referer || '/';
      res.redirect(url);
    });

  app.get('/logout', function (req, res) {
    req.logout();
    const url = req.headers.referer || '/';
    res.redirect(url);
  });

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
