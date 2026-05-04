<template>
   <EditableDeviceModal :dirty="hayCambios" :saving="guardando" @cancel="cancelar" @confirm="aceptar">
      <template #header>
         <div class="dev-icon" :class="encendido ? 'on' : 'off'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['oven']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ encendido ? modoLabel : 'Apagado' }}</div>
         </div>
      </template>

      <div class="oven-preview" :class="encendido ? 'on' : 'off'">
         <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="deviceIcons['oven']"></svg>
         <span class="preview-temp">{{ temperatura }}°C</span>
      </div>

      <div class="ctrl-row">
         <button class="ctrl-btn" :class="{ active: !encendido }" @click="encendido = false">Apagar</button>
         <button class="ctrl-btn" :class="{ active: encendido }" @click="encendido = true">Encender</button>
      </div>

      <div class="section-label">Temperatura</div>
      <div class="slider-row">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
         <input type="range" min="90" max="250" v-model.number="temperatura" class="slider" :disabled="!encendido" />
         <span class="slider-val">{{ temperatura }}°C</span>
      </div>

      <div class="section-label">Modo</div>
      <div class="option-row">
         <button v-for="m in modos" :key="m.value" class="option-btn" :class="{ active: modo === m.value }" :disabled="!encendido" @click="modo = m.value">
            <span>{{ m.label }}</span>
         </button>
      </div>
   </EditableDeviceModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EditableDeviceModal from '@/components/Modales/EditableDeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { manipulateDevice } from '@/services/deviceService'

const props = defineProps<{ device: any }>()
const emit = defineEmits(['close', 'update:state'])

const encendido = ref(props.device.state?.status === 'on')
const temperatura = ref<number>(props.device.state?.temperature ?? 180)
const modo = ref<string>(props.device.state?.mode ?? 'bake')
const guardando = ref(false)
const inicial = ref({ encendido: encendido.value, temperatura: temperatura.value, modo: modo.value })

const modos = [
   { value: 'bake', label: 'Hornear' },
   { value: 'broil', label: 'Grill' },
   { value: 'convection', label: 'Convección' },
]

const modoLabel = computed(() => modos.find(m => m.value === modo.value)?.label ?? modo.value)
const hayCambios = computed(() =>
   encendido.value !== inicial.value.encendido ||
   temperatura.value !== inicial.value.temperatura ||
   modo.value !== inicial.value.modo
)

function cancelar() {
   emit('close')
}

async function aceptar() {
   guardando.value = true
   try {
      if (encendido.value !== inicial.value.encendido) {
         await manipulateDevice(props.device.id, encendido.value ? 'turnOn' : 'turnOff', [])
      }
      if (encendido.value && temperatura.value !== inicial.value.temperatura) {
         await manipulateDevice(props.device.id, 'setTemperature', [temperatura.value])
      }
      if (encendido.value && modo.value !== inicial.value.modo) {
         await manipulateDevice(props.device.id, 'setMode', [modo.value])
      }
      if (!props.device.state) props.device.state = {}
      props.device.state.status = encendido.value ? 'on' : 'off'
      props.device.state.temperature = temperatura.value
      props.device.state.mode = modo.value
      inicial.value = { encendido: encendido.value, temperatura: temperatura.value, modo: modo.value }
      emit('update:state', encendido.value ? 'on' : 'off')
      emit('close')
   } finally {
      guardando.value = false
   }
}
</script>

<style scoped>
.oven-preview { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 20px; transition: background 0.3s, border-color 0.3s; border: 3px solid var(--border); gap: 4px; }
.oven-preview.on { background: #fff0e0; border-color: #ffaa60; color: #c97a1a; }
.oven-preview.off { background: var(--surface2); color: var(--text-muted); }
.preview-temp { font-size: 0.82rem; font-weight: 700; margin-top: 2px; }
.dev-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dev-icon.on { background: #fff0e0; color: #c97a1a; }
.dev-icon.off { background: var(--surface2); color: var(--text-muted); }
.dev-name { font-size: 1.1rem; font-weight: 700; color: var(--text); }
.dev-status { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }
.ctrl-row, .option-row { display: flex; gap: 10px; margin-bottom: 20px; }
.ctrl-btn, .option-btn { flex: 1; padding: 10px; border-radius: 10px; border: 1.5px solid var(--border); background: var(--surface2); color: var(--text-muted); font-size: 0.95rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.15s; }
.ctrl-btn.active, .option-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
.ctrl-btn:hover:not(.active), .option-btn:hover:not(.active) { border-color: var(--accent); color: var(--accent); }
.section-label { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 10px; }
.slider-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: var(--text-muted); }
.slider { flex: 1; accent-color: var(--accent); cursor: pointer; }
.slider:disabled { opacity: 0.4; cursor: not-allowed; }
.slider-val { font-size: 0.9rem; font-weight: 600; color: var(--text); min-width: 46px; text-align: right; }
</style>
