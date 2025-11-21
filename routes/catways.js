// routes/catways.js
const express = require("express");
const router = express.Router();

// Import correct des modèles
const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");

/**
 * GET /catways
 * Récupère la liste de tous les catways.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {void}
 */
router.get("/", async (req, res) => {
  try {
    const catways = await Catway.find();
    return res.json(catways);
  } catch (err) {
    console.error("Erreur GET /catways :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /catways/:id
 * Récupère un catway par son numéro (catwayNumber).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {void}
 */
router.get("/:id", async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id, 10);

    if (isNaN(catwayNumber)) {
      return res.status(400).json({ message: "L'id doit être un nombre." });
    }

    const catway = await Catway.findOne({ catwayNumber });

    if (!catway) {
      return res.status(404).json({ message: "Catway non trouvé." });
    }

    return res.json(catway);
  } catch (err) {
    console.error("Erreur GET /catways/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /catways
 * Crée un nouveau catway.
 *
 * Body JSON :
 * {
 *   "catwayNumber": Number,
 *   "catwayType": "long" | "short",
 *   "catwayState": "texte de ton choix"
 * }
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {void}
 */
router.post("/", async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    // Validation basique
    if (
      typeof catwayNumber !== "number" ||
      !["long", "short"].includes(catwayType) ||
      !catwayState
    ) {
      return res
        .status(400)
        .json({ message: "Données invalides pour le catway." });
    }

    // Vérifier que le numéro n'est pas déjà pris
    const existing = await Catway.findOne({ catwayNumber });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Ce numéro de catway existe déjà." });
    }

    const catway = await Catway.create({
      catwayNumber,
      catwayType,
      catwayState,
    });

    return res.status(201).json(catway);
  } catch (err) {
    console.error("Erreur POST /catways :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * PUT /catways/:id
 * Met à jour UNIQUEMENT l'état (catwayState) d'un catway.
 *
 * Body JSON :
 * {
 *   "catwayState": "nouvel état"
 * }
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {void}
 */
router.put("/:id", async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id, 10);
    const { catwayState } = req.body;

    if (isNaN(catwayNumber)) {
      return res.status(400).json({ message: "L'id doit être un nombre." });
    }

    if (!catwayState) {
      return res.status(400).json({ message: "catwayState est obligatoire." });
    }

    const updated = await Catway.findOneAndUpdate(
      { catwayNumber },
      { catwayState },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Catway non trouvé." });
    }

    return res.json(updated);
  } catch (err) {
    console.error("Erreur PUT /catways/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * DELETE /catways/:id
 * Supprime un catway.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {void}
 */
router.delete("/:id", async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id, 10);

    if (isNaN(catwayNumber)) {
      return res.status(400).json({ message: "L'id doit être un nombre." });
    }

    const deleted = await Catway.findOneAndDelete({ catwayNumber });

    if (!deleted) {
      return res.status(404).json({ message: "Catway non trouvé." });
    }

    return res.json({ message: "Catway supprimé avec succès." });
  } catch (err) {
    console.error("Erreur DELETE /catways/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
