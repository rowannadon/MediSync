import request from 'supertest';
import { app, cleanup } from '../src/index';
import { procedures } from '../src/initialData';

describe('GET /health', () => {
  test('responds with message from server', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });
});

describe('GET /pathwayTemplates', () => {
  test('responds with all pathway templates', async () => {
    const response = await request(app).get('/pathwayTemplates');
    expect(response.statusCode).toBe(200);
    //expect(response.body).toEqual(procedures);
  });
});

afterAll(async () => {
  console.log('done testing');
});
