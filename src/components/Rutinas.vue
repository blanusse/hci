<template>
  <main class="main page-content">
    <div class="screen active">
      <div class="sch-page-header">
        <div>
          <h2 class="section-title">Rutinas</h2>
          <p style="color: var(--text-muted); font-size: 1.06rem; font-weight: 600; margin: 0">
            Automatizaciones programadas para tus dispositivos
          </p>
        </div>
        <button class="sch-new-btn" @click="mostrarNuevaRutina = true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            data-lucide="plus"
            aria-hidden="true"
            class="lucide lucide-plus"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          Nueva rutina
        </button>
      </div>
      <div class="rut-home-cards">
        <button
          v-for="hogar in hogares"
          :key="hogar.id"
          class="rut-home-card"
          :class="{ active: selectedHomeId === hogar.id }"
          @click="selectedHomeId = hogar.id"
        >
          <span class="rut-home-card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="lucide lucide-house"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
              <path
                d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              ></path>
            </svg>
          </span>
          <span class="rut-home-card-copy">
            <span class="rut-home-card-name">{{ hogar.name }}</span>
            <span class="rut-home-card-count"
              >{{ rutinas.length }} rutinas</span>
          </span>
        </button>
      </div>
      <div class="rut-general-card">
        <div class="rut-general-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            data-lucide="layers-3"
            aria-hidden="true"
            class="lucide lucide-layers-3"
          >
            <path
              d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
            ></path>
            <path
              d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
            ></path>
            <path
              d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
            ></path></svg><span>GENERAL</span><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            data-lucide="chevron-right"
            aria-hidden="true"
            class="lucide lucide-chevron-right"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>
        <button class="rut-general-toggle" @click="toggleTodasLasLuces()">
          <span class="rut-general-toggle-icon"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              data-lucide="lightbulb"
              aria-hidden="true"
              class="lucide lucide-lightbulb"
            >
              <path
                d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
              ></path>
              <path d="M9 18h6"></path>
              <path d="M10 22h4"></path></svg></span><span class="rut-general-toggle-copy"
            ><span class="rut-general-toggle-text">Todas las luces</span><span class="rut-general-toggle-sub"
              >Todas las casas</span></span><span class="toggle toggle--lg" :class="{ on: generalActiva }"></span>
        </button>
      </div>
      <!---->
      <div v-if="rutinas.length > 0" style="margin-bottom: 24px">
        <div class="rut-group-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            data-lucide="house"
            aria-hidden="true"
            class="lucide lucide-house"
          >
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
            <path
              d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            ></path></svg><span>{{ selectedHome?.name }}</span>
        </div>
        <div class="sch-grid">
          <div
            v-for="rutina in rutinas"
            :key="rutina.id"
            class="sch-card"
            :class="{ 'sch-card--disabled': rutina.deshabilitada }"
          >
            <div class="sch-card-top">
              <div
                class="sch-card-icon"
                :class="{ 'sch-icon--active': !rutina.deshabilitada }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS[rutina.icon]"></svg>
              </div>
              <div class="sch-card-meta">
                <div class="sch-card-name">{{ rutina.nombre }}</div>
                <div class="sch-card-trigger">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0" v-html="ICONS[rutina.triggerIcon]"></svg>
                  {{ rutina.triggerText }}
                </div>
              </div>
              <div
                class="toggle"
                :class="{ on: rutina.activa }"
                style="flex-shrink: 0; margin-left: 4px; cursor: pointer"
                @click.stop="toggleRutina(rutina)"
              ></div>
            </div>
            <div class="sch-actions-chips">
              <div
                v-for="(accion, j) in rutina.acciones"
                :key="j"
                class="sch-act-chip"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS[accion]"></svg>
              </div>
            </div>
            <div class="sch-card-footer">
              <span class="sch-last-run">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0" v-html="ICONS['history']"></svg>
                Ultima ejecucion: {{ rutina.ultimaEjecucion }}
              </span>
              <div class="sch-card-btns">
                <button
                  class="sch-btn sch-btn--run"
                  :class="{ 'sch-btn--disabled': rutina.deshabilitada }"
                  :disabled="rutina.deshabilitada"
                  title="Ejecutar ahora"
                  @click.stop="ejecutarRutina(rutina)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS['play']"></svg>
                </button>
                <button class="sch-btn sch-btn--edit" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS['sliders-horizontal']"></svg>
                </button>
                <button class="sch-btn sch-btn--delete" title="Eliminar" @click.stop="rutinaAEliminar = rutina">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS['trash-2']"></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <NuevaRutinaModal
    v-if="mostrarNuevaRutina"
    :hogares="hogares"
    @close="mostrarNuevaRutina = false"
    @created="onRutinaCreada"
  />

  <ConfirmarEliminarModal
    v-if="rutinaAEliminar"
    titulo="Eliminar rutina"
    :nombre="rutinaAEliminar.nombre"
    descripcion="Esta rutina se eliminará permanentemente. Esta acción no se puede deshacer."
    :error="errorEliminar"
    @confirm="eliminarRutina"
    @cancel="rutinaAEliminar = null; errorEliminar = ''"
  />
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getHomes, getRooms, getRoomDevices } from "@/services/homeService";
import { getRoutines, updateRoutine, executeRoutine, deleteRoutine } from "@/services/routineService";
import { manipulateDevice } from "@/services/deviceService";
import NuevaRutinaModal from "@/components/NuevaRutinaModal.vue";
import ConfirmarEliminarModal from "@/components/ConfirmarEliminarModal.vue";
import { ICONS } from "@/utils/routineIcons";


interface Rutina {
  id: string;
  nombre: string;
  icon: string;
  triggerIcon: string;
  triggerText: string;
  activa: boolean;
  deshabilitada: boolean;
  acciones: string[];
  ultimaEjecucion: string;
}

/* adaptador entre el idioma de la API y el idioma del template. */
function mapRutina(r: any): Rutina {
  const m = r.metadata ?? {};
  const activa = m.activa ?? true;
  return {
    id: r.id,
    nombre: r.name,
    icon: m.icon ?? 'clock',
    triggerIcon: m.triggerIcon ?? 'clock',
    triggerText: m.triggerText ?? 'Sin trigger definido',
    activa,
    deshabilitada: !activa,
    acciones: m.acciones ?? [],
    ultimaEjecucion: m.ultimaEjecucion ?? 'Nunca',
  };
}

interface Home {
  id: string;
  name: string;
}

const hogares = ref<Home[]>([]);
const generalActiva = ref(true);
const mostrarNuevaRutina = ref(false);
const rutinaAEliminar = ref<Rutina | null>(null);
const errorEliminar = ref('');
const selectedHomeId = ref<string | null>(null);
const selectedHome = computed(() =>
  hogares.value.find((h) => h.id === selectedHomeId.value),
);

const rutinas = ref<Rutina[]>([]);

onMounted(async () => {
  try {
    const [homesData, routinesData] = await Promise.all([getHomes(), getRoutines()]);
    hogares.value = homesData;
    if (hogares.value.length > 0) selectedHomeId.value = hogares.value[0].id;
    rutinas.value = routinesData.map(mapRutina);
  } catch (e) {
    console.error(e);
  }
});

function onRutinaCreada(nueva: any) {
  rutinas.value.push(mapRutina(nueva));
}

async function eliminarRutina() {
  if (!rutinaAEliminar.value) return;
  const id = rutinaAEliminar.value.id;
  errorEliminar.value = '';
  try {
    await deleteRoutine(id);
    rutinas.value = rutinas.value.filter(r => r.id !== id);
    rutinaAEliminar.value = null;
  } catch (e: any) {
    errorEliminar.value = e.response?.data?.error?.description ?? 'Error al eliminar la rutina';
  }
}

async function toggleRutina(rutina: Rutina) {
  const nuevoEstado = !rutina.activa;
  rutina.activa = nuevoEstado;
  rutina.deshabilitada = !nuevoEstado;
  try {
    await updateRoutine(rutina.id, rutina.nombre, [], {
      icon: rutina.icon,
      triggerIcon: rutina.triggerIcon,
      triggerText: rutina.triggerText,
      activa: nuevoEstado,
      acciones: rutina.acciones,
    });
  } catch (e) {
    rutina.activa = !nuevoEstado;
    rutina.deshabilitada = nuevoEstado;
  }
}

async function ejecutarRutina(rutina: Rutina) {
  try {
    await executeRoutine(rutina.id);
  } catch (e: any) {
    console.error('Error al ejecutar rutina:', e.response?.data?.error?.description ?? e.message);
  }
}

async function toggleTodasLasLuces() {
  generalActiva.value = !generalActiva.value;
  const accion = generalActiva.value ? 'turnOn' : 'turnOff';
  for (const hogar of hogares.value) {
    const rooms = await getRooms(hogar.id);
    for (const room of rooms) {
      const devices = await getRoomDevices(room.id);
      for (const device of devices) {
        if (device.type?.name === 'lamp') {
          manipulateDevice(device.id, accion, []).catch(() => {});
        }
      }
    }
  }
}
</script>

<style scoped>
.section-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--text);
  margin-top: 0;
  margin-bottom: 2px;
}

.sch-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.sch-new-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #1a237e;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.0938rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.15s, transform 0.1s, box-shadow 0.15s;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(26, 35, 126, 0.25);
}

.sch-new-btn:hover {
  background: #283593;
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.35);
}

.sch-new-btn:active {
  transform: scale(0.97);
}

.sch-new-btn i {
  width: 16px;
  height: 16px;
}

.rut-home-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 16px 0 22px;
}

.rut-home-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 18px;
  border: 2px solid #d8dbef;
  background: #fff;
  color: #24324b;
  cursor: pointer;
  text-align: left;
  transition: all 0.18s ease;
}

.rut-home-card:hover {
  border-color: #b9c2ff;
  box-shadow: 0 8px 18px rgba(99, 102, 241, 0.1);
}

.rut-home-card.active {
  border-color: transparent;
  background: linear-gradient(135deg, #6466ea 0%, #6861e8 100%);
  color: #fff;
  box-shadow: 0 12px 24px rgba(79, 70, 229, 0.18);
}

.rut-home-card-icon {
  width: 58px;
  height: 58px;
  border-radius: 17px;
  border: 2px solid #cfd3ea;
  background: rgba(255, 255, 255, 0.78);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rut-home-card.active .rut-home-card-icon {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.16);
}

.rut-home-card-icon svg {
  width: 26px;
  height: 26px;
  color: #111827;
}

.rut-home-card-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.rut-home-card-name {
  font-size: 1.1875rem;
  font-weight: 800;
  line-height: 1.1;
}

.rut-home-card-count {
  margin-top: 4px;
  font-size: 0.975rem;
  color: #71819b;
  font-weight: 600;
}

.rut-home-card.active .rut-home-card-count {
  color: rgba(255, 255, 255, 0.9);
}

.rut-general-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 14px 18px;
  margin-bottom: 24px;
  border-radius: 18px;
  border: 2px solid #d8dbef;
  background: #fff;
}

.rut-general-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #657892;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.rut-general-label svg {
  width: 20px;
  height: 20px;
}

.rut-general-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 2px solid #d7d9ea;
  border-radius: 999px;
  background: #edeef8;
  color: #23324b;
  cursor: pointer;
  transition: all 0.18s ease;
}

.rut-general-toggle:hover {
  border-color: #bfc7f4;
  background: #f2f3fb;
}

.rut-general-toggle-icon {
  width: 24px;
  height: 24px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #687b96;
}

.rut-general-toggle-icon svg {
  width: 16px;
  height: 16px;
}

.rut-general-toggle-text {
  font-size: 1.1rem;
  font-weight: 800;
}

.rut-general-toggle-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.rut-general-toggle-sub {
  font-size: 0.9rem;
  color: #71819b;
  font-weight: 600;
}

.toggle {
  display: inline-block;
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #cbd5e1;
  transition: background-color 0.2s;
  margin: 10px auto 0px;
  flex-shrink: 0;
}

.toggle::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}

.toggle.on {
  background: #10b981;
}

.toggle.on::after {
  transform: translateX(20px);
}

.toggle--lg {
  width: 44px;
  height: 24px;
  margin-left: 6px;
  background: #cbd5e1;
  pointer-events: none;
  border-radius: 12px;
}

.toggle--lg::after {
  width: 18px;
  height: 18px;
  top: 3px;
  left: 3px;
}

.toggle--lg.on {
  background: #10b981;
}

.toggle--lg.on::after {
  transform: translateX(20px);
}

.rut-group-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #64748b;
  font-size: 1.025rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.rut-group-label svg {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}

.sch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.sch-card {
  background: var(--surface);
  border: 2px solid #dfe5f3;
  border-radius: 20px;
  padding: 18px 18px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  min-height: 238px;
  transition:
    box-shadow 0.2s,
    border-color 0.2s,
    transform 0.18s;
}

.sch-card:hover {
  box-shadow: 0 12px 26px rgba(148, 163, 184, 0.14);
  border-color: #c7d2fe;
  transform: translateY(-1px);
}

.sch-card--disabled {
  opacity: 0.6;
}

.sch-card-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-height: 56px;
}

.sch-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f5f6fb;
  border: 2px solid #b8bddc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.sch-card-icon.sch-icon--active {
  background: #f5f6fb;
  border-color: #b8bddc;
}

.sch-card-icon svg {
  width: 22px;
  height: 22px;
  color: #253147;
}

.sch-card--disabled .sch-card-icon svg {
  color: var(--text-muted);
}

.sch-card-meta {
  flex: 1;
  min-width: 0;
}

.sch-card-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #263247;
  line-height: 1.15;
}

.sch-card-trigger {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.95rem;
  color: #667892;
  margin-top: 6px;
  font-weight: 500;
}

.sch-card-trigger svg {
  width: 12px !important;
  height: 12px !important;
}

.sch-actions-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 36px;
}

.sch-act-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: #eff2f5;
  color: #5f738d;
}

.sch-act-chip svg {
  width: 15px;
  height: 15px;
}

.sch-act-chip:nth-child(3n) {
  background: rgba(32, 192, 139, 0.1);
  color: #0f9f83;
}

.sch-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 2px solid #e6eaf7;
  gap: 8px;
  margin-top: auto;
  min-height: 44px;
}

.sch-last-run {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #667892;
  flex: 1;
  min-width: 0;
  font-weight: 700;
}

.sch-card-btns {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.sch-card-btns {
  opacity: 0;
  transform: translateY(4px);
  pointer-events: none;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.sch-card:hover .sch-card-btns,
.sch-card:focus-within .sch-card-btns {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.sch-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.15s,
    color 0.15s,
    transform 0.1s;
  color: var(--text-muted);
}

.sch-btn:hover {
  transform: scale(1.08);
}

.sch-btn i {
  width: 16px;
  height: 16px;
}

.sch-btn--run i {
  color: #64748b;
}

.sch-btn--run:hover {
  background: rgba(100, 116, 139, 0.1);
}

.sch-btn--run.sch-btn--disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

.sch-btn--edit i {
  color: #64748b;
}

.sch-btn--edit:hover {
  background: rgba(100, 116, 139, 0.1);
}

.sch-btn--delete i {
  color: #64748b;
}

.sch-btn--delete:hover {
  background: rgba(100, 116, 139, 0.1);
}
</style>
