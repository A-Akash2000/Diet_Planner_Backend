import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';
import User from '../app/Users/Models/User';
import { decrypttest } from '../middlewares/middleware';

// Mock external dependencies
jest.mock('../utils/mailsevice');

jest.mock('../app/Users/Models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe('User API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb+srv://accmywork6:eqco4ldQO98KkyTN@cluster0.rqrgsi6.mongodb.net/HospitalManagement');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user successfully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null); // No duplicate
    (User.create as jest.Mock).mockResolvedValue({
      _id: '64abcd1234ef567890abcd12',
      email: 'newuser@example.com',
      role: 'User',
      deleted: false,
    });

    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'newuser@example.com',
        password: 'SecurePass123',
        role: 'User',
      });

    const decryptedResponse = decrypttest(response.body);
    expect(response.status).toBe(201);
    expect(decryptedResponse.message).toBe('User registered successfully');
    expect(decryptedResponse.data).toHaveProperty('_id');
    expect(decryptedResponse.data.email).toBe('newuser@example.com');
  });

  it('should return error if email already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'existing@example.com',
        password: 'TestPass123',
        role: 'User',
      });

    const decryptedResponse = decrypttest(response.body);
    expect(response.status).toBe(400);
    expect(decryptedResponse.status).toBe(false);
    expect(decryptedResponse.message).toBe('Email already exists');
  });

  it('should return error if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: '', // Missing required fields
        password: '',
      });

    const decryptedResponse = decrypttest(response.body);
    expect(response.status).toBe(400);
    expect(decryptedResponse.status).toBe(false);
    expect(decryptedResponse.message).toBe('Missing required fields');
  });

  it('should handle server errors gracefully', async () => {
    (User.findOne as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'testerror@example.com',
        password: 'Error1234',
        role: 'User',
      });

    const decryptedResponse = decrypttest(response.body);
    expect(response.status).toBe(500);
    expect(decryptedResponse.status).toBe(false);
    expect(decryptedResponse.message).toBe('Internal server error');
  });
});
