const Topic = require('../models/topicModel');
const Link = require('../models/linkModel');

// POST /topics/:id/links -> HTML form, then back to the topic page
function create(req, res) {
  const topicId = Number(req.params.id);
  if (!Topic.getById(topicId)) {
    return res.status(404).send('Topic not found');
  }

  const title = (req.body.title || '').trim();
  const url = (req.body.url || '').trim();
  if (title && url) {
    Link.create(topicId, title, url);
  }

  res.redirect(`/topics/${topicId}`);
}

// PUT /links/:id -> called with fetch(), answers with JSON
function update(req, res) {
  const title = (req.body.title || '').trim();
  const url = (req.body.url || '').trim();
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  const link = Link.update(Number(req.params.id), title, url);
  if (!link) {
    return res.status(404).json({ error: 'Link not found' });
  }

  res.json(link);
}

// POST /links/:id/vote -> called with fetch(), answers with the updated link
function vote(req, res) {
  const link = Link.vote(Number(req.params.id));
  if (!link) {
    return res.status(404).json({ error: 'Link not found' });
  }

  res.json(link);
}

// DELETE /links/:id -> called with fetch(), answers 204 (no content)
function remove(req, res) {
  const deleted = Link.remove(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: 'Link not found' });
  }

  res.status(204).end();
}

module.exports = { create, update, vote, remove };
