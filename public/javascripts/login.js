// public/javascripts/login.js
import { saveAuth } from "./api.js";

const form = document.getElementById("login-form");
const errorEl = document.getElementById("login-error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const resp = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      errorEl.textContent = data.message || "Erreur de connexion";
      return;
    }

    saveAuth(data);
    window.location.href = "/dashboard.html";
  } catch (err) {
    console.error(err);
    errorEl.textContent = "Erreur réseau";
  }
});
