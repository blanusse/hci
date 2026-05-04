import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDeviceLogs, getDevice } from '@/services/deviceService'

export interface Notificacion {
   id: string
   titulo: string
   descripcion: string
   tiempo: string
   leida: boolean
}

const POLL_INTERVAL = 15000 // ms

export const useNotificacionesStore = defineStore('notificaciones', () => {
   const notificaciones = ref<Notificacion[]>([])
   const sinLeer = computed(() => notificaciones.value.filter(n => !n.leida).length)

   let intervalo: ReturnType<typeof setInterval> | null = null
   let seenIds = new Set<string>()
   const deviceCache: Record<string, string> = {}

   async function nombreDispositivo(deviceId: string): Promise<string> {
      if (deviceCache[deviceId]) return deviceCache[deviceId]
      try {
         const d = await getDevice(deviceId)
         deviceCache[deviceId] = d?.name ?? deviceId
      } catch {
         deviceCache[deviceId] = deviceId
      }
      return deviceCache[deviceId]
   }

   async function poll() {
      try {
         const logs = await getDeviceLogs(20, 0)
         const nuevos = logs.filter((l: any) => !seenIds.has(l.id))
         for (const l of nuevos) {
            seenIds.add(l.id)
         }
         // Primera carga: marcar como vistos sin generar notificaciones
         if (notificaciones.value.length === 0 && seenIds.size === logs.length && nuevos.length === logs.length) {
            return
         }
         for (const l of nuevos) {
            const nombre = await nombreDispositivo(l.deviceId)
            notificaciones.value.unshift({
               id: l.id,
               titulo: nombre,
               descripcion: formatAccion(l.actionName, l.params),
               tiempo: tiempoRelativo(l.timestamp),
               leida: false
            })
         }
      } catch {}
   }

   function iniciar() {
      if (intervalo) return
      // Primera carga: seed de IDs vistos sin notificar
      getDeviceLogs(20, 0).then((logs: any[]) => {
         logs.forEach((l: any) => seenIds.add(l.id))
      }).catch(() => {})

      intervalo = setInterval(poll, POLL_INTERVAL)
   }

   function detener() {
      if (intervalo) {
         clearInterval(intervalo)
         intervalo = null
      }
   }

   function marcarTodasLeidas() {
      notificaciones.value.forEach(n => n.leida = true)
   }

   return { notificaciones, sinLeer, iniciar, detener, marcarTodasLeidas }
})

function formatAccion(actionName: string, params: any[]): string {
   if (actionName === 'turnOn') return 'Encendido'
   if (actionName === 'turnOff') return 'Apagado'
   if (actionName === 'setBrightness') return `Brillo: ${params?.[0] ?? ''}%`
   if (actionName === 'setTemperature') return `Temperatura: ${params?.[0] ?? ''}°C`
   if (actionName === 'setColor') return 'Color cambiado'
   if (actionName === 'setMode') return `Modo: ${params?.[0] ?? ''}`
   if (actionName === 'setSpeed') return `Velocidad: ${params?.[0] ?? ''}`
   if (actionName === 'setLocked') return params?.[0] ? 'Bloqueado' : 'Desbloqueado'
   if (actionName === 'open') return 'Abierto'
   if (actionName === 'close') return 'Cerrado'
   return actionName
}

function tiempoRelativo(timestamp: string): string {
   const mins = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000)
   if (mins < 1) return 'Ahora'
   if (mins < 60) return `Hace ${mins} min`
   return `Hace ${Math.floor(mins / 60)} h`
}
