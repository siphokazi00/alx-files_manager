const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
    it('GET /status should return status 200', async () => {
        const res = await request(app).get('/status');
        expect(res.statusCode).toEqual(200);
    });

    it('POST /users should create a user', async () => {
        const res = await request(app).post('/users').send({ email: 'test@example.com', password: '123456' });
        expect(res.statusCode).toEqual(201);
    });
});
