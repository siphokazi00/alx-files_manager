const crypto = require('crypto');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
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

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      // Check if the user already exists
      const userExists = await db.collection('users').findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const sha1Password = crypto.createHash('sha1').update(password).digest('hex');

      // Insert the new user into the database
      const result = await db.collection('users').insertOne({ email, password: sha1Password });

      // Respond with the user's ID and email
      return res.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = UsersController;
