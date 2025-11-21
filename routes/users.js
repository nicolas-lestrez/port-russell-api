// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middlewares/authMiddleware"); // middleware JWT

/**
 * GET /users
 * Récupère tous les utilisateurs (sans le mot de passe)
 */
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // on exclut le mot de passe
    return res.json(users);
  } catch (err) {
    console.error("Erreur dans GET /users :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /users/:email
 * Récupère un utilisateur par email (sans le mot de passe)
 */
router.get("/:email", auth, async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.params.email },
      { password: 0 }
    );
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    return res.json(user);
  } catch (err) {
    console.error("Erreur dans GET /users/:email :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /users
 * Crée un utilisateur (ici on ne hash pas encore le password, on verra si besoin)
 */
router.post("/", auth, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      message: "Utilisateur créé",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Erreur dans POST /users :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * PUT /users/:email
 * Met à jour un utilisateur (hors mot de passe pour l’instant)
 */
router.put("/:email", auth, async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { username },
      { new: true, projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json({
      message: "Utilisateur mis à jour",
      user,
    });
  } catch (err) {
    console.error("Erreur dans PUT /users/:email :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * DELETE /users/:email
 * Supprime un utilisateur
 */
router.delete("/:email", auth, async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ email: req.params.email });

    if (!deleted) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    console.error("Erreur dans DELETE /users/:email :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
