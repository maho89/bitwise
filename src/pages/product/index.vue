<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import List from '@/components/List.vue'
import useProductService from './service'
import useTypeService from '../type/service'

const route = useRoute()
const { items, load, loaded, getById } = useProductService()
const { items: types, load: loadTypes } = useTypeService()

const product = ref({
  id: 0,
  name: '',
  description: '',
  productTypeId: 1,
  barcode: ''
})

const tableData = computed(() => {
  return items.value.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    icon: 'http://app.bitwise.ge/'+p.imagePaths[0]?.path,
    barcode: p.barcode
  }))
})

function initProduct() {
  const id = route.params.id
  if (id === 'add') {
    product.value = {
      id: 0,
      name: '',
      description: '',
      productTypeId: 1,
      barcode: ''
    }
  } else if (id) {
    const p = getById(id)
    if (p) product.value = p
  }
}

onMounted(async () => {
  initProduct()
})

watch(() => route.params.id, () => {
  initProduct()
})
</script>

<template>
  <v-card>
    <template v-if="loaded">
      <List
          :items="tableData"
          to="/product"
          add="/product/add"
          :fields="{icon:{value:'ფოტო', type:'img'}, name: 'დასახელება', description: 'აღწერა', barcode: 'ბარკოდი' }"
          :key="items.length"
      />
      <RouterView
          :product="product"
          :types="types"
          :load="load"
          :key="product.id"
          class="router"
      />
    </template>
  </v-card>
</template>
