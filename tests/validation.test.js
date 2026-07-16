import { test, expect } from "vitest";
import { addToCartSchema } from "@/lib/validations";

// Test 1: Valid data pass honi chahiye
test("valid cart data should pass", () => {
  const result = addToCartSchema.safeParse({ productId: 1, quantity: 2 });
  expect(result.success).toBe(true);
});

//Test 2: Invalid data fail honi chahiye
test("invalid cart data should fail", () => {
  const result = addToCartSchema.safeParse({ productId: -5, quantity: 2 });
  expect(result.success).toBe(false);
});

// Test 3: Quantity zero fail honi chahiye
test("quantity zero should fail", () => {
  const result = addToCartSchema.safeParse({
    productId: 1,
    quantity: 0,
  });

  expect(result.success).toBe(false);
});

// Test 4: Quantity 20 se zyada fail honi chahiye
test("quantity above 20 should fail", () => {
  const result = addToCartSchema.safeParse({
    productId: 1,
    quantity: 25,
  });

  expect(result.success).toBe(false);
});
