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

describe('POST /time', () => {
  test('save time', async () => {
    const response = await request(app).post('/time').send({ time: '6:00 AM' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ time: '6:00 AM' });
  });
});

describe('POST /time', () => {
  test('get saved time', async () => {
    const time = new Date().toLocaleTimeString();
    const response1 = await request(app).post('/time').send({ time: time });
    const response = await request(app).get('/time');
    expect(response.statusCode).toBe(200);
    expect(response.body.time.map((time: any) => time.msg)).toContainEqual(
      time,
    );
  });
});
