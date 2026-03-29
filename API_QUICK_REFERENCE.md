# API Endpoint Quick Reference

## ✅ MATCHING ENDPOINTS (2/16)
```
1. POST /auth/register ✅
2. POST /auth/login ✅
```

## 🔄 MISMATCHED ENDPOINTS (11/16)
These exist but have wrong paths:

### Course Endpoints (6 mismatches):
```
Current                          │ Target
─────────────────────────────────┼──────────────────────────
GET /courses                     │ GET /course/list
GET /courses/{id}                │ GET /course/detail/{id}
POST /courses                    │ POST /course/create
PUT /courses/{id}                │ PUT /course/update/{id}
DELETE /courses/{id}             │ DELETE /course/delete/{id}
POST /courses/{id}/rate          │ POST /course/{id}/rate
```

### Cart Endpoints (3 mismatches):
```
Current                          │ Target
─────────────────────────────────┼──────────────────────────
POST /cart/add                   │ POST /cart
DELETE /cart/remove/{courseId}   │ DELETE /cart
```

### Order Endpoints (2 mismatches):
```
Current                          │ Target
─────────────────────────────────┼──────────────────────────
GET /orders/my-orders            │ GET /order/myCourses
```

### Payment Endpoints (1 mismatch):
```
Current                          │ Target
─────────────────────────────────┼──────────────────────────
POST /payment/create-checkout... │ POST /payment/create-intent
```

---

## ❌ MISSING ENDPOINTS (3/16)
These have NO implementation:

```
1. POST /api/order
   - Purpose: Create a new order
   - Expected Data: { courseIds: string[] }
   - File to Update: src/features/order/orderApi.ts

2. GET /api/course/:courseId/content
   - Purpose: Fetch course content/lessons
   - Expected Data: None
   - File to Update: src/features/course/courseApi.ts

3. GET /api/course/:courseId/rate (NOTE: Target spec is wrong)
   - Purpose: Get ratings for a course
   - Note: POST is correct for submitting a rating
   - Current implementation uses POST ✓
```

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Total Target Endpoints** | 16 |
| **Fully Implemented** | 2 |
| **Implemented but Wrong Path** | 11 |
| **Not Implemented** | 3 |
| **Implementation Rate** | 81.25% |
| **Accuracy Rate** | 12.5% |

---

## Implementation Status by Feature

### ✅ Authentication (2/2 - 100%)
- Register: ✅
- Login: ✅
- *Bonus: Profile, Logout (working)*

### 🟡 Courses (5/6 - 83%)
- Create: ❌ Path
- Read: ❌ Path
- Update: ❌ Path
- Delete: ❌ Path
- Rate: ❌ Path (Minor)
- Content: ❌ Missing

### 🟡 Cart (2/3 - 67%)
- Add: ❌ Path
- Get: ✅
- Remove: ❌ Path

### 🟡 Order (1/2 - 50%)
- Create: ❌ Missing
- Get My Orders: ❌ Path

### 🟡 Payment (0/1 - 0%)
- Create Intent: ❌ Path

---

## Files Affected for Updates

1. **src/features/course/courseApi.ts**
   - Update all endpoint paths (6 changes)
   - Add GET endpoint for course content

2. **src/features/cart/cartApi.ts**
   - Update endpoint paths (2 changes)

3. **src/features/order/orderApi.ts**
   - Update endpoint path (1 change)
   - Add POST endpoint to create order (1 new function)

4. **src/features/payment/paymentApi.ts**
   - Update endpoint path (1 change)
