<template>
  <!-- Top navbar -->
  <nav class="navbar">
    <button class="navbar-brand" @click="$emit('brand-click')">
      <div class="brand-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      </div>
      <span class="brand-name">SmartHome</span>
    </button>

    <div class="navbar-links">
      <button class="nav-btn" @click="router.push('/rutinas')" :class="{ active: route.path === '/rutinas' }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="clock" aria-hidden="true" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> Rutinas </button>

      <button class="nav-btn" @click="router.push('/energia')" :class="{ active: route.path === '/energia' }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="zap" aria-hidden="true" class="lucide lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg> Energía </button>

      <button class="nav-btn" @click="router.push('/permisos')" :class="{ active: route.path === '/permisos' }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="shield-check" aria-hidden="true" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg> Permisos </button>
    </div>

    <div class="navbar-actions">
      <button class="icon-btn" @click="toggleDark" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
        <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>
      <button class="icon-btn" @click="$emit('open-notificaciones')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span v-if="sinLeer > 0" class="badge">{{ sinLeer }}</span>  
      </button>
      <button class="icon-btn" @click="$emit('open-historial')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </button>
      <button class="icon-btn avatar-btn" @click="$emit('open-perfil')">
        <span class="avatar-initials">{{ initials }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificacionesStore } from '@/stores/notificaciones'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { getUserInfo } from '@/services/userService'

const router = useRouter()
const notifStore = useNotificacionesStore()
const { sinLeer } = storeToRefs(notifStore)

const route = useRoute()

defineEmits(['brand-click', 'open-notificaciones', 'open-perfil', 'open-historial'])

const saved = localStorage.getItem('theme')
const isDark = ref(
  saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
)

const userName = ref('')
const initials = computed(() => {
  if (!userName.value) return '?'
  return userName.value.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
})

onMounted(async () => {
  if (isDark.value) document.documentElement.classList.add('dark')
  try {
    const user = await getUserInfo()
    userName.value = user?.name ?? ''
  } catch {}
})

function toggleDark() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    localStorage.setItem('theme', 'light')
  }
}



</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0px 24px;
  height: 60px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0 4px 20px var(--box-shadow);
}

.nav-btn{
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--surface);
  border: 1px solid transparent;
  border-bottom: none;
  color: var(--accent);
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.015rem;
  font-weight: 600;
  transition: all 0.2s;
  position: relative;
  height: 40px;
  margin-bottom: -1px;
  font-family: inherit;
  
}

.nav-btn:hover{
  background: var(--accent);
  color: var(--surface);
}

.nav-btn.active {
  background: var(--accent);
  color: var(--surface);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.406rem;
  color: var(--accent);
  background: transparent;
  border: none;
  padding: 4px 8px;;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.15s, color 0.15s;
  max-width: 200px;
}



.brand-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--surface);
    flex-shrink: 0;
    background: var(--accent);
    border-radius: 50%;
}

.navbar-brand:hover {
  background: var(--accent);
  color: var(--surface);

}

.navbar-brand:hover .brand-icon {
  background: var(--surface);
  color: var(--accent);

}

.navbar-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.nav-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}



.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: none;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.15s;
}
.icon-btn:hover { background: var(--surface2); }

.avatar-btn {
  background: var(--accent) !important;
  width: 34px;
  height: 34px;
}
.avatar-btn:hover { opacity: 0.85; background: var(--accent) !important; }

.avatar-initials {
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  pointer-events: none;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--danger);
  color: var(--surface);
  font-size: 0.6rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Bottom nav: oculto en desktop */
.bottom-nav {
  display: none;
}

@media (max-width: 780px) {
  .navbar{
    align-content:flex-end;
  }
  .navbar-links {                                                                                                                                 
      position: fixed;                 
      bottom: 0;
      left: 0;                    
      right: 0;             
      height: 50px;
      background: var(--surface);
      border-top: 1px solid var(--border);
      justify-content: space-around;   
      z-index: 100;
    }

  .navbar-brand{
    flex: 1;
  }
  .bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    justify-content: space-around;
    align-items: center;
    z-index: 100;
  }

  .bottom-nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--accent);
    text-decoration: none;
    padding: 0.4rem 1rem;
    border-radius: 8px;
    transition: color 0.15s;
  }

  .bottom-nav-link:hover, .bottom-nav-link:active {
    background: var(--accent);
    color: var(--surface);
  }
}
</style>
