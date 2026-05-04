<template>
   <DeviceModal @close="$emit('close')">
      <template #header>
         <div class="dev-icon" :class="abierta ? 'open' : bloqueada ? 'locked' : 'closed'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['door']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ statusLabel }}</div>
         </div>
      </template>


      <!-- Preview -->
      <div class="door-preview" :class="abierta ? 'open' : bloqueada ? 'locked' : 'closed'">
         <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="deviceIcons['door']"></svg>
      </div>

      <!-- Apertura -->
      <div class="section-label">Apertura</div>
      <div class="ctrl-row">
         <button class="ctrl-btn" :class="{ active: abierta }" @click="abrir">Abrir</button>
         <button class="ctrl-btn" :class="{ active: !abierta }" @click="cerrar">Cerrar</button>
      </div>

      <!-- Seguro -->
      <div class="section-label">Seguro</div>
      <div class="ctrl-row">
         <button class="ctrl-btn" :class="{ active: !bloqueada }" :disabled="abierta" @click="desbloquear">Desbloqueada</button>
         <button class="ctrl-btn" :class="{ active: bloqueada }" :disabled="abierta" @click="bloquear">Bloqueada</button>
      </div>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
   </DeviceModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DeviceModal from '@/components/Modales/DeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { manipulateDevice } from '@/services/deviceService'

const props = defineProps<{ device: any }>()
const emit = defineEmits(['close', 'update:state'])

const abierta = ref<boolean>(props.device.state?.status === 'opened')
const bloqueada = ref<boolean>(props.device.state?.lock === 'locked')
const errorMsg = ref('')


const statusLabel = computed(() => {
   if (abierta.value) return 'Abierta'
   if (bloqueada.value) return 'Cerrada — Bloqueada'
   return 'Cerrada'
})

async function abrir() {
    console.log('[PuertaModal] state:', JSON.stringify(props.device.state))  
   errorMsg.value = ''
   if (abierta.value) { errorMsg.value = 'La puerta ya está abierta'; return }
   if (bloqueada.value) { errorMsg.value = 'No se puede abrir la puerta porque está bloqueada'; return }
   try {
      const ok = await manipulateDevice(props.device.id, 'open', [])
      if (ok === false) { errorMsg.value = 'No se pudo abrir la puerta'; return }
      abierta.value = true
      bloqueada.value = false
      emit('update:state', 'opened')
   } catch (e: any) {
      errorMsg.value = e.response?.data?.description ?? 'No se pudo abrir la puerta'
   }
}

async function cerrar() {
   errorMsg.value = ''
   if (!abierta.value) { errorMsg.value = 'La puerta ya está cerrada'; return }
   try {
      const ok = await manipulateDevice(props.device.id, 'close', [])
      if (ok === false) { errorMsg.value = 'No se pudo cerrar la puerta'; return }
      abierta.value = false
      emit('update:state', 'closed')
   } catch (e: any) {
      errorMsg.value = e.response?.data?.description ?? 'No se pudo cerrar la puerta'
   }
}

async function bloquear() {
   errorMsg.value = ''
   if (bloqueada.value) { errorMsg.value = 'La puerta ya está bloqueada'; return }
   try {
      const ok = await manipulateDevice(props.device.id, 'lock', [])
      if (ok === false) { errorMsg.value = 'No se pudo bloquear la puerta'; return }
      bloqueada.value = true
      emit('update:state', 'locked')
   } catch (e: any) {
      errorMsg.value = e.response?.data?.description ?? 'No se pudo bloquear la puerta'
   }
}

async function desbloquear() {
   errorMsg.value = ''
   if (!bloqueada.value) { errorMsg.value = 'La puerta ya está desbloqueada'; return }
   try {
      const ok = await manipulateDevice(props.device.id, 'unlock', [])
      if (ok === false) { errorMsg.value = 'No se pudo desbloquear la puerta'; return }
      bloqueada.value = false
      emit('update:state', 'unlocked')
   } catch (e: any) {
      errorMsg.value = e.response?.data?.description ?? 'No se pudo desbloquear la puerta'
   }
}
</script>

<style scoped>
.door-preview {
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100px;
   height: 100px;
   border-radius: 50%;
   margin: 0 auto 20px;
   transition: background 0.3s, color 0.3s, border-color 0.3s;
   border: 3px solid var(--border);
}

.door-preview.open   { background: #e8f5e9; color: #2e7d32; border-color: #2e7d32; }
.door-preview.locked { background: #fff0f0; color: #e53935; border-color: #e53935; }
.door-preview.closed { background: var(--surface2); color: var(--text-muted); }

.dev-icon {
   width: 40px;
   height: 40px;
   border-radius: 10px;
   display: flex;
   align-items: center;
   justify-content: center;
   flex-shrink: 0;
}

.dev-icon.open   { background: #e8f5e9; color: #2e7d32; }
.dev-icon.locked { background: #fff0f0; color: #e53935; }
.dev-icon.closed { background: var(--surface2); color: var(--text-muted); }

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

.ctrl-row {
   display: flex;
   gap: 8px;
   margin-bottom: 20px;
}

.ctrl-btn {
   flex: 1;
   padding: 10px 6px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text-muted);
   font-size: 0.88rem;
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

.ctrl-btn:hover:not(.active):not(:disabled) {
   border-color: var(--accent);
   color: var(--accent);
}

.ctrl-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.hint-msg {
   font-size: 0.85rem;
   color: var(--text-muted);
   margin: -10px 0 14px;
}

.error-msg {
   font-size: 0.85rem;
   color: #e53935;
   margin: -10px 0 14px;
}
</style>
