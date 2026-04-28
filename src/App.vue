<template>
  <v-app>
    <v-main>
      <Navbar @brand-click="$router.push('/')"/>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import Navbar from '@/components/Navbar.vue';
</script>
