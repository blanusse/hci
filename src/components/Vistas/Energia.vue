<template>
  <div class="screen active page-content">

    <!-- ============================================================ -->
    <!-- HEADER: título + tabs de período (Hoy / Semana / Mes)         -->
    <!-- ============================================================ -->
    <div class="energia-header">
      <div>
        <h2 class="header-title">Consumo de Energía</h2>
        <p class="energia-subtitle">Visualizá el gasto de cada hogar y habitación</p>
      </div>

      <div class="energia-period-tabs">
        <button class="eperiod-btn" :class="{ active: period === 'dia' }" @click="period = 'dia'">Hoy</button>
        <button class="eperiod-btn" :class="{ active: period === 'semana' }" @click="period = 'semana'">Semana</button>
        <button class="eperiod-btn" :class="{ active: period === 'mes' }" @click="period = 'mes'">Mes</button>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- SELECTOR DE HOGAR (multi-selección)                           -->
    <!-- ============================================================ -->
    <div class="energia-home-selector">
      <span class="energia-home-selector-label">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="house" aria-hidden="true" class="lucide lucide-house">
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
        Hogar:
      </span>

      <div class="energia-home-selector-tabs">
        <template v-if="homes.length > 0">
          <button
            v-for="home in homes"
            :key="home.id"
            class="energia-home-btn"
            :class="{ active: selectedHomes.some(h => h.id === home.id) }"
            @click="toggleHome(home)"
          >
            <span class="energia-home-btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="house" aria-hidden="true" class="lucide lucide-house">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </span>
            {{ home.name }}
          </button>
        </template>
        <span v-else-if="!isLoading" class="energia-no-homes">No hay hogares</span>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- ESTADO DE CARGA                                               -->
    <!-- ============================================================ -->
    <div v-if="isLoading" class="energia-loading">
      <span class="energia-loading-spinner"></span>
      Cargando datos de dispositivos…
    </div>

    <!-- ============================================================ -->
    <!-- KPI CARDS: consumo, costo, proyección, CO2                    -->
    <!-- ============================================================ -->
    <div class="energia-kpi-row">

      <!-- KPI: Consumo del período (kWh) -->
      <div class="ekpi-card ekpi-kwh">
        <div class="ekpi-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
          </svg>
        </div>
        <div class="ekpi-val">{{ kpis.main.val }} <span class="ekpi-unit">kWh</span></div>
        <div class="ekpi-label">{{ kpis.main.label }}</div>
        <div class="ekpi-trend" :class="kpis.main.trendClass">
          <svg v-if="kpis.main.trendIcon === 'trending-up'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 7h6v6"></path>
            <path d="m22 7-8.5 8.5-5-5L2 17"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 17h6v-6"></path>
            <path d="m22 17-8.5-8.5-5 5L2 7"></path>
          </svg>
          {{ kpis.main.trend }}
        </div>
      </div>

      <!-- KPI: Costo estimado ($) -->
      <div class="ekpi-card ekpi-cost">
        <div class="ekpi-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" x2="12" y1="2" y2="22"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="ekpi-val">{{ kpis.cost }}</div>
        <div class="ekpi-label">Costo estimado</div>
        <div class="ekpi-trend ekpi-trend--neutral">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14"></path>
          </svg>
          promedio
        </div>
      </div>

      <!-- KPI: Secundario (proyección / mes anterior) -->
      <div class="ekpi-card ekpi-month">
        <div class="ekpi-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
            <path d="M3 10h18"></path>
          </svg>
        </div>
        <div class="ekpi-val">{{ kpis.secondary.val }} <span class="ekpi-unit">kWh</span></div>
        <div class="ekpi-label">{{ kpis.secondary.label }}</div>
        <div class="ekpi-trend" :class="kpis.secondary.trendClass">
          <svg v-if="kpis.secondary.trendIcon === 'trending-up'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 7h6v6"></path>
            <path d="m22 7-8.5 8.5-5-5L2 17"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 17h6v-6"></path>
            <path d="m22 17-8.5-8.5-5 5L2 7"></path>
          </svg>
          {{ kpis.secondary.trend }}
        </div>
      </div>

      <!-- KPI: CO2 evitado (kg) -->
      <div class="ekpi-card ekpi-co2">
        <div class="ekpi-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
          </svg>
        </div>
        <div class="ekpi-val">{{ kpis.co2 }} <span class="ekpi-unit">kg</span></div>
        <div class="ekpi-label">CO₂ evitado</div>
        <div class="ekpi-trend ekpi-trend--up">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 7h6v6"></path>
            <path d="m22 7-8.5 8.5-5-5L2 17"></path>
          </svg>
          {{ kpis.co2Trend }}
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- CHARTS: gráfico de barras por hora + lista por hogar          -->
    <!-- ============================================================ -->
      <div class="energia-charts-row">
        <!-- Gráfico: Consumo por hora -->
        <div class="energia-chart-card energia-chart-card--wide">
          <div class="echart-header">
            <span class="echart-title">{{ kpis.chartTitle }}</span>
            <span class="echart-sub">{{ kpis.chartSub }}</span>
          </div>

          <div class="echart-body">
            <!-- Leyenda con un dot por cada casa seleccionada -->
            <div class="energy-legend">
              <span v-for="h in selectedHomes" :key="h.id" class="energy-legend-item">
                <span class="energy-legend-dot" :style="{ background: homeColor(h.id) }"></span>
                {{ h.name }}
              </span>
            </div>

            <!-- Eje Y + área de barras (grid 2 columnas) -->
            <div class="energy-chart-grid">
              <div class="energy-y-axis">
                <span v-for="tick in yAxisTicks" :key="tick">{{ tick }} kWh</span>
              </div>

              <div class="energy-bars-area">
                <!-- Líneas guía horizontales -->
                <div class="energy-grid-line" v-for="tick in yAxisTicks" :key="'gl-' + tick"></div>

                <!-- Barras -->
                <div class="energy-bars-chart">
                  <div
                    v-for="group in barChartData"
                    :key="group.label"
                    class="energy-bars-group"
                  >
                    <div class="energy-bars-columns">
                      <div
                        v-for="bar in group.values"
                        :key="bar.homeId"
                        class="energy-bar"
                        :style="{ height: bar.pct + '%', background: bar.color }"
                        :title="`${bar.homeName}: ${bar.kwh} kWh`"
                      ></div>
                    </div>
                    <div class="energy-bar-label">{{ group.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Lista: Consumo por hogar -->
      <div class="energia-chart-card energia-homes-card">
        <div class="echart-header">
          <span class="echart-title">Consumo por hogar</span>
          <span class="echart-sub">{{ kpis.periodLabel }} · kWh</span>
        </div>

        <div class="energia-homes-list">
          <div v-for="row in homeConsumption" :key="row.id" class="energia-home-row">
            <div class="energia-home-row-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </div>
            <div class="energia-home-row-info">
              <div class="energia-home-row-name">{{ row.name }}</div>
              <div class="energia-home-row-bar-wrap">
                <div class="energia-home-row-bar" :style="{ width: row.pct + '%', background: row.color }"></div>
              </div>
            </div>
            <div class="energia-home-row-kwh">{{ row.kwh }}<span> kWh</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- DESGLOSE POR HABITACIÓN (de las casas seleccionadas)          -->
    <!-- ============================================================ -->
    <div class="energia-breakdown">
      <div class="echart-header" style="margin-bottom: 14px;">
        <span class="echart-title">Desglose por habitación</span>
        <span class="echart-sub">{{ selectedNames }}</span>
      </div>

      <div class="eroom-list">
        <div v-for="r in roomConsumption" :key="r.homeName + '·' + r.name" class="eroom-row">
          <div class="eroom-icon">
            <EnergyIcon :name="r.icon" />
          </div>
          <div class="eroom-info">
            <div class="eroom-name">{{ r.name }}</div>
            <div class="eroom-home-tag">{{ r.homeName }}</div>
            <div class="eroom-bar-wrap">
              <div class="eroom-bar" :style="{ width: r.pct + '%', background: r.color }"></div>
            </div>
          </div>
          <div class="eroom-kwh">{{ r.kwh }}<span> kWh</span></div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- TOP CONSUMIDORES (dispositivos que más gastan)                -->
    <!-- ============================================================ -->
    <div class="energia-top">
      <div class="echart-header" style="margin-bottom: 14px;">
        <span class="echart-title">Mayores consumidores</span>
        <span class="echart-sub">{{ selectedNames }}</span>
      </div>

      <div class="etop-list">
        <div v-for="(d, idx) in topDevices" :key="d.homeName + '·' + d.roomName + '·' + d.name + idx" class="etop-row">
          <div class="etop-icon" :class="d.on ? 'on' : 'off'">
            <EnergyIcon :name="d.icon" />
          </div>
          <div class="etop-info">
            <div class="etop-name">{{ d.name }}</div>
            <div class="etop-room">{{ d.roomName }} · {{ d.homeName }}</div>
          </div>
          <div class="etop-right">
            <span class="etop-kwh">{{ d.kwh }} kWh</span>
            <div class="etop-bar-track">
              <div class="etop-bar-fill" :style="{ width: d.pct + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getHomes, getRooms, getRoomDevices } from '@/services/homeService'
import { getDeviceTypesInfo } from '@/services/deviceService'
import { roomIcon, type Period } from '@/utils/energyMock'
import EnergyIcon from '@/components/EnergyIcon.vue'

interface Home { id: string; name: string }
interface Room { id: string; name: string }
interface DeviceInfo {
  id: string
  name: string
  typeId: string
  typeName: string
  powerWatts: number
  on: boolean
  roomId: string
  roomName: string
  homeId: string
  homeName: string
}

const HOME_COLORS = ['#1A237E', '#6366F1']
const COST_PER_KWH = 14.5
const CO2_PER_KWH = 0.37

// Distribución normalizada (suma = 1) para generar el gráfico de barras desde datos reales.
const CHART_LABELS: Record<Period, string[]> = {
  dia:    ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
  semana: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  mes:    ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
}
const CHART_DIST: Record<Period, number[]> = {
  dia:    [0.04, 0.08, 0.07, 0.12, 0.14, 0.16, 0.19, 0.13, 0.07],
  semana: [0.12, 0.14, 0.13, 0.15, 0.17, 0.17, 0.12],
  mes:    [0.22, 0.26, 0.24, 0.28],
}

const homes         = ref<Home[]>([])
const selectedHomes = ref<Home[]>([])
const period        = ref<Period>('dia')
const allDevices    = ref<DeviceInfo[]>([])
const isLoading     = ref(true)

function periodHours(p: Period): number {
  if (p === 'dia') return 8
  if (p === 'semana') return 56
  return 240
}

function homeColor(homeId: string): string {
  const idx = homes.value.findIndex(h => h.id === homeId)
  return HOME_COLORS[Math.max(0, idx) % HOME_COLORS.length]
}

function typeNameToIcon(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('lamp') || n.includes('luz') || n.includes('light') || n.includes('bulb')) return 'lightbulb'
  if (n.includes('ac') || n.includes('air') || n.includes('aire') || n.includes('acondicionado')) return 'wind'
  if (n.includes('speaker') || n.includes('parlante') || n.includes('audio')) return 'speaker'
  if (n.includes('faucet') || n.includes('grifo') || n.includes('water') || n.includes('aspersor') || n.includes('riego')) return 'droplets'
  if (n.includes('blind') || n.includes('persiana') || n.includes('curtain')) return 'blinds'
  if (n.includes('door') || n.includes('puerta')) return 'door-open'
  if (n.includes('oven') || n.includes('horno')) return 'oven'
  if (n.includes('refriger') || n.includes('heladera') || n.includes('fridge')) return 'thermometer'
  if (n.includes('vacuum') || n.includes('aspiradora') || n.includes('robot')) return 'bot'
  if (n.includes('alarm') || n.includes('lock') || n.includes('cerradura')) return 'lock'
  return 'lightbulb'
}

onMounted(async () => {
  try {
    const [homesData, typeInfo] = await Promise.all([
      getHomes(),
      getDeviceTypesInfo(),
    ])
    homes.value = homesData.result ?? homesData
    selectedHomes.value = [...homes.value]

    const devicesList: DeviceInfo[] = []
    await Promise.all(homes.value.map(async (home) => {
      const roomsData = await getRooms(home.id)
      const rooms: Room[] = roomsData.result ?? roomsData
      await Promise.all(rooms.map(async (room) => {
        try {
          const devs = await getRoomDevices(room.id)
          for (const d of (devs.result ?? devs)) {
            const tid = d.type?.id ?? ''
            devicesList.push({
              id: d.id,
              name: d.name,
              typeId: tid,
              typeName: typeInfo[tid]?.name ?? '',
              powerWatts: typeInfo[tid]?.powerWatts ?? 0,
              on: d.state?.status === 'on',
              roomId: room.id,
              roomName: room.name,
              homeId: home.id,
              homeName: home.name,
            })
          }
        } catch {}
      }))
    }))
    allDevices.value = devicesList
  } catch {
    // si falla la API, dejamos vacío
  } finally {
    isLoading.value = false
  }
})

function toggleHome(home: Home) {
  const idx = selectedHomes.value.findIndex(h => h.id === home.id)
  if (idx >= 0) selectedHomes.value.splice(idx, 1)
  else selectedHomes.value.push(home)
}

// ── Computed: dispositivos de las casas seleccionadas con kWh del período ──
const deviceConsumption = computed(() => {
  const selectedIds = new Set(selectedHomes.value.map(h => h.id))
  const hours = periodHours(period.value)
  return allDevices.value
    .filter(d => selectedIds.has(d.homeId))
    .map(d => ({ ...d, kwh: parseFloat(((d.powerWatts * hours) / 1000).toFixed(2)) }))
})

// ── Desglose por habitación ──
const roomConsumption = computed(() => {
  const map: Record<string, { name: string; homeId: string; homeName: string; kwh: number }> = {}
  for (const d of deviceConsumption.value) {
    if (!map[d.roomId]) map[d.roomId] = { name: d.roomName, homeId: d.homeId, homeName: d.homeName, kwh: 0 }
    map[d.roomId].kwh += d.kwh
  }
  const list = Object.values(map)
  const max = Math.max(...list.map(r => r.kwh), 0.1)
  return list.map(r => ({
    ...r,
    icon: roomIcon(r.name),
    color: homeColor(r.homeId),
    kwh: parseFloat(r.kwh.toFixed(2)),
    pct: Math.round((r.kwh / max) * 100),
  }))
})

// ── Top 5 consumidores ──
const topDevices = computed(() => {
  const sorted = [...deviceConsumption.value].sort((a, b) => b.kwh - a.kwh).slice(0, 5)
  const maxKwh = sorted[0]?.kwh || 1
  return sorted.map(d => ({
    ...d,
    icon: typeNameToIcon(d.typeName),
    pct: Math.round((d.kwh / maxKwh) * 100),
  }))
})

// ── Consumo por hogar ──
const homeConsumption = computed(() => {
  const map: Record<string, { name: string; kwh: number }> = {}
  for (const d of deviceConsumption.value) {
    if (!map[d.homeId]) map[d.homeId] = { name: d.homeName, kwh: 0 }
    map[d.homeId].kwh += d.kwh
  }
  const list = selectedHomes.value.map(h => ({
    id: h.id,
    name: h.name,
    kwh: parseFloat((map[h.id]?.kwh ?? 0).toFixed(2)),
    color: homeColor(h.id),
  }))
  const max = Math.max(...list.map(v => v.kwh), 0.1)
  return list.map(v => ({ ...v, pct: Math.round((v.kwh / max) * 100) }))
})

// ── KPIs ──
const kpis = computed(() => {
  const totalKwh = homeConsumption.value.reduce((s, h) => s + h.kwh, 0)
  const cost = Math.round(totalKwh * COST_PER_KWH)
  const co2  = Math.round(totalKwh * CO2_PER_KWH)
  const costStr = `$${cost.toLocaleString('es-AR')}`

  if (period.value === 'dia') {
    return {
      main:      { val: totalKwh.toFixed(1), label: 'Consumo hoy',    trend: 'consumo real', trendClass: 'ekpi-trend--neutral' as const, trendIcon: 'trending-up' as const },
      secondary: { val: (totalKwh * 30).toFixed(0), label: 'Proyección mes', trend: 'a este ritmo', trendClass: 'ekpi-trend--neutral' as const, trendIcon: 'trending-up' as const },
      cost: costStr, co2: co2.toString(), co2Trend: `${co2} kg CO₂`,
      chartTitle: 'Consumo por hora', chartSub: 'hoy · kWh', periodLabel: 'Hoy',
    }
  }
  if (period.value === 'semana') {
    return {
      main:      { val: totalKwh.toFixed(1), label: 'Esta semana',    trend: 'consumo real', trendClass: 'ekpi-trend--neutral' as const, trendIcon: 'trending-up' as const },
      secondary: { val: (totalKwh * 4.3).toFixed(0), label: 'Proyección mes', trend: 'a este ritmo', trendClass: 'ekpi-trend--neutral' as const, trendIcon: 'trending-down' as const },
      cost: costStr, co2: co2.toString(), co2Trend: `${co2} kg CO₂`,
      chartTitle: 'Consumo diario', chartSub: 'últimos 7 días · kWh', periodLabel: 'Esta semana',
    }
  }
  return {
    main:      { val: totalKwh.toFixed(0), label: 'Este mes',    trend: 'consumo real', trendClass: 'ekpi-trend--neutral' as const, trendIcon: 'trending-down' as const },
    secondary: { val: Math.round(totalKwh * 1.08).toString(), label: 'Proyección', trend: '+8% tendencia', trendClass: 'ekpi-trend--neutral' as const, trendIcon: 'trending-down' as const },
    cost: costStr, co2: co2.toString(), co2Trend: `${co2} kg CO₂`,
    chartTitle: 'Consumo semanal', chartSub: 'este mes · kWh', periodLabel: 'Este mes',
  }
})

const selectedNames = computed(() => selectedHomes.value.map(h => h.name).join(' · '))

// Gráfico de barras: distribuye el consumo real de cada hogar con patrón temporal fijo.
const barChartData = computed(() => {
  const labels = CHART_LABELS[period.value]
  const dist   = CHART_DIST[period.value]
  const homeKwh = Object.fromEntries(homeConsumption.value.map(h => [h.id, h.kwh]))
  const allSlotValues = selectedHomes.value.flatMap(h =>
    dist.map(f => (homeKwh[h.id] ?? 0) * f)
  )
  const max = Math.max(...allSlotValues, 0.1)
  return labels.map((label, i) => ({
    label,
    values: selectedHomes.value.map(home => {
      const kwh = parseFloat(((homeKwh[home.id] ?? 0) * dist[i]).toFixed(2))
      return {
        homeId: home.id,
        homeName: home.name,
        color: homeColor(home.id),
        kwh,
        pct: Math.round((kwh / max) * 100),
      }
    }),
  }))
})

const yAxisTicks = computed(() => {
  const allKwh = barChartData.value.flatMap(g => g.values.map(v => v.kwh))
  const max = Math.max(...allKwh, 0.1)
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
  const step = Math.ceil(max / magnitude / 4) * magnitude
  const top = step * 4
  return [top, top * 0.75, top * 0.5, top * 0.25, 0]
    .map(n => (n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)))
})
</script>

<style scoped>
.energia-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.energia-subtitle {
    color: var(--text-muted);
    font-size: 1.0625rem;
}

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
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-muted);
    flex-shrink: 0;
}
.energia-home-selector-label svg { width: 1.1em; height: 1.1em; }
.energia-home-selector-tabs { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.energia-no-homes { font-size: 1.25rem; color: red; font-style: italic; }
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
.energia-home-btn svg { width: 20px; height: 20px; }
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
    color: var(--surface);
}

.energia-period-tabs {
    display: inline-flex;
    align-items: center;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 4px;
    gap: 4px;
    box-shadow: 0 1px 4px rgba(15, 23, 42, .04);
}

.eperiod-btn {
    padding: 14px 24px;
    border-radius: 10px;
    border: none;
    background: none;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
}

.eperiod-btn.active {
    background: var(--accent-light);
    color: var(--accent);
    box-shadow: none;
}


/* KPI cards */
.energia-kpi-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
    margin-bottom: 28px;
}
.ekpi-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 20px 22px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 168px;
    box-shadow: 0 2px 10px rgba(15, 23, 42, .06);
}
.ekpi-icon-wrap {
    width: 50px;
    height: 50px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}
.ekpi-icon-wrap svg { width: 24px; height: 24px; }
.ekpi-kwh .ekpi-icon-wrap {
    background: rgba(59, 130, 246, .14);
    color: #2563EB;
}
.ekpi-cost .ekpi-icon-wrap {
    background: rgba(34, 197, 94, .14);
    color: #16A34A;
}
.ekpi-month .ekpi-icon-wrap {
    background: rgba(245, 158, 11, .14);
    color: #D97706;
}
.ekpi-co2 .ekpi-icon-wrap {
    background: rgba(16, 185, 129, .14);
    color: #059669;
}
.ekpi-val {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    color: var(--text);
    letter-spacing: -0.03em;
}
.ekpi-unit {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text);
}
.ekpi-label {
    font-size: 0.88rem;
    color: var(--text-muted);
    font-weight: 500;
}
.ekpi-trend {
    font-size: 0.82rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: auto;
}
.ekpi-trend svg { width: 12px; height: 12px; }
.ekpi-trend--up { color: var(--success); }
.ekpi-trend--down { color: var(--danger); }
.ekpi-trend--neutral { color: var(--text-muted); }

/* Charts row */
.energia-charts-row {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 16px;
    margin-bottom: 24px;
}
@media (max-width: 700px) {
    .energia-charts-row { grid-template-columns: 1fr; }
}
.energia-chart-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(15, 23, 42, .05);
}
.echart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
}
.echart-title { font-size: 0.92rem; font-weight: 700; color: var(--text); }
.echart-sub   { font-size: 0.75rem; color: var(--text-muted); }
.echart-body  {
    height: 240px;
    margin-top: 16px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Leyenda arriba a la derecha */
.energy-legend {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text);
}
.energy-legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}
.energy-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

/* Layout: eje Y a la izquierda + área de barras a la derecha */
.energy-chart-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 8px;
    min-height: 0;
}

/* Eje Y (4 valores: top, 2 medios, 0) */
.energy-y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: end;
    font-size: 0.7rem;
    color: var(--text-muted);
    padding-bottom: 22px; /* deja espacio para los labels del eje X */
}

/* Área donde van las barras + líneas guía */
.energy-bars-area {
    position: relative;
    min-height: 0;
}
.energy-grid-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border);
    opacity: 0.6;
    pointer-events: none;
}
/* Distribuir las 4 líneas: 0%, 33%, 66%, 100% (de abajo) */
.energy-grid-line:nth-child(1) { top: 0; }
.energy-grid-line:nth-child(2) { top: 33%; }
.energy-grid-line:nth-child(3) { top: 66%; }
.energy-grid-line:nth-child(4) { bottom: 22px; }

.energy-bars-chart {
    position: absolute;
    inset: 0;
    bottom: 22px; /* coincide con la línea base */
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 12px;
}

.energy-bars-group {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    gap: 6px;
    position: relative;
}

.energy-bars-columns {
    flex: 1;
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 4px;
}

.energy-bar {
    width: 14px;
    min-height: 4px;
    border-radius: 0;
    transition: height 0.25s ease;
}

/* Lista "Consumo por hogar" */
.energia-homes-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 16px;
}
.energia-home-row {
    display: flex;
    align-items: center;
    gap: 12px;
}
.energia-home-row-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: var(--accent-light);
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.energia-home-row-icon svg { width: 18px; height: 18px; }
.energia-home-row-info { flex: 1; min-width: 0; }
.energia-home-row-name {
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 6px;
}
.energia-home-row-bar-wrap {
    height: 8px;
    background: var(--surface2);
    border-radius: 99px;
    overflow: hidden;
}
.energia-home-row-bar {
    height: 100%;
    border-radius: 99px;
    transition: width 0.4s;
}
.energia-home-row-kwh {
    font-size: 1rem;
    font-weight: 800;
    color: var(--text);
    white-space: nowrap;
}
.energia-home-row-kwh span {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 600;
    margin-left: 2px;
}

.energy-bar-label {
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 600;
}

/* Per-home breakdown */
.energia-breakdown {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.eroom-list { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
.eroom-row  { display: flex; align-items: center; gap: 12px; }
.eroom-icon {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    color: var(--primary-light, var(--color-indigo));
    flex-shrink: 0;
}
.eroom-icon svg { width: 14px; height: 14px; }
.eroom-info { flex: 1; min-width: 0; }
.eroom-name { font-size: 0.75rem; font-weight: 600; margin-bottom: 2px; color: var(--text-muted)}
.eroom-home-tag { font-size: 0.68rem; color: var(--text-muted); margin-bottom: 4px; }
.eroom-bar-wrap {
    height: 7px;
    background: var(--surface2);
    border-radius: 99px;
    overflow: hidden;
}
.eroom-bar {
    height: 100%;
    border-radius: 99px;
    transition: width 0.5s cubic-bezier(.4,0,.2,1);
}
.eroom-kwh {
    font-size: 0.75rem; font-weight: 700;
    color: var(--primary, var(--rut-btn-primary));
    white-space: nowrap;
    min-width: 58px; text-align: right;
}
.eroom-kwh span { font-weight: 500; color: var(--text-muted); }

/* Top consumers */
.energia-top {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.etop-list { display: flex; flex-direction: column; gap: 10px; }
.etop-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.15s;
}
.etop-row:hover { background: var(--surface2); }
.etop-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.etop-icon.on  { background: rgba(26,35,126,.10); color: var(--primary, var(--rut-btn-primary)); }
.etop-icon.off { background: var(--surface2); color: var(--text-muted); }
.etop-icon svg { width: 17px; height: 17px; }
.etop-info { flex: 1; min-width: 0; }
.etop-name { font-size: 0.8125rem; font-weight: 600; color: var(--text-muted)}
.etop-room { font-size: 0.6875rem; color: var(--text-muted); margin-top: 1px; }
.etop-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; min-width: 80px; }
.etop-kwh { font-size: 0.8125rem; font-weight: 700; color: var(--primary, var(--rut-btn-primary)); }
.etop-bar-track {
    width: 70px; height: 5px;
    background: var(--surface2);
    border-radius: 99px;
    overflow: hidden;
}
.etop-bar-fill {
    height: 100%;
    background: linear-gradient(to right, var(--rut-btn-primary), var(--color-indigo));
    border-radius: 99px;
    transition: width 0.5s cubic-bezier(.4,0,.2,1);
}

/* Loading */
.energia-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: 500;
    padding: 14px 0 24px;
}
.energia-loading-spinner {
    width: 18px;
    height: 18px;
    border: 2.5px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: espin 0.7s linear infinite;
    flex-shrink: 0;
}
@keyframes espin { to { transform: rotate(360deg); } }

</style>