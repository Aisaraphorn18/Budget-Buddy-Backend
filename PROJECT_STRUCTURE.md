# Budget Buddy Backend API

RESTful API for Budget Buddy application built with ElysiaJS and Supabase.

## Project Structure

```
src/
├── index.ts                 # Main application entry point
├── config/                  # Configuration files
│   └── supabase.ts         # Supabase client configuration
├── controllers/             # Route handlers (business logic)
│   └── user.controller.ts  # User-related controllers
├── services/               # Data access layer
│   └── user.service.ts     # User business logic
├── serializers/            # Response formatting
│   └── user.serializer.ts  # User data serialization
├── models/                 # Type definitions and interfaces
│   └── user.model.ts       # User model types
├── schemas/                # Validation schemas
│   └── user.schema.ts      # User validation schemas
└── routes/                 # Route definitions (NEW!)
    ├── index.ts            # Route exports
    ├── health.routes.ts    # Health check routes
    └── user.routes.ts      # User management routes
```

## Architecture Layers

### 1. Routes Layer (`/routes`)
- **Purpose**: Define API endpoints and their metadata
- **Responsibilities**: 
  - Route definitions with OpenAPI documentation
  - Parameter validation schemas
  - Route grouping and organization

### 2. Controllers Layer (`/controllers`)
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**: 
  - Request validation
  - Business logic orchestration
  - Response formatting

### 3. Services Layer (`/services`)
- **Purpose**: Business logic and data operations
- **Responsibilities**: 
  - Database interactions
  - Data processing
  - Business rules enforcement

### 4. Models Layer (`/models`)
- **Purpose**: Data structure definitions
- **Responsibilities**: 
  - TypeScript interfaces
  - Data contracts
  - Type safety

## Available Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health status

### User Management
- `GET /api/v1/account/GetAllUser` - Get all users
- `GET /api/v1/account/user/:id` - Get user by ID
- `POST /api/v1/account/user` - Create new user
- `PUT /api/v1/account/user/:id` - Update user
- `DELETE /api/v1/account/user/:id` - Delete user

## API Documentation

- **OpenAPI Spec**: http://localhost:3000/openapi
- **Interactive Documentation**: http://localhost:3000/scalar

## Development

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# The server will be available at http://localhost:3000
```

## Features

- ✅ **Clean Architecture**: Separated concerns with clear layers
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Auto Documentation**: OpenAPI/Swagger integration
- ✅ **CORS Support**: Cross-origin resource sharing
- ✅ **Error Handling**: Centralized error management
- ✅ **Database Integration**: Supabase PostgreSQL
- ✅ **Route Organization**: Modular route structure