const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database(path.join(__dirname, 'learnit.db'));

// SQLite ships with foreign keys disabled: without this, ON DELETE CASCADE does nothing
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

// Sample data, only if the database is empty
const { total } = db.prepare('SELECT COUNT(*) AS total FROM topics').get();

if (total === 0) {
  const insertTopic = db.prepare('INSERT INTO topics (title, votes) VALUES (?, ?)');
  const insertLink = db.prepare('INSERT INTO links (topic_id, title, url, votes) VALUES (?, ?, ?, ?)');

  // Transaction: either everything is inserted or nothing is
  const seed = db.transaction(() => {
    const ninja = insertTopic.run('How to code like a ninja', 3).lastInsertRowid;
    insertLink.run(ninja, 'MDN Web Docs', 'https://developer.mozilla.org', 5);
    insertLink.run(ninja, 'Express guide', 'https://expressjs.com', 2);

    const coffee = insertTopic.run('Mastering the art of brewing coffee', 1).lastInsertRowid;
    insertLink.run(coffee, 'Brewing methods', 'https://en.wikipedia.org/wiki/Coffee_preparation', 1);
  });

  seed();
  console.log('Database initialized with sample data');
}

module.exports = db;
