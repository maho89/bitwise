<script setup>
import {ref, onMounted, inject, computed} from 'vue';
import useClientService from "@/pages/client/service.js";
import useWarehouseService from "@/pages/warehouse/service.js";
import useProductService from "@/pages/product/service.js";
import useSaleService from "@/pages/sale/service.js";
const $http = inject('$http');
const stocks = ref([]);
const clientId = ref(0);

const loaded = ref(false);
const search = ref('');
const searchFocus=ref(false);
const selectedWarehouse = ref(localStorage.getItem('selectedWarehouse')*1 || null);
const clientService = useClientService();
const warehouseService = useWarehouseService();
const productService = useProductService();
const {paymentMethods,saleStatuses} =useSaleService();
const clients = clientService.items;
const warehouses = warehouseService.items;
const products = productService.items;


const cart = ref([]);
const saleStatus = ref(1);
const paymentMethod = ref(1);
const showWarehouseDialog = ref(!selectedWarehouse.value);
const showEndDialog = ref(false);
function confirmWarehouse() {
  if (!selectedWarehouse.value) {
    alert('გთხოვთ აირჩიოთ საწყობი');
    return;
  }
  localStorage.setItem('selectedWarehouse',selectedWarehouse.value)
  showWarehouseDialog.value = false;
}

const paidAmount = ref(0);
const change = ref(0);

function calculateChange() {
  change.value = paidAmount.value - totalPrice.value;
}


function load() {
  Promise.all([
    $http.get('Stock/GetStock')
  ]).then(([stocksRes]) => {
    stocks.value = stocksRes.data;
    loaded.value = true;
  });
}
function getProductImage(productId) {
  const product = products.value.find(p => p.id === productId);
  return product && product.imagePaths && product.imagePaths.length
      ? 'http://app.bitwise.ge/' + product.imagePaths[0].path: '/no-image.png';
}

const filteredProducts = computed(() =>
    stocks.value
        .filter(stock => {
          if (selectedWarehouse.value && stock.warehouseId !== selectedWarehouse.value) return false;

          const product = productService.getById(stock.productId);
          const searchText = search.value.toLowerCase();
          return (
              product.name.toLowerCase().includes(searchText) ||
              product.barcode?.toLowerCase().includes(searchText)
          );
        })
        .slice(0, 20)
        .map(stock => {
          const product = productService.getById(stock.productId);
          return {
            ...stock,
            name: product.name,
            image: product.imagePaths.length
                ? 'http://app.bitwise.ge/' + product.imagePaths[0].path
                : '/no-image.png',
            barcode: product.barcode
          };
        })
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
  searchFocus.value=false;
  search.value='';
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
  showEndDialog.value = false;
}

function end() {

  if (cart.value.length === 0) {
    alert('კალათა ცარიელია');
    return;
  }
  $http.post('Sales/SaveSale', {
    "clientId": clientId.value,
    "warehouseId": selectedWarehouse.value,
    "statusId": saleStatus.value,
    "notes":'',
    "paymentMethod": paymentMethod.value,
    "items": cart.value.map(item=> ({ "productId": item.productId,  "quantity": item.quantity, "unitPrice": item.price}))
  }).then((d) => {
    if(d.status=='success'){
      alert('განახლება წარმატებით დასრულდა');
      clearCart();
    }

    alert('გადახდა ვერ განხორციელდა');
  }).catch(() => {
    alert('გადახდა ვერ განხორციელდა');
  }).finally(() => {
    // აქ შეიძლება კალათის გასუფთავება ან სხვა მოქმედებები

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
/**
 * Handles searching for a product by barcode or name and adds it to the cart.
 *
 * This function first attempts to find a product by its barcode. If found and in stock,
 * the product is immediately added to the cart. If no barcode match is found, it filters
 * products based on the search input. If exactly one product matches the search,
 * that product is added to the cart.
 *
 * @remarks
 * - Checks product availability in the selected warehouse
 * - Clears the search input after successful product addition
 * - Displays an alert if the product is not available in the selected warehouse
 * - Leaves search results on screen if multiple products match
 */


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
  <v-dialog v-model="showEndDialog" persistent max-width="600">
    <v-card class="mt-4 pa-4">

      <v-text-field
          :model-value="totalPrice.toFixed(2) + ' ₾'"
          label="სულ გადასახდელი"
          variant="outlined"
          density="compact"
          readonly
      />
      <v-text-field
          v-model.number="paidAmount"
          label="მოწოდებული თანხა"
          type="number"
          variant="outlined"
          density="compact"
          @input="calculateChange"
      />

      <v-text-field
          :model-value="change >= 0 ? change.toFixed(2) + ' ₾' : ''"
          label="დასაბრუნებელი ხურდა"
          variant="outlined"
          density="compact"
          readonly
      />

      <v-select
          v-model="clientId"
          label="კლიენტი"
          density="comfortable"
          variant="outlined"
          :items="clients"
          item-title="name"
          item-value="id"
      />

      <v-select
          v-model="paymentMethod"
          label="გადახდის მეთოდი"
          density="comfortable"
          variant="outlined"
          :items="paymentMethods"
          item-title="name"
          item-value="id"
      />

      <v-select
          v-model="saleStatus"
          label="გაყიდვის სტატუსი"
          density="comfortable"
          variant="outlined"
          :items="saleStatuses"
          item-title="name"
          item-value="id"
      />

      <v-card-actions class="d-flex justify-space-between">
        <v-btn color="primary" @click="end">დასრულება</v-btn>
        <v-btn @click="printReceipt">ბეჭდვა</v-btn>
        <v-btn color="grey" @click="clearCart">გასუფთავება</v-btn>
        <v-btn color="grey" @click="showEndDialog=false">დახურვა</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card v-if="loaded" class="pa-4">
    <v-toolbar flat>
      <v-text-field
          v-model="search"
          density="compact"
          placeholder="პროდუქტის ძებნა ან ბარკოდი"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          class="pa-3"
          hide-details
          single-line
          @keydown.enter="handleSearchOrBarcode"
          clearable
      />
      <v-btn icon="mdi-cog" @click="showWarehouseDialog = true" />
    </v-toolbar>

    <v-card-item >
      <template v-if="search">
        <div class="d-flex flex-wrap " style="    overflow: auto;    height: 808px;">
          <div v-for="product in filteredProducts" :key="product.productId" class="pa-2 card">
            <v-card @click="addToCart(product)" class="text-center hoverable">
              <v-img :src="product.image" height="200" />
              <v-card-title class="text-subtitle-2">{{ product.name }}</v-card-title>
              <v-card-title class="text-subtitle-2">{{ product.barcode }}</v-card-title>
              <v-card-subtitle>{{ product.price }} ₾</v-card-subtitle>
            </v-card>
          </div>
        </div>
      </template>
      <template v-else>
          <!-- კალათა და გადახდა -->
          <div class="cart-container" style="height: 400px; overflow-y: auto;">
            <v-table dense>
              <thead>
              <tr>
                <th class="w-20px"></th>
                <th>პროდუქტი</th>
                <th>რაოდ.</th>
                <th>ფასი</th>
                <th>ჯამი</th>
                <th class="w-20px"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in cart" :key="item.productId">
                <td><v-avatar :image="item.image" /></td>
                <td><v-list-item :title="item.name" :subtitle="item.barcode" /></td>
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
          </div>
          <div class="text-center ma-2">
            <v-btn :disabled="cart.length<1" @click="showEndDialog=true">დასრულება</v-btn>
          </div>
        </template>
    </v-card-item>
  </v-card>

</template>

<style>
.w-20px{
  width: 20px!important;
}
.card{
  flex: 1 1 300px;

}
.cart-container {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.cart-container thead {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>