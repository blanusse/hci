<template>
   <DeviceModal @close="$emit('close')">

      <template #header>
         <span class="modal-title">Agregar dispositivo</span>
      </template>

      <!-- Tipo de dispositivo -->
      <div class="field">
         <label class="field-label">Tipo de dispositivo</label>
         <div class="device-type-grid">
            <button
               v-for="t in deviceTypes" :key="t.key"
               class="device-type-btn" :class="{ selected: tipoSeleccionado === t.key }"
               @click="tipoSeleccionado = t.key"
            >
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="t.icon"></svg>
               <span>{{ t.label }}</span>
            </button>
         </div>
      </div>

      <!-- Información -->
      <div class="field">
         <label class="field-label">Información</label>
         <div class="info-grid">
            <div class="info-col">
               <label class="sub-label">Nombre</label>
               <input class="field-input" v-model="nombre" placeholder="Ej. Luz del living" />
            </div>
            <!-- <div class="info-col">
               <label class="sub-label">Marca</label>
               <input class="field-input" v-model="marca" placeholder="Ej. Philips, Samsung..." />
            </div>
            <div class="info-col">
               <label class="sub-label">Consumo (W)</label>
               <input class="field-input" v-model="consumo" placeholder="Ej. 60" type="number" />
            </div>
            <div class="info-col">
               <label class="sub-label">Modelo</label>
               <input class="field-input" v-model="modelo" placeholder="Opcional" />
            </div> -->
         </div>
      </div>

      <!-- Asignar a -->
      <div class="field">
         <label class="field-label">Asignar a</label>
         <div class="assign-grid">
            <div class="info-col">
               <label class="sub-label">Hogar</label>
               <select class="field-input" v-model="hogarSeleccionado" @change="onHogarChange">
                  <option v-for="h in hogares" :key="h.id" :value="h.id">{{ h.name }}</option>
               </select>
            </div>
            <div class="info-col">
               <label class="sub-label">Habitación</label>
               <select class="field-input" v-model="cuartoSeleccionado">
                  <option v-for="r in cuartos" :key="r.id" :value="r.id">{{ r.name }}</option>
               </select>
            </div>
         </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
         <button class="btn-secondary" @click="$emit('close')">Cancelar</button>
         <button class="btn-primary" @click="agregar" :disabled="!nombre.trim() || !tipoSeleccionado || !cuartoSeleccionado">
            Agregar
         </button>
      </div>

   </DeviceModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DeviceModal from './DeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { getHomes, getRooms } from '@/services/homeService'
import { getDeviceTypeId, newDeviceInRoom } from '@/services/deviceService'

const props = defineProps<{
   defaultHomeId: string
   defaultRoomId: string
}>()

const emit = defineEmits(['close', 'created'])

const nombre = ref('')
const marca = ref('')
const consumo = ref('')
const modelo = ref('')
const tipoSeleccionado = ref('')
const hogarSeleccionado = ref(props.defaultHomeId)
const cuartoSeleccionado = ref(props.defaultRoomId)
const hogares = ref<any[]>([])
const cuartos = ref<any[]>([])

const deviceTypes = [
   { key: 'lamp',         label: 'Lámpara',       icon: deviceIcons['lamp'] },
   { key: 'ac',           label: 'Aire acond.',    icon: deviceIcons['ac'] },
   { key: 'speaker',      label: 'Parlante',       icon: deviceIcons['speaker'] },
   { key: 'faucet',       label: 'Grifo/Aspersor', icon: deviceIcons['faucet'] },
   { key: 'blind',        label: 'Persiana',       icon: deviceIcons['blind'] },
   { key: 'door',         label: 'Puerta',         icon: deviceIcons['door'] },
   { key: 'alarm',        label: 'Alarma',         icon: deviceIcons['alarm'] },
   { key: 'oven',         label: 'Horno',          icon: deviceIcons['oven'] },
   { key: 'refrigerator', label: 'Heladera',       icon: deviceIcons['refrigerator'] },
   { key: 'vacuum',       label: 'Aspiradora',     icon: deviceIcons['vacuum'] },
]

async function onHogarChange() {
   cuartos.value = await getRooms(hogarSeleccionado.value)
   cuartoSeleccionado.value = cuartos.value[0]?.id ?? ''
}

async function agregar() {
   const typeId = await getDeviceTypeId(tipoSeleccionado.value)
   console.log('typeId:', typeId, 'tipo:', tipoSeleccionado.value)
   await newDeviceInRoom(
      nombre.value.trim(),
      { id: typeId },
      { id: cuartoSeleccionado.value }
   )
   emit('created')
   emit('close')
}

onMounted(async () => {
   hogares.value = await getHomes()
   cuartos.value = await getRooms(props.defaultHomeId)
})
</script>

<style scoped>
.modal-title { font-size: 1.2rem; font-weight: 700; color: var(--text); }

.field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.field-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }
.sub-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; display: block; }

.field-input {
   padding: 10px 14px; border-radius: 10px;
   border: 1.5px solid var(--border); background: var(--surface2);
   font-size: 1rem; font-family: inherit; color: var(--text); outline: none; width: 100%;
   box-sizing: border-box;
}
.field-input:focus { border-color: var(--accent); }

.device-type-grid {
   display: grid;
   grid-template-columns: repeat(5, 1fr);
   gap: 8px;
}

.device-type-btn {
   display: flex; flex-direction: column; align-items: center; justify-content: center;
   gap: 6px; padding: 12px 6px; border-radius: 12px;
   border: 1.5px solid var(--border); background: var(--surface2);
   font-size: 0.8rem; font-weight: 600; font-family: inherit;
   cursor: pointer; color: var(--text); transition: all 0.15s;
}
.device-type-btn:hover { border-color: var(--accent); color: var(--accent); }
.device-type-btn.selected { border-color: var(--accent); background: var(--accent-light); color: var(--accent); }

.info-grid, .assign-grid {
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 12px;
}

.info-col { display: flex; flex-direction: column; }

.modal-footer {
   display: flex; justify-content: flex-end; gap: 10px;
   margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border);
}
.btn-primary {
   padding: 10px 24px; border-radius: 10px;
   border: none; background: var(--accent); color: white;
   font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer;
}
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-secondary {
   padding: 10px 24px; border-radius: 10px;
   border: 1.5px solid var(--border); background: var(--surface2);
   font-size: 1rem; font-weight: 600; font-family: inherit; cursor: pointer; color: var(--text);
}
</style>
