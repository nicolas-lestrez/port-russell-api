/**
 * @file Authentification – Routes de login/logout.
 * @description Gestion de l’authentification via JWT.
 */

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

/**
 * POST /auth/login
 * @summary Permet à un utilisateur de se connecter
 * @tags Auth
 *
 * @param {object} req.body - Corps de la requête
 * @param {string} req.body.email - Email de l'utilisateur
 * @param {string} req.body.password - Mot de passe de l'utilisateur
 *
 * @returns {object} 200 - Token JWT + infos utilisateur
 * @returns {object} 401 - Identifiants incorrects
 * @returns {object} 500 - Erreur serveur
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email incorrect" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login réussi",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Erreur dans /auth/login :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /auth/logout
 * @summary Déconnecte l’utilisateur côté client
 * @tags Auth
 *
 * @returns {object} 200 - Message de confirmation
 */
router.get("/logout", (req, res) => {
  return res.json({
    message: "Déconnexion réussie (supprime le token côté client)",
  });
});

module.exports = router;
