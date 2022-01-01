import feathers from "@feathersjs/feathers";
import express from "@feathersjs/express";
import cookieParser from "cookie-parser";
import oidc from "express-openid-connect";
import { registerFilesService } from "./services/files.js";

const { auth, requiresAuth } = oidc;

const app = express(feathers());
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
    callback: "/auth/login",
  },
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use(requiresAuth());

const port = process.env.PORT || 8080;
// setupMongoose();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.configure(express.rest());
app.use(express.errorHandler());

app.use((req, res, next) => {
  const user = req.oidc.user;
  req.feathers.userId = user.sub;
  next();
});

registerFilesService(app);

app
  .listen(port)
  .on("listening", () =>
    console.log(`Feathers server listening on localhost:${port}`)
  );
