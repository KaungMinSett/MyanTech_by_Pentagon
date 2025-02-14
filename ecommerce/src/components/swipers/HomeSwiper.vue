<template>
  <div class="swiper-container w-full h-[300px] lg:h-[600px] mx-auto">
    <div class="swiper w-full h-full">
      <div class="swiper-wrapper">
        <div class="swiper-slide flex justify-center items-center rounded-lg bg-primary shadow-md">
          <div class="slide-content"
            style="background-image: url('https://m.economictimes.com/thumb/msid-93619804,width-1600,height-900,resizemode-4,imgsize-45974/macbook-2048px-9-.jpg');">
          </div>
        </div>
        <div class="swiper-slide flex justify-center items-center rounded-lg bg-primary shadow-md">
          <div class="slide-content text-center text-2xl font-bold text-gray-800">Slide 2</div>
        </div>
        <div class="swiper-slide flex justify-center items-center rounded-lg bg-primary shadow-md">
          <div class="slide-content text-center text-2xl font-bold text-gray-800">Slide 3</div>
        </div>
      </div>
      <!-- Pagination -->
      <div class="swiper-pagination"></div>
      <!-- Navigation buttons -->
      <!-- <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

onMounted(() => {
  const swiper = new Swiper('.swiper', {
    modules: [Navigation, Pagination, Scrollbar],
    direction: 'horizontal',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
  });
});
</script>

<style>
/* Custom styles for Swiper elements (not covered by Tailwind) */
.swiper-button-prev,
.swiper-button-next {
  color: #fff;
  /* Arrow color */
  background-color: rgba(0, 0, 0, 0.5);
  /* Arrow background */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 20px;
  /* Arrow size */
}

.swiper-pagination-bullet {
  background-color: #fff;
  /* Pagination bullet color */
  opacity: 0.5;
}

.swiper-pagination-bullet-active {
  opacity: 1;
}
</style>