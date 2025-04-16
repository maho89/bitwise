<script setup>
import { ref, onMounted, inject } from 'vue';
import List from '@/components/List.vue';

const $http = inject('$http');
const sales = ref([]);
const clients = ref([]);
const warehouses = ref([]);
const tableData = ref([]);
const loaded = ref(false);

function load() {
  Promise.all([
    $http.get('Sales/GetSales'),
    $http.get('Clients/GetClients'),
    $http.get('Warehouses/GetWarehouses')
  ]).then(([salesRes, clientsRes, warehousesRes]) => {
    sales.value = salesRes.data;
    clients.value = clientsRes.data;
    warehouses.value = warehousesRes.data;

    tableData.value = sales.value.map(s => {
      const client = clients.value.find(c => c.id === s.clientId);
      const warehouse = warehouses.value.find(w => w.id === s.warehouseId);
      return {
        id: s.id,
        client: client?.name || 'უცნობია',
        warehouse: warehouse?.name || 'უცნობია',
        productCount: s.productCount || 0,
        totalAmount: s.totalAmount || 0,
        saleDate: s.saleDate || 0
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
          id="sales-list"
          :items="tableData"
          to="/sale"
          add="/sale/add"
          :fields="{
            client: 'კლიენტი',
            warehouse: 'საწყობი',
            productCount: 'ნივთების რაოდენობა',
            totalAmount: 'თანხაა',
            saleDate: 'დრო'
          }"
          :key="tableData.length"
      />
      <RouterView :load="load" class="router" />
    </template>
  </v-card>
</template>
