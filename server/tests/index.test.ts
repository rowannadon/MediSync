import request from 'supertest';
import app from '../src/index';

describe('GET /test', () => {
  test('responds with message from server', async () => {
    const response = await request(app).get('/test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      test: 'This is a response from the server!',
    });
  });
});

describe('GET /health', () => {
  test('responds with message from server', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });
});
