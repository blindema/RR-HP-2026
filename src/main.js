
import App from './App.vue';
import { createApp } from 'vue';
import router from './router';
import { createPinia } from 'pinia';
import toast from 'vue-toastification';
import "vue-toastification/dist/index.css";

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(toast, {timeout: 2000});
app.mount('#app');