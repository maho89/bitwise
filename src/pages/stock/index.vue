<script setup>
import { onMounted, computed } from 'vue'
import List from '@/components/List.vue'
import useStockService from './service'

const { items, loaded, load, getProductName, getWarehouseName } = useStockService()

const tableData = computed(() => {
  return items.value.map(s => ({
    product: getProductName(s.productId),
    warehouse: getWarehouseName(s.warehouseId),
    quantity: s.quantity
  }))
})

</script>

<template>
  <v-card>
    <template v-if="loaded">
      <List
          :items="tableData"
          :fields="{
          product: 'პროდუქტი',
          warehouse: 'საწყობი',
          quantity: 'რაოდენობა'
        }"
          :key="tableData.length"
      />
    </template>
  </v-card>
</template>
