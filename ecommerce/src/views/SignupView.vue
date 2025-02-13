<template>
    <div class="w-full min-h-screen flex flex-col items-center justify-center">
        <h1 class="text-center text-4xl font-bold mb-4">Sign Up</h1>

        <form @submit.prevent="submitForm" class="flex flex-col gap-3 w-full md:w-1/2 lg:w-1/3">
            <label class="input input-bordered flex items-center gap-2 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>

                <input required v-model="username" type="text" class="grow placeholder:text-base-content/40"
                    placeholder="Username" />
            </label>
            <label class="input input-bordered flex items-center gap-2 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><path d="M4 4h16v16H4z"/><path d="M22 4L12 13 2 4"/></svg>

                <input required v-model="email" type="email" class="grow placeholder:text-base-content/40"
                    placeholder="Email" />
            </label>
            <label class="input input-bordered flex items-center gap-2 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>

                <input required v-model="password" type="password" class="grow placeholder:text-base-content/40"
                    placeholder="Password" />
            </label>
            <label class="input input-bordered flex items-center gap-2 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>

                <input required v-model="confirmPassword" type="password" class="grow placeholder:text-base-content/40"
                    placeholder="Confirm Password" />
            </label>

            <button type="submit" class="btn w-full my-3">Submit</button>
        </form>

        <section class="flex md:w-1/2 lg:w-1/3 justify-between items-center">

            <p 
                class="my-0 cursor-pointer select-none text-sm"
                >
                Already have an account?
                <router-link class="underline font-bold underline-offset-2" :to="{name:'login'}">Login</router-link> 
            </p>

            <span class="cursor-pointer text-sm font-bold select-none underline underline-offset-2"
                @click="uiStore.openModal(SendPswReset)">
                Password Reset
            </span>

        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();

const submitForm = async () => {
    if (password.value !== confirmPassword.value) {
        console.log('Passwords do not match');
        return;
    }

    try {
        await authStore.signup(username.value, email.value, password.value);
        router.push({name: 'login'});
    } catch (error) {
        console.log(error);
    }
};
</script>