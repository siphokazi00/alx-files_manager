const redisClient = require('../utils/redis');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = 'mongodb://localhost:27017'; // Adjust the URI as needed
const dbName = 'files_manager';
let db;

// Connect to MongoDB
MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }
  db = client.db(dbName);
});

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    // Hash the password with SHA1
    const sha1Password = crypto.createHash('sha1').update(password).digest('hex');

    try {
      // Find user in the database
      const user = await db.collection('users').findOne({ email, password: sha1Password });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate a token and store it in Redis
      const token = uuidv4();
      await redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 24 * 60 * 60); // Expires in 24 hours

      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Remove the token from Redis
      await redisClient.del(`auth_${token}`);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = AuthController;
