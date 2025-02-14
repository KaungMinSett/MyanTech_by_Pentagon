<template>
    <!-- Product Categories -->
    <div class="p-4">

        <!-- <HomeSwiper /> -->

        <div class="hero min-h-[400px] rounded"
            style="background-image: url(https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309649.jpg);">
            <div class="hero-overlay bg-black/75"></div>
            <div class="hero-content text-neutral-content text-center">
                <div class="max-w-md">
                    <h1 class="mb-5 text-3xl lg:text-5xl font-bold">Hello there</h1>
                    <p class="mb-5 text-lg lg:text-3xl">
                        Provident cupiditate voluptatem et in.
                    </p>
                    <router-link :to="{name:'products'}" class="btn bg-accent">Explore</router-link>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import HomeSwiper from "../components/swipers/HomeSwiper.vue"
</script>