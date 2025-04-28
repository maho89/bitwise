<script setup>
const pages = [
  { path: '/sale/add', icon: 'mdi-cash-register', title: 'სალარო' },
  { path: '/sale', icon: 'mdi-cart-arrow-up', title: 'გაყიდვები' },
  { path: '/product', icon: 'mdi-package-variant', title: 'პროდუქტები' },
  { path: '/type', icon: 'mdi-shape-outline', title: 'კატეგორიები' },
  { path: '/warehouse', icon: 'mdi-warehouse', title: 'საწყობები' },
  { path: '/purchase', icon: 'mdi-cart-arrow-down', title: 'შესყიდვები' },
  { path: '/stock', icon: 'mdi-clipboard-list-outline', title: 'სტოკი' },
  { path: '/client', icon: 'mdi-account-group', title: 'კლიენტები' },

];

</script>

<template>
  <template v-if="$vuetify.display.mobile" >
    <v-navigation-drawer
      v-model="$menuOpen.value"
      temporary>
      <v-list density="compact">
        <v-list-item v-for="page in pages" :to="page.path" :prepend-icon="page.icon"   :title="page.title"  link />
      </v-list>
    </v-navigation-drawer>
  </template>
  <template v-else>
    <v-navigation-drawer
      :rail="!$menuOpen.value"
      >
      <v-list density="compact">
        <v-list-item v-for="page in pages" :to="page.path" :prepend-icon="page.icon"   :title="page.title"  link />
      </v-list>
    </v-navigation-drawer>
  </template>

</template>

<style scoped>
/*
 :rail=""
permanent
*/
</style>
