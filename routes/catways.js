/**
 * @file Catways – CRUD complet pour gérer les emplacements de quai (catways)
 * @description Toutes les routes sont préfixées par /catways dans app.js
 */

const express = require("express");
const router = express.Router();
const Catway = require("../models/Catway");

/**
 * GET /catways
 * @summary Retourne la liste de tous les catways
 * @tags Catways
 * @returns {Array<object>} 200 - Liste des catways
 * @returns {object} 500 - Erreur serveur
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
 * GET /catways/{id}
 * @summary Retourne un catway selon son numéro
 * @tags Catways
 * @param {number} id.path.required - Numéro du catway
 * @returns {object} 200 - Catway trouvé
 * @returns {object} 400 - ID invalide
 * @returns {object} 404 - Catway non trouvé
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
 * @summary Crée un nouveau catway
 * @tags Catways
 *
 * @param {object} request.body.required - Données du catway
 * @param {number} request.body.catwayNumber - Numéro du catway
 * @param {string} request.body.catwayType - "long" ou "short"
 * @param {string} request.body.catwayState - État du catway
 *
 * @returns {object} 201 - Catway créé
 * @returns {object} 400 - Données invalides
 * @returns {object} 409 - Numéro déjà existant
 * @returns {object} 500 - Erreur serveur
 */
router.post("/", async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    if (
      typeof catwayNumber !== "number" ||
      !["long", "short"].includes(catwayType) ||
      !catwayState
    ) {
      return res
        .status(400)
        .json({ message: "Données invalides pour le catway." });
    }

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
 * PUT /catways/{id}
 * @summary Met à jour uniquement l’état d’un catway
 * @tags Catways
 * @param {number} id.path.required - Numéro du catway
 * @param {object} request.body.required
 * @param {string} request.body.catwayState - Nouvel état du catway
 * @returns {object} 200 - Catway mis à jour
 * @returns {object} 400 - Données invalides
 * @returns {object} 404 - Catway non trouvé
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
 * DELETE /catways/{id}
 * @summary Supprime un catway
 * @tags Catways
 * @param {number} id.path.required - Numéro du catway
 * @returns {object} 200 - Confirmation de suppression
 * @returns {object} 404 - Catway non trouvé
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
