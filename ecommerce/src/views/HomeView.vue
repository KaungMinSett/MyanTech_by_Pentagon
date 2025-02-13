<template>
    <!-- Product Categories -->
    <div class="p-4">

        <HomeSwiper />

        <section class="text-center font-semibold">Products by Categories</section>

        <div class="carousel carousel-center rounded-box w-full space-x-4 p-4">
            <div class="carousel-item">
                <img src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
                    class="rounded-box" />
            </div>
            <div class="carousel-item">
                <img src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
                    class="rounded-box" />
            </div>
            <div class="carousel-item">
                <img src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
                    class="rounded-box" />
            </div>
            <div class="carousel-item">
                <img src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
                    class="rounded-box" />
            </div>
            <div class="carousel-item">
                <img src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
                    class="rounded-box" />
            </div>
            <div class="carousel-item">
                <img src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
                    class="rounded-box" />
            </div>
            <div class="carousel-item">
                <img src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
                    class="rounded-box" />
            </div>
        </div>

        <div class="hero min-h-screen"
            style="background-image: url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp);">
            <div class="hero-overlay"></div>
            <div class="hero-content text-neutral-content text-center">
                <div class="max-w-md">
                    <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
                    <p class="mb-5">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>
                    <button class="btn btn-primary">Get Started</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import HomeSwiper from "../components/swipers/HomeSwiper.vue"
</script>