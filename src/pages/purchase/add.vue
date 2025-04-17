
<script setup>
import {computed, inject, ref} from 'vue';
import {useRouter} from 'vue-router';
import List from "@/components/List.vue";

const $http = inject('$http');
const router = useRouter();
const dlg = true;
const props = defineProps({
  purchase: Object,
  load: Function
});

let pData = ref({ ...props.purchase });
let products = ref([]);
let tableData = computed(()=>{
  let its = [];
  for (let item of items.value) {
    let product  = products.value.find(e=> e.id === item.productId);
    its.push({
      id: item.id,
      product: product?.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    });
  }
  return its;
})
let warehouses = ref([]);
let new_item=ref({})

function save() {
  let params = {
    id: props.purchase.id,
    warehouseId: pData.value.warehouseId,
    items:items.value
  }
  $http.post('Purchases/SavePurchase', params).then(() => {
    props.load();
    router.push('/purchase');
  });
}

function loadRefs() {
  $http.get('Warehouses/GetWarehouses').then(res => warehouses.value = res.data);
  $http.get('Products/GetProducts').then(res => products.value = res.data);
  loadItems();
}
let items = ref([]);
let loaded = ref(false);
function loadItems() {

  $http.get(`Purchases/GetPurchaseItems/${pData.value.id}`).then(res => {
    items.value = res.data;
    loaded.value = true;
  });

}
function addItem() {
  items.value.push(new_item.value);
}

function removeItem(id) {
  items.value = items.value.filter(e => e.id !== id);
}

loadRefs();
</script>

<template>
  <v-dialog width="800" v-model="dlg" persistent>
    <v-card>
      <v-container>
        <v-select
            v-model="pData.warehouseId"
            :items="warehouses"
            item-title="name"
            item-value="id"
            label="საწყობი"
        />
        <div class="d-flex flex-row ma-2">
          <div class="flex-fill"><v-select variant="outlined" v-model="new_item.productId" :items="products" item-title="name" item-value="id" density="compact" hide-details /></div>
          <div class="flex-fill"><v-text-field variant="outlined" v-model="new_item.quantity" type="number" density="compact" hide-details /></div>
          <div class="flex-fill"><v-text-field variant="outlined" v-model="new_item.unitPrice" type="number" density="compact" hide-details /></div>
          <div class="flex-fill"><v-btn @click="addItem()" icon="mdi-plus" size="x-small" /></div>
        </div>

        <List :items="tableData" v-if="loaded" :delete="removeItem" :fields="{product:'პროდუქრი', quantity: 'რაოდენობა',unitPrice:'ფასი'}"/>
      </v-container>

      <template v-slot:actions>
        <v-btn @click="save">შენახვა</v-btn>
        <v-btn to="/purchase">დახურვა</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
