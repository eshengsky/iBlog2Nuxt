import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import api from "./api/index";
import apiAdmin from "./api/admin";

const app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: "7dc9bb0e0fd4e9a92de9",
      clientSecret: "a3d9f400defcee58bef9ce90f5e8ddf3bb71c6bf",
      callbackURL: "http://localhost:8000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function() {
        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "iblog2commentsauthsecret",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  function(req, res) {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    const url = req.headers.referer || "/";
    res.redirect(url);
  }
);

app.get("/logout", function(req, res) {
  req.logout();
  const url = req.headers.referer || "/";
  res.redirect(url);
});

app.use("/admin/api", apiAdmin);

app.use("/api", api);

export default {
  path: "/",
  handler: app
};
