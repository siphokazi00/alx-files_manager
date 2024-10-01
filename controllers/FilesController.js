const uuidv4 = require('uuid').v4;
const redisClient = require('../utils/redis'); // Assuming redisClient is set up
const dbClient = require('../utils/db'); // Assuming a MongoDB client is set up
const fs = require('fs');
const path = require('path');

// Folder to store files
const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    // Verify token and get user ID
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    const validTypes = ['folder', 'file', 'image'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // Check parentId validity if provided
    if (parentId !== 0) {
      const parentFile = await dbClient.findOne('files', { _id: parentId });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    // For folder type, insert into the DB and return response
    if (type === 'folder') {
      const newFolder = {
        userId,
        name,
        type,
        isPublic,
        parentId,
      };
      const result = await dbClient.insertOne('files', newFolder);
      return res.status(201).json({
        id: result.insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    }

    // For file or image type, save to disk
    const fileId = uuidv4();
    const filePath = path.join(folderPath, fileId);

    // Create folder if not exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Decode and save file
    const fileBuffer = Buffer.from(data, 'base64');
    fs.writeFileSync(filePath, fileBuffer);

    // Store file details in the database
    const newFile = {
      userId,
      name,
      type,
      isPublic,
      parentId,
      localPath: filePath,
    };
    const result = await dbClient.insertOne('files', newFile);

    return res.status(201).json({
      id: result.insertedId,
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }
}

module.exports = FilesController;
