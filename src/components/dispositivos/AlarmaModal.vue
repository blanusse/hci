<template>
   <DeviceModal @close="$emit('close')">
      <template #header>
         <div class="dev-icon" :class="armado ? 'on' : 'off'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['alarm']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ statusLabel }}</div>
         </div>
      </template>

      <!-- Preview -->
      <div class="alarm-preview" :class="armado ? 'on' : 'off'">
         <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="deviceIcons['alarm']"></svg>
      </div>

      <!-- Código para operar -->
      <div class="section-label">Código de seguridad</div>
      <div class="code-row">
         <input
            type="password"
            inputmode="numeric"
            maxlength="4"
            v-model="codigoActual"
            class="code-input"
            placeholder="••••"
         />
      </div>

      <!-- Modo -->
      <div class="section-label">Modo</div>
      <div class="ctrl-row">
         <button class="ctrl-btn" :class="{ active: status === 'disarmed' }" @click="desarmar">Desarmada</button>
         <button class="ctrl-btn" :class="{ active: status === 'armedStay' }" @click="armarCasa">Modo Casa</button>
         <button class="ctrl-btn" :class="{ active: status === 'armedAway' }" @click="armarRegular">Modo Regular</button>
      </div>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

      <!-- Cambiar código -->
      <div class="section-label">Cambiar código</div>
      <div class="change-code-row">
         <input
            type="password"
            inputmode="numeric"
            maxlength="4"
            v-model="codigoNuevo"
            class="code-input"
            placeholder="Nuevo ••••"
         />
         <button class="code-btn" @click="cambiarCodigo" :disabled="codigoActual.length < 4 || codigoNuevo.length < 4">
            Cambiar
         </button>
      </div>
      <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
   </DeviceModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DeviceModal from '@/components/Modales/DeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { manipulateDevice } from '@/services/deviceService'

const props = defineProps<{
   device: any
}>()
const emit = defineEmits(['close', 'update:state'])

const status = ref<string>(props.device.state?.status ?? 'disarmed')
const codigoActual = ref('')
const codigoNuevo = ref('')
const errorMsg = ref('')
const successMsg = ref('')

const armado = computed(() => status.value !== 'disarmed')

const statusLabel = computed(() => {
   const labels: Record<string, string> = {
      disarmed: 'Desarmada',
      armedStay: 'Armada — Modo Casa',
      armedAway: 'Armada — Modo Regular',
   }
   return labels[status.value] ?? status.value
})

function limpiarMensajes() {
   errorMsg.value = ''
   successMsg.value = ''
}

async function armarCasa() {
   if (codigoActual.value.length < 4) { errorMsg.value = 'Ingresá el código de seguridad'; return }
   limpiarMensajes()
   try {
      await manipulateDevice(props.device.id, 'armStay', [codigoActual.value])
      status.value = 'armedStay'
      emit('update:state', 'armedStay')
   } catch (e: any) {
      errorMsg.value = e.response?.data?.description ?? 'Código incorrecto'
   }
}

async function armarRegular() {
   if (codigoActual.value.length < 4) { errorMsg.value = 'Ingresá el código de seguridad'; return }
   limpiarMensajes()
   try {
      await manipulateDevice(props.device.id, 'armAway', [codigoActual.value])
      status.value = 'armedAway'
      emit('update:state', 'armedAway')
   } catch (e: any) {
      errorMsg.value = e.response?.data?.description ?? 'Código incorrecto'
   }
}

async function desarmar() {
   if (codigoActual.value.length < 4) { errorMsg.value = 'Ingresá el código de seguridad'; return }
   limpiarMensajes()
   try {
      await manipulateDevice(props.device.id, 'disarm', [codigoActual.value])
      status.value = 'disarmed'
      emit('update:state', 'disarmed')
   } catch (e: any) {
      errorMsg.value = e.response?.data?.description ?? 'Código incorrecto'
   }
}

async function cambiarCodigo() {
   limpiarMensajes()
   try {
      await manipulateDevice(props.device.id, 'changeSecurityCode', [codigoActual.value, codigoNuevo.value])
      codigoActual.value = ''
      codigoNuevo.value = ''
      successMsg.value = 'Código actualizado correctamente'
   } catch (e: any) {
      errorMsg.value = e.response?.data?.description ?? 'No se pudo cambiar el código'
   }
}
</script>

<style scoped>
.alarm-preview {
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

.alarm-preview.on {
   background: #fff0f0;
   color: #e53935;
   border-color: #e53935;
}

.alarm-preview.off {
   background: var(--surface2);
   color: var(--text-muted);
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

.dev-icon.on  { background: #fff0f0; color: #e53935; }
.dev-icon.off { background: var(--surface2); color: var(--text-muted); }

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

.code-row {
   margin-bottom: 20px;
}

.change-code-row {
   display: flex;
   gap: 10px;
   align-items: center;
   margin-bottom: 10px;
}

.code-input {
   width: 90px;
   padding: 10px 14px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   font-size: 1rem;
   font-family: inherit;
   color: var(--text);
   outline: none;
   text-align: center;
   letter-spacing: 0.2em;
   box-sizing: border-box;
}

.code-input:focus { border-color: var(--accent); }

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

.ctrl-btn:hover:not(.active) {
   border-color: var(--accent);
   color: var(--accent);
}

.code-btn {
   flex: 1;
   padding: 10px 16px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text-muted);
   font-size: 0.9rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   transition: all 0.15s;
}

.code-btn:not(:disabled):hover {
   border-color: var(--accent);
   color: var(--accent);
}

.code-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.error-msg {
   font-size: 0.85rem;
   color: #e53935;
   margin: -10px 0 14px;
}

.success-msg {
   font-size: 0.85rem;
   color: var(--success);
   margin: 6px 0 0;
}
</style>
