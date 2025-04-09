import supertest from 'supertest';
import app from '../src/app';

const api = supertest(app);

describe('App', () => {

  test('GET /healthcheck returns status 200 OK', async () => {
    const res = await api
      .get('/healthcheck')
      .expect(200)
      .expect('Content-Type', /text\/plain; charset=utf-8/);

    expect(res.text).toEqual('OK');
  });

  test('GET invalid endpoint returns status 404', async () => {
    const invalidPath = '/checkhealth';
    const res = await api
      .get(invalidPath)
      .expect(404)
      .expect('Content-Type', /application\/json/);

    expect(res.body).toEqual({
      status: 404,
      error: {
        message: 'unknown endpoint',
        path: invalidPath,
      },
    });
  });

  test('POST misformatted json returns status 400', async () => {
    const misformattedJsonStr = '{"foor":"bar",,"baz":"error"}';
    const res = await api
      .post('/')
      .set('Content-Type', 'application/json')
      .send(misformattedJsonStr)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body).toEqual({
      status: 400,
      error: {
        message: 'Expected double-quoted property name in JSON at position 14',
        body: misformattedJsonStr
      },
    });
  });

}); // App
