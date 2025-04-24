<script setup>
import {ref, onMounted, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import List from '@/components/List.vue'
import useClientService from './service'

const route = useRoute()
const { items, types, load, loaded, getById, getTypeName } = useClientService()

const tableData = computed(() => {
  return items.value.map(c => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    identificationNumber: c.identificationNumber,
    type: getTypeName(c.clientTypeId)
  }))
})
const client = ref({
  id: 0,
  name: '',
  phone: '',
  email: '',
  clientTypeId: 0,
  identificationNumber: ''
})


function initClient() {
  const id = route.params.id
  if (id === 'add') {
    client.value = {
      id: 0,
      name: '',
      phone: '',
      email: '',
      clientTypeId: 0,
      identificationNumber: ''
    }
  } else if (id) {
    const c = getById(id)
    if (c) client.value = c
  }
}

onMounted(async () => {
  initClient()
})

watch(() => route.params.id, () => {
  initClient()
})
</script>

<template>
  <v-card>
    <template v-if="loaded">
      <List
          id="client-list"
          :items="tableData"
          to="/client"
          add="/client/add"
          :fields="{
          name: 'დასახელება',
          phone: 'ტელეფონი',
          email: 'ელ.ფოსტა',
          identificationNumber: 'იდენტ. ნომერი',
          type: 'ტიპი'
        }"
          :key="tableData.length"
      />
      <RouterView
          :client="client"
          :clientTypes="types"
          :load="load"
          :key="client.id"
          class="router"
      />
    </template>
  </v-card>
</template>
