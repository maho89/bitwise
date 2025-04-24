<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import useTypeService from './service'

const router = useRouter()
const { save } = useTypeService()

const props = defineProps({
  type: Object,
  types: Array
})

const dlg = ref(true)
const pData = ref({ ...props.type })

watch(() => props.type, (val) => {
  pData.value = { ...val }
})

function submit() {
  save(pData.value).then(() => {
    router.push('/type')
  })
}
</script>

<template>
  <v-dialog width="800" v-model="dlg" persistent>
    <v-card>
      <v-list>
        <v-text-field v-model="pData.name" label="დასახელება" required />
        <v-select
            v-model="pData.parentTypeId"
            :items="props.types"
            item-value="id"
            item-title="name"
            label="მშობელი ტიპი"
        />
      </v-list>
      <template v-slot:actions>
        <v-btn @click="submit">შენახვა</v-btn>
        <v-btn to="/type">დახურვა</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
