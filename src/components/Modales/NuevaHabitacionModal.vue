<template>
   <DeviceModal @close="$emit('close')">

      <template #header>
         <span class="modal-title">Agregar habitación</span>
      </template>

      <!-- Presets -->
      <div class="field">
         <label class="field-label">Habitaciones comunes</label>
         <div class="presets">
            <button
               v-for="p in roomPresets" :key="p.name"
               class="preset-btn" :class="{ selected: seleccionado?.name === p.name }"
               @click="seleccionado = p; roomDraft = ''; roomIconDraft = ''"
            >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="p.icon"></svg>
               {{ p.name }}
            </button>
         </div>
      </div>

      <!-- Personalizada -->
      <div class="field">
         <label class="field-label">Habitación personalizada</label>
         <div class="custom-row">
            <input
               class="field-input" v-model="roomDraft"
               placeholder="Ej. Cine, Terraza…"
               @input="seleccionado = null"
               style="flex:1"
            />
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

      <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>

      <div class="modal-footer">
         <button class="btn-secondary" @click="$emit('close')">Cancelar</button>
         <button class="btn-primary" @click="agregar">Agregar</button>
      </div>

   </DeviceModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DeviceModal from '@/components/Modales/DeviceModal.vue'
import { createRoomInHome } from '@/services/homeService'

const props = defineProps<{ homeId: string }>()
const emit = defineEmits(['close', 'created'])

const errorMsg = ref('')
const seleccionado = ref<{ name: string, icon: string } | null>(null)
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

async function agregar() {
   const nombre = seleccionado.value?.name ?? roomDraft.value.trim()
   const icon = seleccionado.value?.icon ?? roomIconDraft.value

   if (nombre.length < 3) {
      errorMsg.value = 'El nombre debe tener al menos 3 caracteres.'
      return
   }
   errorMsg.value = ''
   try {
      await createRoomInHome({ id: props.homeId }, nombre, icon)
      emit('created')
      emit('close')
   } catch (e: any) {
      errorMsg.value = e.response?.data?.error?.description ?? 'Error al crear la habitación.'
   }
}
</script>

<style scoped>
.modal-title { font-size: 1.1rem; font-weight: 700; color: var(--text); }

.field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.field-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }

.field-input {
   padding: 10px 14px; border-radius: 10px;
   border: 1.5px solid var(--border); background: var(--surface2);
   font-size: 1rem; font-family: inherit; color: var(--text); outline: none; width: 100%;
   box-sizing: border-box;
}
.field-input:focus { border-color: var(--accent); }

.presets { display: flex; flex-wrap: wrap; gap: 8px; }
.preset-btn {
   display: flex; align-items: center; gap: 6px;
   padding: 8px 14px; border-radius: 100px;
   border: 1.5px solid var(--border); background: var(--surface2);
   font-size: 0.9rem; font-weight: 600; font-family: inherit;
   cursor: pointer; color: var(--text); transition: all 0.15s;
}
.preset-btn:hover { border-color: var(--accent); color: var(--accent); }
.preset-btn.selected { border-color: var(--accent); background: var(--accent-light); color: var(--accent); }

.custom-row { display: flex; gap: 8px; }

.icon-picker { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.icon-opt {
   width: 40px; height: 40px; border-radius: 10px;
   border: 1.5px solid var(--border); background: var(--surface2);
   display: flex; align-items: center; justify-content: center;
   cursor: pointer; color: var(--text); transition: all 0.15s;
}
.icon-opt:hover { border-color: var(--accent); }
.icon-opt.selected { border-color: var(--accent); background: var(--accent-light); color: var(--accent); }

.modal-footer {
   display: flex; justify-content: flex-end; gap: 10px;
   margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border);
}
.btn-primary {
   padding: 10px 24px; border-radius: 10px;
   border: none; background: var(--accent); color: white;
   font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer;
}
.btn-secondary {
   padding: 10px 24px; border-radius: 10px;
   border: 1.5px solid var(--border); background: var(--surface2);
   font-size: 1rem; font-weight: 600; font-family: inherit; cursor: pointer; color: var(--text);
}
</style>
