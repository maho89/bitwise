<script setup>
import {inject, ref, watch} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useProductService from './service'
import ImgBox from "@/components/imgBox.vue";
const $http = inject('$http')
const router = useRouter()
const route = useRoute()
const { save } = useProductService()

const props = defineProps({
  product: Object,
  types: Array
})
const id =  route.params.id;
let images = ref([]);
function loadImages() {
  $http.get(`Products/GetProductImages?productId=${id}`).then((res) => {
    images.value = res.data;
  })
}

const dlg = ref(true)
const pData = ref({ ...props.product })

watch(() => props.product, (val) => {
  pData.value = { ...val }
  l
})
loadImages();
function submit() {
  save(pData.value).then(() => {
    router.push('/product')
  })
}
</script>

<template>
  <v-dialog width="800" class="mx-auto" v-model="dlg" persistent>
    <v-card>
      <v-list>
        <v-select
            v-model="pData.productTypeId"
            :items="props.types"
            item-value="id"
            item-title="name"
            label="პროდუქტის ტიპი"
        />
        <v-text-field v-model="pData.name" label="დასახელება" required />
        <v-text-field v-model="pData.barcode" label="ბარკოდი" required />
        <v-text-field v-model="pData.description" label="აღწერა" required />
        <img-box :id="pData.id" :images="images" />
      </v-list>
      <template v-slot:actions>
        <v-btn @click="submit">შენახვა</v-btn>
        <v-btn to="/product">დახურვა</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
