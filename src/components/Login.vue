<template>
   <div class="auth-page">

      <!-- Panel izquierdo: marca -->
      <div class="auth-brand">
         <div class="auth-brand-inner">
            <div class="auth-brand-logo">
               <span class="app-logo-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                     <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                     <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                  </svg>
               </span>
               <span class="auth-brand-name">SmartHome</span>
            </div>

            <h1 class="auth-brand-title">Tu hogar inteligente,<br>en tus manos</h1>
            <p class="auth-brand-sub">Controlá todos tus dispositivos, automatizaciones y rutinas desde un solo lugar.</p>

            <div class="auth-brand-features">
               <div class="auth-feature">
                  <div class="auth-feature-icon">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 20v2"/><path d="M12 2v2"/><path d="M17 20v2"/><path d="M17 2v2"/>
                        <path d="M2 12h2"/><path d="M2 17h2"/><path d="M2 7h2"/><path d="M20 12h2"/>
                        <path d="M20 17h2"/><path d="M20 7h2"/><path d="M7 20v2"/><path d="M7 2v2"/>
                        <rect x="4" y="4" width="16" height="16" rx="2"/>
                        <rect x="8" y="8" width="8" height="8" rx="1"/>
                     </svg>
                  </div>
                  <span>Control de dispositivos en tiempo real</span>
               </div>

               <div class="auth-feature">
                  <div class="auth-feature-icon">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                     </svg>
                  </div>
                  <span>Rutinas y automatizaciones programadas</span>
               </div>

               <div class="auth-feature">
                  <div class="auth-feature-icon">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
                     </svg>
                  </div>
                  <span>Monitoreo de consumo energético</span>
               </div>

               <div class="auth-feature">
                  <div class="auth-feature-icon">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                        <path d="m9 12 2 2 4-4"/>
                     </svg>
                  </div>
                  <span>Gestión de permisos y accesos</span>
               </div>
            </div>

         </div>
         </div>
      <!-- Panel derecho: formulario -->
      <div v-if="vista =='login'" class="auth-form-panel">
         <div class="auth-form-wrap">

            <div class="auth-form-header">
               <h2 class="auth-form-title">Bienvenido de vuelta</h2>
               <p class="auth-form-sub">Ingresá tus credenciales para continuar</p>
            </div>

            <!-- Email -->
            <div class="auth-field">
               <label class="auth-label">Correo electrónico</label>
               <div class="auth-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                     <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
                     <rect x="2" y="4" width="20" height="16" rx="2"/>
                  </svg>
                  <input class="auth-input" type="email" placeholder="tu@correo.com" v-model="email" />
               </div>
            </div>

            <!-- Contraseña -->
            <div class="auth-field">
               <label class="auth-label">Contraseña</label>
               <div class="auth-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                     <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                     <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input class="auth-input" :type="mostrarPassword ? 'text' : 'password'" placeholder="Tu contraseña" v-model="password" />
                  <button class="auth-eye-btn" type="button" @click="mostrarPassword = !mostrarPassword">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="mostrarPassword ? eyeOpen : eyeClosed"></svg>
                  </button>
               </div>
               <div class="auth-field-foot">
                  <button class="auth-link-btn" type="button" @click="vista='recuperacion'">¿Olvidaste tu contraseña?</button>
               </div>
            </div>

            <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>

            <button class="auth-btn-primary" @click="iniciarSesion" :disabled="cargando">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m10 17 5-5-5-5"/>
                  <path d="M15 12H3"/>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
               </svg>
               {{ cargando ? 'Ingresando...' : 'Iniciar sesión' }}
            </button>

            <div class="auth-divider">
               <span>¿No tenés cuenta?</span>
            </div>

            <button class="auth-btn-secondary" @click="vista='registro' ;password='';email=''">
               Crear cuenta nueva
            </button>

         </div>
      </div>
      <div v-else-if="vista =='registro'" class="auth-form-panel">
         <div class="auth-form-wrap">

            <div class="auth-form-header">
               <h2 class="auth-form-title">Crear cuenta</h2>
               <p class="auth-form-sub">Completá tus datos para registrarte</p>
            </div>

            <!-- Nombre completo -->
            <div class="auth-field">
               <label class="auth-label">Nombre completo</label>
               <div class="auth-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                     <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                     <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input class="auth-input" type="text" placeholder="Tu nombre completo" v-model="name"/>
               </div>
            </div>

            <!-- Correo electrónico -->
            <div class="auth-field">
               <label class="auth-label">Correo electrónico</label>
               <div class="auth-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                     <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
                     <rect x="2" y="4" width="20" height="16" rx="2"/>
                  </svg>
                  <input class="auth-input" type="email" placeholder="tu@correo.com" v-model="email"/>
               </div>
            </div>

            <!-- Contraseña -->
            <div class="auth-field">
               <label class="auth-label">Contraseña</label>
               <div class="auth-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                     <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                     <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input class="auth-input" :type="mostrarPassword ? 'text' : 'password'" placeholder="Tu contraseña" v-model="password" />
                  <button class="auth-eye-btn" type="button" @click="mostrarPassword = !mostrarPassword">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="mostrarPassword ? eyeOpen : eyeClosed"></svg>
                  </button>
               </div>
            </div>

            <!-- Confirmar contraseña -->
            <div class="auth-field">
               <label class="auth-label">Confirmar contraseña</label>
               <div class="auth-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                     <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                     <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input class="auth-input" :type="mostrarPasswordRepeat ? 'text' : 'password'" placeholder="Tu contraseña" v-model="repeatPassword" />
                  <button class="auth-eye-btn" type="button" @click="mostrarPasswordRepeat = !mostrarPasswordRepeat">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="mostrarPasswordRepeat ? eyeOpen : eyeClosed"></svg>
                  </button>
               </div>
            </div>

            <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>


            <button class="auth-btn-primary" @click="registrarse">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" x2="19" y1="8" y2="14"/>
                  <line x1="22" x2="16" y1="11" y2="11"/>
               </svg>
               Crear cuenta
            </button>

            <div class="auth-divider">
               <span>¿Ya tenés cuenta?</span>
            </div>

            <button class="auth-btn-secondary" @click="vista = 'login'; password=''; email=''; repeatPassword=''; name=''">
               Iniciar sesión
            </button>

         </div>
      </div>
      <div v-else-if="vista == 'verificacion'" class="auth-form-panel">
         <div class="auth-form-wrap">

            <div class="auth-form-header">
               <div class="auth-verify-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                     <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/>
                     <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                     <path d="m16 19 2 2 4-4"/>
                  </svg>
               </div>
               <h2 class="auth-form-title">Verificá tu cuenta</h2>
               <p class="auth-form-sub">
                  Enviamos un código a<br>
                  <strong>{{ email }}</strong>
               </p>
            </div>

            <div class="auth-field">
               <label class="auth-label">Código de verificación</label>
               <input class="auth-input auth-code-input" type="text" placeholder="000000" v-model="inputCode"/>
            </div>

            <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>

            <button class="auth-btn-primary" @click="verifyCode()">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"/>
                  <path d="m9 11 3 3L22 4"/>
               </svg>
               Verificar cuenta
            </button>

            <div class="auth-resend">
               ¿No llegó el código?
               <button class="auth-link-btn" @click="registrarse">Reenviar código</button>
            </div>

            <button class="auth-btn-ghost" @click="vista='login'">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m12 19-7-7 7-7"/>
                  <path d="M19 12H5"/>
               </svg>
               Volver al inicio de sesión
            </button>

         </div>
      </div>
      <div v-else-if="vista == 'recuperacion'" class="auth-form-panel">
         <div class="auth-form-wrap">
            <div class="auth-form-header">
               <div class="auth-verify-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="key-round" aria-hidden="true" class="lucide lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></svg>
               </div>
               <h2 class="auth-form-title">Recuperar contraseña</h2>
               <p class="auth-form-sub">Ingresá tu correo y te enviaremos un código para restablecer tu contraseña.</p>
            </div>
            <div class="auth-field">
               <label class="auth-label">Correo electrónico</label>
               <div class="auth-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="mail" aria-hidden="true" class="lucide lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
                  <input class="auth-input" type="email" placeholder="tu@correo.com" v-model="email">
               </div>
            </div>
         <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>


            <button class="auth-btn-primary" @click="forgotPasswordLocal()">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="send" aria-hidden="true" class="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
                   Enviar código de recuperación
            </button>
            <button class="auth-btn-ghost" @click="vista='login'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="arrow-left" aria-hidden="true" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
                  Volver al inicio de sesión
            </button>
            </div>
      </div>
      <div v-else class="auth-form-panel">
            <div class="auth-form-wrap">
               <div class="auth-form-header">
                  <div class="auth-verify-icon">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="lock-keyhole" aria-hidden="true" class="lucide lucide-lock-keyhole"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>
                  </div>
                  <h2 class="auth-form-title">Nueva contraseña</h2>
                  <p class="auth-form-sub">Ingresá el código recibido y tu nueva contraseña.</p>
               </div>
               <div class="auth-field">
                  <label class="auth-label">Código de verificación</label>
                  <input class="auth-input auth-code-input" type="text" placeholder="000000" v-model="inputCode">
               </div>
               <div class="auth-field">
                  <label class="auth-label">Nueva contraseña</label>
                  <div class="auth-input-wrap">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="lock" aria-hidden="true" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                     </svg>
                     <input class="auth-input" :type="mostrarPassword ? 'text' : 'password'" placeholder="Mínimo 6 caracteres" v-model="password" />
                     <button class="auth-eye-btn" type="button" @click="mostrarPassword = !mostrarPassword">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="mostrarPassword ? eyeOpen : eyeClosed"></svg>
                     </button>
                  </div>
               </div>
               <div class="auth-field">
                  <label class="auth-label">Confirmar nueva contraseña</label>
                  <div class="auth-input-wrap">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="lock-keyhole" aria-hidden="true" class="lucide lucide-lock-keyhole"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>
                     <input class="auth-input" :type="mostrarPasswordRepeat ? 'text' : 'password'" placeholder="Repetí tu nueva contraseña" v-model="repeatPassword" />
                     <button class="auth-eye-btn" type="button" @click="mostrarPasswordRepeat = !mostrarPasswordRepeat">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="mostrarPasswordRepeat ? eyeOpen : eyeClosed"></svg>
                     </button>
                  </div>
               </div>

            <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>


               <button class="auth-btn-primary" @click="resetPasswordLocal()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="save" aria-hidden="true" class="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                  Restablecer contraseña
               </button>
               <button class="auth-btn-ghost" @click="vista='login'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="arrow-left" aria-hidden="true" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
                  Volver
               </button>
            </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { registerUser, sendVerification, logInUser, resetPassword, forgotPassword, veryAccount } from '@/services/userService'

const eyeOpen = `<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>`
const eyeClosed = `<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>`

const router = useRouter()
const vista=ref('login') //posibles valores: login, registro, verificacion, recuperacion, cambiarPswrd

const email = ref('')
const password = ref('')
const mostrarPassword = ref(false)
const cargando = ref(false)
const errorMsg = ref('')

const name = ref('')
const repeatPassword = ref('');
const mostrarPasswordRepeat = ref(false)

const auth = useAuthStore()

// const codigoVerif = ref('') sirve para guardar el codigo que se manda
const inputCode = ref('')

watch(vista, () => { //cada vez que cambie de vista se limpia el error
     errorMsg.value = ''
  })



//se fija si es valido el inicio de sesion
async function iniciarSesion() {
   errorMsg.value = ''
   cargando.value = true
   try {
      const data = await logInUser(email.value, password.value)
      if (data.error) {
         errorMsg.value = data.error.description
      } else {
         auth.setToken(data.token)
         router.push('/Dashboard')
      }
   } catch (e: any){
      errorMsg.value = e.response?.data?.error?.description ?? 'No se pudo conectar al servidor.'
   } finally {
      cargando.value = false
   }
}

async function registrarse(){
   if (password.value != repeatPassword.value){
     errorMsg.value = 'Las contraseñas deben coincidir'
     return
  }
   try {
      const data = await registerUser(email.value, password.value, name.value)

      if (data.error) {
         errorMsg.value = data.error.description
      } else {
         // registracion exitosa, hay que confirmar mail
         vista.value = 'verificacion'
         sendVerifMail();
      }
   } catch (e: any){
      errorMsg.value = e.response?.data?.error?.description ?? 'No se pudo conectar al servidor.'
   }
}

async function sendVerifMail(){
   try {
      const data = await sendVerification(email.value)
      if (data.error) errorMsg.value = data.error.description
   } catch (e: any){
      errorMsg.value = e.response?.data?.error?.description ?? 'No se pudo conectar al servidor.'
   }
}

async function verifyCode(){
   try {
      const data = await veryAccount(inputCode.value)
      if (data.error) {
         errorMsg.value = data.error.description
      } else {
         vista.value = 'login'
      }
   } catch (e: any){
      errorMsg.value = e.response?.data?.error?.description ?? 'No se pudo conectar al servidor.'
   }
}

async function forgotPasswordLocal(){
   try {
      const data = await forgotPassword(email.value)
      if (data.error) {
         errorMsg.value = data.error.description
      } else {
         password.value = ''
         vista.value = 'cambiarPswrd'
      }
   } catch (e: any){
      errorMsg.value = e.response?.data?.error?.description ?? 'No se pudo conectar al servidor.'
   }
}

async function resetPasswordLocal() {
   if (password.value != repeatPassword.value){
     errorMsg.value = 'Las contraseñas deben coincidir'
     return
   }
   try {
      const data = await resetPassword(inputCode.value, repeatPassword.value)

      if (data.error) {
         errorMsg.value = data.error.description
      } else {
         vista.value = 'login'
      }
   }
   catch (e: any){
      errorMsg.value = e.response?.data?.error?.description ?? 'No se pudo conectar al servidor.'
   }
}




</script>


<style scoped>

.auth-page {
    display: flex;
    min-height: 100vh;
}

/*panel izquierdo */


.auth-brand::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, .06);
    top: -80px;
    right: -80px;
    pointer-events: none;
}

.auth-brand::after {
    content: '';
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, .05);
    bottom: -40px;
    left: -60px;
    pointer-events: none;
}

.auth-brand {
   flex: 0 0 45%;
   background: linear-gradient(145deg, #0D1752 0%, var(--rut-btn-primary) 35%, var(--rut-btn-primary-hover) 65%, var(--color-indigo) 100%);
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 48px;
   position: relative;
   overflow: hidden;
}



.auth-brand-inner {
    position: relative;
    z-index: 1;
    max-width: 380px;
}

.auth-brand-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 40px;
}

.auth-brand-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--surface);
    line-height: 1.25;
    margin-bottom: 16px;
    letter-spacing: -.02em;
}
.auth-brand-sub {
    font-size: .95rem;
    color: var(--border);
    line-height: 1.6;
    margin-bottom: 40px;
}

.auth-brand-features {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.auth-brand-logo .app-logo-badge {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(255, 255, 255, .15);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.auth-brand-name {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--surface);
    letter-spacing: -.02em;
}

.auth-feature {
    display: flex;
    align-items: center;
    gap: 14px;
    color: rgba(255, 255, 255, .9);
    font-size: 1.125rem;
    font-weight: 500;
}

.auth-feature-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: var(--weather-color);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}



/*panel derecho */

.auth-form-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 32px;
    background: var(--background);
    overflow-y: auto;
}

.auth-form-wrap {
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 36px 32px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, .06);
}

.auth-form-header {
    margin-bottom: 6px;
}

.auth-form-title {
    font-size: 1.9rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -.02em;
    margin-bottom: 6px;
}

.auth-form-sub {
    font-size: 1.1rem;
    color: var(--text-muted);
    line-height: 1.55;
}


.auth-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.auth-label {
    font-size: 0.975rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: .06em;
}

.auth-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.auth-input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-size: 1.125rem;
    font-weight: 550;
    font-family: inherit;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
}

.auth-field-foot {
    display: flex;
    justify-content: flex-end;
}

.auth-link-btn {
    background: transparent;
    border: none;
    color: var(--color-indigo);
    font-size: 1.025rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    transition: color .15s;
}


.auth-input-wrap > i, .auth-input-wrap > svg {
    position: absolute;
    left: 14px;
    width: 16px;
    height: 16px;
    color: var(--text-muted);
    pointer-events: none;
    z-index: 1;
    flex-shrink: 0;
}

.auth-eye-btn {
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    transition: color .15s;
}


.auth-btn-primary {
    width: 100%;
    padding: 13px 20px;
    border-radius: 12px;
    border: none;
    background: var(--rut-btn-primary);
    color: var(--surface);
    font-size: 1.1rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 16px var(--box-shadow);
    transition: background .15s, box-shadow .15s, transform .1s;
}

.auth-btn-primary:hover {
    box-shadow: 0 4px 16px rgba(26, 35, 126, .90);
    background: rgba(61, 73, 198, 0.976)


}




.auth-btn-primary:disabled {
   opacity: 0.6;
   cursor: not-allowed;
}

.auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-muted);
    font-size: 1rem;
}

.auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
}

.auth-btn-secondary {
    width: 100%;
    padding: 12px 20px;
    border-radius: 12px;
    border: 1.5px solid var(--border);
    background: var(--surface2);
    color: var(--text);
    font-size: 1.1rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background .15s, border-color .15s;
}


.auth-code-input {
    padding-left: 14px;
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: .35em;
    text-align: center;
    font-family: 'SF Mono', 'Fira Code', monospace;
}

.auth-resend {
    text-align: center;
    font-size: 1rem;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.auth-btn-ghost {
    width: 100%;
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: color .15s, background .15s;
}
.auth-btn-ghost:hover {
    background-color: var(--bg);
}




.auth-verify-icon {
    width: 58px;
    height: 58px;
    border-radius: 16px;
    background: rgba(63, 81, 181, .1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

.auth-verify-icon i, .auth-verify-icon svg {
    width: 28px;
    height: 28px;
    color: var(--color-indigo);
}

</style>




