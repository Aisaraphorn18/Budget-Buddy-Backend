# 🏥 Health Check API

## Overview

Simple endpoint to check server status and health.

## Endpoint

### Check Server Health

**GET** `/health`

**Description**: Returns server status information

**Authentication**: None required

**Response Example**:

```json
{
  "service": "budget-buddy-backend",
  "status": "healthy",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

**HTTP Status**: 200 OK

## Usage Example

```bash
curl -X GET "http://localhost:3000/health"
```

---

[← Back to API Documentation](../README.md)
