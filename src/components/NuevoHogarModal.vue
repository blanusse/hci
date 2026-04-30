<template>
   <DeviceModal @close="$emit('close')">

      <!-- Header -->
      <template #header>
         <span class="modal-title">{{ paso === 2 ? 'Nuevo hogar: agregar habitaciones' : 'Nuevo hogar' }}</span>
      </template>

      <!-- Steps indicator -->
      <div class="steps">
         <div class="step" :class="{ active: paso === 1, done: paso > 1 }">
            <span class="step-num">1</span>
            <span class="step-label">Nombre e ícono</span>
         </div>
         <div class="step-line"></div>
         <div class="step" :class="{ active: paso === 2 }">
            <span class="step-num">2</span>
            <span class="step-label">Habitaciones</span>
         </div>
      </div>

      <!-- PASO 1 -->
      <template v-if="paso === 1">
         <div class="field">
            <label class="field-label">Nombre del hogar</label>
            <input class="field-input" v-model="nombre" placeholder="Ej. Casa de Juan" @keyup.enter="siguiente" />
         </div>

         <div class="field">
            <label class="field-label">Ícono</label>
            <div class="icon-picker">
               <button
                  v-for="ic in homeIconOptions" :key="ic"
                  class="icon-opt" :class="{ selected: iconSeleccionado === ic }"
                  @click="iconSeleccionado = ic"
               >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="ic"></svg>
               </button>
            </div>
         </div>
      </template>

      <!-- PASO 2 -->
      <template v-if="paso === 2">

         <!-- Habitaciones agregadas -->
         <div class="field">
            <label class="field-label">
               Habitaciones agregadas
               <span class="muted">({{ habitaciones.length }})</span>
            </label>
            <div v-if="habitaciones.length === 0" class="rooms-empty">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
               Todavía no agregaste ninguna habitación
            </div>
            <div v-else class="rooms-list">
               <div v-for="(room, idx) in habitaciones" :key="idx" class="room-chip">
                  <span>{{ room.name }}</span>
                  <button class="room-chip-del" @click="habitaciones.splice(idx, 1)">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
               </div>
            </div>
         </div>

         <!-- Habitaciones comunes -->
         <div class="field">
            <label class="field-label">Habitaciones comunes</label>
            <div class="presets">
               <button
                  v-for="p in roomPresets" :key="p.name"
                  class="preset-btn" :class="{ selected: habitaciones.some(r => r.name === p.name) }"
                  @click="togglePreset(p)"
               >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="p.icon"></svg>
                  {{ p.name }}
               </button>
            </div>
         </div>

         <!-- Habitación personalizada -->
         <div class="field">
            <label class="field-label">Agregar habitación personalizada</label>
            <div class="custom-row">
               <input class="field-input" v-model="roomDraft" placeholder="Ej. Cine, Terraza…" @keyup.enter="agregarCustom" style="flex:1" />
               <button class="add-btn" @click="agregarCustom" :disabled="!roomDraft.trim()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
               </button>
            </div>
            <div class="icon-picker">
               <button
                  v-for="(ic, idx) in roomIconOptions" :key="idx"
                  class="icon-opt" :class="{ selected: roomIconDraft === ic }"
                  @click="roomIconDraft = ic"
               >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="ic"></svg>
               </button>
            </div>
         </div>

      </template>
      <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>

      <!-- Footer -->
      <div class="modal-footer">
         <template v-if="paso === 1">
            <button class="btn-secondary" @click="$emit('close')">Cancelar</button>
            <button class="btn-primary" @click="siguiente">
               Siguiente
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
         </template>
         <template v-if="paso === 2">
            <button class="btn-secondary" @click="paso = 1">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
               Atrás
            </button>
            <button class="btn-primary" @click="crearHogar">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
               Crear hogar
            </button>
         </template>
      </div>

   </DeviceModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DeviceModal from './DeviceModal.vue'
import { createHome, createRoomInHome } from '@/services/homeService'
import { apiPost } from '@/utils/api'

const emit = defineEmits(['close', 'created'])

const errorMsg = ref('')
const paso = ref(1)
const nombre = ref('')
const iconSeleccionado = ref('')
const habitaciones = ref<{ name: string, icon: string}[]>([])
const roomDraft = ref('')
const roomIconDraft = ref('')

const roomIconOptions = [
   `<rect width="12" height="8" x="2" y="13" rx="2"/><path d="M19 13V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"/><path d="M2 17v3"/><path d="M22 17v3"/>`,
   `<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>`,
   `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>`,
   `<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>`,
   `<path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 .68-1.5L5.5 5h13l1.82 2.5A2 2 0 0 1 21 9v6a2 2 0 0 1-2 2z"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>`,
   `<path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><path d="M10 21v-4"/><path d="M14 21v-4"/><path d="M9 21h6"/>`,
   `<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
   `<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3"/><path d="m20 20-5-5"/>`,
   `<path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/>`,
   `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`,
   `<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>`,
   `<rect width="20" height="15" x="2" y="7" rx="2"/><polyline points="17 2 12 7 7 2"/>`,
   `<rect width="20" height="12" x="2" y="6" rx="2"/><path d="M6 12h4m-2-2v4"/><circle cx="16" cy="12" r="1"/><circle cx="18" cy="10" r="1"/>`,
   `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
   `<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14"/>`,
   `<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>`,
   `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>`,
   `<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/>`,
]

const homeIconOptions = [
   `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
   `<path d="M6 22V12H2l10-10 10 10h-4v10H6z"/>`,
   `<rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>`,
   `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
   `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
]

const roomPresets = [
   { name: 'Cocina',        icon: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>` },
   { name: 'Baño',          icon: `<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/>` },
   { name: 'Dormitorio',    icon: `<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>` },
   { name: 'Living',        icon: `<rect width="12" height="8" x="2" y="13" rx="2"/><path d="M19 13V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"/><path d="M2 17v3"/><path d="M22 17v3"/>` },
   { name: 'Jardín',        icon: `<path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><path d="M10 21v-4"/><path d="M14 21v-4"/><path d="M9 21h6"/>` },
   { name: 'Garaje',        icon: `<path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 .68-1.5L5.5 5h13l1.82 2.5A2 2 0 0 1 21 9v6a2 2 0 0 1-2 2z"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>` },
   { name: 'Comedor',       icon: `<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3"/><path d="m20 20-5-5"/>` },
   { name: 'Oficina',       icon: `<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>` },
   { name: 'Sala de estar', icon: `<rect width="20" height="15" x="2" y="7" rx="2"/><polyline points="17 2 12 7 7 2"/>` },
   { name: 'Habitación',    icon: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>` },
]

function siguiente() {
   if(nombre.value.trim().length < 3){
      errorMsg.value = 'El nombre debe tener al menos 3 caracteres.'
      return
   }
   errorMsg.value = ''
   paso.value = 2
}

function togglePreset(p: { name: string, icon: string }) {
   const idx = habitaciones.value.findIndex(r => r.name === p.name)
   if (idx >= 0) habitaciones.value.splice(idx, 1)
   else habitaciones.value.push({ name: p.name, icon: p.icon })
}

function agregarCustom() {
   if (!roomDraft.value.trim()) return
   if (roomDraft.value.trim().length < 3){
      errorMsg.value = 'El nombre del cuarto debe tener al menos 3 caracteres'
      return
   }
   errorMsg.value = ''
   habitaciones.value.push({ name: roomDraft.value.trim(), icon: roomIconDraft.value })
   roomDraft.value = ''
   roomIconDraft.value = ''
}

async function crearHogar() {
   try{
   const home = await createHome(nombre.value.trim(), iconSeleccionado.value)
   for(const habitacion of habitaciones.value){
      await createRoomInHome(home, habitacion.name, habitacion.icon)
   }
   emit('created')
   emit('close')
}
   catch(e:any){
      errorMsg.value=e.response?.data?.description ?? 'Error al crear el hogar'
   }
}
</script>

<style scoped>
.modal-title { font-size: 1.1rem; font-weight: 700; color: var(--text); }

.steps {
   display: flex;
   align-items: center;
   gap: 8px;
   margin-bottom: 24px;
   padding-bottom: 16px;
   border-bottom: 1px solid var(--border);
}
.step { display: flex; align-items: center; gap: 6px; }
.step-num {
   width: 24px; height: 24px; border-radius: 50%;
   display: flex; align-items: center; justify-content: center;
   font-size: 0.8rem; font-weight: 700;
   background: var(--surface2); color: var(--text-muted);
}
.step.active .step-num { background: var(--accent); color: white; }
.step.done .step-num { background: var(--success); color: white; }
.step-label { font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
.step.active .step-label { color: var(--accent); }
.step-line { flex: 1; height: 1px; background: var(--border); }

.field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.field-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }
.field-input {
   padding: 10px 14px; border-radius: 10px;
   border: 1.5px solid var(--border); background: var(--surface2);
   font-size: 1rem; font-family: inherit; color: var(--text); outline: none;
}
.field-input:focus { border-color: var(--accent); }
.muted { color: var(--text-muted); font-weight: 400; }

.icon-picker { display: flex; flex-wrap: wrap; gap: 8px; }
.icon-opt {
   width: 44px; height: 44px; border-radius: 10px;
   border: 1.5px solid var(--border); background: var(--surface2);
   display: flex; align-items: center; justify-content: center;
   cursor: pointer; color: var(--text); transition: all 0.15s;
}
.icon-opt:hover { border-color: var(--accent); }
.icon-opt.selected { border-color: var(--accent); background: var(--accent-light); color: var(--accent); }

.rooms-empty { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.95rem; padding: 8px 0; }
.rooms-list { display: flex; flex-wrap: wrap; gap: 8px; }
.room-chip {
   display: flex; align-items: center; gap: 6px;
   padding: 6px 10px; border-radius: 20px;
   background: var(--accent-light); color: var(--accent);
   font-size: 0.9rem; font-weight: 600;
}
.room-chip-del {
   background: none; border: none; cursor: pointer; color: var(--accent);
   display: flex; align-items: center; justify-content: center;
   width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
   transition: background 0.15s;
}
.room-chip-del:hover { background: rgba(0,0,0,0.15); }

.presets { display: flex; flex-wrap: wrap; gap: 8px; }
.preset-btn {
   padding: 8px 14px; border-radius: 20px;
   border: 1.5px solid var(--border); background: var(--surface2);
   font-size: 0.9rem; font-weight: 600; font-family: inherit;
   cursor: pointer; color: var(--text); transition: all 0.15s;
}
.preset-btn:hover { border-color: var(--accent); color: var(--accent); }
.preset-btn.selected { background: var(--accent-light); border-color: var(--accent); color: var(--accent); }

.custom-row { display: flex; gap: 8px; }
.add-btn {
   width: 40px; height: 40px; border-radius: 10px;
   border: none; background: var(--accent); color: white;
   display: flex; align-items: center; justify-content: center;
   cursor: pointer; flex-shrink: 0;
}
.add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.modal-footer {
   display: flex; justify-content: flex-end; gap: 10px;
   margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border);
}
.btn-primary {
   display: flex; align-items: center; gap: 6px;
   padding: 10px 20px; border-radius: 10px;
   border: none; background: var(--accent); color: white;
   font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer;
}
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-secondary {
   display: flex; align-items: center; gap: 6px;
   padding: 10px 20px; border-radius: 10px;
   border: 1.5px solid var(--border); background: var(--surface2);
   font-size: 1rem; font-weight: 600; font-family: inherit; cursor: pointer; color: var(--text);
}
</style>
