// routes/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../models/user");

/**
 * GET /users
 * Récupère la liste de tous les utilisateurs.
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // pas de mdp
    return res.json(users);
  } catch (err) {
    console.error("Erreur GET /users :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /users/:email
 * Récupère un utilisateur par email.
 */
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Erreur GET /users/:email :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /users
 * Crée un utilisateur.
 *
 * Body JSON :
 * {
 *   "username": "Nom",
 *   "email": "email@example.com",
 *   "password": "motdepasse"
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email et password sont obligatoires" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Un utilisateur existe déjà avec cet email" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hash,
    });

    return res.status(201).json({
      message: "Utilisateur créé",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Erreur POST /users :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * PUT /users/:email
 * Met à jour un utilisateur.
 *
 * Body JSON (exemple) :
 * {
 *   "username": "Nouveau Nom",
 *   "password": "nouveau mot de passe"
 * }
 */
router.put("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { username, password } = req.body;

    const updateData = {};

    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json({
      message: "Utilisateur mis à jour",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Erreur PUT /users/:email :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * DELETE /users/:email
 * Supprime un utilisateur.
 */
router.delete("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const deleted = await User.findOneAndDelete({ email });

    if (!deleted) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    console.error("Erreur DELETE /users/:email :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
