import { auth } from "express-openid-connect";
import express from "express";
import cookieParser from "cookie-parser";
const port = process.env.PORT || 8080;
const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.AUTH_BASE_URL,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  routes: {
    login: false,
    logout: false,
  },
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use(cookieParser());

app.get("/logout", (req, res) => res.oidc.logout({ returnTo: "/logged-out" }));
app.get("/login", (req, res) =>
  res.oidc.login({ returnTo: "/auth/logged-in" })
);

app.get("/logged-in", (req, res) => {
  const { picture, name, email, sub } = req.oidc.user;
  res.cookie("kitchen-user", JSON.stringify({ picture, name, email, id: sub }));
  res.redirect("/");
});
app.get("/logged-out", (req, res) => {
  res.clearCookie("kitchen-user");
  res.redirect("/");
});
// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
