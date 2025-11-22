// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

/**
 * POST /auth/login
 *
 * Permet à un utilisateur de se connecter.
 *
 * Body JSON attendu :
 * {
 *   "email": "admin@exemple.com",
 *   "password": "test1234"
 * }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. On cherche l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email incorrect" });
    }

    // 2. On compare le mot de passe EN CLAIR avec le hash en base
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // 3. On génère un token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. On renvoie le token et quelques infos sur le user
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
 *
 * Déconnecte l'utilisateur côté client.
 * Comme on utilise des JWT, l'API renvoie seulement un message.
 * C'est au front de supprimer le token stocké (ex: localStorage).
 */
router.get("/logout", (req, res) => {
  return res.json({
    message: "Déconnexion réussie (supprime le token côté client)",
  });
});

module.exports = router;
