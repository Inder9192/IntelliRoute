# IntelliRoute Backend Analysis

## Overview
IntelliRoute is a multi-tenant backend routing and load balancing system with intelligent traffic distribution powered by AI arbitration. The main backend server runs on **port 4000**.

---

## Server Port & Configuration
- **Port**: 4000
- **Framework**: Express.js  
- **Database**: MongoDB (via Mongoose)
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT tokens (dashboard/internal) + API keys (external apps)

---

## API Routes & Endpoints

### 1. Authentication Routes (`/api/auth`)
These endpoints handle user registration, login, and password management. All return JSON responses.

| Method | Endpoint | Auth | Purpose | Response |
|--------|----------|------|---------|----------|
| POST | `/register` | None | Register a new user & tenant | `{ msg: "Registered successfully" }` |
| POST | `/login` | None | Login with email/password | `{ token: "jwt_token", apiKey: "tenant_api_key" }` |
| POST | `/change-password` | JWT Bearer | Update user password | `{ msg: "Password changed successfully" }` |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "companyName": "Acme Corp"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**MultiTenant Model**: Each user gets a tenant with auto-generated API key (`ir_<hex>`), enabling both JWT and API key authentication.

---

### 2. Backend Service Management Routes (`/api/backends`)
Manage backend services that will be load balanced and monitored.

| Method | Endpoint | Auth | Purpose | Response |
|--------|----------|------|---------|----------|
| POST | `/add` | JWT Bearer | Register a new backend service | Backend object with `_id` |
| GET | `/list` | JWT Bearer | List all backends for tenant | Array of backend objects |
| PUT | `/:id` | JWT Bearer | Update backend configuration | Updated backend object |
| DELETE | `/:id` | JWT Bearer | Remove a backend service | `{ message: "Deleted" }` |

**Example Add Backend Request:**
```json
{
  "name": "API Server A",
  "url": "http://localhost:3001",
  "isActive": true
}
```

**Backend Object Structure:**
```json
{
  "_id": "ObjectId",
  "tenantId": "ObjectId",
  "name": "API Server A",
  "url": "http://localhost:3001",
  "isActive": true
}
```

---

### 3. Metrics Routes (`/api/metrics`)
Real-time monitoring and performance metrics for backends.

| Method | Endpoint | Auth | Purpose | Response |
|--------|----------|------|---------|----------|
| GET | `/overview` | JWT Bearer | Get metrics summary for all backends | Array of metrics (see below) |

**Metrics Response Structure:**
```json
[
  {
    "id": "backend_id",
    "name": "API Server A",
    "url": "http://localhost:3001",
    "isActive": true,
    "isIsolated": false,
    "avgLatency": 45,
    "errorCount": 2,
    "activeConnections": 3
  }
]
```

**Metrics Collected (per backend):**
- **latency[]**: Last 20 response times (sliding window)
- **consecutiveErrors**: Number of consecutive failures (resets on success)
- **totalErrors**: Cumulative error count
- **active**: Current active connections
- **isIsolated**: Circuit breaker flag (tripped after 3 consecutive errors)

---

### 4. Proxy Routes (Request Routing)

#### Internal (Dashboard Testing) - JWT Auth
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| ANY | `/api/proxy/*` | JWT Bearer | Proxy requests to selected backend |

**Header Required:** `Authorization: Bearer <jwt_token>`

#### External (Third-party Apps) - API Key Auth
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| ANY | `/proxy/*` | API Key | Proxy requests to selected backend |

**Header Required:** `X-IntelliRoute-Key: <api_key>`

**Proxy Flow:**
1. User sends request to `/api/proxy/` or `/proxy/` endpoints
2. Backend fetches all active backends for tenant
3. **Routing Engine** builds weighted plan based on:
   - Latency scores
   - Error rates
   - Active connections
   - AI arbitration (when weights are close within 5%)
4. Backend is selected probabilistically by weight
5. Request proxied to selected backend
6. Metrics recorded (latency, errors, active connections)
7. Real-time metrics emitted via Socket.IO

**Real-time Events Emitted:**
- `metrics:full` - Complete metrics state
- `request:routed` - Individual request routing (with backend, method, path, latency, status)
- `backend:isolated` - Backend circuit breaker triggered

---

### 5. Debug & Health Routes

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/` | None | Health check | `"🔥 IntelliRoute Backend Running"` |
| GET | `/debug/metrics` | None | View all metrics | `{ tenantIds: [...], metrics: {...} }` |

---

## Middleware Architecture

### 1. **Auth Middleware** (JWT)
- Validates `Authorization: Bearer <token>` header
- Decodes JWT and attaches `req.user` with `{ userId, tenantId }`
- Used for: `/api/auth/*`, `/api/backends/*`, `/api/metrics/*`, `/api/proxy/*`
- Returns 401 if token missing or invalid

### 2. **API Key Middleware**
- Validates `X-IntelliRoute-Key` header
- Looks up tenant in database by API key
- Attaches `req.user` with `{ tenantId }`
- Used for: `/proxy/*` (external apps)
- Returns 401 if key missing or invalid

---

## Routing & Load Balancing Engine

### Scoring Algorithm (src/engine/scoringEngine.js)
```
score = 100
score -= avgLatency * 0.2
score -= consecutiveErrors * 10
score -= activeConnections * 2
```

### Routing Plan Generation (src/engine/ruleEngine.js)
1. Filter out isolated backends (circuit breaker)
2. Score each healthy backend
3. Normalize scores to weights (%)
4. **AI Arbitration**: If top 2 backends have weights within 5%, consult AWS Bedrock for adjustments
5. Create weighted probability distribution
6. Select backend randomly by weight

### Circuit Breaker
- Tracks consecutive errors per backend
- Isolates backend after **3 consecutive failures**
- Consecutive error counter resets on any successful response
- Isolated backends removed from routing until reset

---

## Data Models

### User
```
{
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  tenantId: ObjectId (ref: Tenant)
}
```

### Tenant
```
{
  name: String (company name),
  apiKey: String (unique, format: "ir_<hex>"),
  createdAt: Date (default: now)
}
```

### BackendService
```
{
  tenantId: ObjectId (ref: Tenant),
  name: String,
  url: String,
  isActive: Boolean (default: true)
}
```

---

## Socket.IO Events

### Server Emits (to connected dashboards)
- **`metrics:full`**: Full metrics state after routing
- **`request:routed`**: Individual request routing details
  ```json
  {
    "tenantId": "...",
    "requestId": "...",
    "backendId": "...",
    "backendName": "API Server A",
    "backendUrl": "http://localhost:3001",
    "method": "GET",
    "path": "/api/users",
    "timestamp": 1234567890,
    "latency": 45,
    "status": "success|error|pending"
  }
  ```
- **`backend:isolated`**: Backend triggered circuit breaker
  ```json
  {
    "tenantId": "...",
    "backendId": "..."
  }
  ```

### Server Receives
- Dashboard connection/disconnection events for tracking

---

## Summary: What Mock Backend Services Should Simulate

### Basic Requirements
Mock backends should be **standalone HTTP servers** that listen on different ports and respond to **any incoming HTTP request** (GET, POST, PUT, DELETE, PATCH, etc.) to **any path**.

### Essential Features

1. **Variable Response Times (Latency)**
   - Simulate realistic response times (e.g., 50-200ms normally)
   - Ability to add artificial delay for testing
   - Different latencies per backend to test routing

2. **Error Simulation**
   - Occasionally return 5xx errors (e.g., 10-20% of requests)
   - Simulate consecutive failures to trigger circuit breaker
   - Different error rates per backend

3. **Generic Request Handling**
   - Accept and respond to ANY HTTP method (GET, POST, PUT, DELETE, PATCH, etc.)
   - Accept requests to ANY path (the routing engine sends requests transparently)
   - Return meaningful JSON responses
   - Should NOT break when receiving unexpected requests

4. **Connection Tracking**
   - Track active concurrent connections
   - Simulate long-running requests to test active connection metrics

5. **Typical Response Format**
   ```json
   {
     "backendId": "backend_1|backend_2|backend_3",
     "timestamp": 1234567890,
     "method": "GET",
     "path": "/api/users",
     "status": "success",
     "latency": 45,
     "message": "Request processed"
   }
   ```

### Configurable Parameters Per Backend
- Port number (e.g., 3001, 3002, 3003)
- Base latency (ms)
- Latency variance (jitter)
- Error rate (%)
- Error pattern (random vs. consecutive)
- Number of active connections

### Integration Notes
- Mock backends will be registered via `/api/backends/add` endpoint
- Example: `{ "name": "Backend 1", "url": "http://localhost:3001" }`
- The IntelliRoute proxy will forward requests from `/api/proxy/*` to these backends
- Metrics (latency, errors, connections) will be collected automatically by the routing engine

---

## Summary Table of API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register` | POST | None | Register new user |
| `/api/auth/login` | POST | None | Login & get JWT + API key |
| `/api/auth/change-password` | POST | JWT | Change password |
| `/api/backends/add` | POST | JWT | Add backend service |
| `/api/backends/list` | GET | JWT | List backends |
| `/api/backends/:id` | PUT | JWT | Update backend |
| `/api/backends/:id` | DELETE | JWT | Delete backend |
| `/api/metrics/overview` | GET | JWT | Get metrics |
| `/api/proxy/*` | ANY | JWT | Proxy requests (internal) |
| `/proxy/*` | ANY | API Key | Proxy requests (external) |
| `/` | GET | None | Health check |
| `/debug/metrics` | GET | None | Debug metrics |

