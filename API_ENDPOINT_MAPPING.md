# LearningHub API Endpoint Mapping Analysis

## Overview
Base URL: `http://localhost:5000/api` (set via `VITE_API_BASE_URL` environment variable)

---

## Current Endpoints in Codebase

### 1. Authentication API
**File:** [src/features/auth/authApi.ts](src/features/auth/authApi.ts)

| Endpoint | Method | Data Sent | Status |
|----------|--------|-----------|--------|
| `/auth/login` | POST | `{ email, password }` | ✅ Implemented |
| `/auth/register` | POST | `{ name, email, password, role }` | ✅ Implemented |
| `/auth/profile` | GET | None | ✅ Extra (not in targets) |
| `/auth/logout` | POST | None | ✅ Extra (not in targets) |

---

### 2. Course Management API
**File:** [src/features/course/courseApi.ts](src/features/course/courseApi.ts)

| Endpoint | Method | Data Sent | Status |
|----------|--------|-----------|--------|
| `/courses` | GET | Query params: `{ search, category, level, page, limit }` | ⚠️ Path mismatch |
| `/courses/{id}` | GET | None | ⚠️ Path mismatch |
| `/courses/tutor/my-courses` | GET | None | ✅ Extra (not in targets) |
| `/courses` | POST | FormData (multipart) | ⚠️ Path & method mismatch |
| `/courses/{id}` | PUT | FormData (multipart) | ⚠️ Path & method mismatch |
| `/courses/{id}` | DELETE | None | ⚠️ Path & method mismatch |
| `/courses/{courseId}/rate` | POST | `{ rating, review }` | ✅ Correct |
| `/courses/my-learning` | GET | None | ⚠️ Path mismatch |

---

### 3. Cart API
**File:** [src/features/cart/cartApi.ts](src/features/cart/cartApi.ts)

| Endpoint | Method | Data Sent | Status |
|----------|--------|-----------|--------|
| `/cart` | GET | None | ✅ Implemented |
| `/cart/add` | POST | `{ courseId }` | ⚠️ Path mismatch |
| `/cart/remove/{courseId}` | DELETE | None | ✅ Correct (DELETE with courseId) |
| `/cart/clear` | DELETE | None | ⚠️ Extra endpoint |

---

### 4. Order API
**File:** [src/features/order/orderApi.ts](src/features/order/orderApi.ts)

| Endpoint | Method | Data Sent | Status |
|----------|--------|-----------|--------|
| `/orders/my-orders` | GET | None | ⚠️ Path mismatch |
| `/orders/{id}` | GET | None | ✅ Extra (not in targets) |

---

### 5. Payment API
**File:** [src/features/payment/paymentApi.ts](src/features/payment/paymentApi.ts)

| Endpoint | Method | Data Sent | Status |
|----------|--------|-----------|--------|
| `/payment/create-checkout-session` | POST | `{ courseIds }` | ⚠️ Path & data mismatch |
| `/payment/verify` | POST | `{ sessionId }` | ✅ Extra (not in targets) |

---

### 6. Admin API
**File:** [src/features/admin/adminApi.ts](src/features/admin/adminApi.ts)

| Endpoint | Method | Data Sent | Status |
|----------|--------|-----------|--------|
| `/admin/courses/pending` | GET | None | ✅ Extra (not in targets) |
| `/admin/courses` | GET | None | ✅ Extra (not in targets) |
| `/admin/courses/{id}/approve` | PATCH | None | ✅ Extra (not in targets) |
| `/admin/courses/{id}/reject` | PATCH | `{ reason? }` | ✅ Extra (not in targets) |

---

## Target Endpoints

| # | Endpoint | Method | Expected Data | Current Status |
|----|----------|--------|---------------|-----------------|
| 1 | `/auth/register` | POST | `{ name, email, password, role }` | ✅ MATCHES |
| 2 | `/auth/login` | POST | `{ email, password }` | ✅ MATCHES |
| 3 | `/course/create` | POST | FormData | ❌ MISSING - Currently: `/courses` |
| 4 | `/course/update/{courseId}` | PUT | FormData | ❌ MISSING - Currently: `/courses/{id}` |
| 5 | `/course/delete/{courseId}` | DELETE | None | ❌ MISSING - Currently: `/courses/{id}` |
| 6 | `/course/list` | GET | Query params | ❌ MISSING - Currently: `/courses` |
| 7 | `/course/detail/{courseId}` | GET | None | ❌ MISSING - Currently: `/courses/{id}` |
| 8 | `/course/search?q=query` | GET | Query string | ⚠️ PARTIAL - Currently included in `/courses` with filters |
| 9 | `/cart` | POST | `{ courseId }` | ❌ MISSING - Currently: `/cart/add` |
| 10 | `/cart` | GET | None | ✅ MATCHES |
| 11 | `/cart` | DELETE | `{ courseId }` | ⚠️ MISMATCH - Currently: `/cart/remove/{courseId}` |
| 12 | `/payment/create-intent` | POST | `{ courseIds }` | ❌ MISSING - Currently: `/payment/create-checkout-session` |
| 13 | `/order` | POST | Cart data | ❌ MISSING - No current implementation |
| 14 | `/order/myCourses` | GET | None | ❌ MISSING - Currently: `/orders/my-orders` |
| 15 | `/course/{courseId}/content` | GET | None | ❌ MISSING - Not implemented |
| 16 | `/course/{courseId}/rate` | GET | None | ❌ WRONG METHOD - Currently: POST (which is correct for rating) |

---

## Summary of Mismatches

### Path Discrepancies
- **Course endpoints**: Using `/courses` instead of `/course`
  - `/courses` → should be `/course/list`
  - `/courses/{id}` → should be `/course/detail/{id}`
  - `/courses` (POST) → should be `/course/create`
  - `/courses/{id}` (PUT) → should be `/course/update/{id}`
  - `/courses/{id}` (DELETE) → should be `/course/delete/{id}`

- **Cart endpoints**: 
  - `/cart/add` → should be POST `/cart` directly
  - `/cart/remove/{courseId}` → should be DELETE `/cart` with courseId in request body or params

- **Order endpoints**:
  - `/orders/my-orders` → should be `/order/myCourses`
  - Missing: POST `/order` (create order endpoint)

- **Payment endpoints**:
  - `/payment/create-checkout-session` → should be `/payment/create-intent`

### Missing Endpoints (NOT IMPLEMENTED)
1. **POST `/order`** - Create order endpoint (currently using `/orders/my-orders`)
2. **GET `/course/{courseId}/content`** - Fetch course content/lessons
3. **GET `/course/{courseId}/rate`** - The spec says this should be GET, but POST makes more sense for rating

### Extra Endpoints (Implemented, not in targets)
1. GET `/auth/profile` - Get current user profile
2. POST `/auth/logout` - Logout functionality
3. GET `/courses/tutor/my-courses` - Get tutor's courses
4. GET `/courses/my-learning` - Get enrolled courses
5. POST `/payment/verify` - Verify payment after checkout
6. GET `/orders/{id}` - Get specific order details
7. GET `/admin/courses/pending` - Admin: get pending courses
8. GET `/admin/courses` - Admin: get all courses
9. PATCH `/admin/courses/{id}/approve` - Admin: approve course
10. PATCH `/admin/courses/{id}/reject` - Admin: reject course
11. DELETE `/cart/clear` - Clear entire cart

---

## Detailed Comparison Table

| Feature | Target Endpoint | Current Implementation | Action Needed |
|---------|-----------------|----------------------|----------------|
| **Auth** | | | |
| Register | POST `/auth/register` | POST `/auth/register` | ✅ No change |
| Login | POST `/auth/login` | POST `/auth/login` | ✅ No change |
| **Course CRUD** | | | |
| Create | POST `/course/create` | POST `/courses` | 🔄 Update path |
| Update | PUT `/course/update/{courseId}` | PUT `/courses/{id}` | 🔄 Update path |
| Delete | DELETE `/course/delete/{courseId}` | DELETE `/courses/{id}` | 🔄 Update path |
| List | GET `/course/list` | GET `/courses` | 🔄 Update path |
| Detail | GET `/course/detail/{courseId}` | GET `/courses/{id}` | 🔄 Update path |
| Search | GET `/course/search?q=query` | GET `/courses?search=query` | ⚠️ Query param differs |
| Rate | POST `/course/{courseId}/rate` | POST `/courses/{courseId}/rate` | 🔄 Update path |
| **Cart** | | | |
| Add | POST `/cart` | POST `/cart/add` | 🔄 Update path |
| Get | GET `/cart` | GET `/cart` | ✅ No change |
| Remove | DELETE `/cart` | DELETE `/cart/remove/{courseId}` | 🔄 Update path & method |
| **Order** | | | |
| Create | POST `/order` | NOT IMPLEMENTED | ❌ Implement |
| Get User Orders | GET `/order/myCourses` | GET `/orders/my-orders` | 🔄 Update path |
| **Payment** | | | |
| Create Intent | POST `/payment/create-intent` | POST `/payment/create-checkout-session` | 🔄 Update path |
| **Course Content** | GET `/course/{courseId}/content` | NOT IMPLEMENTED | ❌ Implement |

---

## Recommendations for Backend Team

### Critical Changes Required:
1. **Rename all `/courses` endpoints to `/course`** for consistency
2. **Rename `/orders/my-orders` to `/order/myCourses`**
3. **Rename `/payment/create-checkout-session` to `/payment/create-intent`**
4. **Implement missing `/order` POST endpoint** to create orders
5. **Implement missing `/course/{courseId}/content` endpoint** to fetch course content

### Path Updates Needed:
- `/courses` → `/course/list`
- `/courses/{id}` → `/course/detail/{id}`
- `/courses` (POST) → `/course/create`
- `/courses/{id}` (PUT) → `/course/update/{id}`
- `/courses/{id}` (DELETE) → `/course/delete/{id}`
- `/cart/add` → `/cart` (POST)
- `/cart/remove/{courseId}` → `/cart` (DELETE with courseId)

### Optional Improvements:
- Keep existing extra endpoints (auth/profile, auth/logout, admin endpoints, etc.) as they provide useful functionality
- Consider standardizing DELETE `/cart` to accept courseId in request body rather than URL params for consistency

---

## How to Update Frontend Code

Once backend endpoints are updated, the following files will need modifications:

1. [src/features/course/courseApi.ts](src/features/course/courseApi.ts) - Update all course endpoint paths
2. [src/features/cart/cartApi.ts](src/features/cart/cartApi.ts) - Update cart endpoint paths
3. [src/features/order/orderApi.ts](src/features/order/orderApi.ts) - Update order endpoint paths; add POST `/order`
4. [src/features/payment/paymentApi.ts](src/features/payment/paymentApi.ts) - Update payment endpoint paths
