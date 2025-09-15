import { t } from 'elysia';

// Login schema
export const LoginRequestSchema = t.Object({
  username: t.String({ 
    minLength: 3,
    description: 'Username'
  }),
  password: t.String({ 
    minLength: 6,
    description: 'User password'
  })
});

// Register schema
export const RegisterRequestSchema = t.Object({
  username: t.String({ 
    minLength: 3,
    description: 'Username (minimum 3 characters)'
  }),
  first_name: t.String({ 
    minLength: 2,
    description: 'User first name'
  }),
  last_name: t.String({ 
    minLength: 2,
    description: 'User last name'
  }),
  password: t.String({ 
    minLength: 6,
    description: 'User password (minimum 6 characters)'
  })
});

// User detail response schema
export const UserDetailSchema = t.Object({
  id: t.Number(),
  username: t.String(),
  first_name: t.String(),
  last_name: t.String(),
  created_at: t.String()
});

// JWT Response schema
export const LoginResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String(),
  token: t.String(),
  user: UserDetailSchema
});

export const RegisterResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String(),
  user: UserDetailSchema
});

export const LogoutResponseSchema = t.Object({
  success: t.Boolean(),
  message: t.String()
});

// Error response schema
export const AuthErrorResponseSchema = t.Object({
  success: t.Literal(false),
  message: t.String(),
  error: t.Optional(t.String())
});

// Authorization header schema
export const AuthHeaderSchema = t.Object({
  authorization: t.String({
    description: 'Bearer token'
  })
});