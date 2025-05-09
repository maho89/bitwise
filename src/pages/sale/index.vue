<script setup>
import {ref, onMounted, inject, computed, watch} from 'vue'
import List from '@/components/List.vue'
import useWarehouseService from "@/pages/warehouse/service.js"
import useClientService from "@/pages/client/service.js"
import {useRoute} from "vue-router";
import useProductService from "@/pages/product/service.js";
const route = useRoute()
const $http = inject('$http')
const warehouseService = useWarehouseService()
const clientService = useClientService()
const productService = useProductService();
const items = ref([])
const loading = ref(false)
const sale = ref({id: 0, items: []});
const loadSales = async () => {
  loading.value = true
  try {
    const res = await $http.get('Sales/GetSales') // სწორია: Sales/GetSales
    items.value = res.data || []
    initSale();
  } catch (e) {
    console.error('ვერ ჩაიტვირთა გაყიდვები', e)
  } finally {
    loading.value = false
  }
}

const tableData = computed(() => {
  return items.value.map(s => ({
    id: s.id,
    warehouse: warehouseService.displayName(s.warehouseId),
    client: clientService.displayName(s.clientId),
    saleDate: s.saleDate?.substring(0, 10), // მარტო წელი-თვე-დღე
    totalAmount: s.totalAmount?.toFixed(2) + ' ₾', // ლამაზად თანხა
  }))
});
function initSale() {
  sale.value = {id: 0, items: []};
  const id = parseInt(route.params.id)
  if (id) {
    const found = tableData.value.find(s => s.id === id)
    let ss = {...found};
    if (found) {
      $http.get(`Sales/GetSale/${id}`)
          .then(res => {
            ss.items = res.data?.items?.map(item => ({
              product: productService.displayName(item.productId) ,
              unitPrice: item.unitPrice?.toFixed(2),

              total: item.total?.toFixed(2),
            })) || []
            sale.value ={...ss};
          })
          .catch(e => {
            console.error('ვერ ჩაიტვირთა გაყიდვის დეტალები', e)
          })
    }}
}

watch(() => route.params.id, () => {
  initSale()
})
onMounted(loadSales);
const fields = [
  { key: 'warehouse', value: 'საწყობი' },
  { key: 'saleDate', value: 'თარიღი' },
  { key: 'client', value: 'კლიენტი' },
  { key: 'totalAmount', value: 'თანხა' }
]
</script>
<template>
  <v-card>
    <List
        :items="tableData"
        :fields="fields"
        to="/sale"
    />
  </v-card>
  <RouterView  :sale="sale" :key="sale.id"/>
</template>
