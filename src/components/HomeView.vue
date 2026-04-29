<template>
   <div class="home-view page-content">

      <!-- Header -->
      <div class="hd-header">
         <div class="hd-title-wrap">
            <button class="back-btn" @click="$router.push('/dashboard')">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
               </svg>
               Volver
            </button>
            <h2 class="hd-home-name">{{ homeName }}</h2>
         </div>
         <button class="hd-edit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
               <path d="m15 5 4 4"/>
            </svg>
            Editar habitaciones
         </button>
      </div>

      <!-- Rooms grid -->
      <div class="hd-rooms-grid">

         <!-- Agregar habitación -->
         <button class="add-card-btn">
            <div class="hd-room-add-icon">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/><path d="M12 5v14"/>
               </svg>
            </div>
            <span>Agregar habitación</span>
         </button>

         <!-- Room cards -->
         <div v-for="room in rooms" :key="room.id" class="hd-room-card">

            <div class="hd-room-header">
               <div class="hd-room-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     v-html="room.metadata?.icon || deviceIcons['lampara']">
                  </svg>
               </div>
               <span class="hd-room-name">{{ room.name }}</span>
               <span class="hd-room-count">{{ room.devices?.length ?? 0 }}</span>
            </div>

            <div class="hd-device-list">
               <p v-if="!room.devices?.length" class="hd-room-empty">Sin dispositivos</p>

               <div
                  v-for="device in room.devices"
                  :key="device.id"
                  class="hd-device-row"
                  :class="{ on: device.state?.status === 'on' }"
               >
                  <div class="hd-device-icon">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons[device.type] ?? deviceIcons['lampara']">
                     </svg>
                  </div>
                  <div class="hd-device-info">
                     <span class="hd-device-name">{{ device.name }}</span>
                     <span class="hd-device-state" :class="device.state?.status === 'on' ? 'state-on' : 'state-off'">
                        {{ device.state?.status === 'on' ? 'Encendido' : 'Apagado' }}
                     </span>
                  </div>
                  <button class="hd-delete-btn" @click.stop>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                        <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                     </svg>
                  </button>
               </div>
            </div>

            <button class="hd-add-device-btn">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/><path d="M12 5v14"/>
               </svg>
               Agregar dispositivo
            </button>

         </div>
      </div>

   </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getRooms, getRoomDevices } from '@/services/homeService'
import { deviceIcons } from '@/utils/deviceIcons'

const route = useRoute()
const homeId = route.params.id as string
const homeName = ref('')
const rooms = ref<any[]>([])

onMounted(async () => {
   const rawRooms = await getRooms(homeId)
   for (const room of rawRooms) {
      room.devices = await getRoomDevices(room.id)
   }
   rooms.value = rawRooms
})
</script>

<style scoped>
.home-view { padding: clamp(1rem, 4vw, 3rem); max-width: 1200px; margin: 0 auto; }

.hd-header {
   display: flex;
   align-items: center;
   justify-content: space-between;
   margin-bottom: 28px;
}

.hd-title-wrap {
   display: flex;
   flex-direction: column;
   gap: 8px;
}

.back-btn {
   display: flex;
   align-items: center;
   gap: 6px;
   background: none;
   border: none;
   color: var(--accent);
   font-size: 0.95rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   padding: 0;
}

.hd-home-name {
   font-size: 2rem;
   font-weight: 800;
   color: var(--text);
   letter-spacing: -0.02em;
   margin: 0;
}

.hd-edit-btn {
   display: flex;
   align-items: center;
   gap: 6px;
   padding: 8px 16px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface);
   color: var(--text);
   font-size: 0.9rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
}

.hd-rooms-grid {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
   gap: 16px;
}

.hd-room-add {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 12px;
   border: 2px dashed rgba(99, 102, 241, 0.3);
   border-radius: 16px;
   padding: 40px 20px;
   cursor: pointer;
   color: var(--accent);
   font-weight: 600;
   transition: background 0.15s;
}
.hd-room-add:hover { background: var(--accent-light); }

.hd-room-add-icon {
   width: 44px;
   height: 44px;
   border-radius: 50%;
   background: var(--accent-light);
   display: flex;
   align-items: center;
   justify-content: center;
}

.hd-room-card {
   background: var(--surface);
   border: 1.5px solid var(--border);
   border-radius: 16px;
   overflow: hidden;
   display: flex;
   padding: 14x;
   flex-direction: column;
}

.hd-room-header {
   display: flex;
   align-items: center;
   gap: 10px;
   padding: 16px;
   border-bottom: 1px solid var(--border);
}

.hd-room-icon {
   width: 32px;
   height: 32px;
   border-radius: 8px;
   background: var(--accent-light);
   color: var(--accent);
   display: flex;
   align-items: center;
   justify-content: center;
   flex-shrink: 0;
}

.hd-room-name {
   flex: 1;
   font-size: 1rem;
   font-weight: 700;
   color: var(--text);
}

.hd-room-count {
   font-size: 0.85rem;
   font-weight: 600;
   color: var(--text-muted);
   background: var(--surface2);
   padding: 2px 8px;
   border-radius: 20px;
}

.hd-device-list {
   flex: 1;
   padding: 12px;
   display: flex;
   flex-direction: column;
   gap: 8px;
   min-height: 80px;
}

.hd-room-empty {
   color: var(--text-muted);
   font-size: 0.9rem;
   text-align: center;
   margin: auto;
}

.hd-device-row {
   display: flex;
   align-items: center;
   gap: 10px;
   padding: 10px 12px;
   border-radius: 10px;
   background: var(--surface2);
   border: 1px solid var(--border);
   cursor: pointer;
   transition: border-color 0.15s;
}
.hd-device-row:hover { border-color: var(--accent); }

.hd-device-icon {
   width: 32px;
   height: 32px;
   border-radius: 8px;
   background: var(--surface);
   display: flex;
   align-items: center;
   justify-content: center;
   color: var(--text-muted);
   flex-shrink: 0;
}
.hd-device-row.on .hd-device-icon { background: #E5F5FE; color: #0CA5E9; }

.hd-device-info {
   flex: 1;
   display: flex;
   flex-direction: column;
   gap: 2px;
}

.hd-device-name { font-size: 0.95rem; font-weight: 600; color: var(--text); }
.hd-device-state { font-size: 0.8rem; color: var(--text-muted); }
.state-on { color: var(--success); }

.hd-delete-btn {
   background: none;
   border: none;
   color: var(--text-muted);
   cursor: pointer;
   padding: 4px;
   border-radius: 6px;
   display: flex;
   align-items: center;
   transition: color 0.15s, background 0.15s;
}
.hd-delete-btn:hover { color: var(--danger); background: var(--danger-light); }

.hd-add-device-btn {
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 6px;
   width: 100%;
   padding: 12px;
   border: none;
   border-top: 1px solid var(--border);
   background: none;
   color: var(--accent);
   font-size: 0.9rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   transition: background 0.15s;
}
.hd-add-device-btn:hover { background: var(--accent-light); }
</style>
