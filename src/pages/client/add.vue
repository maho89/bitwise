<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import useClientService from './service'

const router = useRouter()
const { save } = useClientService()

const props = defineProps({
  client: Object,
  clientTypes: Array
})

const dlg = ref(true)
const form = ref({ ...props.client })
const loading = ref(false)

watch(() => props.client, (val) => {
  form.value = { ...val }
})

function submit() {
  loading.value = true
  save(form.value)
      .then(() => {
        router.push('/client')
      })
      .finally(() => {
        loading.value = false
      })
}
</script>

<template>
  <v-dialog width="800" v-model="dlg" persistent>
    <v-card class="pa-4">
      <v-form @submit.prevent="submit">
        <v-text-field v-model="form.name" label="დასახელება" required />
        <v-text-field v-model="form.phone" label="ტელეფონი" />
        <v-text-field v-model="form.email" label="ელ. ფოსტა" />
        <v-text-field v-model="form.identificationNumber" label="იდენტიფიკაციის ნომერი" />

        <v-select
            v-model="form.clientTypeId"
            :items="props.clientTypes"
            item-value="id"
            item-title="name"
            label="ტიპი"
        />

        <v-btn type="submit" :loading="loading" color="primary" class="mt-4">
          შენახვა
        </v-btn>
        <v-btn to="/client" color="secondary" class="mt-4">
          დახურვა
        </v-btn>
      </v-form>
    </v-card>
  </v-dialog>
</template>
