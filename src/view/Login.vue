<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import useUserService from '@/services/user'

const { login } = useUserService()

const data = ref({
  userName: '',
  passWord: ''
})

function submit(e) {
  e.preventDefault()
  login({
    userName: data.value.userName,
    passWord: data.value.passWord
  })
}

const theme = useTheme()
function toggleTheme() {
  theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="login_bg">
    <v-card class="pa-5">
      <v-btn
          class="position-absolute right-0 top-0"
          style="z-index: 999"
          @click="toggleTheme"
          :key="theme.global.name"
          variant="text"
          slim
          :icon="theme.global.name.value === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
      />
      <v-img class="ma-10" src="/src/assets/logo.svg" style="height: 150px" />
      <form @submit="submit" class="login">
        <v-text-field v-model="data.userName" label="მომხმარებელი" />
        <v-text-field v-model="data.passWord" label="პაროლი" type="password" />
        <v-btn type="submit">შესვლა</v-btn>
      </form>
    </v-card>
  </div>
</template>

<style scoped>
.login_bg {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login {
  width: 300px;
  display: flex;
  flex-direction: column;
}
</style>
