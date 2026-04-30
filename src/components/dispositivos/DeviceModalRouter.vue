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
import LamparaModal from './LamparaModal.vue'

defineProps<{ device: any }>()
defineEmits(['close', 'update:state'])

const modalesPorTipo: Record<string, any> = {
   lamp: LamparaModal,
}
</script>
