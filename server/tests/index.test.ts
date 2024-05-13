import request from 'supertest';
import { app, cleanup } from '../src/index';
import { procedures, stageTemplates } from '../src/initialData';
import { PathwayTemplate, StageTemplate } from '../src/DataTypes';
import axios from 'axios';

let token: string = '';
beforeAll(async () => {
  // delay starting tests to allow server to start
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const res = await axios.post('http://localhost:3001/login', {
    username: 'test3',
    password: 'test3',
  });
  token = res.data.accessToken;
});

describe('GET /health', () => {
  test('responds with message from server', async () => {
    const response = await request(app)
      .get('/health')
      .set('Authorization', 'Bearer ' + token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });
});

describe('GET /pathwayTemplates', () => {
  test('responds with all pathway templates', async () => {
    const response = await request(app)
      .get('/pathwayTemplates')
      .set('Authorization', 'Bearer ' + token);
    expect(response.statusCode).toBe(200);
    response.body.forEach((procedure: PathwayTemplate, index: number) => {
      expect(procedure).toMatchObject(procedures[index]);
    });
  });
});

describe('POST /pathwayTemplates', () => {
  test('responds with the newly created pathway template', async () => {
    const newProcedure: PathwayTemplate = {
      id: 'test-id',
      title: 'newTitle',
      desc: 'newDesc',
      stages: [],
    };
    const response = await request(app)
      .post('/pathwayTemplates')
      .set('Authorization', 'Bearer ' + token)
      .send(newProcedure);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(newProcedure);
  });
});

describe('PUT /pathwayTemplates/:id', () => {
  test('responds with the id of the updated pathway template', async () => {
    const updatedProcedure: PathwayTemplate = {
      id: 'test-id',
      title: 'updatedTitle',
      desc: 'updatedDesc',
      stages: [],
    };
    const response = await request(app)
      .put('/pathwayTemplates/test-id')
      .set('Authorization', 'Bearer ' + token)
      .send(updatedProcedure);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual('test-id');

    const template = await request(app)
      .get('/pathwayTemplates/test-id')
      .set('Authorization', 'Bearer ' + token);
    expect(template.body).toMatchObject(updatedProcedure);
  });
});

describe('DELETE /pathwayTemplates/:id', () => {
  test('responds with the id of the deleted pathway template', async () => {
    const response = await request(app)
      .delete('/pathwayTemplates/test-id')
      .set('Authorization', 'Bearer ' + token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual('test-id');

    const all = await request(app)
      .get('/pathwayTemplates')
      .set('Authorization', 'Bearer ' + token);
    expect(all.body).not.toContainEqual({ id: 'test-id' });
  });
});

describe('GET /stageTemplates', () => {
  test('responds with all stage templates', async () => {
    const response = await request(app)
      .get('/stageTemplates')
      .set('Authorization', 'Bearer ' + token);
    expect(response.statusCode).toBe(200);
    response.body.forEach((stage: PathwayTemplate, index: number) => {
      expect(stage).toMatchObject(stageTemplates[index]);
    });
  });
});

describe('POST /stageTemplates', () => {
  test('responds with the newly created stage template', async () => {
    const newStage: StageTemplate = {
      id: 'test-stage-id',
      name: 'newName',
      desc: 'newDesc',
      type: 'misc',
      required_staff: [],
      required_room: 'test-room',
      required_equipment: [],
      outputs: ['Scheduled'],
      durationEstimate: 10,
    };
    const response = await request(app)
      .post('/stageTemplates')
      .set('Authorization', 'Bearer ' + token)
      .send(newStage);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(newStage);
  });
});

describe('PUT /stageTemplates/:id', () => {
  test('responds with the id of the updated stage template', async () => {
    const updatedStage: StageTemplate = {
      id: 'test-stage-id',
      name: 'updatedName',
      desc: 'updatedDesc',
      type: 'misc',
      required_staff: [],
      required_room: 'test-room',
      required_equipment: [],
      outputs: ['Scheduled'],
      durationEstimate: 10,
    };
    const response = await request(app)
      .put('/stageTemplates/test-stage-id')
      .set('Authorization', 'Bearer ' + token)
      .send(updatedStage);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual('test-stage-id');

    const template = await request(app)
      .get('/stageTemplates/test-stage-id')
      .set('Authorization', 'Bearer ' + token);
    expect(template.body).toMatchObject(updatedStage);
  });
});

describe('DELETE /stageTemplates/:id', () => {
  test('responds with the id of the deleted stage template', async () => {
    const response = await request(app)
      .delete('/stageTemplates/test-stage-id')
      .set('Authorization', 'Bearer ' + token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual('test-stage-id');

    const all = await request(app)
      .get('/stageTemplates')
      .set('Authorization', 'Bearer ' + token);
    expect(all.body).not.toContainEqual({ id: 'test-stage-id' });
  });
});

afterAll(async () => {
  await cleanup();
});
