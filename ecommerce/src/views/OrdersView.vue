<template>
    <div class="px-2 lg:px-6 py-4">
        <section class="py-4 border-b text-4xl font-bold">Order History</section>

        <div class="py-4">
            <div class="text-lg">{{ appStore.orders.length }} Order/s</div>

            <!-- Order Cards Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4" v-if="appStore.orders.length">
                <div v-for="order in appStore.orders" :key="order.id"
                    class="card card-bordered bg-base-100 w-96 shadow-lg">
                    <div class="card-body">
                        <h2 class="card-title border-b py-2 mb-2">Order #{{ order.id }}</h2>
                        <div class="text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-calendar-days">
                                <path d="M8 2v4" />
                                <path d="M16 2v4" />
                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                <path d="M3 10h18" />
                                <path d="M8 14h.01" />
                                <path d="M12 14h.01" />
                                <path d="M16 14h.01" />
                                <path d="M8 18h.01" />
                                <path d="M12 18h.01" />
                                <path d="M16 18h.01" />
                            </svg>
                            <span>{{ order.order_date }}</span>
                        </div>
                        <div class="text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-map-pin">
                                <path
                                    d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{{ order.address.name }}</span>
                        </div>
                        <div class="text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-package">
                                <path
                                    d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                                <path d="M12 22V12" />
                                <polyline points="3.29 7 12 12 20.71 7" />
                                <path d="m7.5 4.27 9 5.15" />
                            </svg>
                            <span>{{ order.order_items.length }} Items</span>
                        </div>
                        <div class="text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-truck">
                                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                                <path d="M15 18H9" />
                                <path
                                    d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                                <circle cx="17" cy="18" r="2" />
                                <circle cx="7" cy="18" r="2" />
                            </svg>
                        <div class="tooltip" :data-tip="getMostRecentDeliveryStatus(order.deliveries)">
                            <div class="w-4 h-4 rounded-full" :class="getDeliveryStatusColor(order.deliveries)">
                            </div>
                        </div>
                        </div>

                        <div class="card-actions justify-end">
                            <button class="btn btn-neutral">Details</button>
                            <button class="btn btn-base-300">Invoice</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAppStore } from '../stores/appStore';

const appStore = useAppStore();

// Helper function to get the most recent delivery status
const getMostRecentDeliveryStatus = (deliveries) => {
    if (!deliveries || deliveries.length === 0) return 'No Deliveries';

    const sortedDeliveries = deliveries.sort((a, b) =>
        new Date(b.last_updated_at) - new Date(a.last_updated_at)
    );

    const statusMap = {
        "P": "Pending",
        "A": "On The Way",
        "C": "Delivered",
        "F": "Failed"
    };

    return statusMap[sortedDeliveries[0].status] || 'Unknown Status';
};

// Helper function to get the color indicator for status
const getDeliveryStatusColor = (deliveries) => {
    if (!deliveries || deliveries.length === 0) return 'bg-gray-400';

    const sortedDeliveries = deliveries.sort((a, b) =>
        new Date(b.last_updated_at) - new Date(a.last_updated_at)
    );

    const colorMap = {
        "P": "bg-yellow-400",  // Pending - Yellow
        "A": "bg-blue-500",    // On The Way - Blue
        "C": "bg-green-500",   // Delivered - Green
        "F": "bg-red-500"      // Failed - Red
    };

    return colorMap[sortedDeliveries[0].status] || 'bg-gray-400';
};

onMounted(async () => {
    await appStore.getOrders();
});
</script>