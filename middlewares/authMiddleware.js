// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

/**
 * Middleware d'authentification.
 * Vérifie la présence d'un token JWT valide dans le header Authorization.
 *
 * Header attendu :
 * Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Pas de header Authorization
  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  // On s'attend à "Bearer xxxxx"
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Format de token invalide" });
  }

  try {
    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On stocke les infos du user dans req.user pour la suite
    req.user = decoded;

    // On laisse continuer la requête
    next();
  } catch (err) {
    console.error("Erreur de vérification du token :", err);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

module.exports = authMiddleware;
