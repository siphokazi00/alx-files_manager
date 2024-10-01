const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');

// Define routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// New route to add a user
router.post('/users', UsersController.postNew);

module.exports = router;
