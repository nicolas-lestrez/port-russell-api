const User = require("../models/user");

/**
 * Ensure a default admin account exists so the demo credentials work
 * in environments where the database starts empty (e.g. Render deploys).
 */
async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@exemple.com";
  const password = process.env.ADMIN_PASSWORD || "test1234";
  const username = process.env.ADMIN_USERNAME || "Admin";

  const existing = await User.findOne({ email });
  if (existing) {
    return;
  }

  await User.create({ username, email, password });
  console.log(`Utilisateur admin créé (${email})`);
}

module.exports = ensureAdminUser;
