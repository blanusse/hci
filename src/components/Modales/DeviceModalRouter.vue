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
import AlarmaModal from '@/components/Dispositivos/AlarmaModal.vue'
import PuertaModal from '@/components/Dispositivos/PuertaModal.vue'

defineProps<{ device: any }>()
defineEmits(['close', 'update:state'])

const modalesPorTipo: Record<string, any> = {
   lamp: LamparaModal,
   alarm: AlarmaModal,
   door: PuertaModal,
}
</script>
