// scripts/createTestUser.js
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/user");

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecté à MongoDB");

    const email = "tonemail@exemple.com";
    const passwordPlain = "test1234";

    // On évite de créer le même user plusieurs fois
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Utilisateur déjà existant avec cet email :", email);
      return process.exit(0);
    }

    const user = await User.create({
      username: "Nicolas",
      email: email,
      // On laisse le hook pre("save") du modèle hasher le mot de passe
      password: passwordPlain,
    });

    console.log("Utilisateur créé :");
    console.log("  email :", user.email);
    console.log("  mot de passe en clair pour les tests :", passwordPlain);

    process.exit(0);
  } catch (err) {
    console.error("Erreur lors de la création du user :", err);
    process.exit(1);
  }
}

run();
