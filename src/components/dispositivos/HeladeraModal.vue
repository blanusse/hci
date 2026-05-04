<template>
   <DeviceModal @close="$emit('close')">
      <template #header>
         <div class="dev-icon on">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['refrigerator']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ modoLabel }}</div>
         </div>
      </template>

      <!-- Preview -->
      <div class="hel-preview" :class="modo">
         <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="deviceIcons['refrigerator']"></svg>
         <span class="preview-temp">{{ temperatura }}°C</span>
      </div>

      <!-- Temperatura Heladera -->
      <div class="section-label">Temperatura heladera</div>
      <div class="slider-row">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
         </svg>
         <input
            type="range"
            min="2"
            max="8"
            v-model.number="temperatura"
            class="slider"
            @change="onTemperaturaChange"
         />
         <span class="slider-val">{{ temperatura }}°C</span>
      </div>

      <!-- Temperatura Freezer -->
      <div class="section-label">Temperatura freezer</div>
      <div class="slider-row">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07"/>
         </svg>
         <input
            type="range"
            min="-20"
            max="-8"
            v-model.number="temperaturaFreezer"
            class="slider"
            @change="onTemperaturaFreezerChange"
         />
         <span class="slider-val">{{ temperaturaFreezer }}°C</span>
      </div>

      <!-- Modo -->
      <div class="section-label">Modo</div>
      <div class="option-row">
         <button
            v-for="m in modos"
            :key="m.value"
            class="option-btn"
            :class="{ active: modo === m.value }"
            @click="seleccionarModo(m.value)"
         >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" v-html="m.icon"></svg>
            <span>{{ m.label }}</span>
         </button>
      </div>
   </DeviceModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DeviceModal from '@/components/Modales/DeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { manipulateDevice } from '@/services/deviceService'

const props = defineProps<{ device: any }>()
const emit = defineEmits(['close', 'update:state'])

const temperatura       = ref<number>(props.device.state?.temperature ?? 5)
const temperaturaFreezer = ref<number>(props.device.state?.freezerTemperature ?? -12)
const modo              = ref<string>(props.device.state?.mode ?? 'normal')

const modos = [
   {
      value: 'normal',
      label: 'Normal',
      icon: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
   },
   {
      value: 'fiesta',
      label: 'Fiesta',
      icon: `<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2z"/>`,
   },
   {
      value: 'vacaciones',
      label: 'Vacaciones',
      icon: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
   },
]

const modoLabel = computed(() => {
   const found = modos.find(m => m.value === modo.value)
   return found ? found.label : modo.value
})

function onTemperaturaChange() {
   manipulateDevice(props.device.id, 'setTemperature', [temperatura.value])
   emit('update:state', { temperature: temperatura.value })
}

function onTemperaturaFreezerChange() {
   manipulateDevice(props.device.id, 'setFreezerTemperature', [temperaturaFreezer.value])
   emit('update:state', { freezerTemperature: temperaturaFreezer.value })
}

function seleccionarModo(value: string) {
   modo.value = value
   manipulateDevice(props.device.id, 'setMode', [value])
   emit('update:state', { mode: value })
}
</script>

<style scoped>
.hel-preview {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   width: 100px;
   height: 100px;
   border-radius: 50%;
   margin: 0 auto 20px;
   transition: background-color 0.3s, border-color 0.3s;
   border: 3px solid var(--border);
   color: var(--text);
   gap: 4px;
   background: var(--bg);
   color: var(--color-icon);
}
.hel-preview.normal {
   background: #e0f0ff;
   border-color: #60b8ff;
   color: #1a7cc9;
}
.hel-preview.fiesta {
   background: #fdf0ff;
   border-color: #c084fc;
   color: #7e22ce;
}
.hel-preview.vacaciones {
   background: #fff8e0;
   border-color: #fbbf24;
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
.dev-icon.on { background: var(--color-sky-light); color: var(--color-sky); }

.dev-name   { font-size: 1.1rem; font-weight: 700; color: var(--text); }
.dev-status { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }

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
.slider-val {
   font-size: 0.9rem;
   font-weight: 600;
   color: var(--text);
   min-width: 46px;
   text-align: right;
}

.option-row {
   display: flex;
   gap: 8px;
   margin-bottom: 20px;
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
.option-btn:hover:not(.active) {
   border-color: var(--accent);
   color: var(--accent);
}
.option-btn.active {
   background: var(--accent);
   color: white;
   border-color: var(--accent);
}
</style>
