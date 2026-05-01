import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSocketStore } from './socket'
import { getDevice } from '@/services/deviceService'

export interface Notificacion {
   id: string
   titulo: string
   descripcion: string
   tiempo: string
   leida: boolean
}

export const useNotificacionesStore = defineStore('notificaciones', () => {
   const notificaciones = ref<Notificacion[]>([])
   const sinLeer = computed(() => notificaciones.value.filter(n => !n.leida).length)

   function iniciar() {
      const socketStore = useSocketStore()
      const socket = socketStore.socket

      if (!socket) return

      socket.on('deviceEvent', async (e: any) => {
         const device = await getDevice(e.data.deviceId).catch(() => null)
         notificaciones.value.unshift({
            id: e.id,
            titulo: device?.name ?? 'Dispositivo',
            descripcion: formatEvento(e.data.event, e.data.args),
            tiempo: tiempoRelativo(e.data.timestamp),
            leida: false
         })
      })

      socket.on('homeShared', (e: any) => {
         notificaciones.value.unshift({
            id: e.homeId,
            titulo: 'Casa compartida',
            descripcion: 'Alguien compartió una casa contigo',
            tiempo: 'Ahora',
            leida: false
         })
      })

      socket.on('homeUnshared', (e: any) => {
         notificaciones.value.unshift({
            id: e.homeId,
            titulo: 'Acceso removido',
            descripcion: 'Te quitaron acceso a una casa',
            tiempo: 'Ahora',
            leida: false
         })
      })
   }

   function marcarTodasLeidas() {
      notificaciones.value.forEach(n => n.leida = true)
   }

   return { notificaciones, sinLeer, iniciar, marcarTodasLeidas }
})

function formatEvento(event: string, args: any): string {
   if (event === 'statusChanged') return args?.newStatus === 'on' ? 'Encendido' : 'Apagado'
   if (event === 'brightnessChanged') return `Brillo: ${args?.newBrightness}%`
   if (event === 'temperatureChanged') return `Temperatura: ${args?.newTemperature}°C`
   return event
}

function tiempoRelativo(timestamp: string): string {
   const mins = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000)
   if (mins < 1) return 'Ahora'
   if (mins < 60) return `Hace ${mins} min`
   return `Hace ${Math.floor(mins / 60)} h`
}
