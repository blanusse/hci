<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <!-- Habitaciones -->
    <template v-if="name === 'sofa'">
      <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"></path>
      <path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"></path>
      <path d="M4 18v2"></path>
      <path d="M20 18v2"></path>
      <path d="M12 4v9"></path>
    </template>
    <template v-else-if="name === 'bed'">
      <path d="M2 4v16"></path>
      <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
      <path d="M2 17h20"></path>
      <path d="M6 8v9"></path>
    </template>
    <template v-else-if="name === 'utensils'">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
      <path d="M7 2v20"></path>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
    </template>
    <template v-else-if="name === 'droplets'">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
    </template>
    <template v-else-if="name === 'car'">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
      <circle cx="7" cy="17" r="2"></circle>
      <path d="M9 17h6"></path>
      <circle cx="17" cy="17" r="2"></circle>
    </template>
    <template v-else-if="name === 'trees'">
      <path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"></path>
      <path d="M7 16v6"></path>
      <path d="M13 19v3"></path>
      <path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"></path>
    </template>
    <template v-else-if="name === 'briefcase'">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      <rect width="20" height="14" x="2" y="6" rx="2"></rect>
    </template>
    <template v-else-if="name === 'utensils-crossed'">
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path>
      <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path>
      <path d="m2.1 21.8 6.4-6.3"></path>
      <path d="m19 5-7 7"></path>
    </template>
    <!-- Dispositivos -->
    <template v-else-if="name === 'wind'">
      <path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path>
      <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path>
      <path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path>
    </template>
    <template v-else-if="name === 'thermometer'">
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>
    </template>
    <template v-else-if="name === 'bot'">
      <path d="M12 8V4H8"></path>
      <rect width="16" height="12" x="4" y="8" rx="2"></rect>
      <path d="M2 14h2"></path>
      <path d="M20 14h2"></path>
      <path d="M15 13v2"></path>
      <path d="M9 13v2"></path>
    </template>
    <template v-else-if="name === 'oven'">
      <rect x="2" y="2" width="20" height="20" rx="2"></rect>
      <line x1="2" y1="7" x2="22" y2="7"></line>
      <circle cx="6.5" cy="4.5" r="1.2"></circle>
      <circle cx="12" cy="4.5" r="1.2"></circle>
      <circle cx="17.5" cy="4.5" r="1.2"></circle>
      <rect x="3.5" y="8.5" width="17" height="11.5" rx="1.5"></rect>
      <line x1="8.5" y1="10.5" x2="15.5" y2="10.5"></line>
      <line x1="5" y1="15.5" x2="19" y2="15.5" stroke-dasharray="2 1.5"></line>
      <line x1="5" y1="18" x2="19" y2="18" stroke-dasharray="2 1.5"></line>
    </template>
    <template v-else-if="name === 'lightbulb'">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
      <path d="M9 18h6"></path>
      <path d="M10 22h4"></path>
    </template>
    <template v-else-if="name === 'speaker'">
      <rect width="16" height="20" x="4" y="2" rx="2"></rect>
      <path d="M12 6h.01"></path>
      <circle cx="12" cy="14" r="4"></circle>
      <path d="M12 14h.01"></path>
    </template>
    <template v-else-if="name === 'blinds'">
      <path d="M3 3h18"></path>
      <path d="M20 7H8"></path>
      <path d="M20 11H8"></path>
      <path d="M10 19h10"></path>
      <path d="M8 15h12"></path>
      <path d="M4 3v14"></path>
      <circle cx="4" cy="19" r="2"></circle>
    </template>
    <template v-else-if="name === 'door-open'">
      <path d="M13 4h3a2 2 0 0 1 2 2v14"></path>
      <path d="M2 20h3"></path>
      <path d="M13 20h9"></path>
      <path d="M10 12v.01"></path>
      <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"></path>
    </template>
    <template v-else-if="name === 'lock'">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </template>
    <!-- fallback: cuadrado vacío -->
    <template v-else>
      <rect width="20" height="20" x="2" y="2" rx="2"></rect>
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
</script>
