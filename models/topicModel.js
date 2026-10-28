const db = require('../db/database');

// Topics ordered by votes (most voted first); ties keep creation order
function getAll() {
  return db.prepare('SELECT * FROM topics ORDER BY votes DESC, id ASC').all();
}

function getById(id) {
  return db.prepare('SELECT * FROM topics WHERE id = ?').get(id);
}

function create(title) {
  const result = db.prepare('INSERT INTO topics (title) VALUES (?)').run(title);
  return getById(result.lastInsertRowid);
}

// Returns the updated topic, or null if the id doesn't exist
function update(id, title) {
  const result = db.prepare('UPDATE topics SET title = ? WHERE id = ?').run(title, id);
  return result.changes > 0 ? getById(id) : null;
}

// Adds one vote; votes = votes + 1 is done by SQLite in a single step,
// so two clicks at the same time can't overwrite each other
function vote(id) {
  const result = db.prepare('UPDATE topics SET votes = votes + 1 WHERE id = ?').run(id);
  return result.changes > 0 ? getById(id) : null;
}

// Returns true if a row was deleted (its links go too, via ON DELETE CASCADE)
function remove(id) {
  const result = db.prepare('DELETE FROM topics WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = { getAll, getById, create, update, vote, remove };
