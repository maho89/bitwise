<script setup>
import { ref, onMounted, inject } from 'vue';
import List from '@/components/List.vue';

const $http = inject('$http');

const stocks = ref([]);
const tableData = ref([]);
const loaded = ref(false);

function load() {
  Promise.all([
    $http.get('Stock/GetStock'),
    $http.get('Products/GetProducts'),
    $http.get('Warehouses/GetWarehouses')
  ]).then(([stockRes, productRes, warehouseRes]) => {
    const products = productRes.data;
    const warehouses = warehouseRes.data;
    stocks.value = stockRes.data;

    tableData.value = stocks.value.map(s => {
      const product = products.find(p => p.id === s.productId);
      const warehouse = warehouses.find(w => w.id === s.warehouseId);
      return {
        product: product?.name || `#${s.productId}`,
        warehouse: warehouse?.name || `#${s.warehouseId}`,
        quantity: s.quantity
      };
    });

    loaded.value = true;
  });
}

onMounted(load);
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
