<script setup>
import { inject, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import List from '@/components/List.vue';

const $http = inject('$http');
const route = useRoute();

let warehouses = ref([]);
let tableData = ref([]);
let warehouse = ref({
  id: 0,
  name: '',
  location: '',
  rd: '',
  active: true
});
let loaded = ref(false);

// საწყობების ჩატვირთვა
function load() {
  return $http.get('Warehouses/GetWarehouses').then(res => {
    warehouses.value = res.data;
    tableData.value = res.data.map(w => ({
      id: w.id,
      name: w.name,
      location: w.location,
      rd: w.rd,
      active: w.active ? '✅' : '❌'
    }));
    initWarehouse();
    loaded.value = true;
  });
}

function initWarehouse() {
  if (route.params.id) {
    const w = warehouses.value.find(el => el.id == route.params.id);
    if (w) warehouse.value = w;
  }
}

onMounted(() => {
  load();
});

watch(() => route.params.id, () => {
  initWarehouse();
});
</script>

<template>
  <v-card>
    <template v-if="loaded">
      <List
          :items="tableData"
          to="/warehouse"
          add="/warehouse/add"
          :fields="{
          name: 'დასახელება',
          location: 'მდებარეობა',
          rd: 'რ/დ ნომერი',
          active: 'სტატუსი'
        }"
          :key="tableData.length"
      />
      <RouterView
          :warehouse="warehouse"
          :load="load"
          :key="warehouse.id"
          class="router"
      />
    </template>
  </v-card>
</template>
