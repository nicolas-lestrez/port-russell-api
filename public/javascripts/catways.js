// public/javascripts/catways.js
import { authFetch } from "./api.js";

const tableBody = document.querySelector("#catways-table tbody");
const msgEl = document.getElementById("catways-message");
const reloadBtn = document.getElementById("reload-catways");
const form = document.getElementById("create-catway-form");

async function loadCatways() {
  msgEl.textContent = "";
  try {
    const catways = await authFetch("/catways");
    tableBody.innerHTML = "";
    catways.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.catwayNumber}</td>
        <td>${c.catwayType}</td>
        <td>
          <input data-id="${c.catwayNumber}" class="state-input" value="${
        c.catwayState || ""
      }">
        </td>
        <td>
          <button data-action="update" data-id="${
            c.catwayNumber
          }">Mettre à jour</button>
          <button data-action="delete" data-id="${
            c.catwayNumber
          }">Supprimer</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Erreur lors du chargement des catways.";
  }
}

reloadBtn.addEventListener("click", loadCatways);
document.addEventListener("DOMContentLoaded", loadCatways);

// Création
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgEl.textContent = "";
  const catwayNumber = Number(document.getElementById("create-number").value);
  const catwayType = document.getElementById("create-type").value;
  const catwayState = document.getElementById("create-state").value;

  try {
    await authFetch("/catways", {
      method: "POST",
      body: JSON.stringify({ catwayNumber, catwayType, catwayState }),
    });
    form.reset();
    loadCatways();
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Erreur lors de la création.";
  }
});

// Update + delete
tableBody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;

  try {
    if (action === "update") {
      const input = tableBody.querySelector(`input[data-id="${id}"]`);
      const catwayState = input.value;
      await authFetch(`/catways/${id}`, {
        method: "PUT",
        body: JSON.stringify({ catwayState }),
      });
    } else if (action === "delete") {
      await authFetch(`/catways/${id}`, { method: "DELETE" });
    }
    loadCatways();
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Erreur lors de la mise à jour ou suppression.";
  }
});
