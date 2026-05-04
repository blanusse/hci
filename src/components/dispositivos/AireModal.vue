<template>
   <DeviceModal @close="$emit('close')">
      <template #header>
         <div class="dev-icon" :class="encendido ? 'on' : 'off'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['ac']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ encendido ? modoLabel : 'Apagado' }}</div>
         </div>
      </template>

      <!-- Preview -->
      <div class="ac-preview" :class="[encendido ? 'on' : 'off', encendido ? modo : '']">
         <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="deviceIcons['ac']"></svg>
         <span v-if="encendido" class="preview-temp">{{ temperatura }}°C</span>
      </div>

      <!-- On / Off -->
      <div class="ctrl-row">
         <button class="ctrl-btn" :class="{ active: !encendido }" @click="apagar">Apagar</button>
         <button class="ctrl-btn" :class="{ active: encendido }" @click="encender">Encender</button>
      </div>

      <!-- Temperatura -->
      <div class="section-label">Temperatura</div>
      <div class="slider-row">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
         </svg>
         <input
            type="range"
            min="18"
            max="38"
            v-model.number="temperatura"
            class="slider"
            :disabled="!encendido"
            @change="onTemperaturaChange"
         />
         <span class="slider-val">{{ temperatura }}°C</span>
      </div>

      <!-- Modo -->
      <div class="section-label">Modo</div>
      <div class="option-row">
         <button
            v-for="m in modos"
            :key="m.value"
            class="option-btn"
            :class="{ active: modo === m.value }"
            :disabled="!encendido"
            @click="seleccionarModo(m.value)"
         >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" v-html="m.icon"></svg>
            <span>{{ m.label }}</span>
         </button>
      </div>

      <!-- Velocidad Ventilador -->
      <div class="section-label">Velocidad ventilador</div>
      <div class="option-row wrap">
         <button
            v-for="v in velocidades"
            :key="v.value"
            class="option-btn compact"
            :class="{ active: velocidadVentilador === v.value }"
            :disabled="!encendido"
            @click="seleccionarVelocidad(v.value)"
         >{{ v.label }}</button>
      </div>

      <!-- Aspas Verticales -->
      <div class="section-label">Aspas verticales</div>
      <div class="option-row wrap">
         <button
            v-for="a in aspasVerticales"
            :key="a.value"
            class="option-btn compact"
            :class="{ active: aspaVertical === a.value }"
            :disabled="!encendido"
            @click="seleccionarAspaVertical(a.value)"
         >{{ a.label }}</button>
      </div>

      <!-- Aspas Horizontales -->
      <div class="section-label">Aspas horizontales</div>
      <div class="option-row wrap">
         <button
            v-for="a in aspasHorizontales"
            :key="a.value"
            class="option-btn compact"
            :class="{ active: aspaHorizontal === a.value }"
            :disabled="!encendido"
            @click="seleccionarAspaHorizontal(a.value)"
         >{{ a.label }}</button>
      </div>
   </DeviceModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DeviceModal from '@/components/Modales/DeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { manipulateDevice, getDeviceState } from '@/services/deviceService'

const props = defineProps<{ device: any }>()
const emit = defineEmits(['close', 'update:state'])

const encendido      = ref(props.device.state?.status === 'on')
const temperatura    = ref<number>(props.device.state?.temperature ?? 22)
const modo           = ref<string>(props.device.state?.mode ?? 'frío')
const velocidadVentilador = ref<string | number>(props.device.state?.fanSpeed ?? 'auto')
const aspaVertical   = ref<string | number>(props.device.state?.verticalSwing ?? 'auto')
const aspaHorizontal = ref<string | number>(props.device.state?.horizontalSwing ?? 'auto')

onMounted(async () => {
   try {
      const s = await getDeviceState(props.device.id)
      if (s) {
         encendido.value           = s.status === 'on'
         temperatura.value         = s.temperature       ?? temperatura.value
         modo.value                = s.mode              ?? modo.value
         velocidadVentilador.value = s.fanSpeed          ?? velocidadVentilador.value
         aspaVertical.value        = s.verticalSwing     ?? aspaVertical.value
         aspaHorizontal.value      = s.horizontalSwing   ?? aspaHorizontal.value
      }
   } catch {}
})

const modos = [
   {
      value: 'ventilación',
      label: 'Ventilación',
      icon: `<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2 2 0 1 1 19 12H2"/>`,
   },
   {
      value: 'frío',
      label: 'Frío',
      icon: `<line x1="12" y1="2" x2="12" y2="22"/><path d="m20 10-8-8-8 8"/><path d="m4 14 4-4 4 4 4-4 4 4"/><line x1="2" y1="12" x2="22" y2="12"/>`,
   },
   {
      value: 'calor',
      label: 'Calor',
      icon: `<path d="M8 2v4"/><path d="M16 2v4"/><circle cx="12" cy="12" r="4"/><path d="M12 8V6"/><path d="M12 18v-2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
   },
]

const velocidades = [
   { value: 'auto', label: 'Auto' },
   { value: '25',     label: '25%'  },
   { value: '50',     label: '50%'  },
   { value: '75',     label: '75%'  },
   { value: '100',    label: '100%' },
]

const aspasVerticales = [
   { value: 'auto', label: 'Auto' },
   { value: '22',     label: '22°'  },
   { value: '45',     label: '45°'  },
   { value: '67',     label: '67°'  },
   { value: '90',     label: '90°'  },
]

const aspasHorizontales = [
   { value: 'auto', label: 'Auto' },
   { value: '-90',    label: '-90°' },
   { value: '-45',    label: '-45°' },
   { value: '0',      label: '0°'   },
   { value: '45',     label: '45°'  },
   { value: '90',     label: '90°'  },
]

const modoLabel = computed(() => {
   const found = modos.find(m => m.value === modo.value)
   return found ? found.label : modo.value
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

function seleccionarModo(value: string) {
   modo.value = value
   manipulateDevice(props.device.id, 'setMode', [value])
}

function seleccionarVelocidad(value: string | number) {
   velocidadVentilador.value = value
   manipulateDevice(props.device.id, 'setFanSpeed', [value])
}

function seleccionarAspaVertical(value: string | number) {
   aspaVertical.value = value
   manipulateDevice(props.device.id, 'setVerticalSwing', [value])
}

function seleccionarAspaHorizontal(value: string | number) {
   aspaHorizontal.value = value
   manipulateDevice(props.device.id, 'setHorizontalSwing', [value])
}
</script>

<style scoped>
.ac-preview {
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
   color: var(--text);
   gap: 4px;
}
.ac-preview.off {
   background: var(--surface2);
   color: var(--text-muted);
}
.ac-preview.on {
   background: var(--bg);
   color: var(--color-icon);
}
.ac-preview.on.frío {
   background: #e0f0ff;
   border-color: #60b8ff;
   color: #1a7cc9;
}
.ac-preview.on.calor {
   background: #fff0e0;
   border-color: #ffaa60;
   color: #c97a1a;
}
.ac-preview.on.ventilación {
   background: #e8f5e9;
   border-color: #66bb6a;
   color: #2e7d32;
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
.dev-icon.on  { background: var(--color-sky-light); color: var(--color-sky); }
.dev-icon.off { background: var(--surface2); color: var(--text-muted); }

.dev-name   { font-size: 1.1rem; font-weight: 700; color: var(--text); }
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
   min-width: 40px;
   text-align: right;
}

.option-row {
   display: flex;
   gap: 8px;
   margin-bottom: 20px;
}
.option-row.wrap {
   flex-wrap: wrap;
}

.option-btn {
   flex: 1;
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 5px;
   padding: 10px 8px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text-muted);
   font-size: 0.82rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   transition: all 0.15s;
}
.option-btn.compact {
   flex-direction: row;
   padding: 8px 12px;
   flex: unset;
}
.option-btn:hover:not(:disabled):not(.active) {
   border-color: var(--accent);
   color: var(--accent);
}
.option-btn.active {
   background: var(--accent);
   color: white;
   border-color: var(--accent);
}
.option-btn:disabled {
   opacity: 0.4;
   cursor: not-allowed;
}
</style>
