<template>
    <div v-if="order" class="container mx-auto p-6">
        <section class="border-b pb-4 mb-4">
            <h1 class="text-3xl font-bold">Order #{{ order.id }}</h1>
            <router-link to="/history" class="text-blue-500">← Back to Orders</router-link>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
                <p class="text-lg">📅 Ordered on: {{ order.order_date }}</p>
                <p class="text-lg flex items-center gap-2">
                    🏷️ Status: 
                    <span class="px-2 py-1 rounded text-white" :class="getStatusColor(order.status)">
                        {{ getStatusText(order.status) }}
                    </span>
                </p>
                <p class="text-lg">📍 Shipping to: {{ order.address.name }}, {{ order.address.line }}</p>
            </div>

            <div class="bg-gray-100 p-4 rounded-lg">
                <h2 class="text-xl font-semibold mb-2">🚚 Delivery Status</h2>
                <ul class="space-y-2">
                    <li v-for="(step, index) in deliverySteps" :key="index" class="flex items-center gap-2">
                        <span :class="step.done ? 'text-green-500' : 'text-gray-400'">
                            {{ step.done ? '✅' : '⬜' }}
                        </span>
                        <span>{{ step.label }} ({{ step.date }})</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div v-else class="text-center py-10 text-lg">Loading...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../stores/appStore';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const order = ref(null);

// Fetch orders first, then validate the order
onMounted(async () => {
    await appStore.getOrders();  // Ensure orders are loaded

    const orderId = route.params.id;
    order.value = appStore.orders.find(o => o.id == orderId);

    if (!order.value) {
        router.replace('/');  // Redirect to home if order is not found
    }
});

// Status mapping
const getStatusText = (status) => ({
    "P": "Pending",
    "A": "On The Way",
    "C": "Delivered",
    "F": "Failed"
}[status] || "Unknown");

const getStatusColor = (status) => ({
    "P": "bg-yellow-400",
    "A": "bg-blue-500",
    "C": "bg-green-500",
    "F": "bg-red-500"
}[status] || "bg-gray-400");

// Delivery steps
const deliverySteps = () => {
    if (!order.value) return [];
    return order.value.deliveries.map(delivery => ({
        label: getStatusText(delivery.status),
        date: new Date(delivery.last_updated_at).toLocaleDateString(),
        done: ["C", "F"].includes(delivery.status) || delivery.status === order.value.status
    }));
};
</script>
