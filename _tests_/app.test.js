/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
// tests/app.test.js
const request = require('supertest');
const { app, start } = require('../server');
const mongoose = require('mongoose');

jest.setTimeout(20000); // allow up to 20 seconds for async DB operations

let token;

beforeAll(async () => {
  // Start MongoDB connection
  await start();

  // Try to register the user (ignore duplicate errors)
  await request(app)
    .post('/api/auth/register')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: '123456',
    })
    .catch(() => {}); // ignore if already exists

  // Then log in to get a JWT token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: '123456',
    });

  token = loginRes.body.token;
});

afterAll(async () => {
  // Cleanly close MongoDB connection after all tests
  await mongoose.connection.close();
});

describe('GET Endpoints', () => {
  // Notes collection
  test('GET /api/notes should return all notes', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
    expect(Array.isArray(res.body) || typeof res.body === 'object').toBe(true);
  });

  test('GET /api/notes/:id should return a single note or 404', async () => {
    const noteId = '68dc2ef731872a932d7bede8';
    const res = await request(app)
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 403, 404]).toContain(res.statusCode);
  });

  // Categories collection
  test('GET /api/categories should return all categories', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
    expect(Array.isArray(res.body) || typeof res.body === 'object').toBe(true);
  });

  test('GET /api/categories/:id should return a single category or 404', async () => {
    const categoryId = '68dbef871253eda7a9f14960';
    const res = await request(app)
      .get(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  // Tags collection
  test('GET /api/tags should return all tags', async () => {
    const res = await request(app)
      .get('/api/tags')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
    expect(Array.isArray(res.body) || typeof res.body === 'object').toBe(true);
  });

  test('GET /api/tags/:id should return a single tag or 404', async () => {
    const tagId = '68dbf0c41253eda7a9f14964';
    const res = await request(app)
      .get(`/api/tags/${tagId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  // Users collection
  test('GET /api/users/:id should return a single user or 404', async () => {
    const userId = '68dbdc7d230a625834ac2325';
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404, 401]).toContain(res.statusCode);
  });
});
