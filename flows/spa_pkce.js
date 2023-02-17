const crypto = require("node:crypto");
const express = require("express");
const axios = require("axios");
const { base64URLEncode, sha256 } = require("../utils");

const router = express.Router();
const route = "/spa-pkce";
const REDIRECT_URI = new URL(`${route}/callback`, "http://localhost:3000").href;

const { AUTH0_DOMAIN, AUTH0_SPA_CLIENT_ID, AUTH0_API_AUDIENCE } = process.env;

const verifier = base64URLEncode(crypto.randomBytes(32));
const challenge = base64URLEncode(sha256(verifier));

router.get("/login", (_req, res) => {
  const url = new URL("authorize", `https://${AUTH0_DOMAIN}`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid");
  url.searchParams.set("client_id", AUTH0_SPA_CLIENT_ID);
  url.searchParams.set("audience", AUTH0_API_AUDIENCE);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", challenge);
  res.redirect(url.href);
});

router.get("/callback", (req, res) => {
  const { code } = req.query;
  const url = new URL("oauth/token", `https://${AUTH0_DOMAIN}`);
  const body = {
    grant_type: "authorization_code",
    client_id: AUTH0_SPA_CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  };
  return axios
    .post(url.href, body)
    .then(({ data }) => res.json(data))
    .catch(() => res.status(500).json({ message: "Something went wrong" }));
});

module.exports = { router, route };
