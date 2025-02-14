<template>
    <div class="navbar bg-base-300 w-full px-2 py-2 justify-between fixed top-0 left-0 z-10">
        <div class="flex-none lg:hidden">
            <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="inline-block h-6 w-6 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                    </path>
                </svg>
            </label>
        </div>
        <div class="mx-2 flex-none px-2">
            <span class="font-extrabold">MyanTech</span>
        </div>
        <div class="hidden flex-none lg:block">
            <ul class="menu menu-horizontal">
                <!-- Navbar menu content here -->
                <li>
                    <router-link :to="{ name: 'products' }" class="font-semibold">Products</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'support' }" class="font-semibold">Support</router-link>
                </li>
                <li>
                    <router-link v-if="!authStore.isActive" :to="{ name: 'login' }" class="font-semibold text-nowrap">
                        Log In
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="flex-none flex justify-between gap-6 items-center">
            <!-- <ThemeController class="interactive" /> -->
            <div v-if="authStore.isActive" class="dropdown dropdown-center">
                        <div tabindex="0" role="button" class="btn btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-user">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <ul tabindex="0"
                            class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm flex flex-col gap-4">
                            <li>
                                <span class="font-semibold text-sm uppercase">{{ authStore.user.username }}</span>
                            </li>
                            <li>
                                <router-link :to="{ name: 'history' }"
                                    class="font-semibold text-sm uppercase">History</router-link>
                            </li>
                            <li>
                                <button class="btn btn-neutral"
                                    @click="authStore.logoutUser(); router.push('/');">Logout</button>
                            </li>
                        </ul>
                    </div>
            <ShoppingCart />
        </div>
    </div>
</template>


<script setup>
import ShoppingCart from './ShoppingCart.vue';
import ThemeController from './ThemeController.vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()
</script>