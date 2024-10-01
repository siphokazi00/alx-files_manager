// utils/redis.js

import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Initialize Redis client
    this.client = createClient();

    // Handle errors
    this.client.on('error', (err) => {
      console.error(`Redis client not connected to the server: ${err.message}`);
    });

    // Connect the Redis client
    this.client.connect().catch(console.error);
  }

  // Function to check if Redis is alive
  isAlive() {
    return this.client.connected;
  }

  // Asynchronous function to get a value by key from Redis
  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      console.error(`Error fetching key ${key} from Redis: ${error.message}`);
      return null;
    }
  }

  // Asynchronous function to set a value in Redis with expiration
  async set(key, value, duration) {
    try {
      await this.client.set(key, value, {
        EX: duration, // Set expiration in seconds
      });
    } catch (error) {
      console.error(`Error setting key ${key} in Redis: ${error.message}`);
    }
  }

  // Asynchronous function to delete a key from Redis
  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Error deleting key ${key} from Redis: ${error.message}`);
    }
  }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
