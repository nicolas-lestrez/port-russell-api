// public/javascripts/reservations.js
import { authFetch } from "./api.js";

const loadForm = document.getElementById("load-reservations-form");
const createForm = document.getElementById("create-reservation-form");
const tableBody = document.querySelector("#reservations-table tbody");
const msgEl = document.getElementById("reservations-message");

async function loadReservations(catwayNumber) {
  msgEl.textContent = "";
  try {
    const reservations = await authFetch(
      `/catways/${catwayNumber}/reservations`
    );
    tableBody.innerHTML = "";
    if (!reservations.length) {
      msgEl.textContent = "Aucune réservation pour ce catway.";
      return;
    }
    reservations.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r._id}</td>
        <td>${r.boatName}</td>
        <td>${r.clientName}</td>
        <td>${new Date(r.startDate).toLocaleDateString("fr-FR")}</td>
        <td>${new Date(r.endDate).toLocaleDateString("fr-FR")}</td>
        <td><button data-id="${r._id}" data-catway="${
        r.catwayNumber
      }">Supprimer</button></td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Erreur lors du chargement.";
  }
}

loadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = Number(document.getElementById("catway-id").value);
  loadReservations(id);
});

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const catwayNumber = Number(
    document.getElementById("res-catway-number").value
  );
  const clientName = document.getElementById("res-client").value;
  const boatName = document.getElementById("res-boat").value;
  const startDate = document.getElementById("res-start").value;
  const endDate = document.getElementById("res-end").value;

  try {
    await authFetch(`/catways/${catwayNumber}/reservations`, {
      method: "POST",
      body: JSON.stringify({ clientName, boatName, startDate, endDate }),
    });
    createForm.reset();
    loadReservations(catwayNumber);
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Erreur lors de la création.";
  }
});

// suppression
tableBody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.dataset.id;
  const catway = btn.dataset.catway;

  try {
    await authFetch(`/catways/${catway}/reservations/${id}`, {
      method: "DELETE",
    });
    loadReservations(catway);
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Erreur lors de la suppression.";
  }
});
