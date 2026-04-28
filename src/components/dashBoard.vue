<template>
   <div class="dashboard">
      <div class="message-banner">
         <div class="banner-left">
            <div class="banner-greeting">{{saludo}}, {{ usuario }}</div>
            <div class="banner-date">{{ fecha }}</div>
         </div>
         <div class="banner-right">
            <div class="banner-time">{{ hora }}</div>
            <div class="banner-weather">{{ clima }}</div>
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
   const res = await fetch('http://hci.it.itba.edu.ar/api/users/profile', {
      headers: {
         'Content-Type': 'application/json',
         'X-API-KEY': import.meta.env.VITE_API_KEY
      }
   })
   const data = await res.json()
   usuario.value = data.name

   const resClima = await fetch(
   `https://api.openweathermap.org/data/2.5/weather?q=Buenos+Aires&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric&lang=es`
)

const dataClima = await resClima.json()
  temperatura.value = Math.round(dataClima.main.temp) + '°C'
  clima.value = dataClima.weather[0].description
  
})

</script>

<style scoped>

.dashboard{
   padding: 0 10px 0 20px;
   /* background-color: white; */
}

.message-banner {
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
   font-size: 1.6rem;
   font-weight: 700;
   /* text-transform: capitalize; */
}

.banner-date{
   font-size: 1rem;
   opacity: .7;
   font-weight: 550;
   text-transform: capitalize;
}

.banner-time{
   font-size: 2rem;
   font-weight: 800;
   letter-spacing: -.02em;
   line-height: 1;
}

</style>
