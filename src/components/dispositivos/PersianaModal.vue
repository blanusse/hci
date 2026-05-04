<template>
   <DeviceModal @close="$emit('close')">
      <template #header>
         <div class="dev-icon" :class="iconClass">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['blinds']"></svg>
         </div>
         <div>
            <div class="dev-name">{{ device.name }}</div>
            <div class="dev-status">{{ estadoTexto }}</div>
         </div>
      </template>

      <div class="blind-preview" :class="iconClass">
         <div class="blind-rail"></div>
         <div class="blind-window">
            <div class="blind-cover" :style="{ height: `${100 - position}%` }"></div>
         </div>
         <div class="blind-meta">
            <span class="blind-value">{{ position }}%</span>
         </div>
      </div>

      <div class="ctrl-row">
         <button class="ctrl-btn" :class="{ active: position === 0 }" :disabled="cargando" @click="changeLevel(0); position=0">
            Cerrar
         </button>
         <button class="ctrl-btn" :class="{ active: position === 100 }" :disabled="cargando" @click="changeLevel(100); position=100">
            Abrir
         </button>
      </div>

      <div class="section-label">Posición</div>
      <div class="slider-row">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="deviceIcons['blinds']"></svg>
         <input
            v-model="position"
            type="range"
            min="0"
            max="100"
            class="slider"
            :disabled="cargando"
            @change="changeLevel(position)"
         />
         <span class="slider-val">{{ position }}%</span>
      </div>
   </DeviceModal>
</template>



<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { deviceIcons } from '@/utils/deviceIcons'
import {manipulateDevice, getDeviceState } from '@/services/deviceService'
import DeviceModal from '@/components/Modales/DeviceModal.vue';

const props = defineProps<{
   device: any
}>()


onMounted(async () => {
   try {
      const s = await getDeviceState(props.device.id)
      if (s) {
         position.value = s.currentLevel ?? s.level ?? s.position ?? position.value
      }
   } catch {}
})
async function changeLevel(newLevel:number) {
   if(newLevel==0){
      await manipulateDevice(props.device.id, 'down')
   }
   else if(newLevel==100){
      await manipulateDevice(props.device.id, 'up')
   }
   await manipulateDevice(props.device.id, 'setLevel', [Math.round(newLevel)])
}


const emit = defineEmits(['close', 'update:state'])

const cargando = ref(false)
const position = ref<number>(props.device.state?.currentLevel ?? props.device.state?.level ?? props.device.level ?? 0)

const estadoTexto = computed(() => {
   if (position.value <= 0)   return 'Cerrada'
   if (position.value >= 100) return 'Abierta'
   return `${position.value}% abierta`
})

const iconClass = computed(() => {
   if (position.value <= 0)   return 'closed'
   if (position.value >= 100) return 'open'
   return 'moving'
})





function normalizarEstado(rawStatus: string | undefined, currentPosition: number) {
   const status = String(rawStatus ?? '').toLowerCase()

   if (['opened', 'open', 'abierta'].includes(status)) return 'opened'
   if (['opening', 'abriéndose', 'abriendo'].includes(status)) return 'opening'
   if (['closed', 'close', 'cerrada'].includes(status)) return 'closed'
   if (['closing', 'cerrándose', 'cerrando'].includes(status)) return 'closing'

   if (currentPosition <= 0) return 'closed'
   if (currentPosition >= 100) return 'opened'
   return 'opening'
}




</script>

<style scoped>
.blind-preview {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 12px;
   margin: 0 auto 20px;
   padding: 18px;
   border-radius: 18px;
   border: 2px solid var(--border);
   transition: all 0.2s ease;
}

.blind-preview.open {
   background: linear-gradient(180deg, var(--color-sky-light), var(--surface));
}

.blind-preview.closed {
   background: linear-gradient(180deg, var(--surface2), var(--surface));
}

.blind-preview.moving {
   background: linear-gradient(180deg, var(--accent-light), var(--surface));
}

.blind-rail {
   width: 112px;
   height: 8px;
   border-radius: 999px;
   background: var(--text);
   opacity: 0.22;
}

.blind-window {
   position: relative;
   width: 112px;
   height: 120px;
   border-radius: 14px;
   border: 2px solid var(--border);
   background:
      linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05)),
      linear-gradient(180deg, #dbeafe, var(--surface2));
   overflow: hidden;
}

.blind-cover {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   background:
      repeating-linear-gradient(
         180deg,
         color-mix(in srgb, var(--accent) 12%, var(--surface)) 0px,
         color-mix(in srgb, var(--accent) 12%, var(--surface)) 12px,
         color-mix(in srgb, var(--accent) 26%, var(--surface)) 12px,
         color-mix(in srgb, var(--accent) 26%, var(--surface)) 24px
      );
   border-top: 1px solid rgba(0, 0, 0, 0.08);
   transition: height 0.2s ease;
}

.blind-meta {
   display: flex;
   align-items: center;
   justify-content: center;
}

.blind-value {
   font-size: 1rem;
   font-weight: 700;
   color: var(--text);
}

.dev-icon {
   width: 40px;
   height: 40px;
   border-radius: 10px;
   display: flex;
   align-items: center;
   justify-content: center;
   flex-shrink: 0;
}

.dev-icon.open {
   background: var(--color-sky-light);
   color: var(--color-sky);
}

.dev-icon.closed {
   background: var(--surface2);
   color: var(--text-muted);
}

.dev-icon.moving {
   background: var(--accent-light);
   color: var(--accent);
}

.dev-name { font-size: 1.1rem; font-weight: 700; color: var(--text); }
.dev-status { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }

.ctrl-row {
   display: flex;
   gap: 10px;
   margin-bottom: 20px;
}

.ctrl-btn {
   flex: 1;
   padding: 10px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   color: var(--text-muted);
   font-size: 0.95rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   transition: all 0.15s;
}

.ctrl-btn.active {
   background: var(--accent);
   color: white;
   border-color: var(--accent);
}

.ctrl-btn:hover:not(.active) {
   border-color: var(--accent);
   color: var(--accent);
}

.section-label {
   font-size: 0.82rem;
   font-weight: 700;
   text-transform: uppercase;
   letter-spacing: 0.06em;
   color: var(--text-muted);
   margin-bottom: 10px;
}

.slider-row {
   display: flex;
   align-items: center;
   gap: 10px;
   margin-bottom: 20px;
   color: var(--text-muted);
}

.slider {
   flex: 1;
   accent-color: var(--accent);
   cursor: pointer;
}

.slider:disabled { opacity: 0.4; cursor: not-allowed; }

.slider-val {
   font-size: 0.9rem;
   font-weight: 600;
   color: var(--text);
   min-width: 36px;
   text-align: right;
}
</style>
