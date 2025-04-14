<script setup>
import { inject, onMounted, ref, watch, computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import List from '@/components/List.vue';

const $http = inject('$http');
const route = useRoute();
let products = ref([]);
let product = ref({
  id: 0,
  name: '',
  description: '',
  productTypeId: 1,
  barcode: ''
});
let loaded = ref(false);
let types = ref([]);
// ტიპების ჩატვირთვა
function typesLoad() {
  $http.get('ProductTypes/GetProductTypes').then(res => {
    types.value = res.data;
    load();
  });
};
// პროდუქტის ინიციალიზაცია ID-ის მიხედვით
function initProduct() {
  if (route.params.id) {
    let p = products.value.find(element => element.id == route.params.id);
    if (p) product.value = p;
  }
}
// პროდუქტების ჩატვირთვა
function load() {
  return $http.get('Products/GetProducts').then(res => {
    products.value = res.data;
    initProduct();
    loaded.value = true;
  });
}
// ჩატვირთვა mount-ზე
onMounted(() => {
  typesLoad();
});

// როცა ID იცვლება
watch(() => route.params.id, () => {
  initProduct();
});
</script>

<template>
  <v-card>
    <template v-if="loaded">
      <List
          :items="products"
          to="/product"
          add="/product/add"
          :fields="{ name: 'დასახელება', description: 'აღწერა', barcode: 'ბარკოდი' }"
          :key="products.length"
      />
      <RouterView
          class="router"
          :product="product"
          :load="load"
          :types="types"
          :key="product.id"
      />
    </template>
  </v-card>
</template>

<style scoped>
</style>
