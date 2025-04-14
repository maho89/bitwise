<script setup>
import {inject, ref} from "vue";
import {useRouter} from "vue-router";
const dlg = true;
const $http = inject('$http');
const props = defineProps({
  types:{
    type:Array,
  },
  load:{
    type:Function
  },
  product: {
    type: Object,
    required: true
  }
});
const router = useRouter();
let pData = ref({ ...props.product });
function save() {
    $http.post('Products/SaveProduct', pData.value).then(()=>{
      props.load()
      router.push('/products');
    })
}

</script>

<template>
  <v-dialog width="800"  class="mx-auto" v-model="dlg">
    <v-card>
      <v-list>
        <v-select
            v-model="pData.productTypeId"
            :items="props.types"
            item-value="id"
            item-title="name"
            label="პროდუქტის ტიპი"
        />
        <v-text-field v-model="pData.name" label="Name" required/>
        <v-text-field v-model="pData.barcode" label="Barcode" required/>
        <v-text-field v-model="pData.description" label="Description" required/>
      </v-list>
      <template v-slot:actions>
        <v-btn @click="save()">შენახვა</v-btn>
        <v-btn to="/product">დახურვა</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>