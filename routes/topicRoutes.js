const express = require('express');
const topicController = require('../controllers/topicController');

const router = express.Router();

router.get('/', topicController.index);
router.post('/topics', topicController.create);
router.put('/topics/:id', topicController.update);
router.delete('/topics/:id', topicController.remove);

module.exports = router;
