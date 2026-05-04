<template>
   <div class="dashboard page-content">
      <div class="banner">
         <div class="banner-left">
            <div class="banner-greeting">{{saludo}}, {{ usuario }}</div>
            <div class="banner-date">{{ fecha }}</div>
         </div>
         <div class="banner-right">
            <div class="banner-time">{{ hora }}</div>
            <div class="banner-weather">{{ temperatura }} - {{ clima }}</div>
         </div>
      </div>

      <!-- Hogares -->
      <div class="header-title">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="house" aria-hidden="true" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
         Mis Hogares
      </div>

      <div class="hogares-cuadro">
         <div v-for="hogar in hogares" :key="hogar.id" class="hogar-card" @click="router.push('/homes/' + hogar.id)"> 
            <div class="hogar-head">
               <div class="hogar-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="hogar.metadata?.icon || defaultHouseIcon">
                  </svg>
               </div>
               <button v-if="hogar.metadata?.ownerEmail === currentUserEmail" class="delete-btn" @click.stop="hogarAEliminar = hogar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
               </button>
               <div class="hogar-main">
                  <div class="hogar-name">{{ hogar.name }}</div>
                  <div class="hogar-sub">{{ hogar.rooms }} habitaciones · {{ hogar.devices }} dispositivos encendidos</div>
               </div>
               <svg class="hogar-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
            </div>
         </div>
         <button class="add-card-btn" @click="mostrarNuevoHogar=true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="plus-circle" aria-hidden="true" class="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg> 
            Agregar hogar 
         </button>
      </div>

      <!-- Actividad reciente -->
      <div class="header-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Dispositivos recientes
      </div>
      <div class="actividad-lista">
        <div v-for="item in actividad" :key="item.id" class="recent-item" @click="abrirModal(item)">
          <div :class="['recent-icon', item.encendido ? 'on' : 'off']">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons[item.tipo]"></svg>
          </div>
          <div class="recent-info">
            <div class="recent-device">{{ item.nombre }}</div>
            <div class="recent-location">{{ item.hogar }} · {{ item.habitacion }}</div>
          </div>
          <span :class="['recent-badge', item.encendido ? 'on' : 'off']">{{ item.estado }}</span>
          <span class="recent-time">{{ item.tiempo }}</span>
        </div>
      </div>
   </div>


   <DeviceModalRouter       
     v-if="dispositivoAbierto"       
     :device="dispositivoAbierto"                             
     @close="dispositivoAbierto = null; cargarActividad()"
     @update:state="dispositivoAbierto.state.status = $event"
  />

   <NuevoHogarModal 
   v-if="mostrarNuevoHogar"
   @close="mostrarNuevoHogar=false"
   @created="cargarHogares()"/>

   <ConfirmarEliminarModal
   v-if="hogarAEliminar"
   :nombre="hogarAEliminar.name"
   titulo="Eliminar Hogar"
   descripcion="Se eliminarán todos sus cuartos y dispositivos. Esta acción no se puede deshacer."
   @confirm="borrarHogar(hogarAEliminar.id); hogarAEliminar = null"
   @cancel="hogarAEliminar=null"
   />

</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { deviceIcons } from '@/utils/deviceIcons'
import { getHomes, getRoomDevices, getRooms, deleteHome } from '@/services/homeService'
import { getDeviceLogs, getDevice, getDeviceTypeName } from '@/services/deviceService'
import { getUserInfo } from '@/services/userService'

import NuevoHogarModal from '@/components/Modales/NuevoHogarModal.vue'
import ConfirmarEliminarModal from '@/components/Modales/ConfirmarEliminarModal.vue'
import DeviceModalRouter from '@/components/Modales/DeviceModalRouter.vue'

const temperatura = ref('')
const clima = ref('')

const hora = ref('')
const horaActual = new Date().getHours() 
let intervalo: number

const fecha = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long'})    
const saludo = horaActual < 12 ? 'Buenos días' : horaActual < 20 ? 'Buenas tardes' : 'Buenas noches'

const router = useRouter()
const hogares = ref<any[]>([]) //hogares del usuario
const usuario = ref('')  //nombre del usuario
const currentUserEmail = ref('')


const mostrarNuevoHogar = ref(false)

const hogarAEliminar = ref<any>(null)

const defaultHouseIcon = ref(`<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`)

// socket.on('deviceEvent', (event)=>{
//    console.log(event)
//    actividad.value.unshift(event)
//    if(actividad.value.length > 10){
//       actividad.value.pop()
//    }
// })


async function cargarHogares() {                                                                                                                
     const data = await getHomes()
     for (const hogar of data) {
        const rooms = await getRooms(hogar.id)
        hogar.rooms = rooms.length
        let totalDevices = 0
        for (const room of rooms) {
           const devices = await getRoomDevices(room.id)
           totalDevices += devices.length
        }
        hogar.devices = totalDevices
     }
     hogares.value = data
  }

async function getUsername(){
   const info = await getUserInfo()
   usuario.value = info.name
   currentUserEmail.value = info.email
  }


async function borrarHogar(id: string){
   await deleteHome(id)
   await cargarHogares()
}

async function cargarActividad() {
     const logs = await getDeviceLogs(20, 0)
     const seen = new Set<string>()
     const uniqueLogs: any[] = []
     for (const log of logs) {
        if (!seen.has(log.deviceId)) {
           seen.add(log.deviceId)
           uniqueLogs.push(log)
        }
     }
     actividad.value = await Promise.all(uniqueLogs.slice(0, 10).map(async (log: any) => {
        const device = await getDevice(log.deviceId)
        const tipoNombre = await getDeviceTypeName(device.type.id)
        const encendido = log.actionName !== 'turnOff'
        const estado = log.actionName === 'turnOn' ? 'Encendido'
                     : log.actionName === 'turnOff' ? 'Apagado'
                     : log.actionName
        return {
           id: log.id,
           nombre: device.name,
           tipo: tipoNombre,
           habitacion: device.metadata?.roomName ?? '—',
           hogar: device.metadata?.homeName ?? '—',
           encendido,
           estado,
           tiempo: tiempoRelativo(log.timestamp),
           deviceObj: { ...device, type: { ...device.type, name: tipoNombre } }
        }
     }))
  }

//levanta la hora
onMounted(() => {
   cargarActividad()
   intervalo = setInterval(() => {
      hora.value = new Date().toLocaleTimeString('es-AR', {hour: '2-digit', minute: '2-digit', hour12: false})
   }, 1000)
   
})

onUnmounted(() => clearInterval(intervalo))


onMounted(async() => {
   await cargarHogares()
   await getUsername()
   const resClima = await fetch(
   `https://api.openweathermap.org/data/2.5/weather?q=Buenos+Aires&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric&lang=es`
)

const dataClima = await resClima.json()
  temperatura.value = Math.round(dataClima.main.temp) + '°C'
  clima.value = dataClima.weather[0].description
  
})


function tiempoRelativo(timestamp: string): string {
     const mins = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000)
     if (mins < 1) return 'Ahora'
     if (mins < 60) return `Hace ${mins} min`
     const hrs = Math.floor(mins / 60)
     if (hrs < 24) return `Hace ${hrs} h`
     return `Hace ${Math.floor(hrs / 24)} d`
}



const actividad = ref<any[]>([])

// Modal de dispositivos
const dispositivoAbierto = ref<typeof actividad.value[0] | null>(null)

function abrirModal(item: any) {
   console.log('item:', item)
   console.log('deviceObj:', item.deviceObj)
   dispositivoAbierto.value = item.deviceObj
}
</script>

<style scoped>

/* estilos de banner*/
.banner {
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: linear-gradient(135deg, var(--rut-btn-primary) 0%, var(--color-indigo) 100%);
    border-radius: 18px;
    padding: 22px 26px;
    margin-bottom: 28px;
    margin-top: 28px;
    color: var(--surface);
    box-shadow: 0 4px 20px var(--box-shadow);
}



.banner-left{
   display: flex;
   flex-direction: column;
   gap: 6px;
   font-size: 1.15rem;
   font-weight: 800;
   opacity: .9;
   white-space: nowrap;
   /* margin: 10px; */
}


.banner-greeting{
   font-size: 1.4375rem;
   font-weight: 700;
   text-transform: capitalize;
}

.banner-date{
   font-size: 1.025rem;
   opacity: .7;
   font-weight: 550;
   text-transform: capitalize;
}

.banner-right{
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   gap: 6px;
   flex-shrink: 0;
}

.banner-time{
   font-size: 2.4rem;
   font-weight: 800;
   letter-spacing: -.02em;
   line-height: 1;
   align-self: center;
}

.banner-weather{
   display: flex;
   align-items: center;
   gap: 5px;
   font-size: 1.025rem;
   font-weight: 750;
   opacity: .78;
   background: var(--weather-color);
   border-radius: 20px;
   padding: 4px 15px;
   text-transform: capitalize;

}
/* estilos de hogares*/


.hogares-header {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 16px;
    margin-top: 32px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text);
    letter-spacing: -.02em;
}
.hogares-header svg{
   width: 22px;
   height: 22px;
   color: var(--color-indigo);
}

.hogares-cuadro{
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
   gap: 1rem;
}


.hogar-card{
   background: var(--surface);
   border: 1.5px solid var(--border);
   border-radius: 1rem;
   cursor: pointer;
   padding: 1.25rem;
   transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
}

.hogar-card:hover{
   border-color: var(--accent);
   box-shadow: 0 4px 16px var(--accent-light);
   transform: translateY(-2px);
   background: var(--surface-light);
}

.hogar-head {
  position: relative;
  min-height: 8.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.hogar-icon {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 2.375rem;
  height: 2.375rem;
  background: var(--accent-light);
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}



.hogar-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  margin-top: 20px;
}

.hogar-name {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text);
  max-width: 100%;
  word-break: break-word;
}

.hogar-sub {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-muted);
  line-height: 1.35;
}

.hogar-chevron {
   position: relative;
   margin-top: 10px;
   color: var(--accent);
}

.delete-btn{
   position: absolute;
  top: 0px;
  right: 0px;
}



/* estilos de recientes*/

.actividad-header{
   font-size: 1.6rem;
   font-weight: 800;
   margin-bottom: 16px;
   margin-top: 32px;
   display: flex;
   align-items: center;
   gap: 10px;
   color: var(--text);
   letter-spacing: -.02em;
}

.actividad-header svg {
    width: 22px;
    height: 22px;
    color: var(--color-indigo);
}

.actividad-lista{
   display: flex;
   flex-direction: column;
   gap: 8px;
   margin-bottom: 4px;
   margin: 0;
   padding: 0;
   box-sizing: border-box;
}

.recent-item{
   display: flex;
   align-items: center;
   gap: 0.875rem;
   padding: 0.75rem 1rem;
   background: var(--surface);
   border: 1px solid var(--border);
   border-radius: 0.75rem;
   box-shadow: 0 1px 3px var(--box-shadow-2);
   cursor: pointer;

}

.recent-item:hover{
border-color: var(--accent);
   box-shadow: 0 4px 16px var(--accent-light);
   transform: translateY(-2px);
}

.recent-info{
   flex: 1;
}
.recent-device{
   font-size: 1.15rem;
   font-weight: 600;
   color: var(--text)
}

.recent-location{
   font-size: 0.86rem;
   font-weight: 400;
   color: var(--text-muted);
   margin-top: 1px;
}

.recent-time{
   font-size: 0.86rem;
    color: var(--text-muted);
    white-space: nowrap;
}

.recent-icon {
  width: 2.625rem;
  height: 2.625rem;
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recent-icon.off {
  background: var(--surface2);
  color: var(--text-muted);
}

.recent-icon.on {
  background: var(--color-sky-light);
  color: var(--color-sky);
}

.recent-badge {
  font-size: 0.82rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.recent-badge.off {
  background: var(--surface2);
  color: var(--text-muted);
}

.recent-badge.on {
  background: rgba(46, 125, 50, 0.12);
  color: var(--success);
}


</style>
