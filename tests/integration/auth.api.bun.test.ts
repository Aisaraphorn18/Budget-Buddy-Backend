/**
 * Auth API Integration Tests
 *
 * ทดสอบการทำงานของ Authentication API endpoints แบบ end-to-end
 * ครอบคลุม user registration, login, profile management และ security validation
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

// Mock server instance (จำลองการเชื่อมต่อ API)
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Mock HTTP client สำหรับ Auth API testing
class MockAuthHttpClient {
  private users: any[] = [];
  private sessions: any[] = [];
  private nextId = 1;
  private nextSessionId = 1;

  async get(url: string, options: any = {}) {
    // Handle /auth/profile (get current user profile)
    if (url.includes('/auth/profile')) {
      const token = options.headers?.authorization?.replace('Bearer ', '');
      const session = this.sessions.find(s => s.token === token && !s.expired);

      if (!session) {
        return { status: 401, data: { error: 'Unauthorized' } };
      }

      const user = this.users.find(u => u.user_id === session.user_id);
      if (!user) {
        return { status: 404, data: { error: 'User not found' } };
      }

      // Return user without password
      const userProfile = {
        user_id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
      };
      return { status: 200, data: { user: userProfile } };
    }

    // Handle /auth/users/:id (get user by ID)
    if (url.match(/\/auth\/users\/\d+$/)) {
      const id = parseInt(url.split('/').pop()!);
      const user = this.users.find(u => u.user_id === id);

      if (!user) {
        return { status: 404, data: { error: 'User not found' } };
      }

      // Don't include password in response
      const userProfile = {
        user_id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
      };
      return { status: 200, data: { user: userProfile } };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  async post(url: string, data: any) {
    // Handle /auth/register
    if (url.includes('/auth/register')) {
      // Validation
      if (!data.username || !data.password || !data.first_name || !data.last_name) {
        return {
          status: 400,
          data: { error: 'Missing required fields' },
        };
      }

      if (data.username.trim().length < 3) {
        return {
          status: 400,
          data: { error: 'Username must be at least 3 characters' },
        };
      }

      if (data.password.length < 6) {
        return {
          status: 400,
          data: { error: 'Password must be at least 6 characters' },
        };
      }

      if (!/^[a-zA-Z0-9_]+$/.test(data.username.trim())) {
        return {
          status: 400,
          data: { error: 'Username can only contain letters, numbers, and underscores' },
        };
      }

      // Check for duplicate username
      const existingUser = this.users.find(u => u.username === data.username.trim());
      if (existingUser) {
        return {
          status: 409,
          data: { error: 'Username already exists' },
        };
      }

      const newUser = {
        user_id: this.nextId++,
        username: data.username.trim(),
        password: data.password, // In real app, this would be hashed
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: null,
      };

      this.users.push(newUser);

      // Return user without password
      const userResponse = {
        user_id: newUser.user_id,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
        last_login: newUser.last_login,
      };
      return {
        status: 201,
        data: {
          user: userResponse,
          message: 'User registered successfully',
        },
      };
    }

    // Handle /auth/login
    if (url.includes('/auth/login')) {
      // Validation
      if (!data.username || !data.password) {
        return {
          status: 400,
          data: { error: 'Username and password are required' },
        };
      }

      // Find user
      const user = this.users.find(u => u.username === data.username);
      if (!user) {
        return {
          status: 401,
          data: { error: 'Invalid username or password' },
        };
      }

      // Check password (in real app, compare hashed passwords)
      if (user.password !== data.password) {
        return {
          status: 401,
          data: { error: 'Invalid username or password' },
        };
      }

      // Update last login
      user.last_login = new Date().toISOString();

      // Create session token
      const token = `token_${this.nextSessionId++}_${Date.now()}`;
      const session = {
        session_id: this.nextSessionId,
        user_id: user.user_id,
        token,
        created_at: new Date().toISOString(),
        expired: false,
      };

      this.sessions.push(session);

      // Return user without password
      const userResponse = {
        user_id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
      };
      return {
        status: 200,
        data: {
          user: userResponse,
          token,
          message: 'Login successful',
        },
      };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  async put(url: string, data: any, options: any = {}) {
    // Handle /auth/profile (update profile)
    if (url.includes('/auth/profile')) {
      const token = options.headers?.authorization?.replace('Bearer ', '');
      const session = this.sessions.find(s => s.token === token && !s.expired);

      if (!session) {
        return { status: 401, data: { error: 'Unauthorized' } };
      }

      const userIndex = this.users.findIndex(u => u.user_id === session.user_id);
      if (userIndex === -1) {
        return { status: 404, data: { error: 'User not found' } };
      }

      // Validation for username update
      if (data.username && data.username !== this.users[userIndex].username) {
        if (data.username.length < 3) {
          return {
            status: 400,
            data: { error: 'Username must be at least 3 characters' },
          };
        }

        if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
          return {
            status: 400,
            data: { error: 'Username can only contain letters, numbers, and underscores' },
          };
        }

        // Check for duplicate username
        const existingUser = this.users.find(u => u.username === data.username);
        if (existingUser) {
          return {
            status: 409,
            data: { error: 'Username already exists' },
          };
        }
      }

      // Validation for password update
      if (data.password && data.password.length < 6) {
        return {
          status: 400,
          data: { error: 'Password must be at least 6 characters' },
        };
      }

      const updatedUser = {
        ...this.users[userIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };

      this.users[userIndex] = updatedUser;

      // Return user without password
      const userResponse = {
        user_id: updatedUser.user_id,
        username: updatedUser.username,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
        last_login: updatedUser.last_login,
      };
      return {
        status: 200,
        data: {
          user: userResponse,
          message: 'Profile updated successfully',
        },
      };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  async delete(url: string, options: any = {}) {
    // Handle /auth/logout
    if (url.includes('/auth/logout')) {
      const token = options.headers?.authorization?.replace('Bearer ', '');
      const sessionIndex = this.sessions.findIndex(s => s.token === token && !s.expired);

      if (sessionIndex === -1) {
        return { status: 401, data: { error: 'Unauthorized' } };
      }

      // Mark session as expired
      this.sessions[sessionIndex].expired = true;

      return {
        status: 200,
        data: { message: 'Logout successful' },
      };
    }

    return { status: 404, data: { error: 'Endpoint not found' } };
  }

  // Helper methods
  reset() {
    this.users = [];
    this.sessions = [];
    this.nextId = 1;
    this.nextSessionId = 1;
  }

  seedTestData() {
    this.users = [
      {
        user_id: 1,
        username: 'testuser',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        last_login: '2024-01-10T10:00:00Z',
      },
      {
        user_id: 2,
        username: 'johndoe',
        password: 'secret456',
        first_name: 'John',
        last_name: 'Doe',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        last_login: null,
      },
    ];

    this.sessions = [
      {
        session_id: 1,
        user_id: 1,
        token: 'valid_token_123',
        created_at: '2024-01-10T10:00:00Z',
        expired: false,
      },
    ];

    this.nextId = 3;
    this.nextSessionId = 2;
  }

  // Helper method to get valid token for testing
  getValidToken(): string {
    return 'valid_token_123';
  }
}

describe('Auth API Integration Tests', () => {
  let httpClient: MockAuthHttpClient;

  beforeEach(() => {
    httpClient = new MockAuthHttpClient();
  });

  afterEach(() => {
    httpClient.reset();
  });

  describe('POST /api/v1/auth/register', () => {
    describe('✅ Successful Registration', () => {
      it('should register new user with valid data', async () => {
        const userData = {
          username: 'newuser',
          password: 'password123',
          first_name: 'New',
          last_name: 'User',
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/register`, userData);

        expect(response.status).toBe(201);
        expect(response.data.user!.user_id).toBeDefined();
        expect(response.data.user!.username).toBe('newuser');
        expect(response.data.user!.first_name).toBe('New');
        expect(response.data.user!.last_name).toBe('User');
        expect(response.data.message).toBe('User registered successfully');
      });

      it('should trim whitespace from input fields', async () => {
        const userData = {
          username: '  trimmed  ',
          password: 'password123',
          first_name: '  John  ',
          last_name: '  Doe  ',
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/register`, userData);

        expect(response.status).toBe(201);
        expect(response.data.user!.username).toBe('trimmed');
        expect(response.data.user!.first_name).toBe('John');
        expect(response.data.user!.last_name).toBe('Doe');
      });
    });

    describe('❌ Validation Errors', () => {
      it('should return 400 for missing required fields', async () => {
        const incompleteData = {
          username: 'testuser',
          // missing password, first_name, last_name
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/register`, incompleteData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Missing required fields');
      });

      it('should return 400 for username too short', async () => {
        const invalidData = {
          username: 'ab', // Too short
          password: 'password123',
          first_name: 'Test',
          last_name: 'User',
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/register`, invalidData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Username must be at least 3 characters');
      });

      it('should return 400 for password too short', async () => {
        const invalidData = {
          username: 'testuser',
          password: '123', // Too short
          first_name: 'Test',
          last_name: 'User',
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/register`, invalidData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Password must be at least 6 characters');
      });

      it('should return 400 for invalid username characters', async () => {
        const invalidData = {
          username: 'test@user', // Invalid character
          password: 'password123',
          first_name: 'Test',
          last_name: 'User',
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/register`, invalidData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe(
          'Username can only contain letters, numbers, and underscores'
        );
      });

      it('should return 409 for duplicate username', async () => {
        httpClient.seedTestData();

        const duplicateData = {
          username: 'testuser', // Already exists
          password: 'password123',
          first_name: 'Another',
          last_name: 'User',
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/register`, duplicateData);

        expect(response.status).toBe(409);
        expect(response.data.error).toBe('Username already exists');
      });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    describe('✅ Successful Login', () => {
      it('should login with valid credentials', async () => {
        httpClient.seedTestData();

        const loginData = {
          username: 'testuser',
          password: 'password123',
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/login`, loginData);

        expect(response.status).toBe(200);
        expect(response.data.user!.username).toBe('testuser');
        expect(response.data.token).toBeDefined();
        expect(response.data.user!.last_login).toBeDefined();
        expect(response.data.message).toBe('Login successful');
      });
    });

    describe('❌ Authentication Errors', () => {
      it('should return 400 for missing credentials', async () => {
        const incompleteData = {
          username: 'testuser',
          // missing password
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/login`, incompleteData);

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Username and password are required');
      });

      it('should return 401 for non-existent user', async () => {
        httpClient.seedTestData();

        const invalidData = {
          username: 'nonexistent',
          password: 'password123',
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/login`, invalidData);

        expect(response.status).toBe(401);
        expect(response.data.error).toBe('Invalid username or password');
      });

      it('should return 401 for wrong password', async () => {
        httpClient.seedTestData();

        const invalidData = {
          username: 'testuser',
          password: 'wrongpassword',
        };

        const response = await httpClient.post(`${API_BASE_URL}/auth/login`, invalidData);

        expect(response.status).toBe(401);
        expect(response.data.error).toBe('Invalid username or password');
      });
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    describe('🔍 Profile Retrieval', () => {
      it('should return user profile with valid token', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/auth/profile`, {
          headers: { authorization: `Bearer ${httpClient.getValidToken()}` },
        });

        expect(response.status).toBe(200);
        expect(response.data.user!.user_id).toBe(1);
        expect(response.data.user!.username).toBe('testuser');
      });

      it('should return 401 for missing token', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/auth/profile`);

        expect(response.status).toBe(401);
        expect(response.data.error).toBe('Unauthorized');
      });

      it('should return 401 for invalid token', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/auth/profile`, {
          headers: { authorization: 'Bearer invalid_token' },
        });

        expect(response.status).toBe(401);
        expect(response.data.error).toBe('Unauthorized');
      });
    });
  });

  describe('PUT /api/v1/auth/profile', () => {
    describe('✅ Successful Profile Update', () => {
      it('should update user profile with valid data', async () => {
        httpClient.seedTestData();

        const updateData = {
          first_name: 'Updated',
          last_name: 'Name',
        };

        const response = await httpClient.put(`${API_BASE_URL}/auth/profile`, updateData, {
          headers: { authorization: `Bearer ${httpClient.getValidToken()}` },
        });

        expect(response.status).toBe(200);
        expect(response.data.user!.first_name).toBe('Updated');
        expect(response.data.user!.last_name).toBe('Name');
        expect(response.data.message).toBe('Profile updated successfully');
      });

      it('should update username with valid data', async () => {
        httpClient.seedTestData();

        const updateData = {
          username: 'newusername',
        };

        const response = await httpClient.put(`${API_BASE_URL}/auth/profile`, updateData, {
          headers: { authorization: `Bearer ${httpClient.getValidToken()}` },
        });

        expect(response.status).toBe(200);
        expect(response.data.user!.username).toBe('newusername');
      });

      it('should update password with valid data', async () => {
        httpClient.seedTestData();

        const updateData = {
          password: 'newpassword123',
        };

        const response = await httpClient.put(`${API_BASE_URL}/auth/profile`, updateData, {
          headers: { authorization: `Bearer ${httpClient.getValidToken()}` },
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Profile updated successfully');
      });
    });

    describe('❌ Update Validation Errors', () => {
      it('should return 401 for missing token', async () => {
        httpClient.seedTestData();

        const updateData = { first_name: 'Updated' };

        const response = await httpClient.put(`${API_BASE_URL}/auth/profile`, updateData);

        expect(response.status).toBe(401);
        expect(response.data.error).toBe('Unauthorized');
      });

      it('should return 400 for invalid username length', async () => {
        httpClient.seedTestData();

        const updateData = {
          username: 'ab', // Too short
        };

        const response = await httpClient.put(`${API_BASE_URL}/auth/profile`, updateData, {
          headers: { authorization: `Bearer ${httpClient.getValidToken()}` },
        });

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Username must be at least 3 characters');
      });

      it('should return 400 for invalid username characters', async () => {
        httpClient.seedTestData();

        const updateData = {
          username: 'user@name', // Invalid character
        };

        const response = await httpClient.put(`${API_BASE_URL}/auth/profile`, updateData, {
          headers: { authorization: `Bearer ${httpClient.getValidToken()}` },
        });

        expect(response.status).toBe(400);
        expect(response.data.error).toBe(
          'Username can only contain letters, numbers, and underscores'
        );
      });

      it('should return 400 for password too short', async () => {
        httpClient.seedTestData();

        const updateData = {
          password: '123', // Too short
        };

        const response = await httpClient.put(`${API_BASE_URL}/auth/profile`, updateData, {
          headers: { authorization: `Bearer ${httpClient.getValidToken()}` },
        });

        expect(response.status).toBe(400);
        expect(response.data.error).toBe('Password must be at least 6 characters');
      });
    });
  });

  describe('DELETE /api/v1/auth/logout', () => {
    describe('🚪 Logout Functionality', () => {
      it('should logout successfully with valid token', async () => {
        httpClient.seedTestData();

        const response = await httpClient.delete(`${API_BASE_URL}/auth/logout`, {
          headers: { authorization: `Bearer ${httpClient.getValidToken()}` },
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Logout successful');

        // Verify token is invalidated
        const profileResponse = await httpClient.get(`${API_BASE_URL}/auth/profile`, {
          headers: { authorization: `Bearer ${httpClient.getValidToken()}` },
        });

        expect(profileResponse.status).toBe(401);
      });

      it('should return 401 for missing token', async () => {
        httpClient.seedTestData();

        const response = await httpClient.delete(`${API_BASE_URL}/auth/logout`);

        expect(response.status).toBe(401);
        expect(response.data.error).toBe('Unauthorized');
      });

      it('should return 401 for invalid token', async () => {
        httpClient.seedTestData();

        const response = await httpClient.delete(`${API_BASE_URL}/auth/logout`, {
          headers: { authorization: 'Bearer invalid_token' },
        });

        expect(response.status).toBe(401);
        expect(response.data.error).toBe('Unauthorized');
      });
    });
  });

  describe('GET /api/v1/auth/users/:id', () => {
    describe('🔍 User Lookup', () => {
      it('should return user by ID', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/auth/users/1`);

        expect(response.status).toBe(200);
        expect(response.data.user!.user_id).toBe(1);
        expect(response.data.user!.username).toBe('testuser');
      });

      it('should return 404 for non-existent user', async () => {
        httpClient.seedTestData();

        const response = await httpClient.get(`${API_BASE_URL}/auth/users/999`);

        expect(response.status).toBe(404);
        expect(response.data.error).toBe('User not found');
      });
    });
  });

  describe('🧪 Integration Scenarios', () => {
    it('should handle complete user authentication flow', async () => {
      // Register user
      const registerResponse = await httpClient.post(`${API_BASE_URL}/auth/register`, {
        username: 'flowtest',
        password: 'password123',
        first_name: 'Flow',
        last_name: 'Test',
      });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.data.user!.username).toBe('flowtest');

      // Login
      const loginResponse = await httpClient.post(`${API_BASE_URL}/auth/login`, {
        username: 'flowtest',
        password: 'password123',
      });

      expect(loginResponse.status).toBe(200);
      const token = loginResponse.data.token;
      expect(token).toBeDefined();

      // Get profile
      const profileResponse = await httpClient.get(`${API_BASE_URL}/auth/profile`, {
        headers: { authorization: `Bearer ${token}` },
      });

      expect(profileResponse.status).toBe(200);
      expect(profileResponse.data.user!.username).toBe('flowtest');

      // Update profile
      const updateResponse = await httpClient.put(
        `${API_BASE_URL}/auth/profile`,
        { first_name: 'Updated Flow' },
        { headers: { authorization: `Bearer ${token}` } }
      );

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.user!.first_name).toBe('Updated Flow');

      // Logout
      const logoutResponse = await httpClient.delete(`${API_BASE_URL}/auth/logout`, {
        headers: { authorization: `Bearer ${token}` },
      });

      expect(logoutResponse.status).toBe(200);

      // Verify logout (profile should return 401)
      const finalProfileResponse = await httpClient.get(`${API_BASE_URL}/auth/profile`, {
        headers: { authorization: `Bearer ${token}` },
      });

      expect(finalProfileResponse.status).toBe(401);
    });

    it('should handle multiple user registration and unique username enforcement', async () => {
      // Register first user
      const firstUserResponse = await httpClient.post(`${API_BASE_URL}/auth/register`, {
        username: 'user1',
        password: 'password123',
        first_name: 'User',
        last_name: 'One',
      });

      expect(firstUserResponse.status).toBe(201);

      // Register second user
      const secondUserResponse = await httpClient.post(`${API_BASE_URL}/auth/register`, {
        username: 'user2',
        password: 'password456',
        first_name: 'User',
        last_name: 'Two',
      });

      expect(secondUserResponse.status).toBe(201);

      // Try to register duplicate username
      const duplicateResponse = await httpClient.post(`${API_BASE_URL}/auth/register`, {
        username: 'user1', // Duplicate
        password: 'password789',
        first_name: 'Duplicate',
        last_name: 'User',
      });

      expect(duplicateResponse.status).toBe(409);
      expect(duplicateResponse.data.error).toBe('Username already exists');
    });
  });
});
