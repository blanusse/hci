/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'


// Plugins
import { registerPlugins } from '@/plugins'
import { createPinia } from 'pinia'



// Components
import App from './App.vue'

// Styles
import 'unfonts.css'
import './assets/main.css'
import router from './router'


const app = createApp(App)

registerPlugins(app)

app.use(router) 
app.use(createPinia())
app.mount('#app')
