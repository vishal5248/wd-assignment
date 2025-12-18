import { renderRegistrationForm } from "./registration.js";
import { getAllRegistrations } from "./storage.js";

const app = document.getElementById("app");
showMenu();

function showMenu() {
  app.innerHTML = `
    <h2>Registration Menu</h2>
    <button id="regBtn">1. Register User</button>
    <button id="viewBtn">2. View All Registrations</button>
    <button id="exitBtn">3. Exit</button>
  `;

  document.getElementById("regBtn").addEventListener("click", () => {
    renderRegistrationForm(app, showMenu);
  });

  document.getElementById("viewBtn").addEventListener("click", () => {
    renderRegistrations(app, showMenu);
  });

  document.getElementById("exitBtn").addEventListener("click", () => {
    app.innerHTML = `<h2>Thank you for using the system!</h2>`;
  });
}

function renderRegistrations(container, goBack) {
  const records = getAllRegistrations();
  if (!records.length) {
    container.innerHTML = `<h2>No Registrations Found</h2><button id="backBtn">Back to Menu</button>`;
    document.getElementById("backBtn").addEventListener("click", goBack);
    return;
  }

  let html = `<h2>All Registrations</h2><ul>`;
  records.forEach(r => {
    html += `<li>
      <strong>${r.name}</strong> (${r.email}, ${r.phone})<br>
      Subject: ${r.subject}<br>
      Message: ${r.message}<br>
      Date: ${r.createdAt}
    </li><hr>`;
  });
  html += `</ul><button id="backBtn">Back to Menu</button>`;

  container.innerHTML = html;
  document.getElementById("backBtn").addEventListener("click", goBack);
}
