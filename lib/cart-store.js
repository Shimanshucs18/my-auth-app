import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],
  loading: true,

  fetchCart: async () => {
    set({ loading: true });
    const res = await fetch("/api/cart");
    const data = await res.json();
    set({ items: data.items || [], loading: false });
  },

  addToCart: async (productId, quantity = 1) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to add to cart");
    }
    await get().fetchCart();
  },

  updateQuantity: async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    await fetch(`/api/cart/${cartItemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    await get().fetchCart();
  },

  removeFromCart: async (cartItemId) => {
    await fetch(`/api/cart/${cartItemId}`, { method: "DELETE" });
    await get().fetchCart();
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
