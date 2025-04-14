<script setup>
import { ref, onMounted, inject, watch } from 'vue';
import { useRoute } from 'vue-router';
import List from '@/components/List.vue';

const $http = inject('$http');
const types = ref([]);
const type = ref({ id: 0, name: '', parentTypeId: null });
const loaded = ref(false);
const route = useRoute();
const tableData = ref([]);
function load() {
  $http.get('ProductTypes/GetProductTypes').then(res => {
    types.value = res.data;
    let items = [];
    for (const type of res.data) {
      let parent  = '';
      if(type.parentTypeId) parent = types.value.find((p) => p.id === type.parentTypeId)
      items.push({
        id: type.id,
        name: type.name,
        parent : parent?.name,
      })

    }
    tableData.value =items;
    loaded.value = true;
  });
}

onMounted(load);

watch(() => route.params.id, () => {
  type.value = types.value.find(t => t.id == route.params.id) || { id: 0, name: '', parentTypeId: null};
});
</script>

<template>
  <v-card>
    <template v-if="loaded">
      <List
          :items="tableData"
          to="/type"
          add="/type/add"
          :fields="{ name: 'დასახელება', parent: 'მშობელი' }"
          :key="types.length"
      />
      <RouterView
          class="router"
          :types="types"
          :type="type"
          :load="load"
          :key="type.id"
      />
    </template>
  </v-card>
</template>
