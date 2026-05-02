<template>
   <div class="panel-overlay" @click.self="$emit('close')">
      <div class="panel">

         <div class="panel-header">
            <div class="panel-title">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
               </svg>
               Mi perfil
            </div>
            <button class="panel-close" @click="$emit('close')">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
               </svg>
            </button>
         </div>

         <div class="panel-body">

            <!-- Avatar + info -->
            <div class="perfil-hero">
               <div class="perfil-avatar">
                  {{ initials }}
               </div>
               <div class="perfil-info">
                  <div class="perfil-name">{{ user?.name ?? '—' }}</div>
                  <div class="perfil-email">{{ user?.email ?? '—' }}</div>
               </div>
            </div>

            <!-- Datos -->
            <div class="perfil-section">
               <div class="perfil-section-label">Información</div>
               <div class="perfil-field">
                  <span class="perfil-field-label">Nombre</span>
                  <span class="perfil-field-value">{{ user?.name ?? '—' }}</span>
               </div>
               <div class="perfil-field">
                  <span class="perfil-field-label">Email</span>
                  <span class="perfil-field-value">{{ user?.email ?? '—' }}</span>
               </div>
            </div>

            <!-- Cambiar contraseña -->
            <div class="perfil-section">
               <div class="perfil-section-label">Cambiar contraseña</div>

               <div class="perfil-form">
                  <div class="form-field">
                     <div class="input-wrap">
                        <input
                           :type="showCurrent ? 'text' : 'password'"
                           v-model="currentPassword"
                           class="form-input"
                           placeholder="Contraseña actual"
                           autocomplete="current-password"
                        />
                        <button class="eye-btn" type="button" @click="showCurrent = !showCurrent">
                           <svg v-if="!showCurrent" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                           </svg>
                           <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                           </svg>
                        </button>
                     </div>
                  </div>

                  <div class="form-field">
                     <div class="input-wrap">
                        <input
                           :type="showNew ? 'text' : 'password'"
                           v-model="newPassword"
                           class="form-input"
                           placeholder="Nueva contraseña"
                           autocomplete="new-password"
                        />
                        <button class="eye-btn" type="button" @click="showNew = !showNew">
                           <svg v-if="!showNew" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                           </svg>
                           <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                           </svg>
                        </button>
                     </div>
                  </div>

                  <div class="form-field">
                     <div class="input-wrap">
                        <input
                           :type="showConfirm ? 'text' : 'password'"
                           v-model="confirmPassword"
                           class="form-input"
                           :class="{ 'input-error': confirmPassword && newPassword !== confirmPassword }"
                           placeholder="Confirmar contraseña"
                           autocomplete="new-password"
                        />
                        <button class="eye-btn" type="button" @click="showConfirm = !showConfirm">
                           <svg v-if="!showConfirm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                           </svg>
                           <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                           </svg>
                        </button>
                     </div>
                     <span v-if="confirmPassword && newPassword !== confirmPassword" class="field-error">
                        Las contraseñas no coinciden
                     </span>
                  </div>

                  <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>
                  <p v-if="passwordSuccess" class="form-success">Contraseña actualizada correctamente.</p>

                  <button
                     class="btn-save"
                     :disabled="!canSave || saving"
                     @click="cambiarPassword"
                  >
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                     </svg>
                     {{ saving ? 'Guardando…' : 'Guardar contraseña' }}
                  </button>
               </div>
            </div>

            <!-- Cerrar sesión -->
            <button class="btn-logout" @click="cerrarSesion">
               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
               </svg>
               Cerrar sesión
            </button>

         </div>

      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo, changePassword, logOutUser } from '@/services/userService'
import { useAuthStore } from '@/stores/auth'



const user = ref<any>(null)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const saving = ref(false)
const passwordSuccess = ref(false)

const errorMsg = ref('')

const initials = computed(() => {
   if (!user.value?.name) return '?'
   return user.value.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
})

const canSave = computed(() =>
   currentPassword.value.trim() &&
   newPassword.value.trim() &&
   newPassword.value === confirmPassword.value
)

onMounted(async () => {
   user.value = await getUserInfo()
})

const router = useRouter()
const authStore = useAuthStore()

const emit = defineEmits(['close'])

function cerrarSesion() {
   logOutUser()
   authStore.setToken('')
   emit('close')
   router.replace('/')
}

async function cambiarPassword() {
   saving.value = true
   errorMsg.value = ''
   passwordSuccess.value = false
   try {
      await changePassword(currentPassword.value, newPassword.value)
      passwordSuccess.value = true
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
   } catch(e: any) {
      errorMsg.value = e.response?.data?.error?.description ?? 'Error al cambiar la contraseña'
   } finally {
      saving.value = false
   }
}
</script>

<style scoped>
.panel-overlay {
   position: fixed;
   inset: 0;
   background: rgba(0,0,0,0.3);
   backdrop-filter: blur(2px);
   z-index: 200;
   display: flex;
   justify-content: flex-end;
}

.panel {
   width: clamp(300px, 33vw, 500px);
   height: 100%;
   background: var(--surface);
   display: flex;
   flex-direction: column;
   box-shadow: -4px 0 24px rgba(0,0,0,0.12);
   animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
   from { transform: translateX(100%); }
   to   { transform: translateX(0); }
}

.panel-header {
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 20px 20px 16px;
   border-bottom: 1px solid var(--border);
   flex-shrink: 0;
}

.panel-title {
   display: flex;
   align-items: center;
   gap: 10px;
   font-size: 1.1rem;
   font-weight: 700;
   color: var(--text);
}

.panel-close {
   width: 32px; height: 32px;
   border-radius: 50%;
   border: none;
   background: var(--surface2);
   cursor: pointer;
   display: flex; align-items: center; justify-content: center;
   color: var(--text-muted);
   transition: background 0.15s;
}
.panel-close:hover { background: var(--border); }

.panel-body {
   flex: 1;
   overflow-y: auto;
   padding: 20px;
   display: flex;
   flex-direction: column;
   gap: 24px;
}

/* Hero */
.perfil-hero {
   display: flex;
   align-items: center;
   gap: 16px;
   padding: 16px;
   background: var(--accent-light);
   border-radius: 16px;
   border: 1px solid rgba(99,102,241,0.2);
}

.perfil-avatar {
   width: 56px; height: 56px;
   border-radius: 50%;
   background: var(--accent);
   color: #fff;
   font-size: 1.3rem;
   font-weight: 800;
   display: flex; align-items: center; justify-content: center;
   flex-shrink: 0;
   letter-spacing: -0.5px;
}

.perfil-info { min-width: 0; }

.perfil-name {
   font-size: 1rem;
   font-weight: 700;
   color: var(--text);
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}

.perfil-email {
   font-size: 0.82rem;
   color: var(--text-muted);
   margin-top: 2px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}

/* Sections */
.perfil-section { display: flex; flex-direction: column; gap: 10px; }

.perfil-section-label {
   font-size: 0.9rem;
   font-weight: 700;
   color: var(--text-muted);
   text-transform: uppercase;
   letter-spacing: 0.07em;
}

.perfil-field {
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 10px 14px;
   background: var(--surface2);
   border-radius: 10px;
   gap: 12px;
}

.perfil-field-label {
   font-size: 0.82rem;
   color: var(--text-muted);
   font-weight: 600;
   flex-shrink: 0;
}

.perfil-field-value {
   font-size: 0.88rem;
   color: var(--text);
   font-weight: 600;
   text-align: right;
   min-width: 0;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
}

/* Form */
.perfil-form { display: flex; flex-direction: column; gap: 12px; }

.form-field { display: flex; flex-direction: column; gap: 5px; }

.form-label {
   font-size: 0.75rem;
   font-weight: 700;
   color: var(--text-muted);
   text-transform: uppercase;
   letter-spacing: 0.06em;
}

.input-wrap { position: relative; }

.form-input {
   width: 100%;
   padding: 10px 38px 10px 12px;
   border-radius: 10px;
   border: 1.5px solid var(--border);
   background: var(--surface);
   color: var(--text);
   font-size: 0.9rem;
   font-family: inherit;
   outline: none;
   transition: border-color 0.15s;
   box-sizing: border-box;
}
.form-input:focus { border-color: var(--accent); }
.form-input.input-error { border-color: var(--color-red); }

.eye-btn {
   position: absolute;
   right: 10px; top: 50%;
   transform: translateY(-50%);
   background: none; border: none;
   cursor: pointer;
   color: var(--text-muted);
   display: flex; align-items: center; justify-content: center;
   padding: 2px;
}
.eye-btn:hover { color: var(--text); }

.field-error {
   font-size: 0.75rem;
   color: var(--color-red);
   font-weight: 500;
}

.form-error {
   font-size: 0.8rem;
   color: var(--color-red);
   background: var(--danger-light);
   border-radius: 8px;
   padding: 8px 12px;
   margin: 0;
}

.form-success {
   font-size: 0.8rem;
   color: var(--success);
   background: var(--success-light);
   border-radius: 8px;
   padding: 8px 12px;
   margin: 0;
}

.btn-save {
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 8px;
   padding: 11px;
   background: var(--accent);
   color: #fff;
   border: none;
   border-radius: 10px;
   font-size: 0.9rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   transition: opacity 0.15s;
   margin-top: 4px;
}
.btn-save:hover:not(:disabled) { opacity: 0.88; }
.btn-save:disabled { opacity: 0.45; cursor: not-allowed; }

.btn-logout {
   display: flex;
   align-items: center;
   gap: 8px;
   padding: 11px 14px;
   background: var(--danger-light);
   color: var(--danger);
   border: 1px solid transparent;
   border-radius: 10px;
   font-size: 0.9rem;
   font-weight: 600;
   font-family: inherit;
   cursor: pointer;
   transition: background 0.15s, border-color 0.15s;
   width: 100%;
   justify-content: center;
}
.btn-logout:hover { border-color: var(--danger); }
</style>
