import { defineStore } from 'pinia';
import axiosInstance  from '../axios';
import { handleAsync } from '../utils/asyncHandler';

export const useAppStore = defineStore('app', {
  state: () => ({
    products: []
  }),
  actions: {
    async getProudcts() {
        try {
            await handleAsync(
                async () => {
                    const res = await axiosInstance.get('api/shop/productlist/')
                    this.products = res.data;
                    console.log(this.products)
                }
            )
        } catch (error) {
            
        }
    }
  },
});