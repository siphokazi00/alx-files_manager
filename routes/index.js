const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

// Define routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// New route to add a user
router.post('/users', UsersController.postNew);

// Auth and user routes
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

module.exports = router;
