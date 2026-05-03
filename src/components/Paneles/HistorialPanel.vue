<template>
   <div class="panel-overlay" @click.self="$emit('close')">
      <div class="panel">

         <div class="panel-header">
            <div class="panel-title">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
               </svg>
               Historial
            </div>
            <button class="panel-close" @click="$emit('close')">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
               </svg>
            </button>
         </div>

         <!-- Filtros -->
         <div class="filtros">
            <div class="filtro-field">
               <label class="filtro-label">Casa</label>
               <select class="filtro-select" v-model="filtroHome">
                  <option value="">Todas</option>
                  <option v-for="h in homes" :key="h.id" :value="h.id">{{ h.name }}</option>
               </select>
            </div>
            <div class="filtro-field">
               <label class="filtro-label">Fecha</label>
               <input class="filtro-input" type="date" v-model="filtroFecha" />
            </div>
            <button v-if="filtroHome || filtroFecha" class="filtro-clear" @click="filtroHome = ''; filtroFecha = ''">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
               </svg>
               Limpiar
            </button>
         </div>

         <div class="panel-body">

            <div v-if="cargando" class="panel-empty">
               <div class="spinner"></div>
               <p>Cargando historial…</p>
            </div>

            <div v-else-if="registrosFiltrados.length === 0" class="panel-empty">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
               </svg>
               <p>Sin registros</p>
            </div>

            <template v-else>
               <template v-for="(grupo, fecha) in registrosAgrupados" :key="fecha">
                  <div class="hist-fecha-label">{{ fecha }}</div>
                  <div v-for="r in grupo" :key="r.id" class="hist-item">
                     <div class="hist-icon" :class="r.colorClass">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="r.iconSvg"></svg>
                     </div>
                     <div class="hist-content">
                        <div class="hist-device">{{ r.deviceName }}</div>
                        <div class="hist-accion">{{ r.descripcion }}</div>
                        <div class="hist-meta">
                           <span class="hist-home">{{ r.homeName || 'Sin casa' }}</span>
                           <span class="hist-result" :class="r.result ? 'ok' : 'err'">
                              {{ r.result ? 'OK' : 'Error' }}
                           </span>
                           <span class="hist-time">{{ r.hora }}</span>
                        </div>
                     </div>
                  </div>
               </template>
            </template>

         </div>

      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getDeviceLogs, getDevice } from '@/services/deviceService'
import { getHomes, getRooms, getRoomDevices } from '@/services/homeService'

defineEmits(['close'])

const cargando = ref(true)
const homes = ref<{ id: string; name: string }[]>([])
const registros = ref<Registro[]>([])

const filtroHome = ref('')
const filtroFecha = ref('')

interface Registro {
   id: string
   deviceName: string
   descripcion: string
   homeName: string
   homeId: string
   fecha: string   // 'YYYY-MM-DD'
   hora: string    // 'HH:MM'
   iconSvg: string
   colorClass: string
   result: boolean
}

const registrosFiltrados = computed(() => {
   return registros.value.filter(r => {
      if (filtroHome.value && r.homeId !== filtroHome.value) return false
      if (filtroFecha.value && r.fecha !== filtroFecha.value) return false
      return true
   })
})

const registrosAgrupados = computed(() => {
   const grupos: Record<string, Registro[]> = {}
   for (const r of registrosFiltrados.value) {
      const label = fechaLabel(r.fecha)
      if (!grupos[label]) grupos[label] = []
      grupos[label].push(r)
   }
   return grupos
})

function fechaLabel(fecha: string): string {
   const hoy = new Date().toISOString().slice(0, 10)
   const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
   if (fecha === hoy) return 'Hoy'
   if (fecha === ayer) return 'Ayer'
   return new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function actionInfo(actionName: string): { descripcion: string; iconSvg: string; colorClass: string } {
   const map: Record<string, { descripcion: string; iconSvg: string; colorClass: string }> = {
      turnOn:          { descripcion: 'Encendido',          iconSvg: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>',                                          colorClass: 'color-green'  },
      turnOff:         { descripcion: 'Apagado',            iconSvg: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>',                                          colorClass: 'color-gray'   },
      setBrightness:   { descripcion: 'Brillo cambiado',    iconSvg: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',  colorClass: 'color-yellow' },
      setTemperature:  { descripcion: 'Temperatura',        iconSvg: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',                                                    colorClass: 'color-blue'   },
      setColor:        { descripcion: 'Color cambiado',     iconSvg: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',  colorClass: 'color-yellow' },
      setMode:         { descripcion: 'Modo cambiado',      iconSvg: '<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>',                colorClass: 'color-blue'   },
      setSpeed:        { descripcion: 'Velocidad cambiada', iconSvg: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',                                     colorClass: 'color-blue'   },
      setLocked:       { descripcion: 'Cerrojo cambiado',   iconSvg: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',                           colorClass: 'color-red'    },
      open:            { descripcion: 'Abierto',            iconSvg: '<polyline points="5 9 2 12 5 15"/><path d="M20 4v7a4 4 0 0 1-4 4H2"/>',                                                    colorClass: 'color-green'  },
      close:           { descripcion: 'Cerrado',            iconSvg: '<polyline points="19 9 22 12 19 15"/><path d="M2 4v7a4 4 0 0 0 4 4h14"/>',                                                 colorClass: 'color-gray'   },
   }
   return map[actionName] ?? {
      descripcion: actionName,
      iconSvg: '<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>',
      colorClass: 'color-blue'
   }
}

onMounted(async () => {
   try {
      // 1. Load homes list for filter dropdown
      const homesData = await getHomes()
      homes.value = homesData

      // 2. Build deviceId → { homeId, homeName } map
      const deviceHomeMap: Record<string, { homeId: string; homeName: string }> = {}
      await Promise.all(homesData.map(async (home: any) => {
         try {
            const rooms = await getRooms(home.id)
            await Promise.all(rooms.map(async (room: any) => {
               try {
                  const devices = await getRoomDevices(room.id)
                  for (const d of devices) {
                     deviceHomeMap[d.id] = { homeId: home.id, homeName: home.name }
                  }
               } catch {}
            }))
         } catch {}
      }))

      // 3. Load logs
      const logs = await getDeviceLogs(100, 0)

      // 4. Fetch device names (with cache)
      const deviceNameCache: Record<string, string> = {}
      const deviceIds = [...new Set(logs.map((l: any) => l.deviceId))]
      await Promise.all(deviceIds.map(async (id: any) => {
         try {
            const d = await getDevice(id)
            deviceNameCache[id] = d?.name ?? id
         } catch {
            deviceNameCache[id] = id
         }
      }))

      // 5. Map logs to Registro
      registros.value = logs.map((log: any) => {
         const ts = new Date(log.timestamp)
         const fecha = ts.toISOString().slice(0, 10)
         const hora = ts.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
         const homeInfo = deviceHomeMap[log.deviceId] ?? { homeId: '', homeName: '' }
         const info = actionInfo(log.actionName)
         return {
            id: log.id,
            deviceName: deviceNameCache[log.deviceId] ?? log.deviceId,
            descripcion: info.descripcion,
            homeName: homeInfo.homeName,
            homeId: homeInfo.homeId,
            fecha,
            hora,
            iconSvg: info.iconSvg,
            colorClass: info.colorClass,
            result: log.result !== false && log.result !== null && log.result !== undefined
         } satisfies Registro
      })
   } finally {
      cargando.value = false
   }
})
</script>

<style scoped>
.panel-overlay {
   position: fixed;
   inset: 0;
   background: rgba(0,0,0,0.3);
   backdrop-filter: blur(2px);
   z-index: 200;
   display: flex;
   justify-content: flex-end;
}

.panel {
   width: clamp(300px, 33vw, 500px);
   height: 100%;
   background: var(--surface);
   display: flex;
   flex-direction: column;
   box-shadow: -4px 0 24px rgba(0,0,0,0.12);
   animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
   from { transform: translateX(100%); }
   to   { transform: translateX(0); }
}

.panel-header {
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 20px 20px 16px;
   border-bottom: 1px solid var(--border);
   flex-shrink: 0;
}

.panel-title {
   display: flex;
   align-items: center;
   gap: 10px;
   font-size: 1.1rem;
   font-weight: 700;
   color: var(--text);
}

.panel-close {
   width: 32px; height: 32px;
   border-radius: 50%;
   border: none;
   background: var(--surface2);
   cursor: pointer;
   display: flex; align-items: center; justify-content: center;
   color: var(--text-muted);
   transition: background 0.15s;
}
.panel-close:hover { background: var(--border); }

/* Filtros */
.filtros {
   display: flex;
   align-items: flex-end;
   gap: 10px;
   padding: 14px 16px;
   border-bottom: 1px solid var(--border);
   flex-shrink: 0;
   flex-wrap: wrap;
}

.filtro-field {
   display: flex;
   flex-direction: column;
   gap: 4px;
   flex: 1;
   min-width: 100px;
}

.filtro-label {
   font-size: 0.68rem;
   font-weight: 700;
   color: var(--text-muted);
   text-transform: uppercase;
   letter-spacing: 0.06em;
}

.filtro-select,
.filtro-input {
   padding: 7px 10px;
   border-radius: 8px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text);
   font-size: 0.85rem;
   font-family: inherit;
   outline: none;
   transition: border-color 0.15s;
   width: 100%;
}
.filtro-select:focus,
.filtro-input:focus { border-color: var(--accent); }

.filtro-clear {
   display: flex;
   align-items: center;
   gap: 5px;
   padding: 7px 10px;
   border-radius: 8px;
   border: none;
   background: var(--surface2);
   color: var(--text-muted);
   font-size: 0.8rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   white-space: nowrap;
   transition: background 0.15s, color 0.15s;
   align-self: flex-end;
}
.filtro-clear:hover { background: var(--border); color: var(--text); }

/* Body */
.panel-body {
   flex: 1;
   overflow-y: auto;
   padding: 12px 12px 20px;
   display: flex;
   flex-direction: column;
   gap: 2px;
}

.panel-empty {
   flex: 1;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 12px;
   color: var(--text-muted);
   font-size: 0.95rem;
   font-weight: 500;
   padding: 40px 0;
}

/* Fecha label */
.hist-fecha-label {
   font-size: 0.7rem;
   font-weight: 700;
   color: var(--text-muted);
   text-transform: uppercase;
   letter-spacing: 0.07em;
   padding: 12px 4px 6px;
}
.hist-fecha-label:first-child { padding-top: 4px; }

/* Item */
.hist-item {
   display: flex;
   align-items: flex-start;
   gap: 10px;
   padding: 10px 12px;
   border-radius: 10px;
   transition: background 0.12s;
}
.hist-item:hover { background: var(--surface2); }

.hist-icon {
   width: 32px; height: 32px;
   border-radius: 9px;
   display: flex; align-items: center; justify-content: center;
   flex-shrink: 0;
   margin-top: 1px;
}
.hist-icon.color-yellow { background: rgba(245,158,11,0.12); color: #F59E0B; }
.hist-icon.color-blue   { background: rgba(99,102,241,0.12);  color: var(--accent); }
.hist-icon.color-green  { background: var(--success-light);   color: var(--success); }
.hist-icon.color-red    { background: var(--danger-light);    color: var(--color-red); }
.hist-icon.color-gray   { background: var(--surface2);        color: var(--text-muted); }

.hist-content { flex: 1; min-width: 0; }

.hist-device {
   font-size: 0.88rem;
   font-weight: 700;
   color: var(--text);
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}

.hist-accion {
   font-size: 0.8rem;
   color: var(--text-muted);
   margin-top: 2px;
   line-height: 1.35;
}

.hist-meta {
   display: flex;
   align-items: center;
   justify-content: space-between;
   margin-top: 4px;
   gap: 8px;
}

.hist-home {
   font-size: 0.72rem;
   color: var(--text-muted);
   background: var(--surface2);
   padding: 2px 7px;
   border-radius: 20px;
   font-weight: 600;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   flex: 1;
   min-width: 0;
}

.hist-result {
   font-size: 0.68rem;
   font-weight: 700;
   padding: 2px 6px;
   border-radius: 20px;
   flex-shrink: 0;
}
.hist-result.ok  { background: var(--success-light); color: var(--success); }
.hist-result.err { background: var(--danger-light);  color: var(--color-red); }

.hist-time {
   font-size: 0.72rem;
   color: var(--text-muted);
   flex-shrink: 0;
}

/* Spinner */
.spinner {
   width: 28px; height: 28px;
   border: 3px solid var(--border);
   border-top-color: var(--accent);
   border-radius: 50%;
   animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
