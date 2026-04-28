<template>
   <div class="dashboard">
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
      <div class="hogares-header">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="house" aria-hidden="true" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
         Mis Hogares
      </div>
      <div class="hogares-cuadro">
         <div v-for="hogar in hogares" :key="hogar.id" class="hogar-card">
            <div class="hogar-head">
               <div class="hogar-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
               </div>
               <button class="hogar-delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
               </button>
               <div class="hogar-main">
                  <div class="hogar-name">{{ hogar.name }}</div>
                  <div class="hogar-sub">{{ hogar.rooms }} habitaciones · {{ hogar.devices }} dispositivos encendidos</div>
               </div>
               <svg class="hogar-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
            </div>
         </div>
         <div class="hogar-add">

         </div>
      </div>
   </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'


const temperatura = ref('')
const clima = ref('')


//levanta la hora
const hora = ref('')
const horaActual = new Date().getHours() 
let intervalo: number
onMounted(() => {
   intervalo = setInterval(() => {
      hora.value = new Date().toLocaleTimeString('es-AR', {hour: '2-digit', minute: '2-digit', hour12: false})
   }, 1000)
   
})

onUnmounted(() => clearInterval(intervalo))
const fecha = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long'})    
// const fecha = fechaRaw.charAt(0).toUpperCase() + fechaRaw.slice(1)

const saludo = horaActual < 12 ? 'Buenos días' : horaActual < 20 ? 'Buenas tardes' : 'Buenas noches'

//levanta la info del usuario para poner el nombre en el cartel de bienvenida
const usuario = ref('') 
onMounted(async() => {
   //TODO: hacer cuando se use la API -> es para levantar el nombre del usuario
   // const res = await fetch('http://hci.it.itba.edu.ar/api/users/profile', {
   //    headers: {
   //       'Content-Type': 'application/json',
   //       'X-API-KEY': import.meta.env.VITE_API_KEY
   //    }
   // })
   // const data = await res.json()
   // usuario.value = data.name

   const resClima = await fetch(
   `https://api.openweathermap.org/data/2.5/weather?q=Buenos+Aires&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric&lang=es`
)

const dataClima = await resClima.json()
  temperatura.value = Math.round(dataClima.main.temp) + '°C'
  clima.value = dataClima.weather[0].description
  
})


//TODO: esta lista dsp va a tener la lista de hogares sacado de la api
const hogares = ref([      
    { id: 1, name: 'Casa Ciudad', rooms: 5, devices: 5 },
    { id: 2, name: 'Casa Pilar', rooms: 6, devices: 6 },
  ])

</script>

<style scoped>

.dashboard{
   padding: 0 10px 0 20px;
   /* background-color: white; */
}

.banner {
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: linear-gradient(135deg, #1A237E 0%, #3F51B5 100%);
    border-radius: 18px;
    padding: 22px 26px;
    margin-bottom: 28px;
    margin-top: 28px;
    max-width: 1050px;
    color: #fff;
    box-shadow: 0 4px 20px rgba(26, 35, 126, .30);
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
   /* text-transform: capitalize; */
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
   background: rgba(255, 255, 255, .12);
   border-radius: 20px;
   padding: 4px 15px;
   text-transform: capitalize;

}


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
   color: #3F51B5;
}

.hogares-cuadro{
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
   gap: 16px;
}


.hogar-card{
   background: var(--surface);
   border: 1.5px solid var(--border);
   border-radius: 16px;
   /* overflow: hidden; */
   cursor: pointer;
   padding: 20px;
   transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
}

.hogar-card:hover{
   border-color: var(--accent);
   box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
   transform: translateY(-2px);
}

.hogar-head {
  position: relative;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.hogar-icon {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 38px;
  height: 38px;
  background: var(--accent-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.hogar-delete {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: none;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: background 0.15s, color 0.15s;
}
.hogares-delete svg {
    width: 14px;
    height: 14px;
}




.hogar-delete:hover{
   background-color: var(--danger-light);
   color: var(--danger);
}

.hogar-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  margin-top: 8px;
}

.hogar-name {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text);
}

.hogar-sub {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-muted);
  line-height: 1.35;
}

.hogar-chevron {
  position: absolute;
  bottom: 12px;
  right: 12px;
  color: var(--accent);
}

</style>
