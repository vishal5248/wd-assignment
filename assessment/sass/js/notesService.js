// js/notesService.js
const STORAGE_KEY = "notes_app_v1";

/**
 * Note shape:
 * { id: number, title: string, content: string, tags: string[], createdAt: string, updatedAt?: string }
 */

export function _loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Load error:", err);
    return [];
  }
}

export function _saveRaw(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    return true;
  } catch (err) {
    console.error("Save error:", err);
    return false;
  }
}

export function loadNotes() {
  return _loadRaw();
}

export function nextId() {
  const a = _loadRaw();
  if (!a.length) return 1;
  return Math.max(...a.map(n => n.id)) + 1;
}

export function addNote({ title, content, tags = [] }) {
  const notes = _loadRaw();
  const id = nextId();
  const now = new Date().toISOString();
  const note = {
    id,
    title: String(title).trim(),
    content: String(content).trim(),
    tags: tags.map(t => String(t).trim()).filter(Boolean),
    createdAt: now
  };
  notes.push(note);
  _saveRaw(notes);
  return note;
}

export function getNoteById(id) {
  const notes = _loadRaw();
  return notes.find(n => n.id === Number(id)) || null;
}

export function updateNote(id, { title, content, tags }) {
  const notes = _loadRaw();
  let updated = null;
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id === Number(id)) {
      if (typeof title === "string") notes[i].title = title.trim();
      if (typeof content === "string") notes[i].content = content.trim();
      if (Array.isArray(tags)) notes[i].tags = tags.map(t => String(t).trim()).filter(Boolean);
      notes[i].updatedAt = new Date().toISOString();
      updated = notes[i];
      break;
    }
  }
  if (updated) _saveRaw(notes);
  return updated;
}

export function deleteNote(id) {
  const notes = _loadRaw();
  const filtered = notes.filter(n => n.id !== Number(id));
  if (filtered.length === notes.length) return false;
  _saveRaw(filtered);
  return true;
}

export function searchNotes(query) {
  const q = String(query).trim().toLowerCase();
  if (!q) return [];
  return _loadRaw().filter(n => {
    return (n.title && n.title.toLowerCase().includes(q)) ||
           (n.content && n.content.toLowerCase().includes(q)) ||
           (Array.isArray(n.tags) && n.tags.some(t => t.toLowerCase().includes(q)));
  });
}

export function clearAllNotes() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
