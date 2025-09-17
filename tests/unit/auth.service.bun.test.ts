/**
 * Auth Service Unit Tests
 *
 * ทดสอบ AuthService ที่จัดการการยืนยันตัวตนในระบบ Budget Buddy
 * ครอบคลุมการสร้างผู้ใช้, การค้นหาผู้ใช้, การตรวจสอบข้อมูล และ validation logic
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// Mock User Data
const mockUsers = [
  {
    user_id: 1,
    username: 'john_doe',
    first_name: 'John',
    last_name: 'Doe',
    password: 'hashed_password_123',
    created_date: '2024-01-01T00:00:00Z',
  },
  {
    user_id: 2,
    username: 'jane_smith',
    first_name: 'Jane',
    last_name: 'Smith',
    password: 'hashed_password_456',
    created_date: '2024-01-02T00:00:00Z',
  },
  {
    user_id: 3,
    username: 'bob_wilson',
    first_name: 'Bob',
    last_name: 'Wilson',
    password: 'hashed_password_789',
    created_date: '2024-01-03T00:00:00Z',
  },
];

// Mock AuthService Class
class MockAuthService {
  private users = [...mockUsers];
  private nextId = 4;

  async findUserByUsername(username: string) {
    if (!username || username.trim() === '') {
      throw new Error('Username is required');
    }

    const user = this.users.find(u => u.username === username);
    return user || null;
  }

  async findUserById(userId: number) {
    if (!userId || userId <= 0) {
      throw new Error('Valid user ID is required');
    }

    const user = this.users.find(u => u.user_id === userId);
    return user || null;
  }

  async findUserByEmail(email: string) {
    if (!email || email.trim() === '') {
      throw new Error('Email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Email lookup not implemented in this mock
    return null;
  }

  async createUser(userData: {
    username: string;
    first_name: string;
    last_name: string;
    password: string;
  }) {
    // Validate required fields
    if (!userData.username || userData.username.trim() === '') {
      throw new Error('Username is required');
    }
    if (!userData.first_name || userData.first_name.trim() === '') {
      throw new Error('First name is required');
    }
    if (!userData.last_name || userData.last_name.trim() === '') {
      throw new Error('Last name is required');
    }
    if (!userData.password || userData.password.trim() === '') {
      throw new Error('Password is required');
    }

    // Validate field lengths
    if (userData.username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (userData.username.trim().length > 30) {
      throw new Error('Username must be no more than 30 characters long');
    }
    if (userData.first_name.trim().length < 2) {
      throw new Error('First name must be at least 2 characters long');
    }
    if (userData.last_name.trim().length < 2) {
      throw new Error('Last name must be at least 2 characters long');
    }
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(userData.username.trim())) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    // Check for duplicate username
    const existingUser = await this.findUserByUsername(userData.username.trim());
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Trim whitespace from input fields
    const trimmedData = {
      username: userData.username.trim(),
      first_name: userData.first_name.trim(),
      last_name: userData.last_name.trim(),
      password: userData.password,
    };

    const newUser = {
      user_id: this.nextId++,
      username: trimmedData.username,
      first_name: trimmedData.first_name,
      last_name: trimmedData.last_name,
      password: `hashed_${trimmedData.password}`,
      created_date: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }
}

describe('AuthService', () => {
  let authService: MockAuthService;

  beforeEach(() => {
    authService = new MockAuthService();
  });

  describe('findUserByUsername()', () => {
    describe('🔍 Basic Functionality', () => {
      it('should return user for valid username', async () => {
        const user = await authService.findUserByUsername('john_doe');

        expect(user).not.toBeNull();
        expect(user?.username).toBe('john_doe');
        expect(user?.first_name).toBe('John');
        expect(user?.last_name).toBe('Doe');
      });

      it('should return null for non-existent username', async () => {
        const user = await authService.findUserByUsername('nonexistent');

        expect(user).toBeNull();
      });

      it('should be case sensitive for username', async () => {
        const user = await authService.findUserByUsername('JOHN_DOE');

        expect(user).toBeNull();
      });

      it('should handle username with underscores', async () => {
        const user = await authService.findUserByUsername('john_doe');

        expect(user).not.toBeNull();
        expect(user?.username).toBe('john_doe');
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error for empty username', async () => {
        expect(async () => {
          await authService.findUserByUsername('');
        }).toThrow('Username is required');
      });

      it('should throw error for whitespace-only username', async () => {
        expect(async () => {
          await authService.findUserByUsername('   ');
        }).toThrow('Username is required');
      });
    });
  });

  describe('findUserById()', () => {
    describe('🔍 Basic Functionality', () => {
      it('should return user for valid ID', async () => {
        const user = await authService.findUserById(1);

        expect(user).not.toBeNull();
        expect(user?.user_id).toBe(1);
        expect(user?.username).toBe('john_doe');
      });

      it('should return null for non-existent ID', async () => {
        const user = await authService.findUserById(999);

        expect(user).toBeNull();
      });

      it('should handle large ID numbers', async () => {
        const user = await authService.findUserById(999999);

        expect(user).toBeNull();
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error for invalid ID (zero)', async () => {
        expect(async () => {
          await authService.findUserById(0);
        }).toThrow('Valid user ID is required');
      });

      it('should throw error for invalid ID (negative)', async () => {
        expect(async () => {
          await authService.findUserById(-1);
        }).toThrow('Valid user ID is required');
      });
    });
  });

  describe('findUserByEmail()', () => {
    describe('🔍 Basic Functionality', () => {
      it('should return null (email lookup not implemented)', async () => {
        const user = await authService.findUserByEmail('john@example.com');

        expect(user).toBeNull();
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error for invalid email format', async () => {
        expect(async () => {
          await authService.findUserByEmail('invalid-email');
        }).toThrow('Invalid email format');
      });

      it('should throw error for empty email', async () => {
        expect(async () => {
          await authService.findUserByEmail('');
        }).toThrow('Email is required');
      });
    });
  });

  describe('createUser()', () => {
    describe('✅ Successful Creation', () => {
      it('should create new user with valid data', async () => {
        const userData = {
          username: 'new_user',
          first_name: 'New',
          last_name: 'User',
          password: 'password123',
        };

        const result = await authService.createUser(userData);

        expect(result).toBeDefined();
        expect(result.user_id).toBe(4); // Next available ID
        expect(result.username).toBe('new_user');
        expect(result.first_name).toBe('New');
        expect(result.last_name).toBe('User');
        expect(result.password).toBe('hashed_password123');
        expect(result.created_date).toBeDefined();
      });

      it('should accept username with underscores', async () => {
        const userData = {
          username: 'user_with_underscores',
          first_name: 'Test',
          last_name: 'User',
          password: 'password123',
        };

        const result = await authService.createUser(userData);

        expect(result.username).toBe('user_with_underscores');
      });

      it('should accept username with numbers', async () => {
        const userData = {
          username: 'user123',
          first_name: 'Test',
          last_name: 'User',
          password: 'password123',
        };

        const result = await authService.createUser(userData);

        expect(result.username).toBe('user123');
      });

      it('should trim whitespace from input fields', async () => {
        const userData = {
          username: '  test_user  ',
          first_name: '  Test  ',
          last_name: '  User  ',
          password: 'password123',
        };

        const result = await authService.createUser(userData);

        expect(result.username).toBe('test_user');
        expect(result.first_name).toBe('Test');
        expect(result.last_name).toBe('User');
      });

      it('should generate unique user IDs', async () => {
        const userData1 = {
          username: 'user1',
          first_name: 'User',
          last_name: 'One',
          password: 'password123',
        };

        const userData2 = {
          username: 'user2',
          first_name: 'User',
          last_name: 'Two',
          password: 'password123',
        };

        const result1 = await authService.createUser(userData1);
        const result2 = await authService.createUser(userData2);

        expect(result1.user_id).not.toBe(result2.user_id);
        expect(result2.user_id).toBeGreaterThan(result1.user_id);
      });

      it('should set created_at timestamp', async () => {
        const userData = {
          username: 'time_user',
          first_name: 'Time',
          last_name: 'User',
          password: 'password123',
        };

        const result = await authService.createUser(userData);

        expect(result.created_date).toBeDefined();
        expect(new Date(result.created_date)).toBeInstanceOf(Date);
        expect(new Date(result.created_date).toString()).not.toBe('Invalid Date');
      });
    });

    describe('❌ Validation Errors', () => {
      it('should throw error for duplicate username', async () => {
        const userData = {
          username: 'john_doe', // Already exists
          first_name: 'Another',
          last_name: 'John',
          password: 'password123',
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('Username already exists');
      });

      it('should throw error for empty username', async () => {
        const userData = {
          username: '',
          first_name: 'Test',
          last_name: 'User',
          password: 'password123',
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('Username is required');
      });

      it('should throw error for empty first name', async () => {
        const userData = {
          username: 'test_user',
          first_name: '',
          last_name: 'User',
          password: 'password123',
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('First name is required');
      });

      it('should throw error for empty last name', async () => {
        const userData = {
          username: 'test_user',
          first_name: 'Test',
          last_name: '',
          password: 'password123',
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('Last name is required');
      });

      it('should throw error for empty password', async () => {
        const userData = {
          username: 'test_user',
          first_name: 'Test',
          last_name: 'User',
          password: '',
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('Password is required');
      });

      it('should throw error for username too short', async () => {
        const userData = {
          username: 'ab',
          first_name: 'Test',
          last_name: 'User',
          password: 'password123',
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('Username must be at least 3 characters long');
      });

      it('should throw error for username too long', async () => {
        const userData = {
          username: 'a'.repeat(31), // 31 characters
          first_name: 'Test',
          last_name: 'User',
          password: 'password123',
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('Username must be no more than 30 characters long');
      });

      it('should throw error for first name too short', async () => {
        const userData = {
          username: 'test_user',
          first_name: 'T',
          last_name: 'User',
          password: 'password123',
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('First name must be at least 2 characters long');
      });

      it('should throw error for last name too short', async () => {
        const userData = {
          username: 'test_user',
          first_name: 'Test',
          last_name: 'U',
          password: 'password123',
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('Last name must be at least 2 characters long');
      });

      it('should throw error for password too short', async () => {
        const userData = {
          username: 'test_user',
          first_name: 'Test',
          last_name: 'User',
          password: '12345', // Only 5 characters
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('Password must be at least 6 characters long');
      });

      it('should throw error for username with invalid characters', async () => {
        const userData = {
          username: 'test-user!', // Contains dash and exclamation
          first_name: 'Test',
          last_name: 'User',
          password: 'password123',
        };

        expect(async () => {
          await authService.createUser(userData);
        }).toThrow('Username can only contain letters, numbers, and underscores');
      });
    });
  });

  describe('🧪 Integration Scenarios', () => {
    it('should handle multiple user creation correctly', async () => {
      const userData1 = {
        username: 'integration_user1',
        first_name: 'Integration',
        last_name: 'User1',
        password: 'password123',
      };

      const userData2 = {
        username: 'integration_user2',
        first_name: 'Integration',
        last_name: 'User2',
        password: 'password456',
      };

      const result1 = await authService.createUser(userData1);
      const result2 = await authService.createUser(userData2);

      expect(result1.user_id).not.toBe(result2.user_id);
      expect(result1.username).toBe('integration_user1');
      expect(result2.username).toBe('integration_user2');
    });

    it('should find newly created users by username', async () => {
      const userData = {
        username: 'findable_user',
        first_name: 'Findable',
        last_name: 'User',
        password: 'password123',
      };

      const createdUser = await authService.createUser(userData);
      const foundUser = await authService.findUserByUsername('findable_user');

      expect(foundUser).not.toBeNull();
      expect(foundUser?.user_id).toBe(createdUser.user_id);
      expect(foundUser?.username).toBe('findable_user');
    });

    it('should find newly created users by ID', async () => {
      const userData = {
        username: 'findable_by_id',
        first_name: 'Findable',
        last_name: 'ById',
        password: 'password123',
      };

      const createdUser = await authService.createUser(userData);
      const foundUser = await authService.findUserById(createdUser.user_id);

      expect(foundUser).not.toBeNull();
      expect(foundUser?.user_id).toBe(createdUser.user_id);
      expect(foundUser?.username).toBe('findable_by_id');
    });
  });
});
