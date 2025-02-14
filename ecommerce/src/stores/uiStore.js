import { defineStore } from 'pinia';
import Toastify from 'toastify-js';

export const useUiStore = defineStore('Ui', {
    state: () => ({
        loading: false,
    }),
    getters: {

    },
    actions: {

        addNotification(type, message) {
            const toastConfig = {
                text: message,
                duration: 2000,  // Adjust to your preference
                close: false,
                stopOnFocus: true,
                gravity: 'bottom',
                position: 'right',
                style: this.getToastStyle(type),
                onClick: function () {
                }
            };

            // Trigger Toastify notification
            Toastify(toastConfig).showToast();
        },

        getToastStyle(type) {
            switch (type) {
                case 'success':
                    return {
                        background: "linear-gradient(to right, #00b09b, #174701)",
                        boxShadow: "0 4px 6px rgba(0, 128, 0, 0.3)"  // Green shadow for success
                    };
                case 'error':
                    return {
                        borderRadius: ".2rem",
                        background: "linear-gradient(to right, #FF5F6D, #591803)",
                        boxShadow: "0 4px 6px rgba(255, 87, 34, 0.3)"  // Red shadow for error
                    };
                case 'info':
                    return {
                        background: "linear-gradient(to right, #2c2a24, #4f4f4f)", // Gradient for info
                        color: "#ffffff",
                        boxShadow: "0 4px 6px rgba(66, 66, 66, 0.3)"  // Dark gray shadow for info
                    };
                default:
                    return {
                        background: "linear-gradient(to right, #2c2a24, #4f4f4f)", // Gradient for default
                        color: "#ffffff",
                        boxShadow: "0 4px 6px rgba(100, 100, 255, 0.3)"  // Bluish gray shadow for default
                    };
            }
        },


    }
});
