import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';

describe.each(['/v2/reseller/octo/supplier', '/reseller/octo/supplier'])('GET %s', (path) => {
  const server = app.listen();

  afterAll(() => {
    server.close();
  });

  it('responds 401 when the Authorization header is missing', async () => {
    const response = await request(server).get(path).send();

    expect(response.status).toBe(401);
    expect(response.body.errorMessage).toContain('Authorization header');
  });

  it('responds 401 when the session in the Authorization header does not exist', async () => {
    const response = await request(server).get(path).set('Authorization', `Bearer ${randomUUID()}`).send();

    expect(response.status).toBe(401);
    expect(response.body.errorMessage).toContain('invalid');
  });
});
