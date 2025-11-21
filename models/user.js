const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/*
 * Modèle utilisateur etemail doit être unique
 */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/*
 hashage du mdp
 */
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Méthode d'instance pour comparer un mot de passe en clair
 * avec le mot de passe hashé stocké en base.
 *
 * @param {string} candidatePassword - Mot de passe fourni par l'utilisateur
 * @returns {Promise<boolean>} true si le mot de passe correspond, false sinon
 */
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
