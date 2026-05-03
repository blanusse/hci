import {createRouter, createWebHistory} from 'vue-router'

import Rutinas from '@/components/Vistas/Rutinas.vue'
import Energia from '@/components/Vistas/Energia.vue'
import Permisos from '@/components/Vistas/Permisos.vue'
import Dashboard from '@/components/Vistas/Dashboard.vue'
import Login from '@/components/Vistas/Login.vue'
import HomeView from '@/components/Vistas/HomeView.vue'


const router = createRouter({
   history: createWebHistory(),
   routes: [
      {path: '/rutinas', component: Rutinas},
      {path: '/', component: Login},
      {path: '/energia', component: Energia},
      {path: '/permisos', component: Permisos},
      {path: '/dashboard', component: Dashboard},
      {path: '/homes/:id', component: HomeView},
   ]
})


export default router