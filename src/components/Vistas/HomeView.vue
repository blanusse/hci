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
         <button class="hd-edit-btn" @click="modoEdicion= !modoEdicion" :class="{'hd-edit-btn-active' : modoEdicion}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
               <path d="m15 5 4 4"/>
            </svg>
            {{modoEdicion ? 'Listo' : 'Editar Habitaciones'}}
         </button>
      </div>

      <!-- Rooms grid -->
      <div class="hd-rooms-grid">

         <!-- Agregar habitación -->
         <button class="add-card-btn" @click="mostrarNuevoHabitacion = true">
            <div class="hd-room-add-icon">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/><path d="M12 5v14"/>
               </svg>
            </div>
            <span>Agregar habitación</span>
         </button>

         <!-- Room cards -->
         <div v-for="room in rooms" :key="room.id" class="hd-room-card" :class="{ wiggle: modoEdicion }" @dragover.prevent @drop="onDrop(room)">

            <div class="hd-room-header">
               <div class="hd-room-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     v-html="room.metadata?.icon || deviceIcons['lamp']">
                  </svg>
               </div>
               <span class="hd-room-name">{{ room.name }}</span>
               <span class="hd-room-count">{{ room.devices?.length }}</span>
               <button v-if="modoEdicion" class="delete-btn" @click="borrarCuarto(room)" >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                        <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                     </svg>
                  </button>
            </div>

            <div class="hd-device-list">
               <p v-if="!room.devices?.length" class="hd-room-empty">Sin dispositivos</p>

               <div
                  v-for="device in room.devices" draggable="true"
                  :key="device.id"
                  class="hd-device-row" @click="abrirDispositivo(device)" @dragstart="onDragStart(device)"
                  :class="{ on: device.state?.status === 'on' }"
               >
               <div class="drag-handle">                                           
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                     <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                     <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                     <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                  </svg>
               </div>
                  <div class="hd-device-icon">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons[device.type?.name] ?? deviceIcons['lamp']">
                     </svg>
                  </div>
                  <div class="hd-device-info">
                     <span class="hd-device-name">{{ device.name }}</span>
                  </div>
                  <button
                     class="device-toggle" :class="{ on: device.state?.status === 'on' }"
                     @click.stop="toggleDevice(device)"
                  >
                     <span class="toggle-knob"></span>
                  </button>
                  <button v-if="modoEdicion" class="delete-btn" @click.stop="borrarDispositivo(device)" >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                        <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                     </svg>
                  </button>
               </div>
            </div>

            <button class="hd-add-device-btn" @click="roomParaDispositivo=room.id; mostrarNuevoDispositivo = true">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/><path d="M12 5v14"/>
               </svg>
               Agregar dispositivo
            </button>

         </div>
      </div>

   </div>
   <NuevoDispositivoModal
     v-if="mostrarNuevoDispositivo"
     :defaultHomeId="homeId"
     :defaultRoomId="roomParaDispositivo"
     @close="mostrarNuevoDispositivo = false"
     @created="cargarRooms()"
  />

  <NuevoHabitacionModal
     v-if="mostrarNuevoHabitacion"
     :homeId="homeId"
     @close="mostrarNuevoHabitacion = false"
     @created="cargarRooms()"
  />

  <ConfirmarEliminarModal
     v-if="dispositivoAEliminar"
     :nombre="dispositivoAEliminar.name"
     titulo="Eliminar Dispositivo"
     descripcion="El dispositivo se elimina permanentemente"
     @confirm="confirmarBorrarDispositivo()"
     @cancel="dispositivoAEliminar = null"
  />

  <ConfirmarEliminarModal
     v-if="cuartoAEliminar"
     :nombre="cuartoAEliminar.name"
     titulo="Eliminar Ambiente"
     descripcion="El ambiente y los dispositivos en el se eliminaran permanentemente"
     @confirm="confirmarBorrarCuarto()"
     @cancel="cuartoAEliminar = null"
  />

  <DeviceModalRouter       
     v-if="dispositivoAbierto"       
     :device="dispositivoAbierto"                             
     @close="dispositivoAbierto = null; cargarRooms()"
     @update:state="dispositivoAbierto.state.status = $event"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getRooms, getRoomDevices, getHome } from '@/services/homeService'
import { deviceIcons } from '@/utils/deviceIcons'
import { getDeviceTypeName, deleteDevice, moverDevice, manipulateDevice, deleteRoom } from '@/services/deviceService'
import { useSocketStore } from '@/stores/socket'

import NuevoDispositivoModal from '@/components/Modales/NuevoDispositivoModal.vue'
import NuevoHabitacionModal from '@/components/Modales/NuevaHabitacionModal.vue'
import DeviceModalRouter from '@/components/Modales/DeviceModalRouter.vue'
import ConfirmarEliminarModal from '@/components/Modales/ConfirmarEliminarModal.vue'

const route = useRoute()
const socketStore = useSocketStore()
const homeId = route.params.id as string
const homeName = ref('')
const rooms = ref<any[]>([])

const mostrarNuevoDispositivo = ref(false)
const mostrarNuevoHabitacion = ref(false)
const roomParaDispositivo = ref('')

const dispositivoAbierto = ref<any>(null)


const dispositivoAEliminar = ref<any>(null)
const cuartoAEliminar = ref<any>(null)
const modoEdicion = ref(false)

const deviceArrastrado = ref<any>(null)


onMounted(async () => {
   const socket = socketStore.socket
   if(!socket) return
   socket.on('deviceUpdated', () => cargarRooms())
   socket.on('deviceCreated', () => cargarRooms())
   socket.on('deviceDeleted', () => cargarRooms())
   const home = await(getHome(homeId))
   homeName.value = home.name
   await cargarRooms()
})

onUnmounted(() => {
    const socket = socketStore.socket
    socket?.off('deviceUpdated')
    socket?.off('deviceCreated')
    socket?.off('deviceDeleted')
  })


function onDragStart(device: any){
   deviceArrastrado.value = device
}



async function onDrop(roomDestino: any){
   if(!deviceArrastrado.value) return
   await moverDevice(deviceArrastrado.value.id, roomDestino.id)
   deviceArrastrado.value = null
   await cargarRooms()
}

async function toggleDevice(device: any) {
   const action = device.state?.status === 'on' ? 'turnOff' : 'turnOn'
   await manipulateDevice(device.id, action)
   device.state.status = action === 'turnOn' ? 'on' : 'off'
}

function abrirDispositivo(device: any) {                                                                                                                                
     console.log('device:', device)
     dispositivoAbierto.value = device
  }




async function cargarRooms() {
   const rawRooms = await getRooms(homeId)
   for (const room of rawRooms) {
      room.devices = await getRoomDevices(room.id)
      for (const device of room.devices) {
         device.type.name = await getDeviceTypeName(device.type.id)
      }  
   }
   rooms.value = rawRooms
}

async function borrarDispositivo(device: any){
   dispositivoAEliminar.value = device
}

async function confirmarBorrarDispositivo(){
   await deleteDevice(dispositivoAEliminar.value.id)
   dispositivoAEliminar.value = null
   await cargarRooms()
}

async function borrarCuarto(room: any){
   cuartoAEliminar.value = room
}

async function confirmarBorrarCuarto() {
   await deleteRoom(cuartoAEliminar.value.id)
   cuartoAEliminar.value = null
   await cargarRooms()
}

</script>

<style scoped>
.home-view {
   /* padding: clamp(1rem, 4vw, 3rem); */
   max-width: 1200px;
   margin: 0 auto;
}

.hd-header {
   display: flex;
   align-items: flex-end;
   justify-content: space-between;
   margin: 28px 0;
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
   font-size: 1.2rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   padding: 0;
}

.hd-home-name {
   font-size: 2.5rem;
   font-weight: 1000;
   color: var(--text);
   letter-spacing: -0.02em;
   margin: 0;
}

.hd-edit-btn {
    height: 34px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1.5px solid rgba(246, 0, 0, 0.474);
    background: var(--danger-light);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--danger);
    font-size: 1rem;
    font-weight: 700;
    transition: background .15s, color .15s, border-color .15s, box-shadow .15s;
    flex-shrink: 0;
    white-space: nowrap;
}
.hd-edit-btn:hover {
    background: var(--danger-light);
    border: 2px solid rgb(246, 0, 0);
}

.hd-edit-btn-active {
   background-color: var(--success-light);
   color: var(--success);
   height: 34px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1.5px solid var(--success);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1rem;
    font-weight: 700;
    transition: background .15s, color .15s, border-color .15s, box-shadow .15s;
    flex-shrink: 0;
    white-space: nowrap;
}

.hd-edit-btn-active:hover {
   background-color: var(--success-light);
    border: 2.2px solid var(--success);
}






.hd-rooms-grid {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
   gap: 16px;
}

.hd-room-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
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
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    border: 1.5px solid var(--border);
    background: var(--surface);
    padding: 14px;
    min-height: var(--room-card-min-height, 240px);
    height: 100%;
    position: relative;
    transition: box-shadow .15s, border-color .15s;
}

@keyframes wiggle {
    0%, 100% { transform: rotate(-1.5deg); }
    50%       { transform: rotate(1.5deg); }
}

.hd-room-card.wiggle {
    animation: wiggle 0.33s ease-in-out infinite;
}

.hd-room-list-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding-bottom: 10px;
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
   font-size: 1.2rem;
   font-weight: 700;
   color: var(--text);
}

.hd-room-count {
   font-size: 1rem;
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
   font-size: 1.1rem;
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
.hd-device-row:hover {
   border-color: var(--accent);
}

.drag-handle{
     color: var(--text);
     opacity: 0.4;
     cursor: grab;
     display: flex;
     align-items: center;
}

.hd-device-row:hover .drag-handle {
   opacity: 1;
}

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
.hd-device-row.on .hd-device-icon {
   background: var(--color-sky-light);
   color: var(--color-sky);
}

.device-toggle {
   width: 42px; height: 24px; border-radius: 12px;
   border: none; background: var(--border); cursor: pointer;
   position: relative; transition: background 0.2s; flex-shrink: 0;
}
.device-toggle.on { background: var(--accent); }
.toggle-knob {
   position: absolute; top: 3px; left: 3px;
   width: 18px; height: 18px; border-radius: 50%;
   background: white; transition: transform 0.2s;
   box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.device-toggle.on .toggle-knob { transform: translateX(18px); }

.hd-device-info {
   flex: 1;
   display: flex;
   flex-direction: column;
   gap: 2px;
}

.hd-device-name {
   font-size: 1.1rem;
   font-weight: 700;
   color: var(--text);
}

.hd-device-state {
   font-size: 0.8rem;
   color: var(--text-muted);
}

.state-on {
   color: var(--success); 
}

.hd-delete-btn {
   background: none;
   border: none;
   color: var(--text-muted);
   cursor: pointer;
   padding: 8px;
   border-radius: 6px;
   display: flex;
   align-items: center;
   transition: color 0.15s, background 0.15s;
}
/* .hd-delete-btn:hover { color: var(--danger); background: var(--danger-light); } */

.hd-add-device-btn {
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 6px;
   width: 100%;
   border-radius: 10px;
   border: 1.5px dashed rgba(63, 81, 181, .4);
   background: none;
   color: var(--accent);
   font-size: 1rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   transition: background 0.15s;
}
.hd-add-device-btn:hover { 
   background: var(--accent-light); 
   border: 1.5px dashed rgba(63, 81, 181, .9);

}
</style>
