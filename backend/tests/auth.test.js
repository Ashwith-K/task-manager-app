const request = require('supertest');
const app = require('../src/index');

// ─── UNIT-STYLE TESTS ───────────────────────────────────────

describe('Auth - Input Validation (Unit)', () => {
  
  test('1. Should reject registration with missing email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ password: '123456' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('2. Should reject registration with missing password', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'nopass@test.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('3. Should reject password shorter than 6 characters', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'short@test.com', password: '123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/6 characters/i);
  });
});

// ─── API INTEGRATION TESTS ──────────────────────────────────

describe('Auth - Register & Login (API)', () => {

  test('4. Should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'user@test.com', password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
    expect(res.body.message).toMatch(/registered/i);
  });

  test('5. Should reject duplicate email registration', async () => {
    // Register same email again
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'user@test.com', password: 'password123' });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already registered/i);
  });

  test('6. Should login and return a JWT token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('user@test.com');
  });

  test('7. Should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'user@test.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  test('8. Should reject login for non-existent user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'ghost@test.com', password: 'password123' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});