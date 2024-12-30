const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.use(auth);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.post('/refresh-token', authController.refreshToken);

module.exports = router; 