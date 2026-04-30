<template>
   <DeviceModal @close="$emit('cancel')">

      <template #header>
         <span class="modal-title">{{ titulo }}</span>
      </template>

      <div class="confirm-body">
         <div class="trash-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M10 11v6"/><path d="M14 11v6"/>
               <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
               <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
         </div>
         <p class="confirm-title">¿Eliminar <strong>{{ nombre }}</strong>?</p>
         <p class="confirm-sub">{{ descripcion }}</p>
      </div>

      <p v-if="error" class="confirm-error">{{ error }}</p>

      <div class="confirm-footer">
         <button class="btn-cancel" @click="$emit('cancel')">Cancelar</button>
         <button class="btn-delete" @click="$emit('confirm')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M10 11v6"/><path d="M14 11v6"/>
               <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
               <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Eliminar
         </button>
      </div>

   </DeviceModal>
</template>

<script setup lang="ts">
import DeviceModal from './DeviceModal.vue'

withDefaults(defineProps<{
   nombre: string
   titulo?: string
   descripcion?: string
   error?: string
}>(), {
   titulo: 'Eliminar',
   descripcion: 'Esta acción no se puede deshacer.',
   error: '',
})
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-title { font-size: 1.1rem; font-weight: 700; color: var(--text); }

.confirm-body {
   display: flex;
   flex-direction: column;
   align-items: center;
   text-align: center;
   padding: 16px 0;
   gap: 12px;
}

.trash-icon {
   width: 64px;
   height: 64px;
   border-radius: 50%;
   background: rgba(220, 53, 69, 0.1);
   display: flex;
   align-items: center;
   justify-content: center;
   color: #DC3545;
}

.confirm-title {
   font-size: 1.2rem;
   color: var(--text);
   margin: 0;
}

.confirm-sub {
   font-size: 0.95rem;
   color: var(--text-muted);
   line-height: 1.5;
   margin: 0;
   max-width: 300px;
}

.confirm-footer {
   display: flex;
   justify-content: flex-end;
   gap: 10px;
   margin-top: 24px;
   padding-top: 16px;
   border-top: 1px solid var(--border);
}

.btn-cancel {
   padding: 10px 20px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface2);
   font-size: 1rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   color: var(--text);
}

.btn-delete {
   display: flex;
   align-items: center;
   gap: 6px;
   padding: 10px 20px;
   border-radius: 10px;
   border: none;
   background: #DC3545;
   color: white;
   font-size: 1rem;
   font-weight: 700;
   font-family: inherit;
   cursor: pointer;
}

.btn-delete:hover { background: #c82333; }

.confirm-error {
   color: #DC3545;
   font-size: 0.9rem;
   text-align: center;
   margin: 8px 0 0;
}
</style>
