<template>
    <div>

        <!-- Search Sorting -->
        <section class="mx-auto w-10/12 border-b border-neutral-300 py-2 flex justify-between items-center">
            <section class="grow">
                <label class="input w-full lg:w-1/2">
                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                            stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" class="grow" placeholder="Search" />
                    <kbd class="kbd kbd-sm">⌘</kbd>
                    <kbd class="kbd kbd-sm">K</kbd>
                </label>
            </section>
            <section class="flex-none">
                <div class="dropdown">
                    <div tabindex="0" role="button" class="btn m-1">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-sliders-horizontal">
                                <line x1="21" x2="14" y1="4" y2="4" />
                                <line x1="10" x2="3" y1="4" y2="4" />
                                <line x1="21" x2="12" y1="12" y2="12" />
                                <line x1="8" x2="3" y1="12" y2="12" />
                                <line x1="21" x2="16" y1="20" y2="20" />
                                <line x1="12" x2="3" y1="20" y2="20" />
                                <line x1="14" x2="14" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="10" y2="14" />
                                <line x1="16" x2="16" y1="18" y2="22" />
                            </svg></span>
                        <span>Filter</span>
                    </div>
                    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><a>Item 1</a></li>
                        <li><a>Item 2</a></li>
                    </ul>
                </div>
            </section>
        </section>

        <!-- Products -->
        <div class="mx-auto mt-4 w-10/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <router-link :to="{ name: 'product-details', params: { id: each.id } }" v-for="each in appStore.products"
                :key="each.id">
                <div class="card bg-base-100 interactive">
                    <figure class="bg-neutral-content rounded relative">
                        <span @click="cartStore.addToCart(each.id, 1)"
                            class="absolute bottom-2 right-2 interactive bg-base-100 p-2 rounded-full text-accent opacity-80"><svg
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-shopping-bag">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                <path d="M3 6h18" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg></span>
                        <img :src="'http://127.0.0.1:8000' + each.details.image" alt="Shoes"
                            class="h-[20rem] object-scale-down" />
                    </figure>
                    <div class="card-body">
                        <h2 class="card-title">
                            {{ each.name }}
                            <!-- <div class="badge badge-secondary">NEW</div> -->
                        </h2>
                        <span>$ {{ each.details.price }}</span>
                    </div>
                </div>
            </router-link>

        </div>

    </div>
</template>

<script setup>

import { onMounted } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useCartStore } from '../stores/cartStore';

const cartStore = useCartStore()
const appStore = useAppStore()
onMounted(async () => {
    await appStore.getProudcts()
})
</script>;