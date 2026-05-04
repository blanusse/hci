<template>
   <component
      :is="modalComponent"
      v-if="modalComponent"
      :device="device"
      @close="$emit('close')"
      @update:state="$emit('update:state', $event)"
   />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LamparaModal from '@/components/dispositivos/LamparaModal.vue'
import AireModal from '@/components/dispositivos/AireModal.vue'
import ParlanteModal from '@/components/dispositivos/ParlanteModal.vue'
import GrifoModal from '@/components/dispositivos/GrifoModal.vue'
import HeladeraModal from '@/components/dispositivos/HeladeraModal.vue'
import HornoModal from '@/components/dispositivos/HornoModal.vue'
import PersianaModal from '@/components/dispositivos/PersianaModal.vue'

const props = defineProps<{ device: any }>()
defineEmits(['close', 'update:state'])

const modalesPorTipo: Record<string, any> = {
   lamp: LamparaModal,
   ac: AireModal,
   speaker: ParlanteModal,
   faucet: GrifoModal,
   refrigerator: HeladeraModal,
   oven: HornoModal,
   blinds: PersianaModal,
}

function normalizeDeviceType(typeName: string | undefined) {
   const normalized = (typeName ?? '').trim().toLowerCase()

   const aliases: Record<string, string> = {
      refrigerator: 'refrigerator',
      heladera: 'refrigerator',
      fridge: 'refrigerator',
      oven: 'oven',
      horno: 'oven',
      lamp: 'lamp',
      lampara: 'lamp',
      lámpara: 'lamp',
      ac: 'ac',
      speaker: 'speaker',
      parlante: 'speaker',
      faucet: 'faucet',
      grifo: 'faucet',
      blinds: 'blinds',
      persiana: 'blinds',
   }

   return aliases[normalized] ?? normalized
}

const modalComponent = computed(() => {
   const key = normalizeDeviceType(props.device?.type?.name)
   return modalesPorTipo[key]
})
</script>
