<script setup>
import {inject, ref} from "vue";
import {useTheme} from "vuetify";
let     data = ref({user:'admin',pass:'satesto'});
const   http = inject("$http");
function login(){
  event.preventDefault();
  let p = {
    "userName" : data.value.user,
    "passWord" : data.value.pass
  }
  http.post('User/Authenticate',p)
      .then(data=>{
        if (data.code === 0){
          localStorage.setItem('token',data.sessionToken);
          location.reload();
        }
      })
      .finally(()=>{
      // location.reload()
  });
}
const theme = useTheme();
</script>
<template>
    <div class="login_bg">
      <v-card class="pa-5">
        <v-btn
          class="position-absolute right-0 top-0"
          style="z-index: 999"
          @click="toggleTheme()"
          :key="theme.global.name"
          variant="text"
          slim
          :icon="theme.global.name.value=='dark'?'mdi-white-balance-sunny':'mdi-moon-waning-crescent'"/>
        <v-img  class="ma-10" src="/src/assets/logo.svg" style="height: 150px" />
        <form @submit="login()" class="login">
          <v-text-field  v-model="data.userName" label="მომხმარებელი"  />
          <v-text-field  v-model="data.passWord" label="პაროლი" type="password"  />
          <v-btn  type="submit" >შესვლა</v-btn>
        </form>
      </v-card>

    </div>
</template>
<style>
.login_bg{
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login{
  width: 300px;
  display: flex;
  flex-direction: column;
}
</style>
