const FileModel = require('../models/FileModel');
const UserModel = require('../models/UserModel');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');

class FilesController {
    static async postFile(req, res) {
        // Your existing code for file storage...
        // Add to fileQueue for background processing
        fileQueue.add({ userId: req.user.id, fileId: newFile.id });
        res.status(201).json(newFile);
    }

    static async putPublish(req, res) {
        const userId = req.user.id;
        const fileId = req.params.id;

        const user = await UserModel.findById(userId);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const file = await FileModel.findOne({ _id: fileId, userId });
        if (!file) return res.status(404).json({ error: 'Not found' });

        file.isPublic = true;
        await file.save();
        res.status(200).json(file);
    }

    static async putUnpublish(req, res) {
        const userId = req.user.id;
        const fileId = req.params.id;

        const user = await UserModel.findById(userId);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const file = await FileModel.findOne({ _id: fileId, userId });
        if (!file) return res.status(404).json({ error: 'Not found' });

        file.isPublic = false;
        await file.save();
        res.status(200).json(file);
    }

    static async getFile(req, res) {
        const fileId = req.params.id;
        const file = await FileModel.findById(fileId);

        if (!file) return res.status(404).json({ error: 'Not found' });
        if (!file.isPublic && (!req.user || req.user.id !== file.userId)) {
            return res.status(404).json({ error: 'Not found' });
        }
        if (file.type === 'folder') {
            return res.status(400).json({ error: "A folder doesn't have content" });
        }
        const filePath = path.join(__dirname, '../files', file.name);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });

        const mimeType = mime.lookup(file.name);
        res.set('Content-Type', mimeType);
        res.sendFile(filePath);
    }
}

module.exports = FilesController;
