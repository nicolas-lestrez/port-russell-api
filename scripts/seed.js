const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models/user");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connecté à MongoDB");

    await User.deleteMany({});

    await User.create({
      username: "Admin",
      email: "admin@exemple.com",
      // Le hook pre("save") du modèle s'occupe de hasher
      password: "test1234",
    });

    console.log("Utilisateur créé : admin@exemple.com / test1234");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
