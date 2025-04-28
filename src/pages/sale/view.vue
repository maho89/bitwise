<script setup>
import { ref } from 'vue'
import List from '@/components/List.vue'


const props = defineProps({
  sale: {
    type: Object,
    default: () => ({ id: 0, items: [] })
  }
})

const dlg = ref(true)

// ველები გაყიდული პროდუქტებისთვის
const itemFields = [
  { key: 'product', value: 'პროდუქტი' },
  { key: 'unitPrice', value: 'ფასი' },
  { key: 'quantity', value: 'რაოდენობა' },
  { key: 'total', value: 'თანხა' }
]
</script>

<template>
  <v-dialog v-model="dlg" width="800" persistent v-if="props.sale.id">
    <v-card>
      <v-card-title>
        გაყიდვის დეტალები
      </v-card-title>

      <v-card-text v-if="props.sale">
        <v-list>
          <v-list-item>
            <v-list-item-title>გაყიდვის №: {{ props.sale.id }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>თარიღი: {{ props.sale.saleDate }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>კლიენტი: {{ props.sale.client }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>საწყობი: {{ props.sale.warehouse }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>სულ თანხა: {{ props.sale.totalAmount }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <!-- გაყიდული პროდუქტების ცხრილი ქვემოთ -->
        <v-divider class="my-4" />

        <List
            :items="props.sale.items"
            :fields="itemFields"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" to="/sale">დახურვა</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
