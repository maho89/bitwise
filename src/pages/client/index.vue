<script setup>
import { ref, onMounted, inject, watch } from 'vue';
import { useRoute } from 'vue-router';
import List from '@/components/List.vue';

const $http = inject('$http');
const route = useRoute();

const clients = ref([]);
const client = ref({
  id: 0,
  name: '',
  phone: '',
  email: '',
  clientTypeId: 0,
  identificationNumber: ''
});
const clientTypes = ref([]);
const tableData = ref([]);
const loaded = ref(false);

function load() {
  Promise.all([
    $http.get('Clients/GetClients'),
    $http.get('Clients/GetClientTypes')
  ]).then(([clientsRes, typesRes]) => {
    clients.value = clientsRes.data;
    clientTypes.value = typesRes?.data || [];

    tableData.value = clients.value.map(c => {
      const type = clientTypes.value.find(t => t.id === c.clientTypeId);
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        identificationNumber: c.identificationNumber,
        type: type?.name || 'უცნობია'
      };
    });

    if (route.params.id) {
      client.value = clients.value.find(c => c.id == route.params.id) || {
        id: 0,
        name: '',
        phone: '',
        email: '',
        clientTypeId: 0,
        identificationNumber: ''
      };
    }

    loaded.value = true;
  });
}

onMounted(load);

watch(() => route.params.id, (newVal) => {
  client.value = clients.value.find(c => c.id == newVal) || {
    id: 0,
    name: '',
    phone: '',
    email: '',
    clientTypeId: 0,
    identificationNumber: ''
  };
});
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
          :clientTypes="clientTypes"
          :load="load"
          :key="client.id"
          class="router"
      />
    </template>
  </v-card>
</template>