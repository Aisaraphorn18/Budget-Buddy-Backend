import { UserService } from "../services/user.service";

export class UserController {
  /**
   * GET /api/v1/account/GetAllUser
   * ดึงรายการผู้ใช้ทั้งหมด
   */
  static async getAllUsers({ set }: any) {
    try {
      const users = await UserService.getAllUsers();

      set.status = 200;
      return {
        success: true,
        message: `Found ${users.length} users`,
        data: users.map((user) => ({
          user_id: user.user_id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          created_date: user.created_date
        }))
      };
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      set.status = 500;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: []
      };
    }
  }

  /**
   * GET /api/v1/account/user/:id
   * ดึงผู้ใช้ตาม ID
   */
  static async getUserById({ params, set }: any) {
    try {
      const userId = params.id;
      const user = await UserService.getUserById(userId);

      if (!user) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
          data: null
        };
      }

      set.status = 200;
      return {
        success: true,
        message: "User found",
        data: {
          user_id: user.user_id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          created_date: user.created_date
        }
      };
    } catch (error) {
      console.error("Error in getUserById:", error);
      set.status = 500;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null
      };
    }
  }

  /**
   * POST /api/v1/account/user
   * สร้างผู้ใช้ใหม่
   */
  static async createUser({ body, set }: any) {
    try {
      // ตรวจสอบว่า username ซ้ำหรือไม่
      const usernameExists = await UserService.checkUsernameExists(
        body.username
      );
      if (usernameExists) {
        set.status = 409;
        return {
          success: false,
          message: "Username already exists",
          data: null
        };
      }

      const newUser = await UserService.createUser(body);

      set.status = 201;
      return {
        success: true,
        message: "User created successfully",
        data: {
          user_id: newUser.user_id,
          username: newUser.username,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          created_date: newUser.created_date
        }
      };
    } catch (error) {
      console.error("Error in createUser:", error);
      set.status = 500;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null
      };
    }
  }

  /**
   * PUT /api/v1/account/user/:id
   * อัพเดทข้อมูลผู้ใช้
   */
  static async updateUser({ params, body, set }: any) {
    try {
      const userId = params.id;

      // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
      const existingUser = await UserService.getUserById(userId);
      if (!existingUser) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
          data: null
        };
      }

      // ถ้ามีการเปลี่ยน username ให้ตรวจสอบว่าซ้ำหรือไม่
      if (body.username && body.username !== existingUser.username) {
        const usernameExists = await UserService.checkUsernameExists(
          body.username
        );
        if (usernameExists) {
          set.status = 409;
          return {
            success: false,
            message: "Username already exists",
            data: null
          };
        }
      }

      const updatedUser = await UserService.updateUser(userId, body);
      if (!updatedUser) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
          data: null
        };
      }

      set.status = 200;
      return {
        success: true,
        message: "User updated successfully",
        data: {
          user_id: updatedUser.user_id,
          username: updatedUser.username,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          created_date: updatedUser.created_date
        }
      };
    } catch (error) {
      console.error("Error in updateUser:", error);
      set.status = 500;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null
      };
    }
  }

  /**
   * DELETE /api/v1/account/user/:id
   * ลบผู้ใช้
   */
  static async deleteUser({ params, set }: any) {
    try {
      const userId = params.id;

      // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
      const user = await UserService.getUserById(userId);
      if (!user) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
          data: null
        };
      }

      await UserService.deleteUser(userId);

      set.status = 200;
      return {
        success: true,
        message: "User deleted successfully",
        data: null
      };
    } catch (error) {
      console.error("Error in deleteUser:", error);
      set.status = 500;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null
      };
    }
  }
}
