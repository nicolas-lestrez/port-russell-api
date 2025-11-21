// models/Catway.js
const mongoose = require("mongoose");

/**
 * Modèle Catway (place à quai)
 */
const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: { type: Number, required: true, unique: true },
    catwayType: { type: String, required: true, enum: ["long", "short"] },
    catwayState: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Catway", catwaySchema);
