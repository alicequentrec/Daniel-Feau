const request = require('supertest');
const app = require('./index');
const token = "";

describe('API Tests', () => {
  it('should return "Hello World" on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World');
  });

  it('should return success message and token on POST /api/login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBe('Login successful');
    expect(response.body.token).toBeDefined();
  });

  it('should return error message on POST /api/login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe('Invalid email or password');
  });

  it('should return success message on POST /api/register with valid credentials', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ username: 'testuser', registerEmail: 'test@example.com', registerPassword: 'password123' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBe('register successful');
  });

  it('should return error message on POST /api/register with existing email', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ username: 'testuser', registerEmail: 'test@example.com', registerPassword: 'password123' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe('Email already exists');
  });

  it('should return error message on POST /api/register with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ username: 'testuser', registerEmail: 'test@example.com', registerPassword: 'pw' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe('Error while registering');
  });

  it('should return 403 status and error message on protected route without token', async () => {
    const response = await request(app).get('/api/shopping');
    expect(response.status).toBe(403);
    expect(response.body.auth).toBe(false);
    expect(response.body.message).toBe('No token provided.');
  });

  it('should return 500 status and error message on protected route with invalid token', async () => {
    const response = await request(app)
      .get('/api/shopping')
      .set('x-access-token', 'invalidtoken');
    expect(response.status).toBe(500);
    expect(response.body.auth).toBe(false);
    expect(response.body.message).toBe('Failed to authenticate token.');
  });

  it('should return 200 status on protected route with valid token', async () => {
    const response = await request(app)
      .get('/api/shopping')
      .set('x-access-token', 'validtoken');
    expect(response.status).toBe(200);
    // Add more assertions as needed
  });
});