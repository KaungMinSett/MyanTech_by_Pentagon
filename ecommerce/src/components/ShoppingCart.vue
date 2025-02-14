<template>
  <div class="drawer drawer-end">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Page content here -->
      <label for="my-drawer-4" class="drawer-button relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-shopping-basket">
          <path d="m15 11-1 9" />
          <path d="m19 11-4-7" />
          <path d="M2 11h20" />
          <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
          <path d="M4.5 15.5h15" />
          <path d="m5 11 4-7" />
          <path d="m9 11 1 9" />
        </svg>
        <!-- Badge for item count -->
        <span v-if="totalItems > 0"
          class="absolute -top-1 -right-1 bg-neutral text-neutral-content rounded-full text-xs px-1">{{ totalItems
          }}</span>
      </label>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="menu bg-base-200 text-base-content min-h-full w-80 flex flex-col justify-between">
        <!-- Header -->
        <section class="py-4 px-1 flex justify-between items-center border-b">
          <span class="font-bold text-xl">Shopping Cart</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-x">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </section>
        <!-- Items -->
        <section class="border-b grow overflow-y-auto p-2">
          <section v-if="cartItems.length < 1" class="text-center">
            <p class="font-semibold mb-2">Wanna Browse Around?</p>
            <router-link :to="{ name: 'products' }" class="btn">Browse</router-link>
          </section>
          <section v-for="item in cartItems" :key="item.productId" class="flex gap-4 items-center mb-4 border-b py-2">
            <!-- Image -->
            <img :src="'http://127.0.0.1:8000' + item.details.image" :alt="item.name"
              class="w-16 h-16 object-contain rounded" />
            <!-- Name & Quantity -->
            <div class="flex-1">
              <p class="font-semibold uppercase">{{ item.name }}</p>
              <!-- Quantity Controller -->
              <div class="flex items-center mt-2">
                <button @click="decrementQuantity(item.productId)" class="btn btn-circle btn-sm neutral-content shadow">
                  -
                </button>
                <input type="number" id="quantity" min="1" :value="item.quantity"
                  @input="updateQuantity(item.productId, $event.target.value)"
                  class="w-12 text-center focus:outline-none border-none font-bold" />
                <button @click="incrementQuantity(item.productId)" class="btn btn-circle btn-sm neutral-content shadow">
                  +
                </button>
              </div>
            </div>
            <!-- Remove & Price -->
            <div class="flex flex-col items-end">
              <button @click="removeFromCart(item.productId)" class="text-sm interactive">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="lucide lucide-trash">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
              <p class="text-sm">${{ (item.details.price * item.quantity).toFixed(2) }}</p>
            </div>
          </section>
        </section>
        <!-- Footer -->
        <section v-if="totalItems > 0" class="py-4">
          <section class="flex justify-between items-center text-xl font-bold mb-4">
            <span>Subtotal</span>
            <span>${{ cartTotal.toFixed(2) }}</span>
          </section>
          <router-link :to="{name:'checkout'}">
            <button class="btn btn-block btn-neutral">Checkout</button>
          </router-link>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useCartStore } from '../stores/cartStore'; // Adjust the path as needed
import { useAppStore } from '../stores/appStore'; // Adjust the path as needed

const cartStore = useCartStore();
const appStore = useAppStore();

// Fetch products when the component mounts
onMounted(async () => {
  await appStore.getProducts();
  cartStore.initializeCart();
});

// Get cart items with product details
const cartItems = computed(() => {
  return cartStore.items.map(cartItem => {
    const product = appStore.products.find(p => p.id === cartItem.productId);
    return {
      ...cartItem,
      name: product?.name || 'Unknown Product',
      details: product?.details || { price: 0, image: '' }
    };
  });
});

// Calculate cart total
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.details.price * item.quantity), 0);
});

// Calculate total number of items in the cart
const totalItems = computed(() => {
  return cartStore.items.reduce((total, item) => total + item.quantity, 0);
});

// Remove item from cart
const removeFromCart = (productId) => {
  cartStore.removeFromCart(productId);
};

// Increment quantity
const incrementQuantity = (productId) => {
  const item = cartStore.items.find(item => item.productId === productId);
  if (item) {
    cartStore.addToCart(productId, 1);
  }
};

// Decrement quantity
const decrementQuantity = (productId) => {
  const item = cartStore.items.find(item => item.productId === productId);
  if (item && item.quantity > 1) {
    cartStore.addToCart(productId, -1);
  }
};

// Update quantity manually
const updateQuantity = (productId, newQuantity) => {
  const item = cartStore.items.find(item => item.productId === productId);
  if (item) {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity)) {
      cartStore.updateQuantity(productId, quantity);
    }
  }
};
</script>