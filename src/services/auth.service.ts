import { supabase } from "../config/supabase";

export interface User {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  created_at: string;
}

export interface CreateUserData {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

export class AuthService {
  async findUserByUsername(username: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async findUserById(id: number): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('user_id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('User')
        .insert([userData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}