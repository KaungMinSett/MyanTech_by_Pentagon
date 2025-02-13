<template>
  <MainLayout>
    <RouterView></RouterView>
  </MainLayout>
</template>

<script setup>
import { RouterView } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import { useAuthStore } from './stores/authStore';
import { onMounted } from 'vue';
import { useCartStore } from './stores/cartStore';
import { useAppStore } from './stores/appStore';

const authStore = useAuthStore()
const cartStore = useCartStore()
const appStore = useAppStore()

onMounted(async () => {
  appStore.getProudcts();
  cartStore.initializeCart();
  await authStore.getUser();
})
</script>