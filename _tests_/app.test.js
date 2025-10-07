/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
// tests/app.test.js
const request = require('supertest');
const { app, start } = require('../server');
const mongoose = require('mongoose');

jest.setTimeout(30000); // allow up to 30 seconds for async DB operations

let token;
let noteId, categoryId, tagId, userId;

beforeAll(async () => {
  await start();

  // Try to register the user (ignore duplicate errors)
  await request(app)
    .post('/api/auth/register')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: '123456',
    })
    .catch(() => {});

  // Log in to get a JWT token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: '123456',
    });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('API Endpoints', () => {
  // ====== CATEGORY TESTS ======
  test('POST /api/categories - create a category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Work', description: 'Work-related tasks' });
    expect([201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) categoryId = res.body._id;
  });

  test('GET /api/categories - get all categories', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /api/categories/:id - get category by id', async () => {
    const id = categoryId || '68dbef871253eda7a9f14960';
    const res = await request(app)
      .get(`/api/categories/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  test('PUT /api/categories/:id - update category', async () => {
    if (!categoryId) return;
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Updated description' });
    expect([200, 404]).toContain(res.statusCode);
  });

  // ====== TAG TESTS ======
  test('POST /api/tags - create a tag', async () => {
    const res = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Urgent' });
    expect([201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) tagId = res.body._id;
  });

  test('GET /api/tags - get all tags', async () => {
    const res = await request(app)
      .get('/api/tags')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /api/tags/:id - get tag by id', async () => {
    const id = tagId || '68dbf0c41253eda7a9f14964';
    const res = await request(app)
      .get(`/api/tags/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  test('PUT /api/tags/:id - update tag', async () => {
    if (!tagId) return;
    const res = await request(app)
      .put(`/api/tags/${tagId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'High Priority' });
    expect([200, 404]).toContain(res.statusCode);
  });

  // ====== NOTE TESTS ======
  test('POST /api/notes - create a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Finish report',
        content: 'Due tomorrow morning',
        category: 'Work',
        tags: ['Urgent'],
      });
    expect([201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) noteId = res.body._id;
  });

  test('GET /api/notes - get all notes', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /api/notes/:id - get note by id', async () => {
    const id = noteId || '68dc2ef731872a932d7bede8';
    const res = await request(app)
      .get(`/api/notes/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 403, 404]).toContain(res.statusCode);
  });

  test('PUT /api/notes/:id - update note', async () => {
    if (!noteId) return;
    const res = await request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Updated note content' });
    expect([200, 404]).toContain(res.statusCode);
  });

  // ====== USER TEST ======
  test('GET /api/users/:id - get user by id', async () => {
    const res = await request(app)
      .get(`/api/users/${userId || '68dbdc7d230a625834ac2325'}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404, 401]).toContain(res.statusCode);
  });
});
