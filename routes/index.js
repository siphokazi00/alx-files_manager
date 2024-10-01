const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const FilesController = require('../controllers/FilesController');

// User routes
router.post('/users', UsersController.postUser);
router.get('/connect', UsersController.getConnect);
router.get('/disconnect', UsersController.getDisconnect);
router.get('/users/me', UsersController.getMe);

// File routes
router.post('/files', FilesController.postFile);
router.get('/files/:id', FilesController.getFileById);
router.get('/files', FilesController.getAllFiles);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);
router.get('/files/:id/data', FilesController.getFile);

module.exports = router;
