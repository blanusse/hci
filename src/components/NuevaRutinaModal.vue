<template>
  <DeviceModal @close="$emit('close')">

    <template #header>
      <span class="modal-title">Nueva rutina</span>
    </template>

    <div class="steps">
      <div class="step" :class="{ active: paso === 1, done: paso > 1 }">
        <span class="step-num">1</span>
        <span class="step-label">Nombre e ícono</span>
      </div>
      <div class="step-line"></div>
      <div class="step" :class="{ active: paso === 2 }">
        <span class="step-num">2</span>
        <span class="step-label">Horario y acciones</span>
      </div>
    </div>

    <!-- PASO 1 -->
    <template v-if="paso === 1">
      <div class="field">
        <label class="field-label">Nombre de la rutina</label>
        <input class="field-input" v-model="nombre" placeholder="Ej. Buenas noches" @keyup.enter="siguiente" />
      </div>

      <div class="field">
        <label class="field-label">Hogar</label>
        <div v-if="!hogares?.length" class="no-homes">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="ICONS['house']"></svg>
          No tenés hogares creados.
        </div>
        <div v-else class="presets">
          <button
            v-for="hogar in hogares" :key="hogar.id"
            class="preset-btn" :class="{ selected: hogarSeleccionado === hogar.id }"
            @click="hogarSeleccionado = hogar.id"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="ICONS['house']"></svg>
            {{ hogar.name }}
          </button>
        </div>
      </div>

      <div class="field">
        <label class="field-label">Ícono</label>
        <div class="icon-picker">
          <button
            v-for="(paths, key) in ROUTINE_ICONS" :key="key"
            class="icon-opt" :class="{ selected: iconSeleccionado === key }"
            @click="iconSeleccionado = key"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="paths"></svg>
          </button>
        </div>
      </div>
    </template>

    <!-- PASO 2 -->
    <template v-if="paso === 2">
      <div class="field">
        <label class="field-label">Tipo de activación</label>
        <div class="presets">
          <button class="preset-btn" :class="{ selected: tipoTrigger === 'scheduled' }" @click="tipoTrigger = 'scheduled'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            Horario programado
          </button>
          <button class="preset-btn" :class="{ selected: tipoTrigger === 'manual' }" @click="tipoTrigger = 'manual'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/>
            </svg>
            Ejecución manual
          </button>
        </div>
      </div>

      <template v-if="tipoTrigger === 'scheduled'">
        <div class="field">
          <label class="field-label">Hora</label>
          <input class="field-input" type="time" v-model="hora" />
        </div>

        <div class="field">
          <label class="field-label">Días</label>
          <div class="presets">
            <button
              v-for="dia in dias" :key="dia.key"
              class="preset-btn" :class="{ selected: diasSeleccionados.includes(dia.key) }"
              @click="toggleDia(dia.key)"
            >
              {{ dia.label }}
            </button>
          </div>
        </div>
      </template>

      <!-- ACCIONES -->
      <div class="field">
        <label class="field-label">Acciones</label>

        <div v-if="accionesAgregadas.length > 0" class="acciones-list">
          <div v-for="(ac, i) in accionesAgregadas" :key="i" class="accion-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>
            </svg>
            <span>{{ ac.nombreDispositivo }}</span>
            <span class="accion-chip-action">{{ ac.actionName === 'turnOn' ? 'Encender' : 'Apagar' }}</span>
            <button class="accion-chip-remove" @click="quitarAccion(i)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="nueva-accion">
          <div class="field" style="margin-bottom: 12px">
            <label class="field-label" style="font-size: 0.75rem">Habitación</label>
            <div v-if="cargandoHabitaciones" class="loading-text">Cargando...</div>
            <div v-else-if="!habitaciones.length" class="loading-text">Sin habitaciones</div>
            <div v-else class="presets">
              <button
                v-for="hab in habitaciones" :key="hab.id"
                class="preset-btn preset-btn--sm" :class="{ selected: habitacionSeleccionada === hab.id }"
                @click="seleccionarHabitacion(hab.id)"
              >
                {{ hab.name }}
              </button>
            </div>
          </div>

          <div v-if="habitacionSeleccionada" class="field" style="margin-bottom: 12px">
            <label class="field-label" style="font-size: 0.75rem">Dispositivo</label>
            <div v-if="cargandoDispositivos" class="loading-text">Cargando...</div>
            <div v-else-if="!dispositivos.length" class="loading-text">Sin dispositivos en esta habitación</div>
            <div v-else class="presets">
              <button
                v-for="dev in dispositivos" :key="dev.id"
                class="preset-btn preset-btn--sm" :class="{ selected: dispositivoSeleccionado?.id === dev.id }"
                @click="dispositivoSeleccionado = dev"
              >
                {{ dev.name }}
              </button>
            </div>
          </div>

          <div v-if="dispositivoSeleccionado" class="field" style="margin-bottom: 12px">
            <label class="field-label" style="font-size: 0.75rem">Acción</label>
            <div class="presets">
              <button class="preset-btn preset-btn--sm" :class="{ selected: accionSeleccionada === 'turnOn' }" @click="accionSeleccionada = 'turnOn'">Encender</button>
              <button class="preset-btn preset-btn--sm" :class="{ selected: accionSeleccionada === 'turnOff' }" @click="accionSeleccionada = 'turnOff'">Apagar</button>
            </div>
          </div>

          <button v-if="dispositivoSeleccionado && accionSeleccionada" class="btn-agregar" @click="agregarAccion">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Agregar acción
          </button>
        </div>
      </div>
    </template>

    <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>

    <div class="modal-footer">
      <template v-if="paso === 1">
        <button class="btn-secondary" @click="$emit('close')">Cancelar</button>
        <button class="btn-primary" @click="siguiente" :disabled="!hogares?.length">
          Siguiente
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </template>
      <template v-if="paso === 2">
        <button class="btn-secondary" @click="paso = 1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Atrás
        </button>
        <button class="btn-primary" @click="crearRutina" :disabled="creando || !accionesAgregadas.length">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          {{ creando ? 'Creando…' : 'Crear rutina' }}
        </button>
      </template>
    </div>

  </DeviceModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DeviceModal from './DeviceModal.vue'
import { createRoutine } from '@/services/routineService'
import { getRooms, getRoomDevices } from '@/services/homeService'
import { getDeviceTypeName } from '@/services/deviceService'
import { ICONS, ROUTINE_ICONS } from '@/utils/routineIcons'

interface AccionRutina {
  device: { id: string }
  actionName: string
  params: any[]
  nombreDispositivo: string
  tipoDispositivo: string
}

const props = defineProps<{ hogares: { id: string; name: string }[] }>()
const emit = defineEmits(['close', 'created'])

const paso = ref(1)
const nombre = ref('')
const hogarSeleccionado = ref(props.hogares[0]?.id ?? '')
const iconSeleccionado = ref('clock')
const tipoTrigger = ref<'scheduled' | 'manual'>('scheduled')
const hora = ref('08:00')
const diasSeleccionados = ref<string[]>(['lun', 'mar', 'mie', 'jue', 'vie'])
const errorMsg = ref('')
const creando = ref(false)

const habitaciones = ref<any[]>([])
const dispositivos = ref<any[]>([])
const habitacionSeleccionada = ref('')
const dispositivoSeleccionado = ref<any>(null)
const accionSeleccionada = ref('')
const accionesAgregadas = ref<AccionRutina[]>([])
const cargandoHabitaciones = ref(false)
const cargandoDispositivos = ref(false)

const dias = [
  { key: 'lun', label: 'Lun' },
  { key: 'mar', label: 'Mar' },
  { key: 'mie', label: 'Mié' },
  { key: 'jue', label: 'Jue' },
  { key: 'vie', label: 'Vie' },
  { key: 'sab', label: 'Sáb' },
  { key: 'dom', label: 'Dom' },
]

function toggleDia(key: string) {
  const idx = diasSeleccionados.value.indexOf(key)
  if (idx >= 0) diasSeleccionados.value.splice(idx, 1)
  else diasSeleccionados.value.push(key)
}

async function siguiente() {
  if (nombre.value.trim().length < 3) {
    errorMsg.value = 'El nombre debe tener al menos 3 caracteres.'
    return
  }
  if (!hogarSeleccionado.value) {
    errorMsg.value = 'Seleccioná una casa.'
    return
  }
  errorMsg.value = ''
  paso.value = 2
  cargandoHabitaciones.value = true
  try {
    habitaciones.value = await getRooms(hogarSeleccionado.value)
  } catch {
    habitaciones.value = []
  } finally {
    cargandoHabitaciones.value = false
  }
}

async function seleccionarHabitacion(id: string) {
  habitacionSeleccionada.value = id
  dispositivoSeleccionado.value = null
  accionSeleccionada.value = ''
  dispositivos.value = []
  cargandoDispositivos.value = true
  try {
    dispositivos.value = await getRoomDevices(id)
  } catch {
    dispositivos.value = []
  } finally {
    cargandoDispositivos.value = false
  }
}

async function agregarAccion() {
  if (!dispositivoSeleccionado.value || !accionSeleccionada.value) return
  const tipoDispositivo = await getDeviceTypeName(dispositivoSeleccionado.value.type.id).catch(() => 'lamp')
  accionesAgregadas.value.push({
    device: { id: dispositivoSeleccionado.value.id },
    actionName: accionSeleccionada.value,
    params: [],
    nombreDispositivo: dispositivoSeleccionado.value.name,
    tipoDispositivo,
  })
  dispositivoSeleccionado.value = null
  accionSeleccionada.value = ''
}

function quitarAccion(i: number) {
  accionesAgregadas.value.splice(i, 1)
}

function buildTriggerText() {
  if (tipoTrigger.value === 'manual') return 'Ejecución manual'
  const labelsMap: Record<string, string> = { lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue', vie: 'Vie', sab: 'Sáb', dom: 'Dom' }
  if (diasSeleccionados.value.length === 7) return `${hora.value} · Todos los días`
  if (JSON.stringify(diasSeleccionados.value.slice().sort()) === JSON.stringify(['lun','mar','mie','jue','vie']))
    return `${hora.value} · Lun a Vie`
  return `${hora.value} · ${diasSeleccionados.value.map(d => labelsMap[d]).join(', ')}`
}

async function crearRutina() {
  if (!accionesAgregadas.value.length) {
    errorMsg.value = 'Agregá al menos una acción.'
    return
  }
  creando.value = true
  try {
    const actions = accionesAgregadas.value.map(({ device, actionName, params }) => ({ device, actionName, params }))
    const nueva = await createRoutine(nombre.value.trim(), actions, {
      icon: iconSeleccionado.value,
      triggerIcon: tipoTrigger.value === 'manual' ? 'mouse-pointer-2' : 'clock',
      triggerText: buildTriggerText(),
      tipoTrigger: tipoTrigger.value,
      ...(tipoTrigger.value === 'scheduled' && { hora: hora.value, dias: diasSeleccionados.value }),
      activa: true,
      acciones: [...new Set(accionesAgregadas.value.map(a => a.tipoDispositivo))],
    })
    emit('created', nueva)
    emit('close')
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error?.description ?? 'Error al crear la rutina'
  } finally {
    creando.value = false
  }
}
</script>

<style scoped>
.modal-title { font-size: 1.1rem; font-weight: 700; color: var(--text); }

.no-homes {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 14px; border-radius: 10px;
  background: var(--surface2); color: rgb(176, 3, 3);
  font-size: 0.95rem;
}

.steps {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 24px; padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.step { display: flex; align-items: center; gap: 6px; }
.step-num {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700;
  background: var(--surface2); color: var(--text-muted);
}
.step.active .step-num { background: var(--accent); color: white; }
.step.done .step-num { background: var(--success); color: white; }
.step-label { font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
.step.active .step-label { color: var(--accent); }
.step-line { flex: 1; height: 1px; background: var(--border); }

.field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.field-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }
.field-input {
  padding: 10px 14px; border-radius: 10px;
  border: 1.5px solid var(--border); background: var(--surface2);
  font-size: 1rem; font-family: inherit; color: var(--text); outline: none;
}
.field-input:focus { border-color: var(--accent); }
.field-input[type="time"] { color-scheme: light; color: var(--text); }

.icon-picker { display: flex; flex-wrap: wrap; gap: 8px; }
.icon-opt {
  width: 44px; height: 44px; border-radius: 10px;
  border: 1.5px solid var(--border); background: var(--surface2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text); transition: all 0.15s;
}
.icon-opt:hover { border-color: var(--accent); }
.icon-opt.selected { border-color: var(--accent); background: var(--accent-light); color: var(--accent); }

.presets { display: flex; flex-wrap: wrap; gap: 8px; }
.preset-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 20px;
  border: 1.5px solid var(--border); background: var(--surface2);
  font-size: 0.9rem; font-weight: 600; font-family: inherit;
  cursor: pointer; color: var(--text); transition: all 0.15s;
}
.preset-btn:hover { border-color: var(--accent); color: var(--accent); }
.preset-btn.selected { background: var(--accent-light); border-color: var(--accent); color: var(--accent); }
.preset-btn--sm { padding: 6px 12px; font-size: 0.85rem; }

.nueva-accion {
  padding: 14px; border-radius: 12px;
  border: 1.5px dashed var(--border); background: var(--surface2);
}

.loading-text { font-size: 0.85rem; color: var(--text-muted); }

.acciones-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.accion-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; border-radius: 10px;
  background: var(--accent-light); border: 1.5px solid var(--accent);
  color: var(--accent); font-size: 0.9rem; font-weight: 600;
}
.accion-chip-action { margin-left: auto; font-size: 0.8rem; opacity: 0.8; }
.accion-chip-remove {
  background: none; border: none; cursor: pointer;
  color: var(--accent); display: flex; align-items: center; padding: 0;
}

.btn-agregar {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 20px;
  border: 1.5px solid var(--accent); background: transparent;
  color: var(--accent); font-size: 0.9rem; font-weight: 600;
  font-family: inherit; cursor: pointer; transition: all 0.15s;
}
.btn-agregar:hover { background: var(--accent-light); }

.auth-error { color: var(--danger); font-size: 0.9rem; margin-top: -8px; }

.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border);
}
.btn-primary {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 20px; border-radius: 10px;
  border: none; background: var(--accent); color: white;
  font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer;
}
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-secondary {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 20px; border-radius: 10px;
  border: 1.5px solid var(--border); background: var(--surface2);
  font-size: 1rem; font-weight: 600; font-family: inherit; cursor: pointer; color: var(--text);
}
</style>
