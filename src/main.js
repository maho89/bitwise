import {createApp} from 'vue'
import App from './App.vue'
import init from "@/init.js";
const app = createApp(App).use(init).mount('#app');



