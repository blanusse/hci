<template>
   <EditableDeviceModal :dirty="hayCambios" :saving="cargando" @cancel="cancelar" @confirm="aceptar">
      <template #header>
         <div class="dev-icon" :class="iconClass">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['blinds']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ estadoTexto }}</div>
         </div>
      </template>

      <div class="blind-preview" :class="iconClass">
         <div class="blind-rail"></div>
         <div class="blind-window">
            <div class="blind-cover" :style="{ height: `${100 - posicion}%` }"></div>
         </div>
         <div class="blind-meta">
            <span class="blind-value">{{ posicion }}%</span>
         </div>
      </div>

      <div class="ctrl-row">
         <button class="ctrl-btn" :class="{ active: posicion === 0 }" :disabled="cargando" @click="cerrar">
            Cerrar
         </button>
         <button class="ctrl-btn" :class="{ active: posicion === 100 }" :disabled="cargando" @click="abrir">
            Abrir
         </button>
      </div>

      <div class="section-label">Posición</div>
      <div class="slider-row">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['blinds']"></svg>
         <input
            v-model="posicion"
            type="range"
            min="0"
            max="100"
            class="slider"
            :disabled="cargando"
            @input="accionPendiente = 'setPosition'"
         />
         <span class="slider-val">{{ posicion }}%</span>
      </div>
   </EditableDeviceModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import EditableDeviceModal from '@/components/Modales/EditableDeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { getDeviceState, manipulateDevice } from '@/services/deviceService'

const props = defineProps<{
   device: any
}>()

const emit = defineEmits(['close', 'update:state'])

const cargando = ref(false)
const posicionInicial = ref(getPosicion(props.device))
const posicion = ref(posicionInicial.value)
const estado = ref(normalizarEstado(props.device.state?.status, posicion.value))
const accionPendiente = ref<string | null>(null)

const hayCambios = computed(() => posicion.value !== posicionInicial.value || accionPendiente.value !== null)

const estadoTexto = computed(() => {
   const labels: Record<string, string> = {
      opened: 'Abierta',
      opening: 'Abriéndose',
      closed: 'Cerrada',
      closing: 'Cerrándose',
   }
   return labels[estado.value] ?? 'Estado desconocido'
})

const iconClass = computed(() => {
   if (estado.value === 'opened') return 'open'
   if (estado.value === 'closed') return 'closed'
   return 'moving'
})

function clamp(value: number) {
   return Math.min(100, Math.max(0, value))
}

function rawPosicion(device: any) {
   return device?.state?.currentLevel
      ?? device?.state?.level
      ?? device?.state?.position
      ?? device?.state?.posicion
      ?? 0
}

function toApiPosition(uiPosition: number) {
   return uiPosition
}

function fromApiPosition(apiPosition: number) {
   return apiPosition
}

function getPosicion(device: any) {
   const raw = clamp(Number(rawPosicion(device)) || 0)
   return fromApiPosition(raw)
}

function normalizarEstado(rawStatus: string | undefined, currentPosition: number) {
   const status = String(rawStatus ?? '').toLowerCase()

   if (['opened', 'open', 'abierta'].includes(status)) return 'opened'
   if (['opening', 'abriéndose', 'abriendo'].includes(status)) return 'opening'
   if (['closed', 'close', 'cerrada'].includes(status)) return 'closed'
   if (['closing', 'cerrándose', 'cerrando'].includes(status)) return 'closing'

   if (currentPosition <= 0) return 'closed'
   if (currentPosition >= 100) return 'opened'
   return 'opening'
}

function estadoDesdePosicion(currentPosition: number, previousPosition: number) {
   if (currentPosition <= 0) return 'closed'
   if (currentPosition >= 100) return 'opened'
   if (currentPosition > previousPosition) return 'opening'
   if (currentPosition < previousPosition) return 'closing'
   return estado.value
}

function syncDeviceState(status: string, level: number) {
   if (!props.device.state) props.device.state = {}
   props.device.state.status = status
   const apiLevel = toApiPosition(level)
   props.device.state.currentLevel = apiLevel
   props.device.state.level = apiLevel
   props.device.state.position = apiLevel
   props.device.state.posicion = apiLevel
}

async function enviarPosicionAPi(apiPosicionObjetivo: number) {
   try {
      await manipulateDevice(props.device.id, 'setPosition', [apiPosicionObjetivo])
   } catch {
      await manipulateDevice(props.device.id, 'setLevel', [apiPosicionObjetivo])
   }
}

async function leerEstadoReal() {
   try {
      return await getDeviceState(props.device.id)
   } catch {
      return null
   }
}

function sleep(ms: number) {
   return new Promise(resolve => setTimeout(resolve, ms))
}

async function esperarPosicionObjetivo(posicionObjetivo: number, intentos = 8) {
   for (let i = 0; i < intentos; i++) {
      const estadoReal = await leerEstadoReal()
      if (estadoReal) {
         const posicionActual = getPosicion({ state: estadoReal })
         if (Math.abs(posicionActual - posicionObjetivo) <= 5) {
            return { estadoReal, posicionActual }
         }
      }
      await sleep(350)
   }
   const estadoReal = await leerEstadoReal()
   if (!estadoReal) return null
   return { estadoReal, posicionActual: getPosicion({ state: estadoReal }) }
}

async function ejecutarAccionPersiana(accion: string, posicionObjetivo: number) {
   const apiPosicionObjetivo = toApiPosition(posicionObjetivo)

   if (accion === 'open') {
      try {
         await manipulateDevice(props.device.id, 'open')
         return
      } catch {
         await enviarPosicionAPi(apiPosicionObjetivo)
         return
      }
   }

   if (accion === 'close') {
      try {
         await manipulateDevice(props.device.id, 'close')
         return
      } catch {
         await enviarPosicionAPi(apiPosicionObjetivo)
         return
      }
   }

   await enviarPosicionAPi(apiPosicionObjetivo)

   const estadoReal = await leerEstadoReal()
   if (!estadoReal) return

   const posicionReportada = clamp(Number(
      estadoReal.currentLevel
      ?? estadoReal.level
      ?? estadoReal.position
      ?? estadoReal.posicion
      ?? apiPosicionObjetivo
   ) || apiPosicionObjetivo)

   const uiSegunActual = fromApiPosition(posicionReportada)
   if (Math.abs(uiSegunActual - posicionObjetivo) <= 8) return
}

function abrir() {
   const anterior = posicion.value
   posicion.value = 100
   estado.value = estadoDesdePosicion(100, anterior)
   accionPendiente.value = 'open'
}

function cerrar() {
   const anterior = posicion.value
   posicion.value = 0
   estado.value = estadoDesdePosicion(0, anterior)
   accionPendiente.value = 'close'
}

function cancelar() {
   accionPendiente.value = null
   emit('close')
}

async function aceptar() {
   cargando.value = true
   try {
      const nuevaPosicion = clamp(Number(posicion.value))
      const nuevoEstado = estadoDesdePosicion(nuevaPosicion, posicionInicial.value)
      const accion = accionPendiente.value
         ?? (nuevaPosicion === 100 ? 'open' : nuevaPosicion === 0 ? 'close' : 'setPosition')

      await ejecutarAccionPersiana(accion, nuevaPosicion)

      const resultadoFinal = await esperarPosicionObjetivo(nuevaPosicion)
      const estadoReal = resultadoFinal?.estadoReal ?? await leerEstadoReal()
      const posicionFinal = resultadoFinal?.posicionActual
         ?? (estadoReal ? getPosicion({ state: estadoReal }) : nuevaPosicion)
      const estadoFinal = estadoReal?.status
         ? normalizarEstado(estadoReal.status, posicionFinal)
         : nuevoEstado

      posicionInicial.value = posicionFinal
      posicion.value = posicionFinal
      estado.value = estadoFinal
      accionPendiente.value = null
      syncDeviceState(estadoFinal, posicionFinal)
      emit('update:state', estadoFinal)
      emit('close')
   } finally {
      cargando.value = false
   }
}
</script>

<style scoped>
.blind-preview {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 12px;
   margin: 0 auto 20px;
   padding: 18px;
   border-radius: 18px;
   border: 2px solid var(--border);
   transition: all 0.2s ease;
}

.blind-preview.open {
   background: linear-gradient(180deg, var(--color-sky-light), var(--surface));
}

.blind-preview.closed {
   background: linear-gradient(180deg, var(--surface2), var(--surface));
}

.blind-preview.moving {
   background: linear-gradient(180deg, var(--accent-light), var(--surface));
}

.blind-rail {
   width: 112px;
   height: 8px;
   border-radius: 999px;
   background: var(--text);
   opacity: 0.22;
}

.blind-window {
   position: relative;
   width: 112px;
   height: 120px;
   border-radius: 14px;
   border: 2px solid var(--border);
   background:
      linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05)),
      linear-gradient(180deg, #dbeafe, #eff6ff);
   overflow: hidden;
}

.blind-cover {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   background:
      repeating-linear-gradient(
         180deg,
         color-mix(in srgb, var(--accent) 12%, white) 0px,
         color-mix(in srgb, var(--accent) 12%, white) 12px,
         color-mix(in srgb, var(--accent) 26%, white) 12px,
         color-mix(in srgb, var(--accent) 26%, white) 24px
      );
   border-top: 1px solid rgba(0, 0, 0, 0.08);
   transition: height 0.2s ease;
}

.blind-meta {
   display: flex;
   align-items: center;
   justify-content: center;
}

.blind-value {
   font-size: 1rem;
   font-weight: 700;
   color: var(--text);
}

.dev-icon {
   width: 40px;
   height: 40px;
   border-radius: 10px;
   display: flex;
   align-items: center;
   justify-content: center;
   flex-shrink: 0;
}

.dev-icon.open {
   background: var(--color-sky-light);
   color: var(--color-sky);
}

.dev-icon.closed {
   background: var(--surface2);
   color: var(--text-muted);
}

.dev-icon.moving {
   background: var(--accent-light);
   color: var(--accent);
}

.dev-name { font-size: 1.1rem; font-weight: 700; color: var(--text); }
.dev-status { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }

.ctrl-row {
   display: flex;
   gap: 10px;
   margin-bottom: 20px;
}

.ctrl-btn {
   flex: 1;
   padding: 10px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text-muted);
   font-size: 0.95rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   transition: all 0.15s;
}

.ctrl-btn.active {
   background: var(--accent);
   color: white;
   border-color: var(--accent);
}

.ctrl-btn:hover:not(.active) {
   border-color: var(--accent);
   color: var(--accent);
}

.section-label {
   font-size: 0.82rem;
   font-weight: 700;
   text-transform: uppercase;
   letter-spacing: 0.06em;
   color: var(--text-muted);
   margin-bottom: 10px;
}

.slider-row {
   display: flex;
   align-items: center;
   gap: 10px;
   margin-bottom: 20px;
   color: var(--text-muted);
}

.slider {
   flex: 1;
   accent-color: var(--accent);
   cursor: pointer;
}

.slider:disabled { opacity: 0.4; cursor: not-allowed; }

.slider-val {
   font-size: 0.9rem;
   font-weight: 600;
   color: var(--text);
   min-width: 36px;
   text-align: right;
}
</style>
