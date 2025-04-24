<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import { useRoute } from 'vue-router'
import List from '@/components/List.vue'
import useWarehouseService from './service'
const route = useRoute();
const { items, load, loaded,getById } = useWarehouseService()

const tableData = computed(() => {
  return items.value.map(w => ({
    id: w.id,
    name: w.name,
    location: w.location,
    rd: w.rd,
    active: w.active ? '✅' : '❌'
  }))
})
const warehouse = ref({
  id: 0,
  name: '',
  location: '',
  rd: '',
  active: true
});


function initWarehouse() {
  const id = route.params.id

  if (id === 'add') {
    warehouse.value = {
      id: 0,
      name: '',
      location: '',
      rd: '',
      active: true
    }
  } else if (id) {
    const w = getById(id)
    if (w) warehouse.value = w
  }
}
onMounted(async () => {
  await load()
  initWarehouse()
})

watch(() => route.params.id, () => {
  initWarehouse()
})
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
