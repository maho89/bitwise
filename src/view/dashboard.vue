<script setup>
import Header from "@/view/Header.vue";
import Nav    from "@/view/Nav.vue";
import Main   from "@/view/Main.vue";
import {inject, ref, watch} from "vue";
const db = inject("db");
let data = ref({initDlg : false, object : null});

const  http = inject("$http");
function loading_data(){
  http.post("REST/",{controller:'Pos',class:'posController',method:'getObjectList'}).then(res=>{
     db.object.bulkAdd(res.data)
  });
}
function loading_products(){
  http.post("REST/",{
    controller:'Pos',
    class:'posController',
    method:'getProductList',
    "data":{
      "objectId":data.value.object,
      "clientId":""
    }
  }).then(res=>{
    db.product.bulkAdd(res.data)
  });
}
//loading_data();
watch(() => data.value.object, () => {
  if(data.value.object){
    loading_products()
    //
  }

}, { immediate: true })
</script>
<template>
  <v-app>
    <Nav />
    <Header />
    <Main  />
    <v-dialog v-model="data.initDlg" width="auto" persistent>
      <v-card width="500" >
        <Sel :name="'object'" v-model="data.object"/>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<style scoped>

</style>
