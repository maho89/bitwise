<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import useWarehouseService from './service'

const router = useRouter()
const { save } = useWarehouseService()

const props = defineProps({
  warehouse: Object
})

const dlg = ref(true)
const pData = ref({ ...props.warehouse })

watch(() => props.warehouse, (val) => {
  pData.value = { ...val }
})

function submit() {
  save(pData.value).then(() => {
    router.push('/warehouse')
  })
}
</script>

<template>
  <v-dialog width="800" v-model="dlg" persistent>
    <v-card>
      <v-list>
        <v-text-field v-model="pData.name" label="დასახელება" />
        <v-text-field v-model="pData.location" label="მდებარეობა" />
        <v-text-field v-model="pData.rd" label="დამატების თარიღი" type="date" />
        <v-checkbox v-model="pData.active" label="აქტიური?" />
      </v-list>
      <template v-slot:actions>
        <v-btn @click="submit">შენახვა</v-btn>
        <v-btn to="/warehouse">დახურვა</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
