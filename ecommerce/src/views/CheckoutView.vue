<template>
    <div class="w-full lg:w-8/12 mx-auto space-y-8 py-4 px-2">
        <!-- {{ location }}
        {{ phone }}
        {{ saveAddress }} -->
        <!-- Step 1 - Select a Location -->
        <div class="flex items-start">

            <!-- Step Content -->
            <div class="  compact flex-1">
                <div class="">
                    <h2 class="checkout-step-title">Step 1: Select a Location</h2>
                    <div class="step-content">
                        <AddressLocator @location-selected="handleLocationSelected" />
                    </div>

                </div>
            </div>
        </div>

        <!-- Step 2 - Enter Phone Number -->
        <div class="flex items-start">

            <!-- Step Content -->
            <div class="  compact flex-1">
                <div class="">
                    <h2 class="checkout-step-title">Step 2: Enter Your Phone Number</h2>
                    <div class="step-content">
                        <label class="input validator w-full lg:w-1/2">
                            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <g fill="none">
                                    <path
                                        d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                                        fill="currentColor"></path>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                                        fill="currentColor"></path>
                                </g>
                            </svg>
                            <input v-model="phone" type="tel" class="tabular-nums" required placeholder="Phone"
                                pattern="[0-9]*" minlength="10" maxlength="10" title="Must be 10 digits" />
                        </label>
                        <p class="validator-hint">Must be 10 digits</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 3 - Review Your Order -->
        <div class="flex items-start">
            <!-- Step Content -->
            <div class="  compact flex-1">
                <div class="">
                    <h2 class="checkout-step-title">Step 3: Review Your Order</h2>
                    <div class="step-content">

                        <div v-for="each in cartItems" class="flex items-center justify-between p-4 rounded-lg">
                            <img :src="'http://127.0.0.1:8000' + each.details.image" alt="Item Image"
                                class="w-20 h-20 rounded-lg" />
                            <div class="flex-1 ml-4">
                                <span class="block font-semibold">{{ each.name }}</span>
                                <span class="block text-sm opacity-50">Quantity: {{ each.quantity }}</span>
                            </div>
                            <span class="text-lg font-bold">${{ each.details.price }}</span>
                        </div>

                        <!-- Add more cart items here if needed -->
                        <div class="mt-4 flex justify-between items-center border-t pt-4">
                            <span class="text-lg font-semibold">Total</span>
                            <span class="text-lg font-bold">${{ totalPrice.toFixed(2) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 4 - Confirm Order -->
        <div class="flex items-start">
            <div class="  compact flex-1">
                <div class="">
                    <h2 class="checkout-step-title">Step 4: Confirm Order</h2>
                    <div class="step-content">
                        <button @click="confirmOrder" class="btn btn-primary w-full mt-4">Confirm Order</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import AddressLocator from '../components/checkout/AddressLocator.vue';
import { useAppStore } from '../stores/appStore';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();
const cartStore = useCartStore();
// Get cart items with product details
const cartItems = computed(() => {
    return cartStore.items.map(cartItem => {
        const product = appStore.products.find(p => p.id === cartItem.productId);
        return {
            ...cartItem,
            name: product?.name || 'Unknown Product',
            details: product?.details || { price: 0, image: '' }
        };
    });
});

// Calculate the total price
const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + (item.details.price * item.quantity);
    }, 0);
});

// State for user data
const phone = ref('');
const saveAddress = ref(false);
const location = ref({
    coordinates: null, // { latitude, longitude }
    name: '', // Address name or description
});

// Handle location selection from AddressLocator component
const handleLocationSelected = (selectedLocation) => {
    location.value = {
        ...selectedLocation.coordinates,
        name: selectedLocation.locationName,
    };
};


// Confirm order handler
const confirmOrder = async () => {
    if (!phone.value) return;
    if (!location.value) return;
    console.log(location.value)
    location.value = {
        lat: parseFloat(location.value.lat.toFixed(6)),
        lng: parseFloat(location.value.lng.toFixed(6)),
        name: location.value.name.trim(),
    };
    console.log(authStore.user)

    try {
        await appStore.order(
            cartItems.value.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                name: item.name,
                price: item.details.price,
            })),
            phone.value,
            authStore.user.customer,
            location.value,
            saveAddress.value,
        )
        cartStore.clearCart();
        router.push("/")
    } catch (error) {

    }
    // You can now send this data to your backend or perform further actions
};
</script>