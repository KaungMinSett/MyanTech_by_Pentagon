import { defineStore } from 'pinia';
import axiosInstance from '../axios';
import { handleAsync } from '../utils/asyncHandler';

export const useAppStore = defineStore('app', {
  state: () => ({
    products: [],
    orders: []
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
    },

    async getOrders() {
      try {
        await handleAsync(
          async () => {
            const res = await axiosInstance.get("api/shop/orders")
            this.orders = res.data
          }
        )
      } catch (error) {
        
      }
    },

    async order(products, phone, customerId, address, saveAddress) {
      try {
        await handleAsync(
          async () => {
            const res = await axiosInstance.post('api/shop/orders/', {
              order_items: products,
              phone: phone,
              order_type: "website",
              customer: customerId,
              address: address,
              save_address: saveAddress
            })
            console.log(res.data)
          }
        )
      } catch (error) {

      }
    }
  },
});