import { createApp } from 'vue'
import App from './App.vue'
import AppPlugin from '@/plugins/app'

createApp(App).use(AppPlugin).mount('#app')
