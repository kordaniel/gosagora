import type { Express } from 'express';
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

  describe('CORS in development environment', () => {
    const OLD_ENV = process.env;
    let devApp: Express | undefined = undefined;

    beforeAll(() => {
      jest.resetModules();
      process.env = {
        ...OLD_ENV,
        NODE_ENV: 'test-production',
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
      devApp = require('../src/app').default;

      consoleSpy.mockRestore();
    });

    afterAll(() => {
      process.env = OLD_ENV;
    });

    test('Request succeeds from whitelisted origin', async () => {
      const origin = 'http://localhost:8081/';
      const res = await supertest(devApp!)
        .get('/healthcheck')
        .set('Origin', origin)
        .expect(200);

      expect(res.headers['access-control-allow-origin']).toEqual(origin);
      expect(res.text).toEqual('OK');
    });

    test('Request from unknown origin returns 403', async () => {
      const origin = 'http://bad.unknown.url.com/';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());

      const res = await supertest(devApp!)
        .get('/healthcheck')
        .set('Origin', origin)
        .expect(403)
        .expect('Content-Type', /application\/json/);

      expect(consoleSpy.mock.calls[0][1]).toEqual(`CorsError: status 403. Request has been blocked by CORS policy. Origin: '${origin}'`);
      consoleSpy.mockRestore();

      expect(res.body).toEqual({
        status: 403,
        error: {
          message: 'Request has been blocked by CORS policy',
          origin,
        },
      });
    });

  }); // CORS in development environment

}); // App
