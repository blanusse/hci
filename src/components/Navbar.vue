<template>
  <!-- Top navbar -->
  <nav class="navbar">
    <button class="navbar-brand" @click="$emit('brand-click')">
      <div class="brand-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <span class="brand-name">SmartHome</span>
    </button>

    <!-- Links (solo desktop) -->
    <div class="navbar-links">
      <a
        v-for="link in navLinks"
        :key="link.id"
        :href="link.href"
        class="nav-link"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          v-html="iconMap[link.icon]"></svg>
        {{ link.label }}
      </a>
    </div>

    <!-- Acciones -->
    <div class="navbar-actions">
      <button class="icon-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span v-if="notifications > 0" class="badge">{{ notifications }}</span>
      </button>
      <button class="icon-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </button>
      <button class="icon-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
        </svg>
      </button>
      <button class="icon-btn">
        <svg width="28" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </button>
    </div>
  </nav>

  <!-- Bottom nav (solo mobile) -->
  <nav class="bottom-nav">
    <a
      v-for="link in navLinks"
      :key="link.id"
      :href="link.href"
      class="bottom-nav-link"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        v-html="iconMap[link.icon]"></svg>
      <span>{{ link.label }}</span>
    </a>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const navLinks = ref([
  { id: 1, label: 'Rutinas',  href: '/rutinas',  icon: 'rutinas'  },
  { id: 2, label: 'Energía',  href: '/energia',  icon: 'energia'  },
  { id: 3, label: 'Permisos', href: '/permisos', icon: 'permisos' },
])

const iconMap = {
  rutinas:  `<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>`,
  energia:  `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
  permisos: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
}

const notifications = ref(0)

onMounted(async () => {
  try {
    const res = await fetch('https://tu-api.com/navbar')
    const data = await res.json()
    notifications.value = data.notifications
  } catch (err) {
    console.error('Error cargando navbar:', err)
  }
})
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0 2rem;
  height: 60px;
  background: white;
  border-bottom: 1px solid #e5e8f0;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.125rem;
  color: #6366F1;
  background: transparent;
  border: none;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}



.brand-icon {
  width: 34px;
  height: 34px;
  background: #6366F1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background 0.15s;
}

.navbar-brand:hover {
  background: #6366F1;
  color: white;

}

.navbar-brand:hover .brand-icon {
  background: white;
  color: #6366F1;

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

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #6366F1;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.nav-link:hover{
  background: #6366F1;
  color: white;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #4a5068;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.15s;
}
.icon-btn:hover { background: #c8cbc7; }

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #e53e3e;
  color: white;
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

@media (max-width: 640px) {
  .navbar-links {
    display: none;
  }

  .bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: white;
    border-top: 1px solid #e5e8f0;
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
    color: #6366F1;
    text-decoration: none;
    padding: 0.4rem 1rem;
    border-radius: 8px;
    transition: color 0.15s;
  }

  .bottom-nav-link:hover, .bottom-nav-link:active {
    background: #6366F1;
    color: white;
  }
}
</style>
