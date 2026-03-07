const request = require('supertest');
const app = require('../src/index');
const prisma = require('../src/lib/prisma');

let userToken = '';
let adminToken = '';
let taskId = null;

// ─── SETUP: Create a user and admin, get tokens ─────────────

beforeAll(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Register normal user
  await request(app)
    .post('/auth/register')
    .send({ email: 'normaluser@test.com', password: 'password123' });

  // Register admin
  await request(app)
    .post('/auth/register')
    .send({ email: 'admin@test.com', password: 'password123', role: 'ADMIN' });

  // Login to get tokens
  const userLogin = await request(app)
    .post('/auth/login')
    .send({ email: 'normaluser@test.com', password: 'password123' });

  const adminLogin = await request(app)
    .post('/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' });

  userToken = userLogin.body.token;
  adminToken = adminLogin.body.token;
});

afterAll(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

// ─── UNIT-STYLE: Auth protection ────────────────────────────

describe('Tasks - Auth Protection (Unit)', () => {

  test('1. Should block task access with no token', async () => {
    const res = await request(app).get('/tasks');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  test('2. Should block task access with invalid token', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', 'Bearer fake.token.here');

    expect(res.statusCode).toBe(401);
  });

  test('3. Should reject task creation without title', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ description: 'No title provided' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });
});

// ─── API: Full Task CRUD ─────────────────────────────────────

describe('Tasks - CRUD Operations (API)', () => {

  test('4. Should create a new task for logged-in user', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'My First Task', description: 'Test description' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('My First Task');
    expect(res.body.status).toBe('PENDING');

    taskId = res.body.id; // save for later tests
  });

  test('5. Should fetch only the user\'s own tasks', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    // Every task must belong to this user
    res.body.forEach(task => {
      expect(task.user.email).toBe('normaluser@test.com');
    });
  });

  test('6. Should update a task successfully', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'COMPLETED' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('COMPLETED');
  });

  test('7. Should prevent user from editing another user\'s task', async () => {
    // Create a task as admin
    const adminTask = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Admin Task' });

    const adminTaskId = adminTask.body.id;

    // Try to edit it as normal user
    const res = await request(app)
      .put(`/tasks/${adminTaskId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Hacked!' });

    expect(res.statusCode).toBe(403);
  });

  test('8. Admin should see ALL tasks', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    // Admin should see tasks from both users
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('9. Should delete a task successfully', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test('10. Should return 404 for non-existent task', async () => {
    const res = await request(app)
      .delete('/tasks/99999')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
  });
});