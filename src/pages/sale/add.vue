<script setup>
import { ref, computed ,inject} from 'vue';
import {useRoute, useRouter} from 'vue-router';
const dlg = true;
const $http = inject('$http');
const router = useRouter();
const route = useRoute();
const id =  route.params.id
const clients = ref([]);
const warehouses = ref([]);
const products = ref([]);

const form = ref({
  clientId: null,
  warehouseId: null,
  items: []
});

const search = ref('');
const filteredProducts = computed(() => {
  if (!search.value) return products.value;
  return products.value.filter(p =>
      p.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const total = computed(() => {
  return form.value.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
});
function load() {
  const id = route.params.id;
  const isEdit = id && id !== 'add';

  const requests = [
    isEdit ? $http.get(`Sales/GetSale/${id}`) : Promise.resolve({ data: {
        clientId: null,
        warehouseId: null,
        items: []
      }}),
    $http.get('Clients/GetClients'),
    $http.get('Warehouses/GetWarehouses'),
    $http.get('Products/GetProducts')
  ];

  Promise.all(requests).then(([f, c, w, p]) => {
    form.value = f?.data || {
      clientId: null,
      warehouseId: null,
      items: []
    };
    clients.value = c.data;
    warehouses.value = w.data;
    products.value = p.data;
  });
}

function productName(id) {
  const product = products.value.find(p => p.id === id);
  return product ? product.name : '';
}
function addProduct(product) {
  if (!form.value.items.find(i => i.productId === product.id)) {
    form.value.items.push({
      productId: product.id,
      quantity: 1,
      unitPrice: product.price || 0
    });
  }
}

function removeProduct(index) {
  form.value.items.splice(index, 1);
}

function save() {
  const payload = {
    clientId: form.value.clientId,
    warehouseId: form.value.warehouseId,
    items: form.value.items.map(i => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice
    }))
  };
  $http.post('Sales/SaveSale', payload).then(() => router.push('/sale'));
}

load();
</script>

<template>
  <v-dialog width="800" v-model="dlg" persistent>
  <v-card class="pa-4">
    <v-select
        v-model="form.clientId"
        :items="clients"
        item-value="id"
        item-title="name"
        label="კლიენტი"
        class="mb-2"
    />
    <v-select
        v-model="form.warehouseId"
        :items="warehouses"
        item-value="id"
        item-title="name"
        label="საწყობი"
        class="mb-4"
    />

    <v-text-field v-model="search" label="პროდუქტის ძებნა" />
    <v-list>
      <v-list-item
          v-for="p in filteredProducts"
          :key="p.id"
          @click="addProduct(p)"
          :title="p.name"
      />
    </v-list>

    <v-table class="mt-4">
      <thead>
      <tr>
        <th>დასახელება</th>
        <th>რაოდენობა</th>
        <th>ფასი</th>
        <th>ჯამი</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in form.items" :key="item.productId">
        <td>{{productName(item.productId)}}</td>
        <td><v-text-field  class="ma-2" variant="underlined" v-model.number="item.quantity" type="number" hide-details /></td>
        <td><v-text-field class="ma-2" variant="underlined" v-model.number="item.unitPrice" type="number" hide-details /></td>
        <td>{{ item.unitPrice * item.quantity }}</td>
        <td><v-btn icon="mdi-delete" @click="removeProduct(i)" /></td>
      </tr>
      </tbody>
    </v-table>

    <div class="text-right my-4">
      <strong>ჯამი: {{ total }}</strong>
    </div>

    <v-btn color="primary" @click="save">შენახვა</v-btn>
  </v-card>
  </v-dialog>
</template>
