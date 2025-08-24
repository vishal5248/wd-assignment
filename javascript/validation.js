export function validateName(name) {
  return /^[A-Za-z][A-Za-z\s]{1,49}$/.test(name.trim());
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function validatePhone(phone) {
  return /^\d{10}$/.test(phone.trim());
}

export function validateSubject(subject) {
  return subject.trim().length > 0;
}

export function validateMessage(msg) {
  return msg.trim().length >= 6;
}
