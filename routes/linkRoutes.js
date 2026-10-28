const express = require('express');
const linkController = require('../controllers/linkController');

const router = express.Router();

router.post('/topics/:id/links', linkController.create);
router.put('/links/:id', linkController.update);
router.delete('/links/:id', linkController.remove);

module.exports = router;
