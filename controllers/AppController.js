const { getRedisStatus, getDbStatus } = require('../utils');  // Assuming these are available in utils.js

class AppController {
  static async getStatus(req, res) {
    // Get Redis and DB statuses
    const redisAlive = await getRedisStatus(); // Returns true/false if Redis is alive
    const dbAlive = await getDbStatus(); // Returns true/false if DB is alive

    return res.status(200).json({ redis: redisAlive, db: dbAlive });
  }

  static async getStats(req, res) {
    try {
      // Mocking the users and files collection counts (use actual DB query in a real scenario)
      const userCount = await countUsers();  // Returns the number of users from the DB
      const fileCount = await countFiles();  // Returns the number of files from the DB

      return res.status(200).json({ users: userCount, files: fileCount });
    } catch (error) {
      return res.status(500).json({ error: 'Unable to fetch stats' });
    }
  }
}

module.exports = AppController;
