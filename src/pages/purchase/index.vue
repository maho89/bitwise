<script setup>
import {ref, onMounted, watch, inject} from 'vue'
import { useRoute } from 'vue-router'
import List from '@/components/List.vue'
import useWarehouseService from '../warehouse/service'

const $http = inject('$http')
const route = useRoute()

const { items: warehouses, load: loadWarehouses } = useWarehouseService()

const purchases = ref([])
const tableData = ref([])
const purchase = ref({ id: 0, warehouseId: 0 })
const loaded = ref(false)

function getWarehouseName(id) {
  const w = warehouses.value.find(w => w.id === id)
  return w?.name || 'უცნობია'
}

function load() {
  Promise.all([
    $http.get('Purchases/GetPurchases'),
    loadWarehouses()
  ]).then(([purchaseRes]) => {
    purchases.value = purchaseRes.data

    tableData.value = purchases.value.map(p => ({
      id: p.id,
      date: p.rd,
      warehouseName: getWarehouseName(p.warehouseId)
    }))

    const paramId = route.params.id
    if (paramId) {
      purchase.value = purchases.value.find(p => p.id == paramId) || { id: 0, warehouseId: 0 }
    }

    loaded.value = true
  })
}

onMounted(load)

watch(() => route.params.id, (newVal) => {
  purchase.value = purchases.value.find(p => p.id == newVal) || { id: 0, warehouseId: 0 }
})
</script>

<template>
  <v-card>
    <template v-if="loaded">
      <List
          :items="tableData"
          to="/purchase"
          add="/purchase/add"
          :fields="{ date: 'თარიღი', warehouseName: 'საწყობი' }"
          :key="tableData.length"
      />
      <RouterView
          :purchase="purchase"
          :load="load"
          :key="purchase.id"
          class="router"
      />
    </template>
  </v-card>
</template>
