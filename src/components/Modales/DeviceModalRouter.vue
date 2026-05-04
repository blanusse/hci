<template>
   <component
      :is="modalesPorTipo[device.type?.name]"
      v-if="modalesPorTipo[device.type?.name]"
      :device="device"
      @close="$emit('close')"
      @update:state="$emit('update:state', $event)"
   />
</template>

<script setup lang="ts">
import LamparaModal from '@/components/dispositivos/LamparaModal.vue'
import AireModal from '@/components/dispositivos/AireModal.vue'
import ParlanteModal from '@/components/dispositivos/ParlanteModal.vue'
import GrifoModal from '@/components/dispositivos/GrifoModal.vue'
import HeladeraModal from '@/components/dispositivos/HeladeraModal.vue'
import PersianaModal from '@/components/dispositivos/PersianaModal.vue'

defineProps<{ device: any }>()
defineEmits(['close', 'update:state'])

const modalesPorTipo: Record<string, any> = {
   lamp: LamparaModal,
   ac: AireModal,
   speaker: ParlanteModal,
   faucet: GrifoModal,
   refrigerator: HeladeraModal,
   blinds: PersianaModal,
}
</script>
