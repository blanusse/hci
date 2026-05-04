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
import LamparaModal from '@/components/Dispositivos/LamparaModal.vue'
import AireModal from '@/components/Dispositivos/AireModal.vue'
import ParlanteModal from '@/components/Dispositivos/ParlanteModal.vue'
import GrifoModal from '@/components/Dispositivos/GrifoModal.vue'

defineProps<{ device: any }>()
defineEmits(['close', 'update:state'])

const modalesPorTipo: Record<string, any> = {
   lamp: LamparaModal,
   ac: AireModal,
   speaker: ParlanteModal,
   faucet: GrifoModal,
}
</script>
