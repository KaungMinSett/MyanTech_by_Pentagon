<template>

<div class="drawer">
        <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
            <!-- Navbar -->
            <Navbar />
            <!-- Page content here -->
            <div class="mt-16 xl:mt-18 min-h-screen">
                <slot></slot>
            </div>

            <Footer />
        </div>
        <div class="drawer-side">
            <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
            <ul class="menu bg-base-200 min-h-full w-80 p-4">
                <!-- Sidebar content here -->
                <li>
                    <router-link :to="{ name: 'products' }" class="font-semibold">Products</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'support' }" class="font-semibold">Support</router-link>
                </li>
            </ul>
        </div>
    </div>

</template>

<script setup>
import Navbar from "../components/Navbar.vue"
import Footer from "../components/Footer.vue"
</script>