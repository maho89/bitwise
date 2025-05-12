<script setup>
import {ref, onMounted, watch, inject} from 'vue'
import { useRoute } from 'vue-router'
import List from '@/components/List.vue'
import useWarehouseService from '../warehouse/service'

import { useDate } from 'vuetify'
import useClientService from "@/pages/client/service.js";

const $http = inject('$http')
const route = useRoute()
const {displayName:clientName} = useClientService()
const { items: warehouses, load: loadWarehouses, displayName:wrName } = useWarehouseService()

const purchases = ref([])
const tableData = ref([])
const purchase = ref({ id: 0, warehouseId: 0 })
const loaded = ref(false)
const date = useDate();
function load() {
  Promise.all([
    $http.get('Purchases/GetPurchases'),
    loadWarehouses()
  ]).then(([purchaseRes]) => {
    purchases.value = purchaseRes.data

    tableData.value = purchases.value.map(p => ({
      id: p.id,
      client:clientName(p.clientId),
      date: date.format(new Date(p.rd), 'keyboardDateTime24h'),
      warehouseName: wrName(p.warehouseId)
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

    <template v-if="loaded">
      <List
          :items="tableData"
          to="/purchase"
          add="/purchase/add"
          :fields="{ date: 'თარიღი',client: 'კომპანია', warehouseName: 'საწყობი' }"
          :key="tableData.length"
      />
      <RouterView
          :purchase="purchase"
          :load="load"
          :key="purchase.id"
          class="router"
      />
    </template>

</template>
