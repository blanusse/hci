<template>
  <v-app>
    <v-main>
      <Navbar v-if="route.path !== '/'" @brand-click="$router.push('/dashboard')" />
      <RouterView />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
</script>
