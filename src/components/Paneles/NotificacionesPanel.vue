<template>
   <div class="panel-overlay" @click.self="$emit('close')">
      <div class="panel">

         <div class="panel-header">
            <div class="panel-title">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
               </svg>
               Notificaciones
            </div>
            <button class="panel-close" @click="$emit('close')">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
               </svg>
            </button>
         </div>

         <div class="panel-body">
            <div v-if="notificaciones.length === 0" class="panel-empty">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
               </svg>
               <p>Sin notificaciones</p>
            </div>

            <div v-for="n in notificaciones" :key="n.id" class="notif-item" :class="{ unread: !n.leida }">
               <div class="notif-dot" v-if="!n.leida"></div>
               <div class="notif-content">
                  <div class="notif-titulo">{{ n.titulo }}</div>
                  <div class="notif-desc">{{ n.descripcion }}</div>
                  <div class="notif-tiempo">{{ n.tiempo }}</div>
               </div>
            </div>
         </div>

      </div>
   </div>
</template>

<script setup lang="ts">

  import { useNotificacionesStore } from '@/stores/notificaciones';
  import { storeToRefs } from 'pinia'

defineEmits(['close'])

const store = useNotificacionesStore()
const {notificaciones} = storeToRefs(store)



</script>

<style scoped>
.panel-overlay {
   position: fixed;
   inset: 0;
   background: rgba(0, 0, 0, 0.3);
   backdrop-filter: blur(2px);
   z-index: 200;
   display: flex;
   justify-content: flex-end;
}

.panel {
   width: clamp(300px, 33vw, 500px);
   height: 100%;
   background: var(--surface);
   display: flex;
   flex-direction: column;
   box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
   animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
   from { transform: translateX(100%); }
   to   { transform: translateX(0); }
}

.panel-header {
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 20px 20px 16px;
   border-bottom: 1px solid var(--border);
   flex-shrink: 0;
}

.panel-title {
   display: flex;
   align-items: center;
   gap: 10px;
   font-size: 1.1rem;
   font-weight: 700;
   color: var(--text);
}

.panel-close {
   width: 32px;
   height: 32px;
   border-radius: 50%;
   border: none;
   background: var(--surface2);
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
   color: var(--text-muted);
   transition: background 0.15s;
}
.panel-close:hover { background: var(--border); }

.panel-body {
   flex: 1;
   overflow-y: auto;
   padding: 12px;
   display: flex;
   flex-direction: column;
   gap: 8px;
}

.panel-empty {
   flex: 1;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 12px;
   color: var(--text-muted);
   font-size: 0.95rem;
   font-weight: 500;
   padding: 40px 0;
}

.notif-item {
   display: flex;
   gap: 10px;
   padding: 12px 14px;
   border-radius: 10px;
   border: 1px solid var(--border);
   background: var(--surface);
   position: relative;
}

.notif-item.unread {
   background: var(--accent-light);
   border-color: rgba(99, 102, 241, 0.2);
}

.notif-dot {
   width: 8px;
   height: 8px;
   border-radius: 50%;
   background: var(--accent);
   flex-shrink: 0;
   margin-top: 5px;
}

.notif-content {
   display: flex;
   flex-direction: column;
   gap: 3px;
   flex: 1;
}

.notif-titulo {
   font-size: 0.95rem;
   font-weight: 600;
   color: var(--text);
}

.notif-desc {
   font-size: 0.85rem;
   color: var(--text-muted);
   line-height: 1.4;
}

.notif-tiempo {
   font-size: 0.78rem;
   color: var(--text-muted);
   margin-top: 2px;
}
</style>
