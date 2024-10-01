const redisClient = require('../utils/redisClient');

describe('Redis Client', () => {
    it('should connect to Redis', async () => {
        const result = await redisClient.ping();
        expect(result).toBe('PONG');
    });
});
