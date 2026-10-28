const Topic = require('../models/topicModel');
const Link = require('../models/linkModel');

// GET / -> page with all topics
function index(req, res) {
  const topics = Topic.getAll();
  res.render('index', { title: 'Topics', topics });
}

// GET /topics/:id -> page of one topic with its links
function show(req, res) {
  const topic = Topic.getById(Number(req.params.id));
  if (!topic) {
    return res.status(404).send('Topic not found');
  }

  const links = Link.getByTopic(topic.id);
  res.render('topic', { title: topic.title, topic, links });
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

// POST /topics/:id/vote -> called with fetch(), answers with the updated topic
function vote(req, res) {
  const topic = Topic.vote(Number(req.params.id));
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

module.exports = { index, show, create, update, vote, remove };
