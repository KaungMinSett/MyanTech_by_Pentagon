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

const authStore = useAuthStore()
onMounted(async () => {
  await authStore.getUser()
})
</script>