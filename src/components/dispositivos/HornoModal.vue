<template>
   <DeviceModal @close="$emit('close')">
      <template #header>
         <div class="dev-icon" :class="encendido ? 'on' : 'off'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['oven']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ encendido ? estadoLabel : 'Apagado' }}</div>
         </div>
      </template>

      <div class="oven-preview" :class="[encendido ? 'on' : 'off', encendido ? heatSource : '']">
         <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="deviceIcons['oven']"></svg>
         <span v-if="encendido" class="preview-temp">{{ temperatura }}°C</span>
      </div>

      <div class="ctrl-row">
         <button class="ctrl-btn" :class="{ active: !encendido }" @click="apagar">Apagar</button>
         <button class="ctrl-btn" :class="{ active: encendido }" @click="encender">Encender</button>
      </div>

      <div class="section-label">Temperatura</div>
      <div class="slider-row">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
         </svg>
         <input
            type="range"
            min="90"
            max="230"
            v-model.number="temperatura"
            class="slider"
            :disabled="!encendido"
            @change="onTemperaturaChange"
         />
         <span class="slider-val">{{ temperatura }}°C</span>
      </div>

      <div class="section-label">Fuente de calor</div>
      <div class="option-row wrap">
         <button
            v-for="source in heatSources"
            :key="source.value"
            class="option-btn compact"
            :class="{ active: heatSource === source.value }"
            :disabled="!encendido"
            @click="seleccionarFuenteCalor(source.value)"
         >{{ source.label }}</button>
      </div>

      <div class="section-label">Modo grill</div>
      <div class="option-row wrap">
         <button
            v-for="grill in grillModes"
            :key="grill.value"
            class="option-btn compact"
            :class="{ active: grillMode === grill.value }"
            :disabled="!encendido"
            @click="seleccionarGrill(grill.value)"
         >{{ grill.label }}</button>
      </div>

      <div class="section-label">Modo convección</div>
      <div class="option-row wrap">
         <button
            v-for="convection in convectionModes"
            :key="convection.value"
            class="option-btn compact"
            :class="{ active: convectionMode === convection.value }"
            :disabled="!encendido"
            @click="seleccionarConveccion(convection.value)"
         >{{ convection.label }}</button>
      </div>
   </DeviceModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DeviceModal from '@/components/Modales/DeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { getDeviceState, manipulateDevice } from '@/services/deviceService'

const props = defineProps<{ device: any }>()
const emit = defineEmits(['close', 'update:state'])

const encendido = ref(props.device.state?.status === 'on')
const temperatura = ref<number>(props.device.state?.temperature ?? 180)
const heatSource = ref<string>(props.device.state?.heatSource ?? 'conventional')
const grillMode = ref<string>(props.device.state?.grill ?? 'off')
const convectionMode = ref<string>(props.device.state?.convection ?? 'off')

onMounted(async () => {
   try {
      const s = await getDeviceState(props.device.id)
      if (s) {
         encendido.value = s.status === 'on'
         temperatura.value = s.temperature ?? temperatura.value
         heatSource.value = s.heatSource ?? heatSource.value
         grillMode.value = s.grill ?? grillMode.value
         convectionMode.value = s.convection ?? convectionMode.value
      }
   } catch {}
})

const heatSources = [
   { value: 'conventional', label: 'Convencional' },
   { value: 'bottom', label: 'Abajo' },
   { value: 'top', label: 'Arriba' },
]

const grillModes = [
   { value: 'off', label: 'Apagado' },
   { value: 'eco', label: 'Económico' },
   { value: 'full', label: 'Completo' },
]

const convectionModes = [
   { value: 'off', label: 'Apagado' },
   { value: 'eco', label: 'Económico' },
   { value: 'conventional', label: 'Convencional' },
]

const heatSourceLabelMap: Record<string, string> = {
   conventional: 'Convencional',
   bottom: 'Abajo',
   top: 'Arriba',
}

const estadoLabel = computed(() => {
   return heatSourceLabelMap[heatSource.value] ?? 'Encendido'
})

function encender() {
   encendido.value = true
   manipulateDevice(props.device.id, 'turnOn', [])
   emit('update:state', 'on')
}

function apagar() {
   encendido.value = false
   manipulateDevice(props.device.id, 'turnOff', [])
   emit('update:state', 'off')
}

function onTemperaturaChange() {
   manipulateDevice(props.device.id, 'setTemperature', [temperatura.value])
}

function seleccionarFuenteCalor(value: string) {
   heatSource.value = value
   manipulateDevice(props.device.id, 'setHeatSource', [value])
}

function seleccionarGrill(value: string) {
   grillMode.value = value
   manipulateDevice(props.device.id, 'setGrill', [value])
}

function seleccionarConveccion(value: string) {
   convectionMode.value = value
   manipulateDevice(props.device.id, 'setConvection', [value])
}
</script>

<style scoped>
.oven-preview {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   width: 100px;
   height: 100px;
   border-radius: 50%;
   margin: 0 auto 20px;
   transition: background 0.3s, border-color 0.3s;
   border: 3px solid var(--border);
   gap: 4px;
   color: var(--text);
}
.oven-preview.off {
   background: var(--surface2);
   color: var(--text-muted);
}
.oven-preview.on {
   background: #fff0e0;
   border-color: #ffaa60;
   color: #c97a1a;
}
.oven-preview.on.top {
   background: #fff3e6;
   border-color: #ff9f43;
   color: #d97706;
}
.oven-preview.on.bottom {
   background: #fff7ed;
   border-color: #fb923c;
   color: #c2410c;
}
.oven-preview.on.conventional {
   background: #ffedd5;
   border-color: #f59e0b;
   color: #b45309;
}

.preview-temp {
   font-size: 0.82rem;
   font-weight: 700;
   margin-top: 2px;
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
.dev-icon.on {
   background: #fff0e0;
   color: #c97a1a;
}
.dev-icon.off {
   background: var(--surface2);
   color: var(--text-muted);
}

.dev-name { font-size: 1.1rem; font-weight: 700; color: var(--text); }
.dev-status { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }

.ctrl-row,
.option-row {
   display: flex;
   gap: 10px;
   margin-bottom: 20px;
}

.option-row.wrap {
   flex-wrap: wrap;
}

.ctrl-btn,
.option-btn {
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

.option-btn.compact {
   min-width: 110px;
   flex: initial;
}

.ctrl-btn.active,
.option-btn.active {
   background: var(--accent);
   color: white;
   border-color: var(--accent);
}

.ctrl-btn:hover:not(.active),
.option-btn:hover:not(.active) {
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

.slider:disabled,
.option-btn:disabled {
   opacity: 0.4;
   cursor: not-allowed;
}

.slider-val {
   font-size: 0.9rem;
   font-weight: 600;
   color: var(--text);
   min-width: 56px;
   text-align: right;
}
</style>
