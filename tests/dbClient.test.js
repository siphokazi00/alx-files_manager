const dbClient = require('../utils/dbClient');

describe('DB Client', () => {
    it('should connect to MongoDB', async () => {
        const isConnected = await dbClient.isConnected();
        expect(isConnected).toBe(true);
    });

    // Other DB tests...
});
