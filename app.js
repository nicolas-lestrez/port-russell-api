// app.js
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var mongoose = require("mongoose");

// Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connecté à MongoDB");
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB :", err.message);
  });

// Routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var catwaysRouter = require("./routes/catways");
var reservationsRouter = require("./routes/reservations");

// Middleware d'authentification
var authMiddleware = require("./middlewares/authMiddleware");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes publiques
app.use("/auth", authRouter);
app.use("/", indexRouter);

// Routes protégées
app.use("/users", authMiddleware, usersRouter);
app.use("/catways", authMiddleware, catwaysRouter);
app.use("/catways", authMiddleware, reservationsRouter);

module.exports = app;
