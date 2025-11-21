// middlewares/auth.js
const jwt = require("jsonwebtoken");

/**
 * Middleware d'authentification JWT.
 *
 * À utiliser sur les routes protégées.
 * Il attend un header : Authorization: Bearer <token>
 *
 * @param {import("express").Request} req - Requête entrante
 * @param {import("express").Response} res - Réponse à renvoyer
 * @param {import("express").NextFunction} next - Fonction pour passer au middleware suivant
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Si pas de header ou mauvais format -> 401
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token manquant ou mal formaté (Authorization)" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Vérifie et décode le token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // On attache les infos du user sur la requête
    req.user = {
      id: payload.userId,
      email: payload.email,
    };

    // On laisse continuer la requête
    next();
  } catch (err) {
    console.error("Erreur de vérification du token :", err);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

module.exports = authMiddleware;
