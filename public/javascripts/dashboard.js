// public/javascripts/dashboard.js
import { getUserInfo, clearAuth, authFetch } from "./api.js";

const userInfoEl = document.getElementById("user-info");
const todayEl = document.getElementById("today");
const logoutBtn = document.getElementById("logout-btn");
const tableBody = document.querySelector("#reservations-table tbody");
const messageEl = document.getElementById("reservations-message");

const { email, username } = getUserInfo();
if (!email) {
  // pas connecté
  window.location.href = "/";
}

userInfoEl.textContent = `${username || ""} (${email})`;
todayEl.textContent = new Date().toLocaleDateString("fr-FR");

logoutBtn.addEventListener("click", () => {
  clearAuth();
  window.location.href = "/";
});

// Exemple : on charge les réservations du catway 1
(async () => {
  try {
    const reservations = await authFetch("/catways/1/reservations");
    tableBody.innerHTML = "";
    if (!reservations.length) {
      messageEl.textContent = "Aucune réservation pour le catway 1.";
      return;
    }
    reservations.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.boatName}</td>
        <td>${r.clientName}</td>
        <td>${new Date(r.startDate).toLocaleDateString("fr-FR")}</td>
        <td>${new Date(r.endDate).toLocaleDateString("fr-FR")}</td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    messageEl.textContent = "Erreur lors du chargement des réservations.";
  }
})();
