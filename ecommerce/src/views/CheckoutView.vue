<template>
    <div class="w-full lg:w-8/12 mx-auto space-y-8 py-4">
        <!-- Step 1 - Select a Location -->
        <div class="flex items-start">
            <!-- Vertical Line -->
            <div class="relative w-1 bg-primary h-full mr-4">
                <div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            </div>
            <!-- Step Content -->
            <div class="card shadow-lg compact flex-1">
                <div class="card-body">
                    <h2 class="checkout-step-title">Step 1: Select a Location</h2>
                    <div class="step-content">
                        <AddressLocator @location-selected="handleLocationSelected" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 2 - Enter Phone Number -->
        <div class="flex items-start">
            <!-- Vertical Line -->
            <div class="relative w-1 bg-primary h-full mr-4">
                <div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            </div>
            <!-- Step Content -->
            <div class="card shadow-lg compact flex-1">
                <div class="card-body">
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
            <div class="card shadow-lg compact flex-1">
                <div class="card-body">
                    <h2 class="checkout-step-title">Step 3: Review Your Order</h2>
                    <div class="step-content">
                        <div class="flex items-center justify-between p-4 rounded-lg">
                            <img src="https://via.placeholder.com/80" alt="Item Image" class="w-20 h-20 rounded-lg" />
                            <div class="flex-1 ml-4">
                                <span class="block font-semibold">Product Name</span>
                                <span class="block text-sm opacity-50">Quantity: 8</span>
                            </div>
                            <span class="text-lg font-bold">$0.00</span>
                        </div>
                        <!-- Add more cart items here if needed -->
                        <div class="mt-4 flex justify-between items-center border-t pt-4">
                            <span class="text-lg font-semibold">Total</span>
                            <span class="text-lg font-bold">$0.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 4 - Confirm Order -->
        <div class="flex items-start">
            <div class="card shadow-lg compact flex-1">
                <div class="card-body">
                    <h2 class="checkout-step-title">Step 4: Confirm Order</h2>
                    <div class="step-content">
                        <label class="flex items-center space-x-2">
                            <input v-model="saveAddress" type="checkbox" class="checkbox" />
                            <span>Save this address for future use</span>
                        </label>
                        <button @click="confirmOrder" class="btn w-full mt-4">Confirm Order</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AddressLocator from '../components/checkout/AddressLocator.vue';

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
        coordinates: selectedLocation.coordinates,
        name: selectedLocation.name,
    };
};

// Confirm order handler
const confirmOrder = () => {
    const orderData = {
        phone: phone.value,
        saveAddress: saveAddress.value,
        location: location.value,
    };
    console.log('Order Data:', orderData);
    // You can now send this data to your backend or perform further actions
};
</script>