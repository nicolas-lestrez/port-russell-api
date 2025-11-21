// routes/reservations.js
const express = require("express");
const router = express.Router();

const Reservation = require("../models/Reservation");
const Catway = require("../models/Catway");

/**
 * GET /catways/:id/reservations
 * Récupère toutes les réservations d’un catway.
 */
router.get("/:id/reservations", async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id, 10);

    if (isNaN(catwayNumber)) {
      return res.status(400).json({ message: "L'id doit être un nombre." });
    }

    const reservations = await Reservation.find({ catwayNumber });

    return res.json(reservations);
  } catch (err) {
    console.error("Erreur GET /catways/:id/reservations :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /catways/:id/reservations/:idReservation
 * Récupère une réservation précise d’un catway.
 */
router.get("/:id/reservations/:idReservation", async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id, 10);
    const reservationId = req.params.idReservation;

    if (isNaN(catwayNumber)) {
      return res.status(400).json({ message: "L'id doit être un nombre." });
    }

    const reservation = await Reservation.findOne({
      _id: reservationId,
      catwayNumber,
    });

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    return res.json(reservation);
  } catch (err) {
    console.error("Erreur GET réservation :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /catways/:id/reservations
 * Crée une réservation pour un catway.
 *
 * Body JSON :
 * {
 *   "clientName": "Nom",
 *   "boatName": "Nom du bateau",
 *   "startDate": "2024-12-01",
 *   "endDate": "2024-12-03"
 * }
 */
router.post("/:id/reservations", async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id, 10);
    const { clientName, boatName, startDate, endDate } = req.body;

    if (isNaN(catwayNumber)) {
      return res.status(400).json({ message: "L'id doit être un nombre." });
    }

    if (!clientName || !boatName || !startDate || !endDate) {
      return res.status(400).json({ message: "Données invalides." });
    }

    // Vérifie que le catway existe
    const catwayExists = await Catway.findOne({ catwayNumber });
    if (!catwayExists) {
      return res.status(404).json({ message: "Ce catway n'existe pas." });
    }

    const reservation = await Reservation.create({
      catwayNumber,
      clientName,
      boatName,
      startDate,
      endDate,
    });

    return res.status(201).json(reservation);
  } catch (err) {
    console.error("Erreur POST réservation :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * PUT /catways/:id/reservations/:idReservation
 * Mettre à jour une réservation
 */
router.put("/:id/reservations/:idReservation", async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id, 10);
    const reservationId = req.params.idReservation;
    const { clientName, boatName, startDate, endDate } = req.body;

    const updated = await Reservation.findOneAndUpdate(
      { _id: reservationId, catwayNumber },
      { clientName, boatName, startDate, endDate },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    return res.json(updated);
  } catch (err) {
    console.error("Erreur PUT réservation :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * DELETE /catways/:id/reservations/:idReservation
 */
router.delete("/:id/reservations/:idReservation", async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id, 10);
    const reservationId = req.params.idReservation;

    const deleted = await Reservation.findOneAndDelete({
      _id: reservationId,
      catwayNumber,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    return res.json({ message: "Réservation supprimée." });
  } catch (err) {
    console.error("Erreur DELETE réservation :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
