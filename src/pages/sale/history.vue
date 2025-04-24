<script setup>

import List from "@/components/List.vue";
import {inject, ref} from "vue";

const $http = inject('$http');
const sales = ref([]);
const clients = ref([]);
const warehouses = ref([]);
const tableData = ref([]);
</script>

<template>
  <List
      id="sales-list"
      :items="tableData"
      to="/sale"
      add="/sale/add"
      :fields="{
            client: 'კლიენტი',
            warehouse: 'საწყობი',
            productCount: 'ნივთების რაოდენობა',
            totalAmount: 'თანხაა',
            saleDate: 'დრო'
          }"
      :key="tableData.length"
  />
</template>

<style scoped>

</style>