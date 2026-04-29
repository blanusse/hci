import {createRouter, createWebHistory} from 'vue-router'

import Rutinas from '@/components/Rutinas.vue'
import Energia from '@/components/Energia.vue'
import Permisos from '@/components/Permisos.vue'
import Dashboard from '@/components/Dashboard.vue'
import Login from '@/components/Login.vue'
import HomeView from '@/components/HomeView.vue'
// import Navbar from '@/components/Navbar.vue'


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