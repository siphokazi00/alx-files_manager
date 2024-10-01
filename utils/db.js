// utils/db.js

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file if it exists
dotenv.config();

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    
    const url = `mongodb://${host}:${port}`;
    
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.db = null;

    // Connect to the MongoDB server
    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
        console.log('MongoDB connected successfully');
      })
      .catch((err) => {
        console.error(`MongoDB connection error: ${err.message}`);
      });
  }

  // Function to check if MongoDB connection is alive
  isAlive() {
    return !!this.db;
  }

  // Asynchronous function to get the number of users in the collection
  async nbUsers() {
    try {
      const usersCollection = this.db.collection('users');
      const usersCount = await usersCollection.countDocuments();
      return usersCount;
    } catch (error) {
      console.error(`Error counting users: ${error.message}`);
      return 0;
    }
  }

  // Asynchronous function to get the number of files in the collection
  async nbFiles() {
    try {
      const filesCollection = this.db.collection('files');
      const filesCount = await filesCollection.countDocuments();
      return filesCount;
    } catch (error) {
      console.error(`Error counting files: ${error.message}`);
      return 0;
    }
  }
}

// Export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
