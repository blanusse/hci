<template>
   <DeviceModal @close="$emit('cancel')">
      <template #header>
         <slot name="header" />
      </template>

      <slot />

      <div class="modal-footer">
         <button class="btn-secondary" :disabled="saving" @click="$emit('cancel')">
            {{ cancelLabel }}
         </button>
         <button class="btn-primary" :disabled="saving || !dirty" @click="$emit('confirm')">
            {{ confirmLabel }}
         </button>
      </div>
   </DeviceModal>
</template>

<script setup lang="ts">
import DeviceModal from '@/components/Modales/DeviceModal.vue'

withDefaults(defineProps<{
   dirty: boolean
   saving?: boolean
   confirmLabel?: string
   cancelLabel?: string
}>(), {
   saving: false,
   confirmLabel: 'Aceptar',
   cancelLabel: 'Cancelar',
})

defineEmits(['cancel', 'confirm'])
</script>

<style scoped>
.modal-footer {
   display: flex;
   justify-content: flex-end;
   gap: 10px;
   margin-top: 24px;
   padding-top: 16px;
   border-top: 1px solid var(--border);
}

.btn-primary {
   padding: 10px 24px;
   border-radius: 10px;
   border: none;
   background: var(--accent);
   color: white;
   font-size: 1rem;
   font-weight: 700;
   font-family: inherit;
   cursor: pointer;
}

.btn-secondary {
   padding: 10px 24px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   font-size: 1rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   color: var(--text);
}

.btn-primary:disabled,
.btn-secondary:disabled {
   opacity: 0.4;
   cursor: not-allowed;
}
</style>
