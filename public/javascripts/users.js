// public/javascripts/users.js
import { authFetch } from "./api.js";

const tableBody = document.querySelector("#users-table tbody");
const reloadBtn = document.getElementById("reload-users");
const createForm = document.getElementById("create-user-form");
const msgEl = document.getElementById("users-message");

async function loadUsers() {
  msgEl.textContent = "";
  try {
    const users = await authFetch("/users");
    tableBody.innerHTML = "";
    users.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.email}</td>
        <td>${u.username}</td>
        <td><button data-email="${u.email}">Supprimer</button></td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Erreur lors du chargement des utilisateurs.";
  }
}

reloadBtn.addEventListener("click", loadUsers);
document.addEventListener("DOMContentLoaded", loadUsers);

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;
  const password = document.getElementById("user-password").value;

  try {
    await authFetch("/users", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    createForm.reset();
    loadUsers();
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Erreur lors de la création.";
  }
});

// suppression
tableBody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-email]");
  if (!btn) return;
  const email = btn.dataset.email;

  try {
    await authFetch(`/users/${encodeURIComponent(email)}`, {
      method: "DELETE",
    });
    loadUsers();
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Erreur lors de la suppression.";
  }
});
