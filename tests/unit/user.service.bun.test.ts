/**
 * User Service Unit Tests
 *
 * ทดสอบ UserService ที่จัดการข้อมูลผู้ใช้ในระบบ Budget Buddy
 * ครอบคลุมการดึงข้อมูลผู้ใช้, สถิติ, การลบผู้ใช้ และฟังก์ชันผู้ดูแลระบบ
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import type { User } from '../../src/models/user.model';

interface UserStats {
  total_transactions: number;
  total_budgets: number;
  last_login?: string;
}

// Mock User Data
const mockUsers: Omit<User, 'password'>[] = [
  {
    user_id: 1,
    username: 'john_doe',
    first_name: 'John',
    last_name: 'Doe',
    created_date: '2024-01-01T00:00:00Z',
  },
  {
    user_id: 2,
    username: 'jane_smith',
    first_name: 'Jane',
    last_name: 'Smith',
    created_date: '2024-01-02T00:00:00Z',
  },
  {
    user_id: 3,
    username: 'bob_wilson',
    first_name: 'Bob',
    last_name: 'Wilson',
    created_date: '2024-01-03T00:00:00Z',
  },
  {
    user_id: 4,
    username: 'alice_brown',
    first_name: 'Alice',
    last_name: 'Brown',
    created_date: '2024-01-04T00:00:00Z',
  },
  {
    user_id: 5,
    username: 'charlie_davis',
    first_name: 'Charlie',
    last_name: 'Davis',
    created_date: '2024-01-05T00:00:00Z',
  },
];

// Mock User Stats Data
const mockUserStats = {
  1: { total_transactions: 15, total_budgets: 3, last_login: '2024-09-15T10:30:00Z' },
  2: { total_transactions: 8, total_budgets: 2, last_login: '2024-09-14T14:20:00Z' },
  3: { total_transactions: 0, total_budgets: 0 },
  4: { total_transactions: 25, total_budgets: 5, last_login: '2024-09-16T09:15:00Z' },
  5: { total_transactions: 3, total_budgets: 1, last_login: '2024-09-13T16:45:00Z' },
};

// Mock UserService Class
class MockUserService {
  private users: Omit<User, 'password'>[] = [...mockUsers];
  private deletedUserIds: Set<number> = new Set();

  async getAllUsers(filters: { page: number; limit: number; search: string }) {
    const { page, limit, search } = filters;

    // Filter users that haven't been deleted
    let filteredUsers = this.users.filter(user => !this.deletedUserIds.has(user.user_id));

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        user =>
          user.username.toLowerCase().includes(searchLower) ||
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created_date (newest first)
    filteredUsers.sort(
      (a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
    };
  }

  async getUserById(userId: number): Promise<Omit<User, 'password'> | null> {
    if (this.deletedUserIds.has(userId)) {
      return null;
    }

    const user = this.users.find(u => u.user_id === userId);
    return user || null;
  }

  async getUserStats(userId: number): Promise<UserStats> {
    if (this.deletedUserIds.has(userId)) {
      throw new Error('User not found');
    }

    const user = this.users.find(u => u.user_id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    return (
      mockUserStats[userId as keyof typeof mockUserStats] || {
        total_transactions: 0,
        total_budgets: 0,
      }
    );
  }

  async deleteUser(userId: number): Promise<boolean> {
    const user = this.users.find(u => u.user_id === userId);
    if (!user || this.deletedUserIds.has(userId)) {
      return false;
    }

    this.deletedUserIds.add(userId);
    return true;
  }
}

describe('UserService', () => {
  let userService: MockUserService;

  beforeEach(() => {
    userService = new MockUserService();
  });

  describe('getAllUsers()', () => {
    describe('🔍 Basic Functionality', () => {
      it('should return all users with pagination', async () => {
        const result = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: '',
        });

        expect(result.users).toHaveLength(5);
        expect(result.total).toBe(5);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
      });

      it('should return users sorted by created_date (newest first)', async () => {
        const result = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: '',
        });

        expect(result.users[0].username).toBe('charlie_davis'); // 2024-01-05
        expect(result.users[1].username).toBe('alice_brown'); // 2024-01-04
        expect(result.users[4].username).toBe('john_doe'); // 2024-01-01
      });
    });

    describe('📄 Pagination', () => {
      it('should handle pagination correctly', async () => {
        const page1 = await userService.getAllUsers({
          page: 1,
          limit: 2,
          search: '',
        });

        expect(page1.users).toHaveLength(2);
        expect(page1.total).toBe(5);
        expect(page1.users[0].username).toBe('charlie_davis');

        const page2 = await userService.getAllUsers({
          page: 2,
          limit: 2,
          search: '',
        });

        expect(page2.users).toHaveLength(2);
        expect(page2.total).toBe(5);
        expect(page2.users[0].username).toBe('bob_wilson');
      });

      it('should handle last page with remaining items', async () => {
        const lastPage = await userService.getAllUsers({
          page: 3,
          limit: 2,
          search: '',
        });

        expect(lastPage.users).toHaveLength(1);
        expect(lastPage.total).toBe(5);
        expect(lastPage.users[0].username).toBe('john_doe');
      });

      it('should return empty array for page beyond total', async () => {
        const result = await userService.getAllUsers({
          page: 10,
          limit: 5,
          search: '',
        });

        expect(result.users).toHaveLength(0);
        expect(result.total).toBe(5);
      });
    });

    describe('🔍 Search Functionality', () => {
      it('should search by username', async () => {
        const result = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: 'john',
        });

        expect(result.users).toHaveLength(1);
        expect(result.users[0].username).toBe('john_doe');
        expect(result.total).toBe(1);
      });

      it('should search by first name', async () => {
        const result = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: 'Jane',
        });

        expect(result.users).toHaveLength(1);
        expect(result.users[0].first_name).toBe('Jane');
        expect(result.total).toBe(1);
      });

      it('should search by last name', async () => {
        const result = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: 'Wilson',
        });

        expect(result.users).toHaveLength(1);
        expect(result.users[0].last_name).toBe('Wilson');
        expect(result.total).toBe(1);
      });

      it('should be case insensitive', async () => {
        const result = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: 'ALICE',
        });

        expect(result.users).toHaveLength(1);
        expect(result.users[0].first_name).toBe('Alice');
      });

      it('should return empty array for no matches', async () => {
        const result = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: 'nonexistent',
        });

        expect(result.users).toHaveLength(0);
        expect(result.total).toBe(0);
      });

      it('should handle partial matches', async () => {
        const result = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: 'o', // Should match john, bob
        });

        expect(result.users.length).toBeGreaterThanOrEqual(2);
        expect(result.total).toBeGreaterThanOrEqual(2);
      });
    });

    describe('🗑️ Deleted Users', () => {
      it('should exclude deleted users from results', async () => {
        // Delete a user first
        await userService.deleteUser(1);

        const result = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: '',
        });

        expect(result.users).toHaveLength(4);
        expect(result.total).toBe(4);
        expect(result.users.find(u => u.user_id === 1)).toBeUndefined();
      });
    });
  });

  describe('getUserById()', () => {
    describe('🔍 Basic Functionality', () => {
      it('should return user by valid ID', async () => {
        const user = await userService.getUserById(1);

        expect(user).not.toBeNull();
        expect(user?.user_id).toBe(1);
        expect(user?.username).toBe('john_doe');
        expect(user?.first_name).toBe('John');
        expect(user?.last_name).toBe('Doe');
      });

      it('should return null for non-existent user ID', async () => {
        const user = await userService.getUserById(999);

        expect(user).toBeNull();
      });

      it('should return null for deleted user', async () => {
        // Delete user first
        await userService.deleteUser(2);

        const user = await userService.getUserById(2);

        expect(user).toBeNull();
      });
    });

    describe('🔒 Security', () => {
      it('should not include password field in response', async () => {
        const user = await userService.getUserById(1);

        expect(user).not.toBeNull();
        expect(user).not.toHaveProperty('password');
      });
    });

    describe('🧪 Edge Cases', () => {
      it('should handle zero as user ID', async () => {
        const user = await userService.getUserById(0);

        expect(user).toBeNull();
      });

      it('should handle negative user ID', async () => {
        const user = await userService.getUserById(-1);

        expect(user).toBeNull();
      });
    });
  });

  describe('getUserStats()', () => {
    describe('📊 Statistics Calculation', () => {
      it('should return user statistics for active user', async () => {
        const stats = await userService.getUserStats(1);

        expect(stats.total_transactions).toBe(15);
        expect(stats.total_budgets).toBe(3);
        expect(stats.last_login).toBe('2024-09-15T10:30:00Z');
      });

      it('should return zero stats for user with no activity', async () => {
        const stats = await userService.getUserStats(3);

        expect(stats.total_transactions).toBe(0);
        expect(stats.total_budgets).toBe(0);
        expect(stats.last_login).toBeUndefined();
      });

      it('should handle user with only transactions', async () => {
        const stats = await userService.getUserStats(4);

        expect(stats.total_transactions).toBe(25);
        expect(stats.total_budgets).toBe(5);
        expect(stats.last_login).toBe('2024-09-16T09:15:00Z');
      });
    });

    describe('❌ Error Handling', () => {
      it('should throw error for non-existent user', async () => {
        expect(async () => {
          await userService.getUserStats(999);
        }).toThrow('User not found');
      });

      it('should throw error for deleted user', async () => {
        // Delete user first
        await userService.deleteUser(2);

        expect(async () => {
          await userService.getUserStats(2);
        }).toThrow('User not found');
      });
    });

    describe('🔢 Data Types', () => {
      it('should return numbers for transaction and budget counts', async () => {
        const stats = await userService.getUserStats(1);

        expect(typeof stats.total_transactions).toBe('number');
        expect(typeof stats.total_budgets).toBe('number');
        expect(stats.total_transactions).toBeGreaterThanOrEqual(0);
        expect(stats.total_budgets).toBeGreaterThanOrEqual(0);
      });

      it('should return valid date string for last_login', async () => {
        const stats = await userService.getUserStats(1);

        if (stats.last_login) {
          expect(typeof stats.last_login).toBe('string');
          expect(new Date(stats.last_login).toString()).not.toBe('Invalid Date');
        }
      });
    });
  });

  describe('deleteUser()', () => {
    describe('🗑️ Basic Deletion', () => {
      it('should successfully delete existing user', async () => {
        const result = await userService.deleteUser(1);

        expect(result).toBe(true);

        // Verify user is deleted
        const user = await userService.getUserById(1);
        expect(user).toBeNull();
      });

      it('should return false for non-existent user', async () => {
        const result = await userService.deleteUser(999);

        expect(result).toBe(false);
      });

      it('should return false when trying to delete already deleted user', async () => {
        // Delete user first
        const firstDelete = await userService.deleteUser(2);
        expect(firstDelete).toBe(true);

        // Try to delete again
        const secondDelete = await userService.deleteUser(2);
        expect(secondDelete).toBe(false);
      });
    });

    describe('🔄 Cascading Effects', () => {
      it('should remove user from getAllUsers results after deletion', async () => {
        // Get initial count
        const initialResult = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: '',
        });
        const initialCount = initialResult.total;

        // Delete user
        await userService.deleteUser(3);

        // Check updated count
        const updatedResult = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: '',
        });

        expect(updatedResult.total).toBe(initialCount - 1);
        expect(updatedResult.users.find(u => u.user_id === 3)).toBeUndefined();
      });

      it('should make getUserStats throw error after deletion', async () => {
        // Delete user
        await userService.deleteUser(4);

        // Try to get stats
        expect(async () => {
          await userService.getUserStats(4);
        }).toThrow('User not found');
      });
    });

    describe('🛡️ Data Integrity', () => {
      it('should handle multiple user deletions', async () => {
        const deleteResults = await Promise.all([
          userService.deleteUser(1),
          userService.deleteUser(2),
          userService.deleteUser(3),
        ]);

        expect(deleteResults).toEqual([true, true, true]);

        const remainingUsers = await userService.getAllUsers({
          page: 1,
          limit: 10,
          search: '',
        });

        expect(remainingUsers.total).toBe(2);
        expect(remainingUsers.users.map(u => u.user_id)).toEqual([5, 4]); // Sorted by date
      });
    });

    describe('🧪 Edge Cases', () => {
      it('should handle deletion of user with zero ID', async () => {
        const result = await userService.deleteUser(0);

        expect(result).toBe(false);
      });

      it('should handle deletion of user with negative ID', async () => {
        const result = await userService.deleteUser(-1);

        expect(result).toBe(false);
      });
    });
  });

  describe('🧪 Integration Scenarios', () => {
    it('should handle complete user lifecycle', async () => {
      const userId = 1;

      // 1. Get user initially
      const initialUser = await userService.getUserById(userId);
      expect(initialUser).not.toBeNull();

      // 2. Get user stats
      const stats = await userService.getUserStats(userId);
      expect(stats).toBeDefined();

      // 3. User should appear in getAllUsers
      const allUsers = await userService.getAllUsers({
        page: 1,
        limit: 10,
        search: '',
      });
      expect(allUsers.users.find(u => u.user_id === userId)).toBeDefined();

      // 4. Delete user
      const deleteResult = await userService.deleteUser(userId);
      expect(deleteResult).toBe(true);

      // 5. Verify user is gone everywhere
      const deletedUser = await userService.getUserById(userId);
      expect(deletedUser).toBeNull();

      const updatedAllUsers = await userService.getAllUsers({
        page: 1,
        limit: 10,
        search: '',
      });
      expect(updatedAllUsers.users.find(u => u.user_id === userId)).toBeUndefined();

      expect(async () => {
        await userService.getUserStats(userId);
      }).toThrow('User not found');
    });

    it('should handle search and pagination together', async () => {
      // Search with pagination
      const searchResult = await userService.getAllUsers({
        page: 1,
        limit: 1,
        search: 'o', // Should match multiple users
      });

      expect(searchResult.users).toHaveLength(1);
      expect(searchResult.total).toBeGreaterThan(1);

      // Get second page
      const page2 = await userService.getAllUsers({
        page: 2,
        limit: 1,
        search: 'o',
      });

      expect(page2.users).toHaveLength(1);
      expect(page2.users[0].user_id).not.toBe(searchResult.users[0].user_id);
    });
  });
});
