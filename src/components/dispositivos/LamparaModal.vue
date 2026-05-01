<template>
   <DeviceModal @close="$emit('close')">
      <template #header>
         <div class="dev-icon" :class="encendido ? 'on' : 'off'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['lamp']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ encendido ? 'Encendido' : 'Apagado' }}</div>
         </div>
      </template>

      <!-- Preview -->
      <div class="lamp-preview" :style="previewStyle" :class="encendido ? 'on' : 'off'">
         <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="deviceIcons['lamp']"></svg>
      </div>

      <!-- On / Off -->
      <div class="ctrl-row">
         <button class="ctrl-btn" :class="{ active: !encendido }" @click="apagar">Apagar</button>
         <button class="ctrl-btn" :class="{ active: encendido }" @click="encender">Encender</button>
      </div>

      <!-- Intensity slider -->
      <div class="section-label">Intensidad</div>
      <div class="slider-row">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['lamp']"></svg>
         <input
            type="range"
            min="0"
            max="100"
            v-model="intensidad"
            class="slider"
            :disabled="!encendido"
            @change="onIntensidadChange"
         />
         <span class="slider-val">{{ intensidad }}%</span>
      </div>

      <!-- Color swatches -->
      <div class="section-label">Color</div>
      <div class="swatches">
         <button
            v-for="s in swatches"
            :key="s.label"
            class="swatch"
            :class="{ selected: colorSeleccionado === s.label }"
            :style="{ background: s.color }"
            @click="seleccionarColor(s)"
            :title="s.label"
         >
            <span class="swatch-label">{{ s.label }}</span>
         </button>

         <!-- Custom color picker -->
         <label class="swatch swatch-custom" :class="{ selected: colorSeleccionado === 'Personalizar' }" :style="colorSeleccionado === 'Personalizar' ? { background: colorPersonalizado } : {}" title="Personalizar">
            <input type="color" v-model="colorPersonalizado" @change="onColorPersonalizado" style="display:none" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
               <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2v20M2 12h20" opacity=".3"/>
            </svg>
            <span class="swatch-label">Custom</span>
         </label>
      </div>
   </DeviceModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DeviceModal from '../DeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { manipulateDevice } from '@/services/deviceService';

const props = defineProps<{
   device: any
}>()
const emit = defineEmits(['close', 'update:state'])

const encendido = ref(props.device.state?.status === 'on')
const intensidad = ref(props.device.state?.brightness ?? 80)
const colorSeleccionado = ref(props.device.state?.color ?? 'Blanca')
const colorPersonalizado = ref('var(--surface)fff')

const previewStyle = computed(() => {
   if (!encendido.value) return { background: 'var(--surface2)', color: 'var(--text)' }
   const baseColor = colorSeleccionado.value === 'Personalizar'
      ? colorPersonalizado.value
      : swatches.find(s => s.label === colorSeleccionado.value)?.color ?? 'var(--surface)8DC'
   const alpha = Math.round((intensidad.value / 100) * 255).toString(16).padStart(2, '0')
   return { background: baseColor + alpha, color: 'var(--text)' }
})

const swatches = [
   { label: 'Blanca',   color: 'var(--surface)', hex: 'var(--surface)' },
   { label: 'Natural',  color: '#FFF9E6', hex: '#FFF9E6' },
   { label: 'Cálida',   color: '#FFD580', hex: '#FFD580' },
   { label: 'Naranja',  color: '#FFA040', hex: '#FFA040' },
   { label: 'Fría',     color: '#CCE8FF', hex: '#CCE8FF' },
   { label: 'Violeta',  color: '#C8B4F0', hex: '#C8B4F0' },
]

function encender() {
   encendido.value = true
   manipulateDevice(props.device.id, 'turnOn', [])
   emit('update:state', 'on')
}

function apagar() {
   encendido.value = false
   emit('update:state', 'off')
   manipulateDevice(props.device.id, 'turnOff')

}

function onIntensidadChange() {
   return manipulateDevice(props.device.id, 'setBrightness', [parseInt(intensidad.value)])

}

function seleccionarColor(s: { label: string; hex: string }) {
   colorSeleccionado.value = s.label
   return manipulateDevice(props.device.id, 'setColor', [colorSeleccionado.value])

}

function onColorPersonalizado() {
   colorSeleccionado.value = 'Personalizar'
   return manipulateDevice(props.device.id, 'setColor', [colorPersonalizado.value])
}
</script>

<style scoped>
.lamp-preview {
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100px;
   height: 100px;
   border-radius: 50%;
   margin: 0 auto 20px;
   transition: background 0.3s;
   border: 3px solid var(--border);
   color: var(--text);

}
.lamp-preview.on{
   background: var(--bg);
   color: var(--color-icon);
}
.lamp-preview.off {
   background: var(--surface2);
   color: var(--text);
   border-color: var(--border);
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
.dev-icon.on{
   background: var(--color-sky-light);
   color: var(--color-sky);
}
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
   min-width: 36px;
   text-align: right;
}

.swatches {
   display: flex;
   flex-wrap: wrap;
   gap: 8px;
}
.swatch {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 4px;
   padding: 8px 10px;
   border-radius: 10px;
   border: 2px solid var(--border);
   cursor: pointer;
   transition: border-color 0.15s, transform 0.1s;
   background: var(--surface);
   min-width: 60px;
}
.swatch:hover   { border-color: var(--accent); transform: scale(1.04); }
.swatch.selected { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-light); }

.swatch-label {
   font-size: 0.72rem;
   font-weight: 600;
   color: var(--text-muted);
}

.swatch-custom {
   background: var(--surface2);
   color: var(--text-muted);
   border-style: dashed;
}
.swatch-custom.selected { color: white; }
.swatch-custom.selected .swatch-label { color: white; }
</style>
