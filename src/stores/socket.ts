import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from './auth'

export const useSocketStore = defineStore('socket', () => {
   const socket = ref<ReturnType<typeof io> | null>(null)
   const conectado = ref(false)

   function conectar() {
      if (socket.value?.connected) return
      const auth = useAuthStore()
      if (!auth.token) return

      socket.value = io('http://localhost:8081', {
         transports: ['polling', 'websocket'],
         reconnection: false,
         auth: { token: auth.token, apiKey: import.meta.env.VITE_API_KEY?.replace('sk_', '') }
      })

      socket.value.on('connect', () => { conectado.value = true })
      socket.value.on('disconnect', () => { conectado.value = false })
   }

   function desconectar() {
      socket.value?.disconnect()
      socket.value = null
      conectado.value = false
   }

   return { socket, conectado, conectar, desconectar }
})
