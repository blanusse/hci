<template>
   <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal">
         <div class="modal-header">
            <slot name="header" />
            <button class="modal-close" @click="$emit('close')">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
               </svg>
            </button>
         </div>
         <div class="modal-body">
            <slot />
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
   position: fixed;
   inset: 0;
   background: rgba(0, 0, 0, 0.4);
   backdrop-filter: blur(4px);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1000;
}

.modal {
   background: white;
   border-radius: 20px;
   width: 90%;
   max-width: 500px;
   max-height: 90vh;
   overflow-y: auto;
   padding: 24px;
}

.modal-header {
   display: flex;
   align-items: center;
   gap: 12px;
   margin-bottom: 20px;
   padding-bottom: 16px;
   border-bottom: 1px solid var(--border);
}

.modal-close {
   margin-left: auto;
   width: 32px;
   height: 32px;
   border-radius: 50%;
   border: none;
   background: var(--surface2);
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
   color: var(--text-muted);
   transition: background 0.15s;
}

.modal-close:hover {
   background: var(--border);
}
</style>
