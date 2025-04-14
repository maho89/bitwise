<script setup>

import Login from "@/view/Login.vue";
import Dashboard from "@/view/dashboard.vue";
import Loading from "@/view/Loading.vue";
</script>

<template>
  <Loading v-if="$user.value===undefined"/>
  <Dashboard v-else-if="$user.value"/>
  <Login v-else />
</template>

<style scoped>

</style>
