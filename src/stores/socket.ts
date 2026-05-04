import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

type EventHandler = (data: any) => void

export const useSocketStore = defineStore('socket', () => {
   const conectado = ref(false)
   let es: EventSource | null = null
   const handlers: Record<string, EventHandler[]> = {}

   function conectar() {
      if (es) return
      const auth = useAuthStore()
      if (!auth.token) return

      const apiKey = import.meta.env.VITE_API_KEY as string
      const url = `https://hci.it.itba.edu.ar/api/devices/events?Authorization=${encodeURIComponent('Bearer ' + auth.token)}&X-API-Key=${encodeURIComponent(apiKey)}`
      es = new EventSource(url)

      es.onopen = () => { conectado.value = true }

      es.onmessage = (e) => {
         try {
            const parsed = JSON.parse(e.data)
            const event = parsed.event as string
            if (handlers[event]) handlers[event].forEach(h => h(parsed))
            if (handlers['*']) handlers['*'].forEach(h => h(parsed))
         } catch {}
      }

      es.onerror = () => { conectado.value = false }
   }

   function desconectar() {
      es?.close()
      es = null
      conectado.value = false
   }

   function on(event: string, handler: EventHandler) {
      if (!handlers[event]) handlers[event] = []
      handlers[event].push(handler)
   }

   function off(event: string, handler: EventHandler) {
      if (!handlers[event]) return
      handlers[event] = handlers[event].filter(h => h !== handler)
   }

   return { conectado, conectar, desconectar, on, off }
})
