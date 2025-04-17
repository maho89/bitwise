<script setup>
import {inject, ref} from 'vue';
import {useRouter} from 'vue-router';

const $http = inject('$http');
const router = useRouter();
const dlg = true;
const props = defineProps({
  warehouse: Object,
  load: Function
});

let pData = ref({ ...props.warehouse });

function save() {
  $http.post('Warehouses/SaveWarehouse', pData.value).then(() => {
    props.load();
    router.push('/warehouses');
  });
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
        <v-btn @click="save">შენახვა</v-btn>
        <v-btn to="/warehouse">დახურვა</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
