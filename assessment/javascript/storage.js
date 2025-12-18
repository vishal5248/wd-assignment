const STORAGE_KEY = "registrations";

export function saveRegistration(record) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  existing.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getAllRegistrations() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
