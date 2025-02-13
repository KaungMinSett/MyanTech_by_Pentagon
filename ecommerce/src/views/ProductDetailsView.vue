<template>
    <div class="flex flex-col xl:flex-row xl:items-stretch min-h-screen">
      <!-- Product Image with View Mode -->
      <div class="w-full xl:w-8/12 p-10 flex justify-center items-center">
        <a
          href="https://pngimg.com/d/macbook_PNG65.png"
          data-fancybox="gallery"
          data-caption="MacBook Pro"
          class="w-72 h-72 md:w-96 md:h-96 flex items-center justify-center outline-none"
        >
          <img
            src="https://pngimg.com/d/macbook_PNG65.png"
            alt="MacBook Pro"
            class="w-full h-full object-cover rounded-lg"
          />
        </a>
      </div>
      <!-- Product Details -->
      <div class="grow p-10 flex flex-col justify-center gap-4">

        <!-- Name -->
        <h1 class="text-3xl font-bold ">MacBook Pro</h1>
        <!-- Price -->
        <p class="text-xl ">$1299.00</p>
        <!-- Details -->
        <p class="">
          The MacBook Pro is a line of Macintosh portable computers introduced in January 2006 by Apple Inc.
        </p>
        <!-- Qty -->
        <div class="flex items-center">
            <button
              @click="decrementQuantity"
              class="btn btn-circle neutral-content shadow"
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              min="1"
              v-model="quantity"
              class="w-12 text-center focus:outline-none border-none font-bold"
            />
            <button
              @click="incrementQuantity"
              class="btn btn-circle neutral-content shadow"
            >
              +
            </button>
          </div>

        <!-- Container for add to cart and wishlist -->
        <div class="flex space-x-4">
            <button  @click="cartStore.addToCart(1, 1)" class="btn btn-wide btn-neutral">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <span class="">Add to Cart</span>
            </button>
            <button class="btn">
                <span class="text-red-700"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></span>
                <span>Wishlist</span>
            </button>
        </div>


        <div tabindex="0" class="collapse collapse-plus border-base-300 bg-base-100 border border-base-300 border">
            <div class="collapse-title font-semibold">MacBook Pro Features</div>
            <div class="collapse-content text-sm">
                <ul class="list-disc pl-5">
                    <li class="text-sm mb-1">16-inch Retina Display with True Tone</li>
                    <li class="text-sm mb-1">Apple M1 Pro chip for a massive leap in CPU, GPU, and machine learning performance</li>
                </ul>
            </div>
        </div>
        <div tabindex="0" class="collapse collapse-plus border-base-300 bg-base-100 border border-base-300 border">
            <div class="collapse-title font-semibold">Specifications</div>
            <div class="collapse-content text-sm">
                <ul class="list-disc pl-5">
                    <li class="text-sm mb-1">16-inch Retina Display with True Tone</li>
                    <li class="text-sm mb-1">Apple M1 Pro chip for a massive leap in CPU, GPU, and machine learning performance</li>
                </ul>
            </div>
        </div>
      </div>

    </div>
    <RecentlyViewed />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Fancybox } from "@fancyapps/ui";
  import "@fancyapps/ui/dist/fancybox/fancybox.css";
  import RecentlyViewed from '../components/RecentlyViewed.vue';
import { useCartStore } from '../stores/cartStore';
  
  const cartStore = useCartStore();
  const quantity = ref(1);
  
  const incrementQuantity = () => {
    quantity.value++;
  };
  
  const decrementQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--;
    }
  };
  
  onMounted(() => {
    // Initialize Fancybox
    Fancybox.bind("[data-fancybox]", {
      // Options can be added here
      // Example: 
      // infinite: true,
      // loop: true,
    });
  });
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  