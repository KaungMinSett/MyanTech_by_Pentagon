import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  actions: {
    initializeCart() {
      console.log('Initializing cart from localStorage');
      const cart = localStorage.getItem('cart');
      if (cart) {
        this.items = JSON.parse(cart);
      }
    },
    addToCart(productId, quantity) {
      console.log('Adding to the cart');
      const existingItem = this.items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({ productId, quantity });
      }
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    clearCart() {
      this.items = [];
      localStorage.removeItem('cart');
    }
  },
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    cartTotal: (state) => {
      // Assuming you have access to product prices
      return state.items.reduce((total, item) => total + (item.quantity * item.price), 0);
    }
  }
});