import { supabase } from '../config/supabase';
import type { User, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

export class UserService {
  /**
   * ดึงผู้ใช้ทั้งหมดจากฐานข้อมูล
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  }

  /**
   * ดึงผู้ใช้ตาม ID
   */
  static async getUserById(userId: number): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // ไม่พบผู้ใช้
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  }

  /**
   * สร้างผู้ใช้ใหม่
   */
  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('User')
        .insert([{
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          password: userData.password,
          created_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  /**
   * อัพเดทข้อมูลผู้ใช้
   */
  static async updateUser(userId: number, userData: UpdateUserRequest): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('User')
        .update(userData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // ไม่พบผู้ใช้
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  /**
   * ลบผู้ใช้
   */
  static async deleteUser(userId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('User')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }

  /**
   * ตรวจสอบว่ามี username นี้อยู่แล้วหรือไม่
   */
  static async checkUsernameExists(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('user_id')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Database error: ${error.message}`);
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkUsernameExists:', error);
      throw error;
    }
  }
}