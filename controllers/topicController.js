const Topic = require('../models/topicModel');

// GET / -> page with all topics
function index(req, res) {
  const topics = Topic.getAll();
  res.render('index', { title: 'Learn It, Love It', topics });
}

// POST /topics -> HTML form, then back to the list
function create(req, res) {
  const title = (req.body.title || '').trim();
  if (title) {
    Topic.create(title);
  }
  res.redirect('/');
}

// PUT /topics/:id -> called with fetch(), answers with JSON
function update(req, res) {
  const title = (req.body.title || '').trim();
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const topic = Topic.update(Number(req.params.id), title);
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }

  res.json(topic);
}

// DELETE /topics/:id -> called with fetch(), answers 204 (no content)
function remove(req, res) {
  const deleted = Topic.remove(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: 'Topic not found' });
  }

  res.status(204).end();
}

module.exports = { index, create, update, remove };
