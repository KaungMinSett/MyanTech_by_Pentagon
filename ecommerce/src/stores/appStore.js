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
                    const res = await axiosInstance.get('shop/api/productlist/')
                    console.log(res.data)
                }
            )
        } catch (error) {
            
        }
    }
  },
});