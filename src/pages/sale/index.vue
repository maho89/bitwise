<script setup>
import { ref, onMounted, inject, computed } from 'vue';

const $http = inject('$http');

const clients = ref([]);
const warehouses = ref([]);
const stocks = ref([]);
const loaded = ref(false);
const search = ref('');
const cart = ref([]);
const paymentMethod = ref('cash');

function load() {
  Promise.all([
    $http.get('Clients/GetClients'),
    $http.get('Warehouses/GetWarehouses'),
    $http.get('Products/GetProducts')
  ]).then(([clientsRes, warehousesRes, stocksRes]) => {
    clients.value = clientsRes.data;
    warehouses.value = warehousesRes.data;
    stocks.value = stocksRes.data;
    loaded.value = true;
  });
}

const filteredProducts = computed(() =>
    stocks.value.filter(p =>
        p.name.toLowerCase().includes(search.value.toLowerCase())
    )
);

const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

function addToCart(product) {
  const existing = cart.value.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
}

function increaseQty(item) {
  item.quantity += 1;
}

function decreaseQty(item) {
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    removeFromCart(item);
  }
}

function removeFromCart(item) {
  const index = cart.value.findIndex(p => p.id === item.id);
  if (index !== -1) {
    cart.value.splice(index, 1);
  }
}

function clearCart() {
  cart.value = [];
}

function pay() {
  alert(`გადახდა შესრულდა - ჯამი: ${totalPrice.value.toFixed(2)} ₾`);
  clearCart();
}

function printReceipt() {
  alert('ქვითარი დაიბეჭდა!');
}

onMounted(load);
</script>

<template>
  <v-card v-if="loaded" class="pa-4">
    <v-row>
      <!-- მარცხენა ნაწილი: პროდუქტები -->
      <v-col cols="8">
        <v-text-field
            v-model="search"
            label="პროდუქტის ძიება"
            prepend-inner-icon="mdi-magnify"
            hide-details
            dense
            solo
        />

        <v-row>
          <v-col
              v-for="product in filteredProducts"
              :key="product.id"
              cols="4"

          >
            <v-card @click="addToCart(product)" class="text-center hoverable">
              <v-img :src="product.image || '/no-image.png'" height="100"></v-img>
              <v-card-title class="text-subtitle-2">{{ product.name }}</v-card-title>
              <v-card-subtitle>{{ product.price }} ₾</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- მარჯვენა ნაწილი: კალათა -->
      <v-col cols="4">
        <v-table dense>
          <thead>
          <tr>
            <th>პროდუქტი</th>
            <th>რაოდ.</th>
            <th>ფასი</th>
            <th>ჯამი</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in cart" :key="item.id">
            <td>{{ item.name }}</td>
            <td>
              <v-btn icon @click="decreaseQty(item)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              {{ item.quantity }}
              <v-btn icon @click="increaseQty(item)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </td>
            <td>{{ item.price }} ₾</td>
            <td>{{ (item.price * item.quantity).toFixed(2) }} ₾</td>
            <td>
              <v-btn icon @click="removeFromCart(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </v-table>

        <v-card class="mt-4 pa-4">
          <div class="text-h6 mb-2">სულ გადასახდელი: {{ totalPrice.toFixed(2) }} ₾</div>

          <v-btn-toggle v-model="paymentMethod" label="გადახდის მეთოდი">
            <v-btn text="ნაღდი" value="cash" />
            <v-btn text="ბარათი" value="card" />
            <v-btn text="სხვა" value="other" />
          </v-btn-toggle>

          <v-card-actions class="d-flex">
            <v-btn color="primary"  @click="pay">გადახდა</v-btn>
            <v-btn  @click="printReceipt">ბეჭდვა</v-btn>
            <v-btn  color="grey" @click="clearCart">გაუქმება</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
