<script setup>
import { onMounted, computed, watch } from 'vue'
import useUserService from '@/services/user'
import useProductService from '@/pages/product/service'
import useWarehouseService from '@/pages/warehouse/service'
import useClientService from '@/pages/client/service'
import useStockService from '@/pages/stock/service'
import useTypeService from '@/pages/type/service'
import useSaleService from '@/pages/sale/service'


import Login from "@/view/Login.vue"
import Dashboard from "@/view/dashboard.vue"
import Loading from "@/view/Loading.vue"
/**
 * Manages the application's initialization and loading state across multiple services.
 *
 * This setup handles user authentication and subsequent loading of various application services:
 * - Initializes user authentication
 * - Conditionally loads products, warehouses, clients, stocks, and types
 * - Tracks loading progress and determines overall application readiness
 *
 * @remarks
 * - Uses Vue's composition API (onMounted, computed, watch)
 * - Depends on multiple service hooks for data loading
 * - Provides reactive loading state and progress tracking
 */
// 1. Init user
const { init: initUser, user, loaded: userLoaded } = useUserService()

// 2. Prep remaining services
const { load: loadProducts, loaded: productLoaded } = useProductService()
const { load: loadWarehouses, loaded: warehouseLoaded } = useWarehouseService()
const { load: loadClients, loaded: clientLoaded } = useClientService()
const { load: loadStocks, loaded: stockLoaded } = useStockService()
const { load: loadTypes, loaded: typeLoaded } = useTypeService()
const { load: loadSales, loaded: saleLoaded } = useSaleService()

const isLoggedIn = computed(() => !!user.value)

onMounted(() => {
  initUser()
})

// 3. თუ ავტორიზებულია, დატვირთე სხვა სერვისები
watch(userLoaded, (isLoaded) => {
  if (isLoaded && user.value) {
    loadProducts()
    loadWarehouses()
    loadClients()
    loadStocks()
    loadTypes()
    loadSales()
  }
})

const allServices = computed(() => [
  userLoaded.value,
  !user.value || ( // თუ არ არის ავტორიზებული, დანარჩენი მნიშვნელდება თითქოს "დატვირთულია"
      productLoaded.value &&
      warehouseLoaded.value &&
      clientLoaded.value &&
      stockLoaded.value &&
      typeLoaded.value &&
      saleLoaded.value
  )
])

const isLoading = computed(() => allServices.value.includes(false))
const progress = computed(() => {
  const steps = user.value ? 7 : 1 // თუ ავტორიზებული არაა, მხოლოდ user
  const done = [
    userLoaded.value,
    productLoaded.value,
    warehouseLoaded.value,
    clientLoaded.value,
    stockLoaded.value,
    typeLoaded.value,
    saleLoaded.value
  ].filter(Boolean).length
  return Math.round((done / steps) * 100)
})
</script>

<template>
  <Loading v-if="isLoading" :progress="progress" />
  <Dashboard v-else-if="user" />
  <Login v-else />
</template>
