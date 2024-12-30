const express = require('express');
const router = express.Router();
const labelController = require('../controllers/label.controller');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Label routes
router.get('/', labelController.getLabels);
router.post('/', labelController.createLabel);
router.put('/:id', labelController.updateLabel);
router.delete('/:id', labelController.deleteLabel);
router.get('/:id', auth, labelController.getLabel);

module.exports = router; 