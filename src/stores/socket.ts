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

      socket.value = io('https://hci.it.itba.edu.ar/', {
         transports: ['websocket'],
         reconnection: false,
         auth: { token: auth.token }
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
