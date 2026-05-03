<template>
   <div class="panel-overlay" @click.self="$emit('close')">
      <div class="panel">

         <div class="panel-header">
            <div class="panel-title">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
               </svg>
               Historial
            </div>
            <button class="panel-close" @click="$emit('close')">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
               </svg>
            </button>
         </div>

         <!-- Filtros -->
         <div class="filtros">
            <div class="filtro-field">
               <label class="filtro-label">Casa</label>
               <select class="filtro-select" v-model="filtroHome">
                  <option value="">Todas</option>
                  <option v-for="h in homes" :key="h.id" :value="h.id">{{ h.name }}</option>
               </select>
            </div>
            <div class="filtro-field">
               <label class="filtro-label">Fecha</label>
               <input class="filtro-input" type="date" v-model="filtroFecha" />
            </div>
            <button v-if="filtroHome || filtroFecha" class="filtro-clear" @click="filtroHome = ''; filtroFecha = ''">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
               </svg>
               Limpiar
            </button>
         </div>

         <div class="panel-body">

            <div v-if="cargando" class="panel-empty">
               <div class="spinner"></div>
               <p>Cargando historial…</p>
            </div>

            <div v-else-if="registrosFiltrados.length === 0" class="panel-empty">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
               </svg>
               <p>Sin registros</p>
            </div>

            <template v-else>
               <template v-for="(grupo, fecha) in registrosAgrupados" :key="fecha">
                  <div class="hist-fecha-label">{{ fecha }}</div>
                  <div v-for="r in grupo" :key="r.id" class="hist-item">
                     <div class="hist-icon" :class="r.colorClass">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="r.iconSvg"></svg>
                     </div>
                     <div class="hist-content">
                        <div class="hist-device">{{ r.deviceName }}</div>
                        <div class="hist-accion">{{ r.descripcion }}</div>
                        <div class="hist-meta">
                           <span class="hist-home">{{ r.homeName }}</span>
                           <span class="hist-time">{{ r.hora }}</span>
                        </div>
                     </div>
                  </div>
               </template>
            </template>

         </div>

      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getHomes } from '@/services/homeService';

defineEmits(['close'])

// TODO: reemplazar con llamadas reales a la API
const cargando = ref(false)
const homes = ref<{ id: string; name: string }[]>([])
const registros = ref<Registro[]>([])

const filtroHome = ref('')
const filtroFecha = ref('')

interface Registro {
   id: string
   deviceName: string
   descripcion: string
   homeName: string
   homeId: string
   fecha: string   // 'YYYY-MM-DD'
   hora: string    // 'HH:MM'
   iconSvg: string
   colorClass: string
}

const registrosFiltrados = computed(() => {
   return registros.value.filter(r => {
      if (filtroHome.value && r.homeId !== filtroHome.value) return false
      if (filtroFecha.value && r.fecha !== filtroFecha.value) return false
      return true
   })
})

const registrosAgrupados = computed(() => {
   const grupos: Record<string, Registro[]> = {}
   for (const r of registrosFiltrados.value) {
      const label = fechaLabel(r.fecha)
      if (!grupos[label]) grupos[label] = []
      grupos[label].push(r)
   }
   return grupos
})

function fechaLabel(fecha: string): string {
   const hoy = new Date().toISOString().slice(0, 10)
   const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
   if (fecha === hoy) return 'Hoy'
   if (fecha === ayer) return 'Ayer'
   return new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
}

onMounted(async () => {
   // TODO: cargar homes y registros desde la API
   homes.value = await getHomes()
   // registros.value = await cargarHistorial()
})
</script>

<style scoped>
.panel-overlay {
   position: fixed;
   inset: 0;
   background: rgba(0,0,0,0.3);
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
   box-shadow: -4px 0 24px rgba(0,0,0,0.12);
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
   width: 32px; height: 32px;
   border-radius: 50%;
   border: none;
   background: var(--surface2);
   cursor: pointer;
   display: flex; align-items: center; justify-content: center;
   color: var(--text-muted);
   transition: background 0.15s;
}
.panel-close:hover { background: var(--border); }

/* Filtros */
.filtros {
   display: flex;
   align-items: flex-end;
   gap: 10px;
   padding: 14px 16px;
   border-bottom: 1px solid var(--border);
   flex-shrink: 0;
   flex-wrap: wrap;
}

.filtro-field {
   display: flex;
   flex-direction: column;
   gap: 4px;
   flex: 1;
   min-width: 100px;
}

.filtro-label {
   font-size: 0.68rem;
   font-weight: 700;
   color: var(--text-muted);
   text-transform: uppercase;
   letter-spacing: 0.06em;
}

.filtro-select,
.filtro-input {
   padding: 7px 10px;
   border-radius: 8px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text);
   font-size: 0.85rem;
   font-family: inherit;
   outline: none;
   transition: border-color 0.15s;
   width: 100%;
}
.filtro-select:focus,
.filtro-input:focus { border-color: var(--accent); }

.filtro-clear {
   display: flex;
   align-items: center;
   gap: 5px;
   padding: 7px 10px;
   border-radius: 8px;
   border: none;
   background: var(--surface2);
   color: var(--text-muted);
   font-size: 0.8rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   white-space: nowrap;
   transition: background 0.15s, color 0.15s;
   align-self: flex-end;
}
.filtro-clear:hover { background: var(--border); color: var(--text); }

/* Body */
.panel-body {
   flex: 1;
   overflow-y: auto;
   padding: 12px 12px 20px;
   display: flex;
   flex-direction: column;
   gap: 2px;
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

/* Fecha label */
.hist-fecha-label {
   font-size: 0.7rem;
   font-weight: 700;
   color: var(--text-muted);
   text-transform: uppercase;
   letter-spacing: 0.07em;
   padding: 12px 4px 6px;
}
.hist-fecha-label:first-child { padding-top: 4px; }

/* Item */
.hist-item {
   display: flex;
   align-items: flex-start;
   gap: 10px;
   padding: 10px 12px;
   border-radius: 10px;
   transition: background 0.12s;
}
.hist-item:hover { background: var(--surface2); }

.hist-icon {
   width: 32px; height: 32px;
   border-radius: 9px;
   display: flex; align-items: center; justify-content: center;
   flex-shrink: 0;
   margin-top: 1px;
}
.hist-icon.color-yellow { background: rgba(245,158,11,0.12); color: #F59E0B; }
.hist-icon.color-blue   { background: rgba(99,102,241,0.12);  color: var(--accent); }
.hist-icon.color-green  { background: var(--success-light);   color: var(--success); }
.hist-icon.color-red    { background: var(--danger-light);    color: var(--color-red); }
.hist-icon.color-gray   { background: var(--surface2);        color: var(--text-muted); }

.hist-content { flex: 1; min-width: 0; }

.hist-device {
   font-size: 0.88rem;
   font-weight: 700;
   color: var(--text);
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}

.hist-accion {
   font-size: 0.8rem;
   color: var(--text-muted);
   margin-top: 2px;
   line-height: 1.35;
}

.hist-meta {
   display: flex;
   align-items: center;
   justify-content: space-between;
   margin-top: 4px;
   gap: 8px;
}

.hist-home {
   font-size: 0.72rem;
   color: var(--text-muted);
   background: var(--surface2);
   padding: 2px 7px;
   border-radius: 20px;
   font-weight: 600;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}

.hist-time {
   font-size: 0.72rem;
   color: var(--text-muted);
   flex-shrink: 0;
}

/* Spinner */
.spinner {
   width: 28px; height: 28px;
   border: 3px solid var(--border);
   border-top-color: var(--accent);
   border-radius: 50%;
   animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
