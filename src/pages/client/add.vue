<script setup>
import { ref ,inject} from 'vue';
import { useRouter } from 'vue-router';
const dlg = true;
const props = defineProps({
  client: Object,
  clientTypes: Array,
  load: Function
});

const $http = inject('$http');
const router = useRouter();
const form = ref({ ...props.client });
const loading = ref(false);

function save() {
  loading.value = true;
  $http.post('Clients/SaveClient', form.value)
      .then(res => {
        if (res.success) {
          props.load();
          router.push('/client');
        }
      })
      .finally(() => loading.value = false);
}
</script>

<template>
  <v-dialog width="800" v-model="dlg">
  <v-card class="pa-4">

    <v-form @submit.prevent="save">
      <v-text-field v-model="form.name" label="დასახელება" required />
      <v-text-field v-model="form.phone" label="ტელეფონი" />
      <v-text-field v-model="form.email" label="ელ. ფოსტა" />
      <v-text-field v-model="form.identificationNumber" label="იდენტიფიკაციის ნომერი" />

      <v-select
          v-model="form.clientTypeId"
          :items="clientTypes"
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