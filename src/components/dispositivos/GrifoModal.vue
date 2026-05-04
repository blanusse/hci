<template>
   <DeviceModal @close="$emit('close')">
      <template #header>
         <div class="dev-icon" :class="abierto ? 'on' : 'off'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['faucet']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ abierto ? 'Abierto' : 'Cerrado' }}</div>
         </div>
      </template>

      <!-- Preview -->
      <div class="faucet-preview" :class="abierto ? 'on' : 'off'">
         <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="deviceIcons['faucet']"></svg>
         <div class="preview-drops" v-if="abierto">
            <span class="drop" v-for="i in 3" :key="i" :style="{ animationDelay: (i * 0.25) + 's' }">●</span>
         </div>
      </div>

      <!-- Abrir / Cerrar -->
      <div class="ctrl-row">
         <button class="ctrl-btn" :class="{ active: !abierto }" @click="cerrar">Cerrar</button>
         <button class="ctrl-btn" :class="{ active: abierto }"  @click="abrir">Abrir</button>
      </div>

      <!-- Dispensar -->
      <div class="section-label">Dispensar</div>
      <div class="dispense-row">
         <input
            type="number"
            class="qty-input"
            v-model.number="cantidad"
            min="1"
            max="9999"
            placeholder="Cantidad"
         />
         <div class="unit-chips">
            <button
               v-for="u in unidades"
               :key="u"
               class="unit-chip"
               :class="{ active: unidad === u }"
               @click="unidad = u"
            >{{ u }}</button>
         </div>
         <button class="dispense-btn" @click="dispensar" :disabled="!cantidad || cantidad <= 0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
            </svg>
            Dispensar
         </button>
      </div>

   </DeviceModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DeviceModal from '@/components/Modales/DeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { manipulateDevice } from '@/services/deviceService'

const props = defineProps<{ device: any }>()
const emit = defineEmits(['close', 'update:state'])

const abierto = ref(props.device.state?.status === 'opened')
const cantidad = ref<number>(500)
const unidad   = ref('ml')

const unidades = ['ml', 'cl', 'dl', 'l']

async function abrir() {
   await manipulateDevice(props.device.id, 'open', [])
   abierto.value = true
   emit('update:state', 'opened')
}

async function cerrar() {
   await manipulateDevice(props.device.id, 'close', [])
   abierto.value = false
   emit('update:state', 'closed')
}

async function dispensar() {
   await manipulateDevice(props.device.id, 'dispense', [cantidad.value, unidad.value])
}
</script>

<style scoped>
.dev-icon {
   width: 40px; height: 40px;
   border-radius: 10px;
   display: flex; align-items: center; justify-content: center;
   flex-shrink: 0;
}
.dev-icon.on  { background: var(--color-sky-light); color: var(--color-sky); }
.dev-icon.off { background: var(--surface2); color: var(--text-muted); }

.dev-name   { font-size: 1.1rem; font-weight: 700; color: var(--text); }
.dev-status { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }

/* Preview */
.faucet-preview {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   width: 110px;
   height: 110px;
   border-radius: 50%;
   margin: 0 auto 20px;
   border: 3px solid var(--border);
   transition: background 0.3s, border-color 0.3s;
   gap: 4px;
   color: var(--text-muted);
}
.faucet-preview.on {
   background: var(--color-sky-light);
   border-color: var(--color-sky);
   color: var(--color-sky);
}
.faucet-preview.off {
   background: var(--surface2);
}

.preview-drops {
   display: flex;
   gap: 4px;
   font-size: 0.55rem;
   color: var(--color-sky);
}
.drop {
   animation: drip 1s ease-in infinite;
   opacity: 0;
}
@keyframes drip {
   0%   { opacity: 0; transform: translateY(-4px); }
   40%  { opacity: 1; }
   100% { opacity: 0; transform: translateY(6px); }
}

/* Abrir / Cerrar */
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

/* Dispensar */
.section-label {
   font-size: 0.82rem;
   font-weight: 700;
   text-transform: uppercase;
   letter-spacing: 0.06em;
   color: var(--text-muted);
   margin-bottom: 10px;
}

.dispense-row {
   display: flex;
   align-items: center;
   gap: 10px;
   flex-wrap: wrap;
}

.qty-input {
   width: 90px;
   padding: 9px 12px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text);
   font-size: 0.95rem;
   font-weight: 600;
   font-family: inherit;
   outline: none;
   transition: border-color 0.15s;
}
.qty-input:focus { border-color: var(--accent); }

.unit-chips {
   display: flex;
   gap: 6px;
   flex: 1;
}
.unit-chip {
   flex: 1;
   padding: 9px 6px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text-muted);
   font-size: 0.85rem;
   font-weight: 700;
   font-family: inherit;
   cursor: pointer;
   transition: all 0.15s;
}
.unit-chip:hover  { border-color: var(--accent); color: var(--accent); }
.unit-chip.active { background: var(--accent); border-color: var(--accent); color: white; }

.dispense-btn {
   display: flex;
   align-items: center;
   gap: 6px;
   padding: 9px 16px;
   border-radius: 10px;
   border: none;
   background: var(--color-sky);
   color: white;
   font-size: 0.9rem;
   font-weight: 700;
   font-family: inherit;
   cursor: pointer;
   transition: opacity 0.15s;
   white-space: nowrap;
}
.dispense-btn:hover    { opacity: 0.85; }
.dispense-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
