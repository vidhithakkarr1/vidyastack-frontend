# Frontend Code Updates Required

This document shows the exact code changes needed to align frontend API calls with target endpoints.

---

## File 1: src/features/course/courseApi.ts

### Change 1: Update getAllCourses endpoint path
```typescript
// BEFORE
getAllCourses: async (filters: CourseFilters = {}): Promise<PaginatedResponse<Course>> => {
  const { data } = await axiosInstance.get<ApiResponse<PaginatedResponse<Course>>>(
    '/courses',
    { params: filters }
  );
  return data.data;
},

// AFTER
getAllCourses: async (filters: CourseFilters = {}): Promise<PaginatedResponse<Course>> => {
  const { data } = await axiosInstance.get<ApiResponse<PaginatedResponse<Course>>>(
    '/course/list',
    { params: filters }
  );
  return data.data;
},
```

### Change 2: Update getCourseById endpoint path
```typescript
// BEFORE
getCourseById: async (id: string): Promise<Course> => {
  const { data } = await axiosInstance.get<ApiResponse<Course>>(`/courses/${id}`);
  return data.data;
},

// AFTER
getCourseById: async (id: string): Promise<Course> => {
  const { data } = await axiosInstance.get<ApiResponse<Course>>(`/course/detail/${id}`);
  return data.data;
},
```

### Change 3: Update createCourse endpoint path
```typescript
// BEFORE
createCourse: async (formData: FormData): Promise<Course> => {
  const { data } = await axiosInstance.post<ApiResponse<Course>>('/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
},

// AFTER
createCourse: async (formData: FormData): Promise<Course> => {
  const { data } = await axiosInstance.post<ApiResponse<Course>>('/course/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
},
```

### Change 4: Update updateCourse endpoint path
```typescript
// BEFORE
updateCourse: async (id: string, formData: FormData): Promise<Course> => {
  const { data } = await axiosInstance.put<ApiResponse<Course>>(
    `/courses/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data.data;
},

// AFTER
updateCourse: async (id: string, formData: FormData): Promise<Course> => {
  const { data } = await axiosInstance.put<ApiResponse<Course>>(
    `/course/update/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data.data;
},
```

### Change 5: Update deleteCourse endpoint path
```typescript
// BEFORE
deleteCourse: async (id: string): Promise<void> => {
  await axiosInstance.delete(`/courses/${id}`);
},

// AFTER
deleteCourse: async (id: string): Promise<void> => {
  await axiosInstance.delete(`/course/delete/${id}`);
},
```

### Change 6: Update rateCourse endpoint path
```typescript
// BEFORE
rateCourse: async (payload: RatingPayload): Promise<void> => {
  await axiosInstance.post(`/courses/${payload.courseId}/rate`, {
    rating: payload.rating,
    review: payload.review,
  });
},

// AFTER
rateCourse: async (payload: RatingPayload): Promise<void> => {
  await axiosInstance.post(`/course/${payload.courseId}/rate`, {
    rating: payload.rating,
    review: payload.review,
  });
},
```

### Change 7: ADD NEW - Get course content endpoint
```typescript
// ADD THIS NEW FUNCTION
getCourseContent: async (id: string): Promise<any> => {
  const { data } = await axiosInstance.get<ApiResponse<any>>(`/course/${id}/content`);
  return data.data;
},
```

---

## File 2: src/features/cart/cartApi.ts

### Change 1: Update addToCart endpoint path and structure
```typescript
// BEFORE
addToCart: async (courseId: string): Promise<Cart> => {
  const { data } = await axiosInstance.post<ApiResponse<Cart>>('/cart/add', { courseId });
  return data.data;
},

// AFTER
addToCart: async (courseId: string): Promise<Cart> => {
  const { data } = await axiosInstance.post<ApiResponse<Cart>>('/cart', { courseId });
  return data.data;
},
```

### Change 2: Update removeFromCart endpoint path and structure
```typescript
// BEFORE
removeFromCart: async (courseId: string): Promise<Cart> => {
  const { data } = await axiosInstance.delete<ApiResponse<Cart>>(`/cart/remove/${courseId}`);
  return data.data;
},

// AFTER
removeFromCart: async (courseId: string): Promise<Cart> => {
  const { data } = await axiosInstance.delete<ApiResponse<Cart>>('/cart', { 
    data: { courseId }  // or via params: { params: { courseId } } if backend expects query
  });
  return data.data;
},
```

---

## File 3: src/features/order/orderApi.ts

### Change 1: Update getMyOrders endpoint path
```typescript
// BEFORE
getMyOrders: async (): Promise<Order[]> => {
  const { data } = await axiosInstance.get<ApiResponse<Order[]>>('/orders/my-orders');
  return data.data;
},

// AFTER
getMyOrders: async (): Promise<Order[]> => {
  const { data } = await axiosInstance.get<ApiResponse<Order[]>>('/order/myCourses');
  return data.data;
},
```

### Change 2: ADD NEW - Create order endpoint
```typescript
// ADD THIS NEW FUNCTION
createOrder: async (courseIds: string[]): Promise<Order> => {
  const { data } = await axiosInstance.post<ApiResponse<Order>>('/order', { courseIds });
  return data.data;
},
```

---

## File 4: src/features/payment/paymentApi.ts

### Change 1: Update createCheckoutSession endpoint path and data structure
```typescript
// BEFORE
createCheckoutSession: async (courseIds: string[]): Promise<CheckoutSessionResponse> => {
  const { data } = await axiosInstance.post<ApiResponse<CheckoutSessionResponse>>(
    '/payment/create-checkout-session',
    { courseIds }
  );
  return data.data;
},

// AFTER
createCheckoutSession: async (courseIds: string[]): Promise<CheckoutSessionResponse> => {
  const { data } = await axiosInstance.post<ApiResponse<CheckoutSessionResponse>>(
    '/payment/create-intent',
    { courseIds }
  );
  return data.data;
},
```

---

## Summary of Changes

### Total Updates Required: 11

- **Course API**: 7 changes (6 path updates + 1 new endpoint)
- **Cart API**: 2 changes (path/structure updates)
- **Order API**: 2 changes (1 path update + 1 new endpoint)
- **Payment API**: 1 change (path update)

### Implementation Priority

**Phase 1 (Critical)** - Auth endpoints (0 changes, already correct)
**Phase 2 (High)** - Course endpoints (7 changes) - Used most frequently
**Phase 3 (Medium)** - Cart endpoints (2 changes) - Core checkout flow
**Phase 4 (Medium)** - Order endpoints (2 changes) - Post-purchase
**Phase 5 (Low)** - Payment endpoints (1 change) - Integration point

---

## Testing Checklist

After applying changes, verify:

- [ ] Login/Register still work (no changes)
- [ ] Course listing loads with new endpoint
- [ ] Course detail loads with new endpoint
- [ ] Create course works as tutor
- [ ] Update course works as tutor
- [ ] Delete course works as tutor
- [ ] Rate course works with new endpoint
- [ ] Add to cart works with new endpoint
- [ ] Get cart works (no changes)
- [ ] Remove from cart works with new endpoint
- [ ] Create order endpoint responds correctly
- [ ] Get my orders works with new endpoint
- [ ] Payment intent created with new endpoint
- [ ] Course content endpoint works

---

## Notes

1. **DELETE /cart change**: Current implementation uses URL parameter `/cart/remove/{courseId}`. Update needs to accept courseId in request body instead. Verify backend implementation.

2. **POST /order**: Currently no implementation exists. Need to coordinate with backend for expected payload and response.

3. **GET /course/:courseId/content**: Currently not implemented. Need backend implementation.

4. **Search functionality**: Currently handled via `/course/list?search=query`. Ensure backend supports this parameter.

5. **Pagination**: Ensure `/course/list` supports page and limit parameters for pagination.
