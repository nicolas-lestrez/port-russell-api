// app.js
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var mongoose = require("mongoose");
var ensureAdminUser = require("./scripts/ensureAdminUser");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connecté à MongoDB");
    try {
      await ensureAdminUser();
    } catch (err) {
      console.error("Erreur lors de la création de l'admin :", err.message);
    }
  })
  .catch((err) => console.error("Erreur MongoDB :", err.message));

// Routes backend
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var catwaysRouter = require("./routes/catways");
var reservationsRouter = require("./routes/reservations");
var authMiddleware = require("./middlewares/authMiddleware");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 👉 Sert les fichiers FRONTEND (index.html, CSS, JS…)
app.use(express.static(path.join(__dirname, "public")));

// 👉 Routes publiques API
app.use("/auth", authRouter);

// 👉 Page d'accueil
app.use("/", indexRouter);

// 👉 Routes API protégées
app.use("/users", authMiddleware, usersRouter);
app.use("/catways", authMiddleware, catwaysRouter);
app.use("/catways", authMiddleware, reservationsRouter);

// 👉 Si aucune route ne match → renvoyer index.html (SPA utilisé par front)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

module.exports = app;
