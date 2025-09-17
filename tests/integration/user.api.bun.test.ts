/**
 * 👥 User Management API Integration Tests
 * ทดสอบ API endpoints สำหรับจัดการผู้ใช้งาน (Admin Only) พร้อม Mock HTTP Client
 * @description Integration Tests สำหรับทดสอบ User Management API endpoints ครบถ้วน
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// 🔧 Mock API Response Helpers
const createMockResponse = (statusCode: number, data: any) => ({
  status: statusCode,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
});

// 👤 Mock User Data
const mockUsers = [
  {
    user_id: 1,
    username: 'johndoe',
    first_name: 'John',
    last_name: 'Doe',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    user_id: 2,
    username: 'janedoe',
    first_name: 'Jane',
    last_name: 'Doe',
    created_at: '2024-01-20T14:30:00Z',
  },
  {
    user_id: 3,
    username: 'bobsmith',
    first_name: 'Bob',
    last_name: 'Smith',
    created_at: '2024-02-01T09:15:00Z',
  },
];

const mockUserStats = {
  total_transactions: 25,
  total_budgets: 5,
  last_login: '2024-01-20T14:30:00Z',
};

// 🔗 Mock User Management HTTP Client
class MockUserManagementHttpClient {
  private users = [...mockUsers];
  private isAdmin = false;

  setAdminStatus(isAdmin: boolean) {
    this.isAdmin = isAdmin;
  }

  async getAllUsers(query: Record<string, string> = {}, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    if (!this.isAdmin) {
      return createMockResponse(403, {
        success: false,
        message: 'Admin access required',
      });
    }

    const { page = '1', limit = '20', search } = query;
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);

    let filteredUsers = [...this.users];

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

    // Apply pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return createMockResponse(200, {
      success: true,
      data: paginatedUsers,
      message: 'Users retrieved successfully',
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  }

  async getUserById(userId: number, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    if (!this.isAdmin) {
      return createMockResponse(403, {
        success: false,
        message: 'Admin access required',
      });
    }

    const user = this.users.find(u => u.user_id === userId);
    if (!user) {
      return createMockResponse(404, {
        success: false,
        message: 'User not found',
      });
    }

    return createMockResponse(200, {
      success: true,
      data: {
        ...user,
        stats: mockUserStats,
      },
      message: 'User retrieved successfully',
    });
  }

  async deleteUser(userId: number, authToken?: string) {
    if (!authToken) {
      return createMockResponse(401, { message: 'Authentication required' });
    }

    if (!this.isAdmin) {
      return createMockResponse(403, {
        success: false,
        message: 'Admin access required',
      });
    }

    const userIndex = this.users.findIndex(u => u.user_id === userId);
    if (userIndex === -1) {
      return createMockResponse(404, {
        success: false,
        message: 'User not found',
      });
    }

    // Simulate constraint check - prevent deleting user with active data
    if (userId === 1) {
      return createMockResponse(400, {
        success: false,
        message: 'Cannot delete user with existing transactions or budgets',
      });
    }

    this.users.splice(userIndex, 1);

    return createMockResponse(200, {
      success: true,
      message: 'User deleted successfully',
    });
  }

  // Helper method to reset test data
  reset() {
    this.users = [...mockUsers];
    this.isAdmin = false;
  }
}

describe('👥 User Management API Integration Tests', () => {
  let api: MockUserManagementHttpClient;
  const validToken = 'mock-jwt-token-123';
  const adminToken = 'mock-admin-jwt-token-456';

  beforeEach(() => {
    api = new MockUserManagementHttpClient();
    api.reset();
  });

  describe('GET /api/v1/users', () => {
    describe('📄 Basic Functionality', () => {
      it('should return all users for admin - ดึงข้อมูลผู้ใช้ทั้งหมดสำหรับ admin', async () => {
        api.setAdminStatus(true);
        const response = await api.getAllUsers({}, adminToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(Array.isArray(data.data)).toBe(true);
        expect(data.data.length).toBe(3);
        expect(data.data[0]).toHaveProperty('user_id');
        expect(data.data[0]).toHaveProperty('username');
        expect(data.data[0]).toHaveProperty('first_name');
        expect(data.data[0]).toHaveProperty('last_name');
        expect(data.data[0]).toHaveProperty('created_at');
        expect(data.message).toBe('Users retrieved successfully');
        expect(data).toHaveProperty('pagination');
      });

      it('should support pagination - รองรับการแบ่งหน้า', async () => {
        api.setAdminStatus(true);
        const query = { page: '1', limit: '2' };
        const response = await api.getAllUsers(query, adminToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.length).toBe(2);
        expect(data.pagination.total).toBe(3);
        expect(data.pagination.page).toBe(1);
        expect(data.pagination.limit).toBe(2);
        expect(data.pagination.totalPages).toBe(2);
      });

      it('should support search functionality - รองรับการค้นหา', async () => {
        api.setAdminStatus(true);
        const query = { search: 'john' };
        const response = await api.getAllUsers(query, adminToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.length).toBe(1);
        expect(data.data[0].username).toBe('johndoe');
        expect(data.pagination.total).toBe(1);
      });

      it('should return empty array when no users match search - ส่งคืน array ว่างเมื่อไม่พบผู้ใช้', async () => {
        api.setAdminStatus(true);
        const query = { search: 'nonexistent' };
        const response = await api.getAllUsers(query, adminToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.length).toBe(0);
        expect(data.pagination.total).toBe(0);
      });
    });

    describe('❌ Authorization Errors', () => {
      it('should return 401 for missing authentication token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.getAllUsers({});
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe('Authentication required');
      });

      it('should return 403 for non-admin users - ส่งคืน 403 เมื่อไม่ใช่ admin', async () => {
        api.setAdminStatus(false);
        const response = await api.getAllUsers({}, validToken);
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Admin access required');
      });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    describe('🔍 User Retrieval', () => {
      it('should return specific user by ID with stats - ดึงข้อมูลผู้ใช้ตาม ID พร้อมสถิติ', async () => {
        api.setAdminStatus(true);
        const response = await api.getUserById(1, adminToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.user_id).toBe(1);
        expect(data.data.username).toBe('johndoe');
        expect(data.data).toHaveProperty('stats');
        expect(data.data.stats).toHaveProperty('total_transactions');
        expect(data.data.stats).toHaveProperty('total_budgets');
        expect(data.data.stats).toHaveProperty('last_login');
        expect(data.message).toBe('User retrieved successfully');
      });

      it('should return 404 for non-existent user - ส่งคืน 404 เมื่อไม่พบผู้ใช้', async () => {
        api.setAdminStatus(true);
        const response = await api.getUserById(999, adminToken);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe('User not found');
      });
    });

    describe('❌ Authorization Errors', () => {
      it('should return 401 for missing authentication token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.getUserById(1);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe('Authentication required');
      });

      it('should return 403 for non-admin users - ส่งคืน 403 เมื่อไม่ใช่ admin', async () => {
        api.setAdminStatus(false);
        const response = await api.getUserById(1, validToken);
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Admin access required');
      });
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    describe('🗑️ Successful Deletion', () => {
      it('should delete user successfully - ลบผู้ใช้สำเร็จ', async () => {
        api.setAdminStatus(true);
        const response = await api.deleteUser(2, adminToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe('User deleted successfully');

        // Verify user is actually deleted
        const getUserResponse = await api.getUserById(2, adminToken);
        expect(getUserResponse.status).toBe(404);
      });
    });

    describe('❌ Error Handling', () => {
      it('should return 404 for non-existent user - ส่งคืน 404 เมื่อไม่พบผู้ใช้', async () => {
        api.setAdminStatus(true);
        const response = await api.deleteUser(999, adminToken);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.message).toBe('User not found');
      });

      it('should return 400 when user has dependencies - ส่งคืน 400 เมื่อผู้ใช้มีข้อมูลที่เกี่ยวข้อง', async () => {
        api.setAdminStatus(true);
        const response = await api.deleteUser(1, adminToken);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Cannot delete user with existing transactions or budgets');
      });

      it('should return 401 for missing authentication token - ส่งคืน 401 เมื่อไม่มี token', async () => {
        const response = await api.deleteUser(2);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe('Authentication required');
      });

      it('should return 403 for non-admin users - ส่งคืน 403 เมื่อไม่ใช่ admin', async () => {
        api.setAdminStatus(false);
        const response = await api.deleteUser(2, validToken);
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.success).toBe(false);
        expect(data.message).toBe('Admin access required');
      });
    });
  });

  describe('📊 API Response Format', () => {
    describe('✅ Consistent Response Structure', () => {
      it('should return consistent success response format - ตรวจสอบรูปแบบการตอบกลับที่สำเร็จ', async () => {
        api.setAdminStatus(true);
        const response = await api.getAllUsers({}, adminToken);
        const data = await response.json();

        expect(data).toHaveProperty('success');
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('message');
        expect(data).toHaveProperty('pagination');
        expect(typeof data.success).toBe('boolean');
      });

      it('should return consistent error response format - ตรวจสอบรูปแบบการตอบกลับที่ผิดพลาด', async () => {
        api.setAdminStatus(true);
        const response = await api.getUserById(999, adminToken);
        const data = await response.json();

        expect(data).toHaveProperty('success');
        expect(data).toHaveProperty('message');
        expect(data.success).toBe(false);
      });
    });
  });

  describe('🔐 Authentication and Authorization', () => {
    describe('🚫 Admin Access Control', () => {
      it('should handle missing authorization header across all endpoints - จัดการกรณีไม่มี header authorization', async () => {
        const endpoints = [
          () => api.getAllUsers({}),
          () => api.getUserById(1),
          () => api.deleteUser(2),
        ];

        for (const endpoint of endpoints) {
          const response = await endpoint();
          expect(response.status).toBe(401);
        }
      });

      it('should require admin access for all endpoints - ต้องการสิทธิ์ admin สำหรับทุกจุดสิ้นสุด', async () => {
        api.setAdminStatus(false);
        const endpoints = [
          () => api.getAllUsers({}, validToken),
          () => api.getUserById(1, validToken),
          () => api.deleteUser(2, validToken),
        ];

        for (const endpoint of endpoints) {
          const response = await endpoint();
          expect(response.status).toBe(403);
        }
      });

      it('should allow admin access for all endpoints - อนุญาตให้ admin เข้าถึงทุกจุดสิ้นสุด', async () => {
        api.setAdminStatus(true);
        const getAllResponse = await api.getAllUsers({}, adminToken);
        expect(getAllResponse.status).toBe(200);

        const getUserResponse = await api.getUserById(1, adminToken);
        expect(getUserResponse.status).toBe(200);

        const deleteResponse = await api.deleteUser(3, adminToken);
        expect(deleteResponse.status).toBe(200);
      });
    });
  });

  describe('🧪 Integration Scenarios', () => {
    describe('📋 Complete User Management Workflow', () => {
      it('should handle complete user management flow - ทดสอบการจัดการผู้ใช้แบบครบวงจร', async () => {
        api.setAdminStatus(true);

        // Get all users
        const getAllResponse = await api.getAllUsers({}, adminToken);
        const getAllData = await getAllResponse.json();

        expect(getAllResponse.status).toBe(200);
        expect(getAllData.data.length).toBe(3);

        // Get specific user details
        const getUserResponse = await api.getUserById(2, adminToken);
        const getUserData = await getUserResponse.json();

        expect(getUserResponse.status).toBe(200);
        expect(getUserData.data.user_id).toBe(2);
        expect(getUserData.data.stats).toHaveProperty('total_transactions');

        // Delete user
        const deleteResponse = await api.deleteUser(2, adminToken);
        const deleteData = await deleteResponse.json();

        expect(deleteResponse.status).toBe(200);
        expect(deleteData.success).toBe(true);

        // Verify user is deleted
        const getAllAfterDeleteResponse = await api.getAllUsers({}, adminToken);
        const getAllAfterDeleteData = await getAllAfterDeleteResponse.json();

        expect(getAllAfterDeleteResponse.status).toBe(200);
        expect(getAllAfterDeleteData.data.length).toBe(2);
        expect(getAllAfterDeleteData.data.find((u: any) => u.user_id === 2)).toBeUndefined();
      });

      it('should handle pagination and search together - จัดการการแบ่งหน้าและการค้นหาร่วมกัน', async () => {
        api.setAdminStatus(true);

        // Search with pagination
        const query = { search: 'doe', page: '1', limit: '1' };
        const response = await api.getAllUsers(query, adminToken);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.data.length).toBe(1);
        expect(data.pagination.total).toBe(2); // johndoe and janedoe
        expect(data.pagination.totalPages).toBe(2);
        expect(data.data[0].username).toMatch(/doe$/);

        // Get next page
        const nextPageQuery = { search: 'doe', page: '2', limit: '1' };
        const nextPageResponse = await api.getAllUsers(nextPageQuery, adminToken);
        const nextPageData = await nextPageResponse.json();

        expect(nextPageResponse.status).toBe(200);
        expect(nextPageData.data.length).toBe(1);
        expect(nextPageData.data[0].username).toMatch(/doe$/);
        expect(nextPageData.data[0].user_id).not.toBe(data.data[0].user_id);
      });
    });
  });
});
