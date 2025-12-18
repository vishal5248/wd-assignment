// js/app.js
import * as svc from "./notesService.js";
import * as v from "./validation.js";

const openMenuBtn = document.getElementById("open-menu");
const menuModal = document.getElementById("menu-modal");
const closeMenuBtn = document.getElementById("close-menu");
const menuList = document.getElementById("menu-list");
const actionArea = document.getElementById("action-area");
const statusEl = document.getElementById("status");
const toast = document.getElementById("toast");

function showModal() { menuModal.classList.remove("hidden"); showStatus("Menu opened. Choose an action."); }
function hideModal() { menuModal.classList.add("hidden"); showToast("Menu closed."); }
function showStatus(msg) { statusEl.textContent = msg; }
function showToast(msg) { toast.textContent = msg; toast.classList.remove("hidden"); setTimeout(()=>toast.classList.add("hidden"), 2400); }

async function safeRun(fn) {
  try {
    await fn();
  } catch (err) {
    console.error(err);
    showStatus("An unexpected error occurred. Returned to menu.");
    showToast("Error: " + (err && err.message ? err.message : "unknown"));
    renderMenuPrompt();
  }
}

function renderMenuPrompt() {
  actionArea.innerHTML = `<div style="padding:12px;color:rgba(255,255,255,.8)">
    <p>Choose an option from the left. After each operation the menu will remain available.</p>
  </div>`;
}

function renderAddForm() {
  actionArea.innerHTML = `
    <form id="add-form">
      <div class="form-row"><label>Title</label><input id="title" type="text" placeholder="Enter title" /></div>
      <div class="form-row"><label>Tags (comma or semicolon separated)</label><input id="tags" type="text" placeholder="tag1, tag2" /></div>
      <div class="form-row"><label>Content</label><textarea id="content" placeholder="Write note..."></textarea></div>
      <div style="display:flex;gap:8px;align-items:center">
        <button type="submit" class="primary-action">Save Note</button>
        <button type="button" id="cancel-add" class="secondary">Cancel</button>
      </div>
    </form>
  `;
  const form = document.getElementById("add-form");
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    safeRun(() => {
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const tagsRaw = document.getElementById("tags").value;
      if (!v.nonEmptyString(title)) { showStatus("Validation: title cannot be empty."); return; }
      if (!v.nonEmptyString(content)) { showStatus("Validation: content cannot be empty."); return; }
      const tags = v.parseTags(tagsRaw);
      const note = svc.addNote({ title, content, tags });
      showStatus(`Note saved (ID ${note.id}).`);
      showToast("Note added ✓");
      renderMenuPrompt();
    });
  });

  document.getElementById("cancel-add").addEventListener("click", () => {
    renderMenuPrompt();
    showStatus("Add cancelled.");
  });
}

function renderAllNotes() {
  safeRun(async () => {
    const notes = svc.loadNotes();
    if (!notes.length) {
      actionArea.innerHTML = `<div class="note-list"><div class="note-card"><div class="meta">No notes found.</div></div></div>`;
      showStatus("No notes available.");
      return;
    }
    actionArea.innerHTML = `<div class="note-list">${notes.map(n => {
      const tags = (n.tags && n.tags.length) ? n.tags.join(", ") : "—";
      return `<div class="note-card">
        <div class="meta">ID: ${n.id} • ${new Date(n.createdAt).toLocaleString()}</div>
        <div class="note-title">${escapeHtml(n.title)}</div>
        <div class="meta">Tags: ${escapeHtml(tags)}</div>
        <div class="content">${escapeHtml(n.content)}</div>
      </div>`;
    }).join("")}</div>`;
    showStatus(`${notes.length} note(s) displayed.`);
  });
}

function renderSearch() {
  actionArea.innerHTML = `
    <form id="search-form">
      <div class="form-row"><label>Query (title, content or tags)</label><input id="q" type="text" placeholder="Search..." /></div>
      <div style="display:flex;gap:8px"><button type="submit" class="primary-action">Search</button><button type="button" id="cancel-search" class="secondary">Cancel</button></div>
    </form>
    <div id="search-results"></div>
  `;
  document.getElementById("search-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    safeRun(() => {
      const q = document.getElementById("q").value.trim();
      if (!v.nonEmptyString(q)) { showStatus("Validation: query cannot be empty."); return; }
      const res = svc.searchNotes(q);
      const container = document.getElementById("search-results");
      if (!res.length) {
        container.innerHTML = `<div class="note-card"><div class="meta">No results for "${escapeHtml(q)}".</div></div>`;
        showStatus("No matching notes.");
        return;
      }
      container.innerHTML = `<div class="note-list">${res.map(n => `<div class="note-card">
        <div class="meta">ID: ${n.id} • ${new Date(n.createdAt).toLocaleString()}</div>
        <div class="note-title">${escapeHtml(n.title)}</div>
        <div class="meta">Tags: ${(n.tags||[]).join(", ")}</div>
        <div class="content">${escapeHtml(n.content)}</div>
      </div>`).join("")}</div>`;
      showStatus(`${res.length} result(s) found.`);
    });
  });
  document.getElementById("cancel-search").addEventListener("click", () => { renderMenuPrompt(); showStatus("Search cancelled.");});
}

function renderEdit() {
  actionArea.innerHTML = `
    <form id="edit-lookup">
      <div class="form-row"><label>Enter Note ID to edit</label><input id="edit-id" type="text" placeholder="e.g. 1" /></div>
      <div style="display:flex;gap:8px"><button type="submit" class="primary-action">Lookup</button><button type="button" id="cancel-edit" class="secondary">Cancel</button></div>
    </form>
    <div id="edit-area"></div>
  `;
  document.getElementById("edit-lookup").addEventListener("submit", (ev) => {
    ev.preventDefault();
    safeRun(() => {
      const idRaw = document.getElementById("edit-id").value;
      const id = v.parsePositiveInt(idRaw);
      if (!id) { showStatus("Validation: enter a positive integer ID."); return; }
      const note = svc.getNoteById(id);
      if (!note) { showStatus(`Note ID ${id} not found.`); return; }
      renderEditForm(note);
    });
  });
  document.getElementById("cancel-edit").addEventListener("click", () => { renderMenuPrompt(); showStatus("Edit cancelled.");});
}

function renderEditForm(note) {
  document.getElementById("edit-area").innerHTML = `
    <form id="edit-form">
      <div class="form-row"><label>Title</label><input id="edit-title" type="text" value="${escapeHtml(note.title)}" /></div>
      <div class="form-row"><label>Tags (comma separated)</label><input id="edit-tags" type="text" value="${escapeHtml((note.tags||[]).join(", "))}" /></div>
      <div class="form-row"><label>Content</label><textarea id="edit-content">${escapeHtml(note.content)}</textarea></div>
      <div style="display:flex;gap:8px">
        <button type="submit" class="primary-action">Save Changes</button>
        <button type="button" id="cancel-edit2" class="secondary">Cancel</button>
      </div>
    </form>
  `;
  document.getElementById("edit-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    safeRun(() => {
      const title = document.getElementById("edit-title").value;
      const content = document.getElementById("edit-content").value;
      const tags = v.parseTags(document.getElementById("edit-tags").value);
      if (!v.nonEmptyString(title)) { showStatus("Validation: title cannot be empty."); return; }
      if (!v.nonEmptyString(content)) { showStatus("Validation: content cannot be empty."); return; }
      const updated = svc.updateNote(note.id, { title, content, tags });
      if (!updated) { showStatus("Update failed."); return; }
      showStatus(`Note ID ${note.id} updated.`);
      showToast("Note updated ✓");
      renderMenuPrompt();
    });
  });
  document.getElementById("cancel-edit2").addEventListener("click", () => { renderMenuPrompt(); showStatus("Edit cancelled.");});
}

function renderDelete() {
  actionArea.innerHTML = `
    <form id="del-form">
      <div class="form-row"><label>Enter Note ID to delete</label><input id="del-id" type="text" placeholder="e.g. 2" /></div>
      <div style="display:flex;gap:8px"><button type="submit" class="primary-action">Delete</button><button type="button" id="cancel-del" class="secondary">Cancel</button></div>
    </form>
  `;
  document.getElementById("del-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    safeRun(() => {
      const idRaw = document.getElementById("del-id").value;
      const id = v.parsePositiveInt(idRaw);
      if (!id) { showStatus("Validation: enter a positive integer ID."); return; }
      const exists = svc.getNoteById(id);
      if (!exists) { showStatus(`Note ID ${id} not found.`); return; }
      const ok = confirm(`Are you sure you want to delete note ID ${id} (${exists.title})?`);
      if (!ok) { showStatus("Delete cancelled by user."); return; }
      const deleted = svc.deleteNote(id);
      if (deleted) {
        showStatus(`Note ID ${id} deleted.`);
        showToast("Note deleted ✓");
      } else {
        showStatus("Delete failed (unknown).");
      }
      renderMenuPrompt();
    });
  });
  document.getElementById("cancel-del").addEventListener("click", () => { renderMenuPrompt(); showStatus("Delete cancelled.");});
}

function renderClearAll() {
  actionArea.innerHTML = `
    <div class="form-row"><p>Clear ALL notes from browser storage. This cannot be undone.</p></div>
    <div style="display:flex;gap:10px"><button id="clear-confirm" class="primary-action">Clear All</button><button id="clear-cancel" class="secondary">Cancel</button></div>
  `;
  document.getElementById("clear-confirm").addEventListener("click", () => {
    safeRun(() => {
      const ok = confirm("Confirm: remove ALL notes?");
      if (!ok) { showStatus("Clear all cancelled."); return; }
      const done = svc.clearAllNotes();
      if (done) {
        showStatus("All notes cleared.");
        showToast("Cleared ✓");
      } else {
        showStatus("Clear failed.");
      }
      renderMenuPrompt();
    });
  });
  document.getElementById("clear-cancel").addEventListener("click", () => { renderMenuPrompt(); showStatus("Clear cancelled.");});
}

function actionExit() {
  hideModal();
  showStatus("Exited menu.");
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}

function handleMenuAction(action) {
  switch (action) {
    case "add": renderAddForm(); break;
    case "view": renderAllNotes(); break;
    case "search": renderSearch(); break;
    case "edit": renderEdit(); break;
    case "delete": renderDelete(); break;
    case "clearall": renderClearAll(); break;
    case "exit": actionExit(); break;
    default: renderMenuPrompt(); showStatus("Unknown action."); break;
  }
}

function init() {
  renderMenuPrompt();
  openMenuBtn.addEventListener("click", () => { showModal(); });
  closeMenuBtn.addEventListener("click", () => { hideModal(); });

  menuList.addEventListener("click", (ev) => {
    const btn = ev.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    safeRun(() => handleMenuAction(action));
  });

  document.getElementById("open-linkedin").addEventListener("click", ()=> { showToast("LinkedIn button (placeholder)"); });
  document.getElementById("open-twitter").addEventListener("click", ()=> { showToast("Twitter button (placeholder)"); });

  const notes = svc.loadNotes();
  showStatus(`Menu ready. ${notes.length} saved note(s).`);
}

init();
