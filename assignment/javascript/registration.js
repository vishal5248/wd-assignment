import { validateName, validateEmail, validatePhone, validateSubject, validateMessage } from "./validation.js";
import { saveRegistration } from "./storage.js";

export function renderRegistrationForm(container, goBack) {
  container.innerHTML = `
    <h2>Registration Form</h2>
    <form id="regForm">
      <input type="text" id="name" placeholder="Name*" />
      <div id="err-name" class="error"></div>
      
      <input type="email" id="email" placeholder="Email*" />
      <div id="err-email" class="error"></div>
      
      <input type="text" id="phone" placeholder="Phone*" />
      <div id="err-phone" class="error"></div>
      
      <input type="text" id="subject" placeholder="Subject*" />
      <div id="err-subject" class="error"></div>
      
      <textarea id="message" placeholder="Message*"></textarea>
      <div id="err-message" class="error"></div>
      
      <button type="submit">Submit</button>
      <button type="button" id="cancelBtn">Back to Menu</button>
    </form>
  `;

  const form = document.getElementById("regForm");
  document.getElementById("cancelBtn").addEventListener("click", goBack);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit(goBack);
  });
}

function handleSubmit(goBack) {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  
  ["name","email","phone","subject","message"].forEach(id => {
    document.getElementById("err-" + id).textContent = "";
  });

  let valid = true;

  if (!validateName(name)) {
    document.getElementById("err-name").textContent = "Please enter a valid name.";
    valid = false;
  }
  if (!validateEmail(email)) {
    document.getElementById("err-email").textContent = "Please enter a valid email.";
    valid = false;
  }
  if (!validatePhone(phone)) {
    document.getElementById("err-phone").textContent = "Please enter a 10-digit phone.";
    valid = false;
  }
  if (!validateSubject(subject)) {
    document.getElementById("err-subject").textContent = "Please enter a subject.";
    valid = false;
  }
  if (!validateMessage(message)) {
    document.getElementById("err-message").textContent = "Message must be at least 6 characters.";
    valid = false;
  }

  if (!valid) return;

  const record = {
    name, email, phone, subject, message,
    createdAt: new Date().toLocaleString()
  };
  saveRegistration(record);

  alert("Registration successful!\n" +
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`);
  goBack();
}
