<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import List from '@/components/List.vue';

const $http = inject('$http');
const purchases = ref([]);
const tableData = ref([]);
const purchase = ref({ id: 0, warehouseId: 0 });
const loaded = ref(false);
const route = useRoute();

function load() {
  Promise.all([
    $http.get('Purchases/GetPurchases'),
    $http.get('Warehouses/GetWarehouses')
  ]).then(([purchaseRes, warehouseRes]) => {
    purchases.value = purchaseRes.data;
    const warehouses = warehouseRes.data;

    tableData.value = purchases.value.map(p => {
      const warehouse = warehouses.find(w => w.id === p.warehouseId);
      return {
        id: p.id,
        date: p.rd,
        warehouseName: warehouse ? warehouse.name : 'უცნობია'
      };
    });

    if (route.params.id) {
      purchase.value = purchases.value.find(p => p.id == route.params.id) || { id: 0, warehouseId: 0 };
    }

    loaded.value = true;
  });
}


onMounted(load);

watch(() => route.params.id, (newVal) => {
  purchase.value = purchases.value.find(p => p.id == newVal) || { id: 0, warehouseId: 0 };
});
</script>

<template>
  <v-card>
    <template v-if="loaded">
      <List
          :items="tableData"
          to="/purchase"
          add="/purchase/add"
          :fields="{
    date: 'თარიღი',
    warehouseName: 'საწყობი'
  }"
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
