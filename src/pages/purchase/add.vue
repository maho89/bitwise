<script setup>
import { ref, computed, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import List from '@/components/List.vue'
import useProductService from '../product/service'
import useWarehouseService from '../warehouse/service'

const $http = inject('$http') // ← შენი გლობალური http client
const router = useRouter()

const props = defineProps({
  purchase: Object,
  load: Function
})

const { items: products, load: loadProducts } = useProductService()
const { items: warehouses, load: loadWarehouses } = useWarehouseService()

const dlg = ref(true)
const pData = ref({ ...props.purchase })
const new_item = ref({})
const items = ref([])
const loaded = ref(false)

watch(() => props.purchase, (val) => {
  pData.value = { ...val }
})

const tableData = computed(() => {
  return items.value.map(item => {
    const product = products.value.find(p => p.id === item.productId)
    return {
      id: item.id,
      product: product?.name || `#${item.productId}`,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }
  })
})

function loadItems() {
  $http.get(`Purchases/GetPurchaseItems/${pData.value.id}`).then(res => {
    items.value = res.data
    loaded.value = true
  })
}

function loadRefs() {
  loadProducts()
  loadWarehouses()
  loadItems()
}

function save() {
  const params = {
    id: pData.value.id,
    warehouseId: pData.value.warehouseId,
    items: items.value
  }
  $http.post('Purchases/SavePurchase', params).then(() => {
    props.load()
    router.push('/purchase')
  })
}

function addItem() {
  items.value.push({ ...new_item.value })
  new_item.value = {}
}

function removeItem(id) {
  items.value = items.value.filter(e => e.id !== id)
}

loadRefs()
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
          <div class="flex-fill">
            <v-select variant="outlined" v-model="new_item.productId" :items="products" item-title="name" item-value="id" density="compact" hide-details />
          </div>
          <div class="flex-fill">
            <v-text-field variant="outlined" v-model="new_item.quantity" type="number" density="compact" hide-details />
          </div>
          <div class="flex-fill">
            <v-text-field variant="outlined" v-model="new_item.unitPrice" type="number" density="compact" hide-details />
          </div>
          <div class="flex-fill">
            <v-btn @click="addItem" icon="mdi-plus" size="x-small" />
          </div>
        </div>

        <List
            :items="tableData"
            :fields="{ product: 'პროდუქტი', quantity: 'რაოდენობა', unitPrice: 'ფასი' }"
            :delete="removeItem"
            v-if="loaded"
        />
      </v-container>

      <template v-slot:actions>
        <v-btn @click="save">შენახვა</v-btn>
        <v-btn to="/purchase">დახურვა</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
