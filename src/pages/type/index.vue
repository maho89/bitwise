<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import List from '@/components/List.vue'
import useTypeService from './service'

const route = useRoute()
const { items, load, loaded, getById } = useTypeService()

const tableData = ref([])
const type = ref({ id: 0, name: '', parentTypeId: null })

function buildTable() {
  tableData.value = items.value.map(t => {
    const parent = items.value.find(p => p.id === t.parentTypeId)
    return {
      id: t.id,
      name: t.name,
      parent: parent?.name || ''
    }
  })
}

function initType() {
  const id = route.params.id
  if (id === 'add') {
    type.value = { id: 0, name: '', parentTypeId: null }
  } else if (id) {
    const found = getById(id)
    if (found) type.value = found
  }
}

onMounted(async () => {
  await load()
  buildTable()
  initType()
})

watch(() => route.params.id, () => {
  initType()
})
</script>

<template>
  <v-card>
    <template v-if="loaded">
      <List
          :items="tableData"
          to="/type"
          add="/type/add"
          :fields="{ name: 'დასახელება', parent: 'მშობელი' }"
          :key="items.length"
      />
      <RouterView
          :type="type"
          :types="items"
          :load="load"
          :key="type.id"
          class="router"
      />
    </template>
  </v-card>
</template>
