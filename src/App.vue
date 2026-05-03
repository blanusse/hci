<template>
  <v-app>
    <v-main>
      <Navbar v-if="route.path !== '/'" @brand-click="$router.push('/dashboard')" @open-notificaciones="mostrarNotificaciones = true" @open-perfil="mostrarPerfil = true" @open-historial="mostrarHistorial = true"/>
      <NotificacionesPanel v-if="mostrarNotificaciones" @close="mostrarNotificaciones = false" />
      <PerfilPanel v-if="mostrarPerfil" @close="mostrarPerfil = false" />
      <HistorialPanel v-if="mostrarHistorial" @close="mostrarHistorial = false" />
      <RouterView />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import Navbar from '@/components/Navbar.vue'
import { useRoute } from 'vue-router'
import { useSocketStore } from '@/stores/socket'
import { ref, watch } from 'vue'
import NotificacionesPanel from '@/components/Paneles/NotificacionesPanel.vue'
import PerfilPanel from '@/components/Paneles/PerfilPanel.vue'
import HistorialPanel from '@/components/Paneles/HistorialPanel.vue'
import { useNotificacionesStore } from './stores/notificaciones'

const mostrarNotificaciones = ref(false)
const mostrarPerfil = ref(false)
const mostrarHistorial = ref(false)
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
