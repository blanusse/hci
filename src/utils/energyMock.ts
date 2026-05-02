// Mock de datos de energía para Energia.vue.
// La API real no expone consumo (kWh) — esta lógica está portada del repo viejo (TP_HCI/app.js).

export type Period = 'dia' | 'semana' | 'mes'

export interface HomeBasic {
    id: string
    name: string
}

export interface RoomConsumption {
    name: string
    homeName: string
    icon: string
    kwh: number
    color: string
    pct: number
}

export interface DeviceConsumption {
    name: string
    icon: string
    on: boolean
    roomName: string
    homeName: string
    kwh: number
    pct: number
}

export interface HomeConsumption {
    id: string
    name: string
    kwh: number
    color: string
    pct: number
}

export interface EnergyKpis {
    main:      { val: string; label: string; trend: string; trendClass: 'ekpi-trend--up' | 'ekpi-trend--down' | 'ekpi-trend--neutral'; trendIcon: 'trending-up' | 'trending-down' | 'minus' }
    secondary: { val: string; label: string; trend: string; trendClass: 'ekpi-trend--up' | 'ekpi-trend--down' | 'ekpi-trend--neutral'; trendIcon: 'trending-up' | 'trending-down' | 'minus' }
    cost: string
    co2: string
    co2Trend: string
    chartTitle: string
    chartSub: string
    periodLabel: string
}

// Sets de habitaciones por índice de casa (alternados, para soportar N casas).
const ROOM_SETS: string[][] = [
    ['Sala de estar', 'Dormitorio', 'Cocina', 'Baño', 'Garaje'],
    ['Living', 'Hab. principal', 'Habitación 2', 'Jardín', 'Oficina', 'Comedor'],
]

// kWh por habitación (mock).
const KWH_BY_ROOM: Record<string, number> = {
    'Sala de estar': 1.2, 'Dormitorio': 0.8, 'Cocina': 1.8, 'Baño': 0.3, 'Garaje': 0.5,
    'Living': 0.9, 'Hab. principal': 1.1, 'Habitación 2': 0.6,
    'Jardín': 0.4, 'Oficina': 1.0, 'Comedor': 0.7,
}

// Dispositivos por habitación (mock).
const DEVICES_BY_ROOM: Record<string, { icon: string; name: string; on: boolean }[]> = {
    'Sala de estar': [
        { icon: 'lightbulb', name: 'Luz principal',      on: true },
        { icon: 'wind',      name: 'Aire acondicionado', on: false },
        { icon: 'speaker',   name: 'Parlante sala',      on: false },
    ],
    'Dormitorio': [
        { icon: 'lightbulb', name: 'Luz techo', on: false },
        { icon: 'blinds',    name: 'Persiana',  on: false },
    ],
    'Cocina': [
        { icon: 'lightbulb',   name: 'Luz cocina',   on: true },
        { icon: 'oven',        name: 'Horno',         on: false },
        { icon: 'droplets',    name: 'Grifo cocina',  on: false },
        { icon: 'thermometer', name: 'Heladera',      on: true },
    ],
    'Baño': [
        { icon: 'lightbulb', name: 'Luz baño',   on: false },
        { icon: 'droplets',  name: 'Grifo baño', on: false },
    ],
    'Garaje': [
        { icon: 'door-open', name: 'Puerta garaje', on: true },
        { icon: 'lightbulb', name: 'Luz exterior',  on: true },
    ],
    'Living': [
        { icon: 'lightbulb', name: 'Luz living',     on: true },
        { icon: 'speaker',   name: 'Parlante smart', on: false },
    ],
    'Hab. principal': [
        { icon: 'lightbulb', name: 'Luz principal',      on: true },
        { icon: 'wind',      name: 'Aire acondicionado', on: true },
        { icon: 'lock',      name: 'Cerradura smart',    on: false },
    ],
    'Habitación 2': [
        { icon: 'lightbulb', name: 'Luz habitación', on: false },
        { icon: 'blinds',    name: 'Persiana',        on: false },
    ],
    'Jardín': [
        { icon: 'droplets',  name: 'Riego automático', on: true },
        { icon: 'lightbulb', name: 'Iluminación',      on: false },
    ],
    'Oficina': [
        { icon: 'lightbulb', name: 'Luz oficina', on: false },
        { icon: 'blinds',    name: 'Persiana',    on: false },
        { icon: 'speaker',   name: 'Parlante',    on: false },
    ],
    'Comedor': [
        { icon: 'lightbulb', name: 'Araña',      on: true },
        { icon: 'bot',       name: 'Aspiradora', on: false },
    ],
}

// kWh por dispositivo conocido (mock).
const KWH_BY_DEVICE: Record<string, number> = {
    'Aire acondicionado': 1.4, 'Horno': 0.9, 'Heladera': 0.8,
    'Aspiradora': 0.6, 'Riego automático': 0.5,
    'Grifo cocina': 0.3, 'Luz principal': 0.2,
}

// kWh total por casa según período (mock — orden por índice de casa).
const KWH_BY_HOME_AND_PERIOD: Record<Period, number[]> = {
    dia:    [4.2, 2.8, 1.9, 3.5],
    semana: [28.4, 19.6, 13.8, 24.1],
    mes:    [89, 62, 43, 76],
}

const HOME_PALETTE = ['#1A237E', '#6366F1']
const COST_PER_KWH = 14.5
const CO2_PER_KWH = 0.37

// Mapa de habitación → ícono de Lucide.
export function roomIcon(name: string): string {
    const n = (name || '').toLowerCase()
    if (n.includes('sala') || n.includes('living') || n.includes('estar')) return 'sofa'
    if (n.includes('dorm') || n.includes('hab') || n.includes('cuarto'))   return 'bed'
    if (n.includes('cocin'))                                                 return 'utensils'
    if (n.includes('ba'))                                                    return 'droplets'
    if (n.includes('garaj') || n.includes('garage'))                        return 'car'
    if (n.includes('jard') || n.includes('terraza'))                        return 'trees'
    if (n.includes('ofici'))                                                 return 'briefcase'
    if (n.includes('comedor'))                                               return 'utensils-crossed'
    return 'layout-grid'
}

// Devuelve las habitaciones (mock) que tendría una casa según su índice.
export function getRoomsForHomeIndex(idx: number): string[] {
    return ROOM_SETS[idx % ROOM_SETS.length]
}

// Habitaciones planas con consumo, usando las rooms reales traídas de la API.
export function getEnergyRoomData(
    selectedHomes: HomeBasic[],
    allHomes: HomeBasic[],
    roomsByHome: Record<string, { id: string; name: string }[]>,
): RoomConsumption[] {
    const rooms: Omit<RoomConsumption, 'pct'>[] = selectedHomes.flatMap(home => {
        const idx = allHomes.findIndex(h => h.id === home.id)
        const homeRooms = roomsByHome[home.id] ?? []
        return homeRooms.map(r => ({
            name: r.name,
            homeName: home.name,
            icon: roomIcon(r.name),
            kwh: KWH_BY_ROOM[r.name] ?? 0.5,
            color: HOME_PALETTE[idx % HOME_PALETTE.length],
        }))
    })
    const max = Math.max(...rooms.map(r => r.kwh), 0.1)
    return rooms.map(r => ({ ...r, pct: Math.round((r.kwh / max) * 100) }))
}

// Top 5 dispositivos con mayor consumo.
export function getTopConsumers(selectedHomes: HomeBasic[], allHomes: HomeBasic[]): DeviceConsumption[] {
    const allDevs = selectedHomes.flatMap(home => {
        const idx = allHomes.findIndex(h => h.id === home.id)
        const rooms = getRoomsForHomeIndex(Math.max(0, idx))
        return rooms.flatMap(r =>
            (DEVICES_BY_ROOM[r] || []).map(d => ({ ...d, roomName: r, homeName: home.name }))
        )
    })
    const withKwh = allDevs.map((d, i) => ({
        ...d,
        kwh: KWH_BY_DEVICE[d.name] ?? parseFloat(((i % 5) * 0.1 + 0.1).toFixed(1)),
    }))
        .sort((a, b) => b.kwh - a.kwh)
        .slice(0, 5)
    const maxKwh = withKwh[0]?.kwh || 1
    return withKwh.map(d => ({ ...d, pct: Math.round((d.kwh / maxKwh) * 100) }))
}

// Consumo por hogar (lista para el panel "Consumo por hogar").
export function getHomeEnergyData(selectedHomes: HomeBasic[], allHomes: HomeBasic[], period: Period): HomeConsumption[] {
    const vals = selectedHomes.map(home => {
        const idx = allHomes.findIndex(h => h.id === home.id)
        const kwh = KWH_BY_HOME_AND_PERIOD[period][Math.max(0, idx)] ?? 2.5
        return {
            id: home.id,
            name: home.name,
            kwh,
            color: HOME_PALETTE[idx % HOME_PALETTE.length],
        }
    })
    const max = Math.max(...vals.map(v => v.kwh), 0.1)
    return vals.map(v => ({ ...v, pct: Math.round((v.kwh / max) * 100) }))
}

export interface EnergyBarDatum {
    label: string
    values: { homeId: string; homeName: string; color: string; kwh: number; pct: number }[]
}

export function getHourlyEnergyData(
    selectedHomes: HomeBasic[],
    allHomes: HomeBasic[],
    period: Period,
): EnergyBarDatum[] {
    const configs: Record<Period, { labels: string[]; series: number[][] }> = {
        dia: {
            labels: ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
            series: [
                [0.1, 0.3, 0.2, 0.5, 0.7, 0.9, 1.2, 0.8, 0.4],
                [0.05, 0.2, 0.1, 0.3, 0.5, 0.7, 0.8, 0.5, 0.2],
                [0.08, 0.18, 0.12, 0.28, 0.4, 0.55, 0.7, 0.48, 0.22],
                [0.12, 0.25, 0.18, 0.36, 0.52, 0.68, 0.92, 0.64, 0.31],
            ],
        },
        semana: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            series: [
                [3.2, 3.8, 3.5, 4.1, 4.5, 5.2, 4.1],
                [2.1, 2.4, 2.3, 2.8, 3.1, 3.5, 2.9],
                [1.8, 2.0, 2.1, 2.2, 2.6, 2.9, 2.4],
                [2.7, 3.0, 3.2, 3.5, 3.9, 4.2, 3.6],
            ],
        },
        mes: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            series: [
                [18, 22, 20, 24],
                [13, 15, 14, 18],
                [10, 11, 12, 14],
                [15, 17, 18, 21],
            ],
        },
    }

    const config = configs[period]
    const allValues = selectedHomes.flatMap((home) => {
        const idx = allHomes.findIndex(h => h.id === home.id)
        const series = config.series[Math.max(0, idx)] ?? config.series[0]
        return series
    })
    const max = Math.max(...allValues, 0.1)

    return config.labels.map((label, pointIdx) => ({
        label,
        values: selectedHomes.map((home) => {
            const idx = allHomes.findIndex(h => h.id === home.id)
            const series = config.series[Math.max(0, idx)] ?? config.series[0]
            const kwh = series[pointIdx] ?? 0
            return {
                homeId: home.id,
                homeName: home.name,
                color: HOME_PALETTE[idx % HOME_PALETTE.length],
                kwh,
                pct: Math.round((kwh / max) * 100),
            }
        }),
    }))
}

// 4 KPIs principales: consumo, costo, proyección, CO2.
export function getEnergyKpis(selectedHomes: HomeBasic[], allHomes: HomeBasic[], period: Period): EnergyKpis {
    const totalKwh = selectedHomes.reduce((sum, h) => {
        const idx = allHomes.findIndex(hh => hh.id === h.id)
        return sum + (KWH_BY_HOME_AND_PERIOD[period][Math.max(0, idx)] ?? 2.5)
    }, 0)
    const cost = Math.round(totalKwh * COST_PER_KWH)
    const co2 = Math.round(totalKwh * CO2_PER_KWH)
    const costStr = `$${cost.toLocaleString('es-AR')}`

    if (period === 'dia') {
        const prev = totalKwh * 0.92
        const diff = Math.round(Math.abs((totalKwh - prev) / prev * 100))
        return {
            main:      { val: totalKwh.toFixed(1), label: 'Consumo hoy',    trend: `${diff}% vs ayer`,   trendClass: 'ekpi-trend--up',   trendIcon: 'trending-up' },
            secondary: { val: (totalKwh * 21).toFixed(0), label: 'Proyección mes', trend: '5% vs anterior', trendClass: 'ekpi-trend--down', trendIcon: 'trending-down' },
            cost: costStr, co2: co2.toString(), co2Trend: '3% este mes',
            chartTitle: 'Consumo por hora', chartSub: 'hoy · kWh', periodLabel: 'Hoy',
        }
    }
    if (period === 'semana') {
        const prev = totalKwh * 1.06
        const diff = Math.round(Math.abs((totalKwh - prev) / prev * 100))
        return {
            main:      { val: totalKwh.toFixed(1), label: 'Esta semana',    trend: `${diff}% vs sem. ant.`, trendClass: 'ekpi-trend--down', trendIcon: 'trending-down' },
            secondary: { val: (totalKwh * 4.3).toFixed(0), label: 'Proyección mes', trend: '5% vs anterior', trendClass: 'ekpi-trend--down', trendIcon: 'trending-down' },
            cost: costStr, co2: co2.toString(), co2Trend: '6% esta semana',
            chartTitle: 'Consumo diario', chartSub: 'últimos 7 días · kWh', periodLabel: 'Esta semana',
        }
    }
    return {
        main:      { val: totalKwh.toFixed(0), label: 'Este mes',         trend: '5% vs mes ant.', trendClass: 'ekpi-trend--down', trendIcon: 'trending-down' },
        secondary: { val: Math.round(totalKwh * 1.08).toString(), label: 'Mes anterior', trend: '5% de reducción', trendClass: 'ekpi-trend--down', trendIcon: 'trending-down' },
        cost: costStr, co2: co2.toString(), co2Trend: '5% vs mes ant.',
        chartTitle: 'Consumo semanal', chartSub: 'este mes · kWh', periodLabel: 'Este mes',
    }
}
