import {ref} from "vue";
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import {createVuetify, useTheme} from 'vuetify';
import {createRouter, createWebHistory} from "vue-router";
import Http from "@/Http.js";
import User from "@/User.js";
import product from '@/pages/product/index.vue';
import product_add from '@/pages/product/add.vue';
import type from '@/pages/type/index.vue'
import type_add from '@/pages/type/add.vue'
import warehouse from '@/pages/warehouse/index.vue'
import warehouse_add from '@/pages/warehouse/add.vue'
import purchase from '@/pages/purchase/index.vue'
import purchase_add from '@/pages/purchase/add.vue'
import stock from '@/pages/stock/index.vue'

import stock_add from '@/pages/stock/add.vue'
import client_add from '@/pages/client/add.vue'
import client from '@/pages/client/index.vue'
import sale from '@/pages/sale/index.vue'
import sale_add from '@/pages/sale/add.vue'
const routes = [
    {path: '/',  name:'home', redirect: '/product'},
    {path: '/product', name:'product', component: product,children: [{ path: ':id', name: 'edit', component: product_add }],},
    {path: '/type', name: 'type', component: type, children: [{ path: ':id', name: 'type-edit', component: type_add }]},
    {path: '/warehouse', name: 'warehouse', component: warehouse, children: [{ path: ':id', name: 'warehouse-edit', component: warehouse_add }]},
    {path: '/purchase', name: 'purchase', component: purchase, children: [{ path: ':id', name: 'purchase-edit', component: purchase_add }]},
    {path: '/stock', name: 'stock', component: stock, children: [{ path: ':id', name: 'stock-edit', component: stock_add }]},
    {path: '/client', name: 'client', component: client, children: [{ path: ':id', name: 'stock-edit', component: client_add }]},
    {path: '/sale', name: 'sale', component: sale,children: [{ path: ':id', name: 'sale_add', component: sale_add }]},

];
const router = createRouter({ history: createWebHistory(),routes});
const vuetify = createVuetify({ theme: {  defaultTheme: 'dark' }});
export default {
    install(app) {
        app.config.globalProperties.$menuOpen = ref(false);
        app.config.globalProperties.toggleTheme = () => {
            vuetify.theme.global.name.value = vuetify.theme.global.name.value === 'light' ? 'dark' : 'light';
        }
        app.use(vuetify).use(Http).use(User).use(router);
    }

};
