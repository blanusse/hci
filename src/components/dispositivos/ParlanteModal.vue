<template>
   <DeviceModal @close="$emit('close')">
      <template #header>
         <div class="dev-icon" :class="estado">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['speaker']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ estadoLabel }}</div>
         </div>
      </template>

      <!-- Preview -->
      <div class="speaker-preview" :class="estado">
         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="deviceIcons['speaker']" style="flex-shrink:0"></svg>
         <div class="preview-song">
            <div class="song-name">{{ cancion || (estado === 'stopped' ? 'Detenido' : 'Sin información') }}</div>
            <div class="song-artist" v-if="artista">{{ artista }}</div>
            <div class="song-meta">
               <span class="song-genre">{{ generoActual || '—' }}</span>
               <span class="song-time" v-if="timestamp">· {{ timestamp }}</span>
            </div>
         </div>
      </div>

      <!-- Controles de reproducción -->
      <div class="ctrl-playback">
         <button class="playback-btn" @click="anteriorCancion" title="Anterior">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
               <polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
         </button>

         <button class="playback-btn play-btn" @click="togglePlay" :class="{ active: estado === 'playing' }">
            <!-- Play -->
            <svg v-if="estado !== 'playing'" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
               <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <!-- Pause -->
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
               <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
         </button>

         <button class="playback-btn" @click="siguienteCancion" title="Siguiente">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
               <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
         </button>

         <button class="playback-btn stop-btn" @click="detener" title="Detener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
               <rect x="4" y="4" width="16" height="16" rx="2"/>
            </svg>
         </button>
      </div>

      <!-- Volumen -->
      <div class="section-label">Volumen</div>
      <div class="vol-row">
         <button class="vol-btn" @click="bajarVolumen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="15" y1="12" x2="19" y2="12"/>
            </svg>
         </button>
         <input type="range" min="0" max="10" step="1" v-model.number="volumen" class="slider" @change="onVolumenChange" />
         <button class="vol-btn" @click="subirVolumen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
         </button>
         <span class="vol-val">{{ volumen }}/10</span>
      </div>

      <!-- Género -->
      <div class="section-label">Género</div>
      <div class="generos">
         <button
            v-for="g in generos"
            :key="g.value"
            class="genre-chip"
            :class="{ active: generoActual === g.value }"
            @click="cambiarGenero(g.value)"
         >{{ g.label }}</button>
      </div>

   </DeviceModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DeviceModal from '@/components/Modales/DeviceModal.vue'
import { deviceIcons } from '@/utils/deviceIcons'
import { manipulateDevice, getDevice } from '@/services/deviceService'

const props = defineProps<{ device: any }>()
const emit = defineEmits(['close', 'update:state'])

// estado: 'playing' | 'paused' | 'stopped'
const estado = ref<string>(props.device.state?.status ?? 'stopped')
const volumen = ref<number>(props.device.state?.volume ?? 5)
const generoActual = ref<string>(props.device.state?.genre ?? '')
const cancion = ref<string>('')
const artista = ref<string>('')
const timestamp = ref<string>('')

const estadoLabel = computed(() => {
   if (estado.value === 'playing') return 'Reproduciendo'
   if (estado.value === 'paused')  return 'Pausado'
   return 'Detenido'
})

onMounted(async () => {
   try {
      const d = await getDevice(props.device.id)
      if (d?.state) {
         estado.value       = d.state.status ?? estado.value
         generoActual.value = d.state.genre  ?? generoActual.value
         const raw = d.state.volume
         if (raw !== undefined) volumen.value = raw > 10 ? Math.round(raw / 10) : raw
         actualizarSong(d.state)
      }
   } catch {}
})

function actualizarSong(state: any) {
   // La API puede devolver song como objeto o como string plano
   if (state.song && typeof state.song === 'object') {
      cancion.value   = state.song.title   ?? state.song.name ?? ''
      artista.value   = state.song.artist  ?? ''
      timestamp.value = state.song.progress ?? state.song.timestamp ?? ''
   } else {
      cancion.value   = state.song    ?? ''
      artista.value   = state.artist  ?? ''
      timestamp.value = state.timestamp ?? ''
   }
}

const generos = [
   { label: 'Clásica',  value: 'clasica'  },
   { label: 'Country',  value: 'country'  },
   { label: 'Dance',    value: 'dance'    },
   { label: 'Latina',   value: 'latina'   },
   { label: 'Pop',      value: 'pop'      },
   { label: 'Rock',     value: 'rock'     },
]


function togglePlay() {
   if (estado.value === 'playing') {
      pausar()
   } else if (estado.value === 'paused') {
      reanudar()
   } else {
      reproducir()
   }
}

async function reproducir() {
   await manipulateDevice(props.device.id, 'play', [])
   estado.value = 'playing'
   emit('update:state', 'playing')
}

async function pausar() {
   await manipulateDevice(props.device.id, 'pause', [])
   estado.value = 'paused'
   emit('update:state', 'paused')
}

async function reanudar() {
   await manipulateDevice(props.device.id, 'resume', [])
   estado.value = 'playing'
   emit('update:state', 'playing')
}

async function detener() {
   await manipulateDevice(props.device.id, 'stop', [])
   estado.value = 'stopped'
   emit('update:state', 'stopped')
}

async function siguienteCancion() {
   const r = await manipulateDevice(props.device.id, 'nextSong', [])
   if (r) actualizarSong(r)
}

async function anteriorCancion() {
   const r = await manipulateDevice(props.device.id, 'previousSong', [])
   if (r) actualizarSong(r)
}

async function subirVolumen() {
   if (volumen.value >= 10) return
   await manipulateDevice(props.device.id, 'setVolume', [++volumen.value])
}

async function bajarVolumen() {
   if (volumen.value <= 0) return
   await manipulateDevice(props.device.id, 'setVolume', [--volumen.value])
}

async function onVolumenChange() {
   await manipulateDevice(props.device.id, 'setVolume', [volumen.value])
}

async function cambiarGenero(genero: string) {
   await manipulateDevice(props.device.id, 'setGenre', [genero])
   generoActual.value = genero
}
</script>

<style scoped>
.dev-icon {
   width: 40px; height: 40px;
   border-radius: 10px;
   display: flex; align-items: center; justify-content: center;
   flex-shrink: 0;
}
.dev-icon.playing { background: var(--color-sky-light); color: var(--color-sky); }
.dev-icon.paused  { background: rgba(245,158,11,0.12);  color: #F59E0B; }
.dev-icon.stopped { background: var(--surface2); color: var(--text-muted); }

.dev-name   { font-size: 1.1rem; font-weight: 700; color: var(--text); }
.dev-status { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }

/* Preview */
.speaker-preview {
   display: flex;
   align-items: center;
   gap: 16px;
   padding: 16px 20px;
   border-radius: 14px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   margin-bottom: 20px;
   transition: background 0.3s, border-color 0.3s;
}
.speaker-preview.playing {
   background: var(--color-sky-light);
   border-color: var(--color-sky);
   color: var(--color-sky);
}
.speaker-preview.paused {
   background: rgba(245,158,11,0.08);
   border-color: rgba(245,158,11,0.3);
   color: #F59E0B;
}
.speaker-preview.stopped { color: var(--text-muted); }

.preview-song { flex: 1; min-width: 0; }
.song-name {
   font-size: 0.95rem;
   font-weight: 700;
   color: var(--text);
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}
.song-artist {
   font-size: 0.82rem;
   color: var(--text-muted);
   margin-top: 2px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}
.song-meta {
   display: flex;
   gap: 6px;
   align-items: center;
   margin-top: 4px;
}
.song-genre {
   font-size: 0.75rem;
   color: var(--text-muted);
   text-transform: capitalize;
   background: rgba(0,0,0,0.06);
   padding: 1px 7px;
   border-radius: 20px;
}
.song-time {
   font-size: 0.75rem;
   color: var(--text-muted);
}

/* Playback controls */
.ctrl-playback {
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 12px;
   margin-bottom: 24px;
}

.playback-btn {
   width: 44px; height: 44px;
   border-radius: 50%;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text-muted);
   cursor: pointer;
   display: flex; align-items: center; justify-content: center;
   transition: all 0.15s;
}
.playback-btn:hover { border-color: var(--accent); color: var(--accent); }

.play-btn {
   width: 54px; height: 54px;
   background: var(--accent);
   border-color: var(--accent);
   color: white;
}
.play-btn:hover { background: var(--accent-hover, var(--accent)); opacity: 0.9; color: white; }

.stop-btn:hover { border-color: var(--color-red); color: var(--color-red); }

/* Volumen */
.section-label {
   font-size: 0.82rem;
   font-weight: 700;
   text-transform: uppercase;
   letter-spacing: 0.06em;
   color: var(--text-muted);
   margin-bottom: 10px;
}

.vol-row {
   display: flex;
   align-items: center;
   gap: 10px;
   margin-bottom: 20px;
   color: var(--text-muted);
}

.vol-btn {
   width: 32px; height: 32px;
   border-radius: 8px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text-muted);
   cursor: pointer;
   display: flex; align-items: center; justify-content: center;
   flex-shrink: 0;
   transition: all 0.15s;
}
.vol-btn:hover { border-color: var(--accent); color: var(--accent); }

.slider {
   flex: 1;
   accent-color: var(--accent);
   cursor: pointer;
}

.vol-val {
   font-size: 0.9rem;
   font-weight: 600;
   color: var(--text);
   min-width: 36px;
   text-align: right;
}

/* Géneros */
.generos {
   display: flex;
   flex-wrap: wrap;
   gap: 8px;
}

.genre-chip {
   padding: 7px 14px;
   border-radius: 20px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text-muted);
   font-size: 0.85rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   transition: all 0.15s;
}
.genre-chip:hover  { border-color: var(--accent); color: var(--accent); }
.genre-chip.active { background: var(--accent); border-color: var(--accent); color: white; }
</style>
