// routes/index.js
const path = require("path");
const express = require("express");
const router = express.Router();

/**
 * GET /
 * Renvoie la page d'accueil statique (public/index.html)
 */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
