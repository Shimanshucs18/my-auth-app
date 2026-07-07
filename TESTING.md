# API Test Cases

Manual test cases for the core API endpoints.

---

## Cart API — POST /api/cart

### Test 1: Add valid product to cart

- **Input:** `{ productId: 1, quantity: 1 }`
- **Expected:** 200 OK, `{ message: "Added to cart!" }`

### Test 2: Reject invalid product ID

- **Input:** `{ productId: 999, quantity: 1 }`
- **Expected:** 404, `{ error: "Product not found" }`

### Test 3: Reject out-of-stock product

- **Input:** `{ productId: 3, quantity: 1 }` (Coffee Maker, stock: 0)
- **Expected:** 400, `{ error: "Product is out of stock" }`

### Test 4: Reject quantity above stock

- **Input:** `{ productId: 1, quantity: 20 }` (Headphones, stock: 15)
- **Expected:** 400, `{ error: "Only 15 item(s) available in stock" }`

### Test 5: Reject unauthenticated request

- **Input:** No token cookie, `{ productId: 1, quantity: 1 }`
- **Expected:** 401, `{ error: "Unauthorized" }`

---

## Orders API — POST /api/orders

### Test 6: Checkout empty cart

- **Setup:** Empty cart
- **Expected:** 400, `{ error: "Cart is empty" }`

### Test 7: Checkout valid cart

- **Setup:** Add product 1 (qty: 1) and product 2 (qty: 1) to cart
- **Expected:** 200 OK, order created with correct total

### Test 8: Checkout cart with out-of-stock product

- **Setup:** Manually insert cart item with product_id: 3 (stock: 0)
- **Expected:** 400, `{ error: "Coffee Maker is out of stock" }`, order rolled back

### Test 9: Checkout cart with quantity exceeding stock

- **Setup:** Manually insert cart item with product_id: 1, quantity: 20 (stock: 15)
- **Expected:** 400, `{ error: "Only 15 item(s) available for Wireless Headphones" }`, order rolled back

### Test 10: Reject unauthenticated request

- **Input:** No token cookie
- **Expected:** 401, `{ error: "Unauthorized" }`

---

## Auth API

### Test 11: Register with valid data

- **Input:** `{ name: "Test", email: "test@example.com", password: "Test@1234" }`
- **Expected:** 201, `{ message: "Account created!" }`

### Test 12: Register with duplicate email

- **Input:** Same email as existing user
- **Expected:** 400, `{ error: "Email already registered" }`

### Test 13: Login with valid credentials

- **Input:** `{ email: "admin@myapp.com", password: "Admin@123" }`
- **Expected:** 200, sets token + refresh_token cookies

### Test 14: Login with wrong password

- **Input:** `{ email: "admin@myapp.com", password: "wrongpassword" }`
- **Expected:** 401, `{ error: "Invalid email or password" }`

### Test 15: Rate limiting — lock after 5 failed attempts

- **Input:** Same email, wrong password × 5
- **Expected:** 6th attempt returns 429, `{ error: "Account locked! 1 minute baad try karo." }`
