import { create } from "zustand"

export const useCartStore = create((set, get) => ({
  items: [],
  loading: true,

  fetchCart: async () => {
    set({ loading: true })
    const res = await fetch("/api/cart")
    const data = await res.json()
    set({ items: data.items || [], loading: false })
  },

  addToCart: async (productId, quantity = 1) => {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    })
    await get().fetchCart()
  },

  removeFromCart: async (cartItemId) => {
    await fetch(`/api/cart/${cartItemId}`, { method: "DELETE" })
    await get().fetchCart()
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },
}))