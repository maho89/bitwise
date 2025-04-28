<script setup>
import {ref, onMounted, inject, computed} from 'vue';

const $http = inject('$http');

const clients = ref([]);
const warehouses = ref([]);
const products = ref([]);
const stocks = ref([]);
const clientId = ref(1);

const loaded = ref(false);
const search = ref('');
const selectedWarehouse = ref(localStorage.getItem('selectedWarehouse')*1 || null);
const cart = ref([]);
const paymentMethod = ref('cash');
const showWarehouseDialog = ref(!selectedWarehouse.value);
function confirmWarehouse() {
  if (!selectedWarehouse.value) {
    alert('გთხოვთ აირჩიოთ საწყობი');
    return;
  }
  localStorage.setItem('selectedWarehouse',selectedWarehouse.value)
  showWarehouseDialog.value = false;
}

function load() {
  Promise.all([
    $http.get('Clients/GetClients'),
    $http.get('Warehouses/GetWarehouses'),
    $http.get('Products/GetProducts'),
    $http.get('Stock/GetStock')
  ]).then(([clientsRes, warehousesRes, productsRes, stocksRes]) => {
    clients.value = clientsRes.data;
    warehouses.value = warehousesRes.data;
    products.value = productsRes.data;
    stocks.value = stocksRes.data;
    loaded.value = true;
  });
}

function getProductName(productId) {
  const product = products.value.find(p => p.id === productId);
  return product ? product.name : 'უცნობი პროდუქტი';
}

function getProductImage(productId) {
  const product = products.value.find(p => p.id === productId);
  return product && product.imagePaths && product.imagePaths.length
      ? 'http://app.bitwise.ge/' + product.imagePaths[0].path
      : '/no-image.png';
}

const filteredProducts = computed(() =>
    stocks.value
        .filter(stock =>
            (!selectedWarehouse.value || stock.warehouseId === selectedWarehouse.value) &&
            getProductName(stock.productId).toLowerCase().includes(search.value.toLowerCase())
        )
        .map(stock => ({
          ...stock,
          name: getProductName(stock.productId),
          image: getProductImage(stock.productId)
        }))
);

const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

function addToCart(product) {
  const existing = cart.value.find(item => item.productId === product.productId);
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
  const index = cart.value.findIndex(p => p.productId === item.productId);
  if (index !== -1) {
    cart.value.splice(index, 1);
  }
}

function clearCart() {
  cart.value = [];
}

function pay() {
  if (cart.value.length === 0) {
    alert('კალათა ცარიელია');
    return;
  }
  $http.post('Sales/SaveSale', {
    "clientId": clientId.value,
    "warehouseId": selectedWarehouse.value,
    "items": cart.value.map(item=> ({ "productId": item.productId,  "quantity": item.quantity, "unitPrice": item.price}))
  }).then(() => {
    alert('გადახდა წარმატებით დასრულდა');
  }).catch(() => {
    alert('გადახდა ვერ განხორციელდა');
  }).finally(() => {
    // აქ შეიძლება კალათის გასუფთავება ან სხვა მოქმედებები
    clearCart();
  });

}

function printReceipt() {
  const printWindow = window.open('', '', 'width=600,height=800');
  if (!printWindow) return;

  const now = new Date();
  const dateStr = now.toLocaleString('ka-GE'); // ქართულ ფორმატში თარიღი

  const receiptContent = `
    <html>
      <head>
        <title>ქვითარი</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h1 { font-size: 20px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; font-size: 14px; }
          tfoot td { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>ქვითარი</h1>
        <div>თარიღი: ${dateStr}</div>
        <div>გადახდის მეთოდი: ${paymentMethod.value === 'cash' ? 'ნაღდი' : paymentMethod.value === 'card' ? 'ბარათი' : 'სხვა'}</div>

        <table>
          <thead>
            <tr>
              <th>პროდუქტი</th>
              <th>რაოდენობა</th>
              <th>ერთეულის ფასი</th>
              <th>ჯამი</th>
            </tr>
          </thead>
          <tbody>
            ${cart.value.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)} ₾</td>
                <td>${(item.price * item.quantity).toFixed(2)} ₾</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">სულ გადასახდელი:</td>
              <td>${totalPrice.value.toFixed(2)} ₾</td>
            </tr>
          </tfoot>
        </table>
</body>
</html>`;

  printWindow.document.write(receiptContent);
  printWindow.document.close();
}

function handleSearchOrBarcode() {
  if (!search.value) return;

  // ჯერ ვცადოთ ბარკოდით პროდუქტის პოვნა
  const product = products.value.find(p => p.barcode === search.value.trim());

  if (product) {
    const stock = stocks.value.find(s => s.productId === product.id && (!selectedWarehouse.value || s.warehouseId === selectedWarehouse.value));
    if (stock) {
      const enrichedProduct = {
        ...stock,
        name: product.name,
        image: getProductImage(product.id),
        productId: product.id
      };
      addToCart(enrichedProduct);
      search.value = '';
    } else {
      alert('პროდუქტი არჩეულ საწყობში არ მოიძებნა');
      search.value = '';
    }
  } else {
    // ბარკოდი ვერ მოიძებნა, ვამოწმებთ ძებნის შედეგს
    const matches = filteredProducts.value;

    if (matches.length === 1) {
      addToCart(matches[0]);
      search.value = '';
    }

    // თუ ბევრია, არაფერს ვაკეთებთ — ძებნის შედეგები რჩება ეკრანზე
  }
}



onMounted(load);
</script>

<template>
  <v-dialog v-model="showWarehouseDialog" persistent max-width="400">
    <v-card>
      <v-card-title>აირჩიეთ საწყობი</v-card-title>
      <v-card-text>
        <v-select
            v-model="selectedWarehouse"
            :items="warehouses"
            item-title="name"
            item-value="id"
            label="საწყობი"
            dense
            solo
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="confirmWarehouse">გაგრძელება</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-card v-if="loaded" class="pa-4">
    <v-row>

      <!-- მარცხენა ნაწილი: საწყობი + ძებნა + პროდუქტები -->
      <v-col cols="6">
        <v-toolbar>
          <v-text-field
              v-model="search"
              density="compact"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="solo"
              width="200"
              flat
              hide-details
              single-line
              @keydown.enter="handleSearchOrBarcode"
              clearable
          />
          <v-btn icon="mdi mdi-cog"   @click="showWarehouseDialog=true" />
        </v-toolbar>



        <v-container class="d-flex flex-wrap">
          <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="pa-2"
          >
            <v-card @click="addToCart(product)" class="text-center hoverable">
              <img :src="product.image" height="100" />
              <v-card-title class="text-subtitle-2">{{ product.name }}</v-card-title>
              <v-card-subtitle>{{ product.price }} ₾</v-card-subtitle>
            </v-card>
          </div>
        </v-container>
      </v-col>

      <!-- მარჯვენა ნაწილი: კალათა -->
      <v-col cols="6">
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
          <tr v-for="item in cart" :key="item.productId">
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
          <v-select v-model="clientId" label="კლიენტი" density="comfortable" variant="outlined" :items="clients" item-title="name"  item-value="id"/>
          <v-card-actions class="d-flex">
            <v-btn color="primary" @click="pay">გადახდა</v-btn>
            <v-btn @click="printReceipt">ბეჭდვა</v-btn>
            <v-btn color="grey" @click="clearCart">გაუქმება</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

    </v-row>
  </v-card>
</template>
