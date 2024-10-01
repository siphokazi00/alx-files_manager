const { userQueue } = require('../worker');

describe('User Queue', () => {
    it('should process welcome email job', async () => {
        const job = await userQueue.add({ userId: 'someUserId' });
    });
});
