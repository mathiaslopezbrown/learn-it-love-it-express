// Every list with a data-endpoint (topics on the home page, links on a topic page)
// gets the same edit/delete behaviour. One listener per list (event delegation).
document.querySelectorAll('[data-endpoint]').forEach(list => {
  list.addEventListener('click', async (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const item = button.closest('li');
    const url = `${list.dataset.endpoint}/${item.dataset.id}`; // e.g. /topics/3 or /links/7

    if (button.classList.contains('edit-btn')) startEditing(item);
    if (button.classList.contains('cancel-btn')) setEditing(item, false);
    if (button.classList.contains('save-btn')) await saveItem(item, url);
    if (button.classList.contains('delete-btn')) await deleteItem(item, url, list.dataset.confirm);
  });
});

// Shows the "edit" elements and hides the "view" ones (or the other way around)
function setEditing(item, editing) {
  item.querySelectorAll('[data-mode="view"]').forEach(el => (el.hidden = editing));
  item.querySelectorAll('[data-mode="edit"]').forEach(el => (el.hidden = !editing));
}

// Fills each input with the text currently shown for that field
function startEditing(item) {
  const inputs = item.querySelectorAll('[data-field]');
  inputs.forEach(input => {
    input.value = item.querySelector(`[data-display="${input.dataset.field}"]`).textContent.trim();
  });
  setEditing(item, true);
  inputs[0].focus();
}

async function saveItem(item, url) {
  // Builds { title: '...' } for a topic, or { title: '...', url: '...' } for a link
  const data = {};
  for (const input of item.querySelectorAll('[data-field]')) {
    data[input.dataset.field] = input.value.trim();
  }

  if (Object.values(data).some(value => value === '')) {
    alert('Fields cannot be empty');
    return;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    alert('Could not save the changes');
    return;
  }

  const updated = await response.json();
  for (const field in data) {
    item.querySelector(`[data-display="${field}"]`).textContent = updated[field];
  }

  // For links, the title is also the anchor: keep its href in sync with the new URL
  if (updated.url) {
    item.querySelector('[data-display="title"]').href = updated.url;
  }

  setEditing(item, false);
}

async function deleteItem(item, url, message) {
  if (!confirm(message || 'Delete this item?')) return;

  const response = await fetch(url, { method: 'DELETE' });

  if (!response.ok) {
    alert('Could not delete the item');
    return;
  }

  item.remove();
}
