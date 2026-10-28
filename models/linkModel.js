const db = require('../db/database');

// Links of one topic, most voted first
function getByTopic(topicId) {
  return db.prepare('SELECT * FROM links WHERE topic_id = ? ORDER BY votes DESC, id ASC').all(topicId);
}

function getById(id) {
  return db.prepare('SELECT * FROM links WHERE id = ?').get(id);
}

function create(topicId, title, url) {
  const result = db
    .prepare('INSERT INTO links (topic_id, title, url) VALUES (?, ?, ?)')
    .run(topicId, title, url);
  return getById(result.lastInsertRowid);
}

// Returns the updated link, or null if the id doesn't exist
function update(id, title, url) {
  const result = db.prepare('UPDATE links SET title = ?, url = ? WHERE id = ?').run(title, url, id);
  return result.changes > 0 ? getById(id) : null;
}

// Returns true if a row was deleted
function remove(id) {
  const result = db.prepare('DELETE FROM links WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = { getByTopic, getById, create, update, remove };
