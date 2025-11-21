// scripts/seed.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecté à MongoDB pour le seed");

    const catwaysPath = path.join(__dirname, "../data/catways.json");
    const reservationsPath = path.join(__dirname, "../data/reservations.json");

    const catwaysData = JSON.parse(fs.readFileSync(catwaysPath, "utf-8"));
    const reservationsData = JSON.parse(
      fs.readFileSync(reservationsPath, "utf-8")
    );

    // On vide les collections avant de réimporter
    await Catway.deleteMany({});
    await Reservation.deleteMany({});

    await Catway.insertMany(catwaysData);
    await Reservation.insertMany(reservationsData);

    console.log("Données importées avec succès");
    process.exit(0);
  } catch (err) {
    console.error("Erreur pendant le seed :", err);
    process.exit(1);
  }
}

seed();
