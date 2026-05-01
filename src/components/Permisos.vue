<template>
  <div class="screen active page-content" > 
    <div class="sch-page-header">
      <div>
        <h2 class="header-title">Permisos</h2>
        <p class="perm-subtitle">
          Gestioná quién tiene acceso a cada hogar y qué puede controlar
        </p>
      </div>

    </div>

    <div class="energia-home-selector">
      <span class="energia-home-selector-label">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-lucide="house"
          aria-hidden="true"
          class="lucide lucide-house"
        >
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
        Hogar:
      </span>
      <div class="energia-home-selector-tabs">
        <button
          v-for="home in homes"
          :key="home.id"
          class="energia-home-btn"
          :class="{ active: selectedHome?.id === home.id }"
          @click="selectedHome = home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="lucide lucide-house">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          {{ home.name }}
        </button>
      </div>
    </div>

    <div class="perm-section-label">Propietario</div>

    <div class="perm-member-card perm-member-card--owner">
      <div class="perm-member-avatar perm-avatar--owner">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-lucide="crown"
          aria-hidden="true"
          class="lucide lucide-crown"
        >
          <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
          <path d="M5 21h14"></path>
        </svg>
      </div>
      <div class="perm-member-info">
        <div class="perm-member-name">@usuario</div>
        <div class="perm-member-sub">Acceso completo · Propietario</div>
      </div>
      <span class="perm-role-badge perm-role-badge--owner">Propietario</span>
    </div>

    <!---->

    <div class="perm-section-label">Miembros con acceso</div>

    <div v-if="members.length === 0" class="perm-empty">
      <div class="perm-empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <circle cx="9" cy="7" r="4"></circle>
        </svg>
      </div>
      <p class="perm-empty-title">Sin miembros todavía</p>
      <p class="perm-empty-sub">Agregá usuarios para compartir este hogar con tu familia.</p>
      <button class="btn btn-primary btn-add-member" @click="showModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" x2="19" y1="8" y2="14"></line>
          <line x1="22" x2="16" y1="11" y2="11"></line>
        </svg>
        Agregar miembro
      </button>
    </div>

    <div v-for="m in members" :key="m.id" class="perm-member-card">
      <div class="perm-member-avatar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div class="perm-member-info">
        <div class="perm-member-name">{{ m.name }}</div>
        <div class="perm-member-sub">{{ m.email }}</div>
      </div>
      <button class="perm-action-btn perm-action-btn--danger" @click="quitarMiembro(m.email)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <button v-if="members.length > 0" class="btn btn-primary btn-add-member" @click="showModal = true">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <line x1="19" x2="19" y1="8" y2="14"></line>
        <line x1="22" x2="16" y1="11" y2="11"></line>
      </svg>
      Agregar miembro
    </button>
  </div>

  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">Agregar miembro</span>
        <button class="modal-close-btn" @click="showModal = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-desc">
          Ingresá el email de la persona que querés invitar a <strong>{{ selectedHome?.name }}</strong>.
        </p>
        <div class="modal-field">
          <label class="modal-field-label">Email</label>
          <input class="modal-input" v-model="email" type="email" placeholder="usuario@ejemplo.com" autocomplete="off" />
        </div>
        <p v-if="inviteError" class="modal-error">{{ inviteError }}</p>
        <p v-if="inviteSuccess" class="modal-success">Invitación enviada correctamente.</p>
        <p class="modal-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          El usuario debe estar registrado en HomeSmart.
        </p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn--secondary" @click="closeModal">Cancelar</button>
        <button class="modal-btn modal-btn--primary" :disabled="!email.trim() || sending" @click="sendInvitation">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/></svg>
          {{ sending ? 'Enviando…' : 'Enviar invitación' }}
        </button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getHomes, shareHome, getHomeMembers, removeHomeMember } from '@/services/homeService'


interface Home { id: string; name: string }

const homes = ref<Home[]>([])
const selectedHome = ref<Home | null>(null)

const showModal = ref(false)
const email = ref('')
const sending = ref(false)
const inviteError = ref('')
const inviteSuccess = ref(false)

const members = ref<any[]>([])

watch(selectedHome, async(home) =>{
  if(!home) return
  members.value = await getHomeMembers(home.id)
})

onMounted(async () => {
  try {
    const data = await getHomes()
    homes.value = data.result ?? data
    if (homes.value.length) selectedHome.value = homes.value[0]
  } catch {
    // silently ignore – UI still usable without homes
  }
})

function closeModal() {
  showModal.value = false
  email.value = ''
  inviteError.value = ''
  inviteSuccess.value = false
}

async function sendInvitation() {
  if (!selectedHome.value || !email.value.trim()) return
  sending.value = true
  inviteError.value = ''
  inviteSuccess.value = false
  try {
    await shareHome(selectedHome.value.id, [email.value.trim()])
    inviteSuccess.value = true
    email.value = ''
  } catch (err: any) {
    inviteError.value = err?.response?.data?.error?.description ?? 'No se pudo enviar la invitación.'
  } finally {
    sending.value = false
  }
}

async function quitarMiembro(userMail: string){
  if(!selectedHome.value) return
  await removeHomeMember(selectedHome.value.id, userMail)
  members.value = members.value.filter(m => m.email !==userMail)
}
</script>

<style scoped>

.activity-backdrop {
display: none;
position: fixed;
inset: 0;
background: rgba(15,23,42,.3);
backdrop-filter: blur(2px);
z-index: 350;
}

.screen.active {
display: block;
}


.sch-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}


/* ── ENERGÍA: home selector at top ── */
.energia-home-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}
.energia-home-selector-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--text-muted);
    flex-shrink: 0;
}
.energia-home-selector-label svg { width: 14px; height: 14px; }
.energia-home-selector-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.energia-home-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 12px;
    border: 1.5px solid var(--border);
    background: var(--surface);
    font-size: 1.125rem;
    color: var(--text-muted);
    cursor: pointer;
    font-weight: 600;
    transition: all 0.18s;
    box-shadow: 0 1px 3px rgba(15, 23, 42, .03);
}
.energia-home-btn-icon {
    width: 28px;
    height: 28px;
    border-radius: 9px;
    background: var(--accent-light);
    color: var(--accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.energia-home-btn svg { width: 14px; height: 14px; }
.energia-home-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(99,102,241,.03);
}
.energia-home-btn.active {
    background: var(--surface);
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 0 3px rgba(99,102,241,.10);
}
.energia-home-btn.active .energia-home-btn-icon {
    background: var(--accent);
    color: #fff;
}
/* ── PERMISSIONS PANEL ── */
.perm-section-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: .07em;
    margin: 20px 0 8px;
}
.perm-member-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,.04);
    transition: box-shadow .15s, border-color .15s;
}
.perm-member-card--owner {
    background: rgba(26,35,126,.04);
    border-color: rgba(26,35,126,.15);
}
.perm-member-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: var(--text-muted);
}
.perm-member-avatar svg { width: 18px; height: 18px; }
.perm-avatar--owner { background: rgba(26,35,126,.12); color: #1A237E; }
.perm-avatar--owner svg { width: 16px; height: 16px; }
.perm-member-info { flex: 1; min-width: 0; }
.perm-member-name { font-size: 1.375rem; font-weight: 700; color: var(--text); }
.perm-member-sub { font-size: 0.9375rem; color: var(--text-muted); margin-top: 2px; }
.perm-role-badge {
    font-size: 1.09375rem; font-weight: 700;
    padding: 3px 9px; border-radius: 20px;
    flex-shrink: 0;
}
.perm-role-badge--owner { background: rgba(26,35,126,.12); color: #1A237E; }
.perm-action-btn {
    width: 40px; height: 40px;
    border-radius: 10px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-muted);
    flex-shrink: 0;
    transition: background .15s, color .15s;
}
.perm-action-btn svg { width: 20px; height: 20px; }
.perm-action-btn:hover { background: rgba(63,81,181,.1); color: #3F51B5; }
.perm-action-btn--danger:hover { background: #FEE2E2; color: #EF4444; }
.perm-empty {
    display: flex; flex-direction: column; align-items: center;
    gap: 8px; text-align: center; padding: 40px 20px;
}
.perm-empty-icon {
    width: 60px; height: 60px;
    border-radius: 50%;
    background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
}
.perm-empty-icon svg { width: 28px; height: 28px; color: var(--text-muted); }
.perm-empty-title { font-size: 1.25rem; font-weight: 700; color: var(--text); }
.perm-empty-sub { font-size: 1.025rem; color: var(--text-muted); max-width: 260px; line-height: 1.5; }

/* Restrict devices modal */
.perm-restrict-group { padding: 0 0 4px; }
.perm-restrict-room-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.9rem; font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase; letter-spacing: .06em;
    padding: 12px 20px 6px;
    border-top: 1px solid var(--border);
}
.perm-restrict-dev-row {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 20px;
    transition: background .12s;
}
.perm-restrict-dev-row:hover { background: var(--surface2); }
.perm-restrict-dev-icon {
    width: 26px; height: 26px;
    border-radius: 7px;
    background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.perm-restrict-dev-icon svg { width: 13px; height: 13px; color: #3F51B5; }
.perm-restrict-dev-name { flex: 1; font-size: 1.0625rem; font-weight: 500; color: var(--text); }
.perm-restrict-badge {
    font-size: 1.0625rem; font-weight: 600;
    padding: 2px 7px; border-radius: 10px;
    flex-shrink: 0;
}
.perm-restrict-badge--on  { background: rgba(0,137,123,.1); color: #00897B; }
.perm-restrict-badge--off { background: rgba(239,68,68,.1);  color: #EF4444; }
.hd-edit-rooms-btn svg { width: 15px; height: 15px; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: var(--surface, #fff);
  border-radius: 20px;
  width: 90%;
  max-width: 460px;
  box-shadow: 0 20px 60px rgba(0,0,0,.15);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 18px;
  border-bottom: 1px solid var(--border);
}
.modal-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text);
}
.modal-close-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--surface2);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  transition: background .15s;
}
.modal-close-btn:hover { background: var(--border); }
.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-desc {
  font-size: 1.375rem;
  color: var(--text-muted);
  line-height: 1.5;
}
.modal-field { display: flex; flex-direction: column; gap: 6px; }
.modal-field-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: .07em;
}
.modal-input {
  width: 100%;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  font-size: 1.125rem;
  color: var(--text);
  font-family: inherit;
  outline: none;
  transition: border-color .15s;
}
.modal-input:focus { border-color: var(--accent); }
.modal-info {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 0.9625rem;
  color: var(--text-muted);
  background: rgba(99,102,241,.06);
  border-radius: 8px;
  padding: 10px 12px;
  line-height: 1.5;
}
.modal-info svg { flex-shrink: 0; margin-top: 2px; }
.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 24px 22px;
  border-top: 1px solid var(--border);
}
.modal-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 1.09375rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: all .18s;
}
.modal-btn--secondary {
  background: var(--surface2);
  color: var(--text);
}
.modal-btn--secondary:hover { background: var(--border); }
.modal-btn--primary {
  background: var(--accent);
  color: #fff;
}
.modal-btn--primary:hover { opacity: .88; }
.modal-btn--primary:disabled { opacity: .45; cursor: not-allowed; }
.modal-error {
  font-size: 1rem;
  color: #EF4444;
  background: rgba(239,68,68,.08);
  border-radius: 8px;
  padding: 8px 12px;
}
.modal-success {
  font-size: 1rem;
  color: #00897B;
  background: rgba(0,137,123,.08);
  border-radius: 8px;
  padding: 8px 12px;
}


.btn-primary {
background: var(--accent);
color: white;
}

.btn-primary:hover {
background: var(--accent-mid);
}

.btn {
padding: 10px 22px;
border-radius: 10px;
font-size: 1.09375rem;
font-weight: 600;
cursor: pointer;
transition: all 0.2s;
border: none;
font-family: inherit;
}

.section-title {
  margin-bottom: 2px;
}

.perm-subtitle {
  color: var(--text-muted);
  font-size: 1.0625rem;
}

.btn-add-member {
  margin-top: 12px;
}

</style>