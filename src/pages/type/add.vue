<script setup>
import {inject, ref} from 'vue';
import {useRouter} from 'vue-router';
const $http = inject('$http');
const router = useRouter();

const props = defineProps({
  types:{
    type:Array,
  },
  type: {
    type: Object,
    required: true
  },
  load: Function
});

let pData = ref({...props.type});

function save() {
  $http.post('ProductTypes/SaveProductType', pData.value).then(() => {
    props.load();
    router.push('/type');
  });
}
</script>

<template>
  <v-dialog width="600" :model-value="true">
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
        <v-btn @click="save">შენახვა</v-btn>
        <v-btn to="/type">დახურვა</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
