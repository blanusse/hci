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
   let iniciado = false

   function iniciar() {
      if (iniciado) return
      iniciado = true
      console.log('[Notificaciones] iniciando listeners SSE')
      const socketStore = useSocketStore()

      socketStore.on('statusChanged', async (e: any) => {
         const device = await getDevice(e.deviceId).catch(() => null)
         notificaciones.value.unshift({
            id: e.id ?? Date.now().toString(),
            titulo: device?.name ?? 'Dispositivo',
            descripcion: formatEvento(e.event, e.args),
            tiempo: tiempoRelativo(e.timestamp),
            leida: false
         })
      })

      socketStore.on('brightnessChanged', async (e: any) => {
         const device = await getDevice(e.deviceId).catch(() => null)
         notificaciones.value.unshift({
            id: e.id ?? Date.now().toString(),
            titulo: device?.name ?? 'Dispositivo',
            descripcion: formatEvento(e.event, e.args),
            tiempo: tiempoRelativo(e.timestamp),
            leida: false
         })
      })

      socketStore.on('temperatureChanged', async (e: any) => {
         const device = await getDevice(e.deviceId).catch(() => null)
         notificaciones.value.unshift({
            id: e.id ?? Date.now().toString(),
            titulo: device?.name ?? 'Dispositivo',
            descripcion: formatEvento(e.event, e.args),
            tiempo: tiempoRelativo(e.timestamp),
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
