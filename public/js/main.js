const topicList = document.getElementById('topic-list');

// One listener for the whole list (event delegation):
// it works for every button, including those of topics added later
topicList.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const item = button.closest('li');
  const id = item.dataset.id;

  if (button.classList.contains('edit-btn')) startEditing(item);
  if (button.classList.contains('cancel-btn')) setEditing(item, false);
  if (button.classList.contains('save-btn')) await saveTopic(item, id);
  if (button.classList.contains('delete-btn')) await deleteTopic(item, id);
});

// Shows the "edit" elements and hides the "view" ones (or the other way around)
function setEditing(item, editing) {
  item.querySelectorAll('[data-mode="view"]').forEach(el => (el.hidden = editing));
  item.querySelectorAll('[data-mode="edit"]').forEach(el => (el.hidden = !editing));
}

function startEditing(item) {
  const input = item.querySelector('.edit-input');
  input.value = item.querySelector('.topic-title').textContent;
  setEditing(item, true);
  input.focus();
}

async function saveTopic(item, id) {
  const title = item.querySelector('.edit-input').value.trim();
  if (!title) {
    alert('The title cannot be empty');
    return;
  }

  const response = await fetch(`/topics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  if (!response.ok) {
    alert('Could not update the topic');
    return;
  }

  const topic = await response.json();
  item.querySelector('.topic-title').textContent = topic.title;
  setEditing(item, false);
}

async function deleteTopic(item, id) {
  if (!confirm('Delete this topic and all its links?')) return;

  const response = await fetch(`/topics/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    alert('Could not delete the topic');
    return;
  }

  item.remove();
}
