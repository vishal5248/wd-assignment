// js/validation.js
export function nonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export function parseTags(s) {
  if (!s) return [];
  return String(s).split(/[;,]/).map(t => t.trim()).filter(Boolean);
}

export function parsePositiveInt(s) {
  if (s === null || s === undefined) return null;
  const str = String(s).trim();
  if (!/^\d+$/.test(str)) return null;
  const val = Number(str);
  return val > 0 ? val : null;
}
