# 🏗️ Project Architecture

## 📁 Project Structure

```
Budget-Buddy-Backend/
├── src/
│   ├── controllers/           # 🎮 HTTP request handlers
│   │   ├── auth.controller.ts       # Authentication controller
│   │   ├── budget.controller.ts     # Budget controller
│   │   ├── category.controller.ts   # Category controller
│   │   ├── reports.controller.ts    # Reports controller
│   │   ├── transaction.controller.ts # Transaction controller
│   │   └── user.controller.ts       # User controller
│   ├── services/              # 🔧 Business logic layer
│   │   ├── auth.service.ts          # Authentication logic
│   │   ├── budget.service.ts        # Budget calculations
│   │   ├── category.service.ts      # Category operations
│   │   ├── transaction.service.ts   # Transaction processing
│   │   └── user.service.ts          # User management
│   ├── models/                # 📊 TypeScript interfaces
│   │   ├── budget.model.ts          # Budget data types
│   │   ├── category.model.ts        # Category interfaces
│   │   ├── transaction.model.ts     # Transaction types
│   │   └── user.model.ts            # User definitions
│   ├── routes/                # 🛣️ API route definitions
│   │   ├── auth.routes.ts           # Authentication routes
│   │   ├── budget.routes.ts         # Budget endpoints
│   │   ├── category.routes.ts       # Category endpoints
│   │   ├── health.routes.ts         # Health check
│   │   ├── reports.routes.ts        # Report routes
│   │   ├── transaction.routes.ts    # Transaction routes
│   │   ├── user.routes.ts           # User endpoints
│   │   └── index.ts                 # Route aggregator
│   ├── middleware/            # 🛡️ Custom middleware
│   │   └── jwt.middleware.ts        # JWT validation
│   ├── schemas/               # ✅ Validation schemas
│   │   ├── api.schema.ts            # API validation schemas
│   │   ├── auth.schema.ts           # Authentication schemas
│   │   └── user.schema.ts           # User validation schemas
│   ├── config/                # ⚙️ Configuration files
│   │   └── supabase.ts              # Supabase client setup
│   ├── types/                 # 📝 TypeScript type definitions
│   │   └── elysia.types.ts          # Elysia framework types
│   ├── utils/                 # 🔧 Utility functions
│   │   └── logger.ts                # Logging utilities
│   └── index.ts               # 🚀 Application entry point
├── tests/                     # 🧪 Test suites
│   ├── unit/                  # Unit tests (174 tests)
│   │   ├── auth.service.bun.test.ts
│   │   ├── budget.service.bun.test.ts
│   │   ├── category.service.bun.test.ts
│   │   ├── transaction.service.bun.test.ts
│   │   └── user.service.bun.test.ts
│   ├── integration/           # Integration tests (138 tests)
│   │   ├── auth.api.bun.test.ts
│   │   ├── budget.api.bun.test.ts
│   │   ├── category.api.bun.test.ts
│   │   ├── reports.api.bun.test.ts
│   │   ├── transaction.api.bun.test.ts
│   │   └── user.api.bun.test.ts
│   ├── mocks/                 # Mock implementations
│   │   ├── supabase.mock.ts         # Full Supabase mock
│   │   └── supabase-simple.mock.ts  # Simple Supabase mock
│   ├── utils/                 # Test utilities
│   │   └── test-utils.ts            # Test helper functions
│   ├── setup.test.ts          # Test setup configuration
│   ├── package.json           # Test-specific dependencies
│   └── README.md              # Testing documentation
├── docs/                      # 📚 Documentation
│   ├── api-documentation.md   # Complete API reference
│   ├── deployment.md          # Deployment guide
│   ├── architecture.md        # This file
│   ├── EN/                    # English documentation
│   └── TH/                    # Thai documentation
├── .husky/                    # Git hooks configuration
├── .vscode/                   # VS Code settings
├── .env.example               # Environment template
├── .gitignore                 # Git ignore patterns
├── .prettierrc                # Prettier configuration
├── .commitlintrc.js           # Commit lint rules
├── eslint.config.js           # ESLint configuration
├── test-runner.ts             # Test runner configuration
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── bun.lockb                  # Dependency lock file
└── README.md                  # Project overview
```

## 🎯 Architecture Patterns

### 🏛️ Layered Architecture

```
┌─────────────────┐
│   Controllers   │ ← HTTP Request/Response Layer
├─────────────────┤
│    Services     │ ← Business Logic Layer
├─────────────────┤
│     Models      │ ← Data Structure Layer
├─────────────────┤
│   Database      │ ← Data Persistence Layer
└─────────────────┘
```

### 🔄 Request Flow

```
Client Request
       ↓
   Middleware (JWT Auth)
       ↓
   Route Handler
       ↓
   Controller (HTTP)
       ↓
   Service (Business Logic)
       ↓
   Database (Supabase)
       ↓
   Response (JSON)
```

## 🛠️ Technology Stack

### Core Technologies

- **Runtime**: [Bun](https://bun.sh/) - Ultra-fast JavaScript runtime
- **Framework**: [ElysiaJS](https://elysiajs.com/) - Fast & type-safe web framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Database**: [Supabase](https://supabase.io/) - PostgreSQL with real-time features

### Development Tools

- **Testing**: Bun built-in test framework
- **Validation**: Custom schema validation
- **Authentication**: JWT with middleware
- **Environment**: dotenv configuration

### Key Libraries

- **@supabase/supabase-js** - Supabase client library
- **@elysiajs/jwt** - JWT authentication plugin
- **@elysiajs/cors** - CORS handling

## 🔧 Design Principles

### 1. **Separation of Concerns**

- Controllers handle HTTP requests/responses only
- Services contain all business logic
- Models define data structures and types
- Clear separation between layers

### 2. **Type Safety**

- Full TypeScript implementation
- Strong typing for all data structures
- Interface-driven development
- Compile-time error catching

### 3. **Testability**

- Comprehensive test coverage (323 tests)
- Mock implementations for external dependencies
- Unit tests for business logic
- Integration tests for API endpoints

### 4. **Security First**

- JWT-based authentication
- Input validation on all endpoints
- CORS configuration
- Environment-based configuration

### 5. **Performance Optimization**

- Bun runtime for ultra-fast execution
- ElysiaJS for minimal overhead
- Efficient database queries
- Proper pagination implementation

## 📊 Data Flow Architecture

### Authentication Flow

```
Register/Login → JWT Generation → Token Storage → Protected Route Access
```

### Transaction Processing

```
Client Request → Validation → Authorization → Service Logic → Database → Response
```

### Budget Analytics

```
Transaction Data → Aggregation → Calculation → Analysis → Reporting
```

## 🔌 API Design

### RESTful Conventions

- **GET** - Retrieve resources
- **POST** - Create new resources
- **PUT** - Update existing resources
- **DELETE** - Remove resources

### Consistent Response Format

```json
{
  "success": true|false,
  "data": {...},
  "message": "string",
  "error": "string" // for error responses
}
```

### Error Handling

- Standardized HTTP status codes
- Descriptive error messages
- Consistent error response format
- Proper validation error details

## 🚀 Scalability Considerations

### Database Design

- Normalized PostgreSQL schema
- Proper indexing for query performance
- Foreign key relationships
- Optimized for financial data integrity

### Code Organization

- Modular service architecture
- Reusable middleware components
- Centralized configuration management
- Clean separation of concerns

### Performance Features

- Pagination for large datasets
- Query optimization
- Efficient data structures
- Minimal memory footprint

## 🔒 Security Architecture

### Authentication & Authorization

- JWT-based stateless authentication
- Middleware-based route protection
- Role-based access control (admin features)
- Secure password handling

### Data Protection

- Input validation and sanitization
- SQL injection prevention (Supabase ORM)
- XSS protection
- CORS configuration

### Environment Security

- Environment variable configuration
- Sensitive data isolation
- Production vs development settings
- Database connection security

For deployment information, see [Deployment Guide](deployment.md).
For API details, see [API Documentation](api-documentation.md).
