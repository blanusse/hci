<template>
  <v-app>
    <v-main>
      <Navbar v-if="route.path !== '/'" @brand-click="$router.push('/dashboard')"  @open-notificaciones="mostrarNotificaciones = true"/>
      <NotificacionesPanel v-if="mostrarNotificaciones" @close="mostrarNotificaciones = false" />
      <RouterView />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import Navbar from '@/components/Navbar.vue'
import { useRoute } from 'vue-router'
import { useSocketStore } from '@/stores/socket'
import { ref, watch } from 'vue'
import NotificacionesPanel from '@/components/NotificacionesPanel.vue'
import { useNotificacionesStore } from './stores/notificaciones'

const mostrarNotificaciones = ref(false)
const route = useRoute()
const socketStore = useSocketStore()
const notificacionesStore = useNotificacionesStore()


watch(() => route.path, (path) => {
     if (path !== '/') {
        socketStore.conectar()
        notificacionesStore.iniciar()
     }
  }, { immediate: true })


</script>
