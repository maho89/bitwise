<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import List from '@/components/List.vue'
import useTypeService from './service'

const route = useRoute()
const { items, load, loaded, getById, displayName } = useTypeService()


const type = ref({ id: 0, name: '', parentTypeId: null })
import { computed } from 'vue'

const tableData = computed(() => {
  return items.value.map(t => {
    return {
      id: t.id,
      name: t.name,
      parent: displayName(t.parentTypeId) || ''
    }
  })
})


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
  initType()
})

watch(() => route.params.id, () => {
  initType()
})
</script>

<template>

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

</template>
