import request from 'supertest';
import { app, cleanup } from '../src/index';

describe('GET /health', () => {
  test('responds with message from server', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });
});

afterAll(() => {
  cleanup();
});
