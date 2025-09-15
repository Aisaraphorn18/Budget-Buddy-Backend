export interface User {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  created_date: string;
}

export interface UserResponse {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  created_date: string;
}

export interface CreateUserRequest {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}