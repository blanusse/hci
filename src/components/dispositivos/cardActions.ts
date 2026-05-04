import { defineComponent, ref, h } from 'vue'
import { manipulateDevice } from '@/services/deviceService'

function toggleOnOff(device: any, encendido: ReturnType<typeof ref<boolean>>, emit: any) {
   return async (e: Event) => {
      e.stopPropagation()
      const action = encendido.value ? 'turnOff' : 'turnOn'
      encendido.value = !encendido.value
      emit('update:state', encendido.value ? 'on' : 'off')
      await manipulateDevice(device.id, action)
   }
}

export const LamparaCardActions = defineComponent({
   props: { device: { type: Object, required: true } },
   emits: ['update:state'],
   setup(props, { emit }) {
      const encendido = ref(props.device.state?.status === 'on')
      return () => h('button',
         { class: ['card-toggle', { on: encendido.value }], onClick: toggleOnOff(props.device, encendido, emit) },
         [h('span', { class: 'card-toggle-knob' })]
      )
   }
})

export const AireCardActions = defineComponent({
   props: { device: { type: Object, required: true } },
   emits: ['update:state'],
   setup(props, { emit }) {
      const encendido = ref(props.device.state?.status === 'on')
      return () => h('button',
         { class: ['card-toggle', { on: encendido.value }], onClick: toggleOnOff(props.device, encendido, emit) },
         [h('span', { class: 'card-toggle-knob' })]
      )
   }
})

export const ParlanteCardActions = defineComponent({
   props: { device: { type: Object, required: true } },
   emits: ['update:state'],
   setup(props, { emit }) {
      const reproduciendo = ref(props.device.state?.status === 'playing')
      async function toggle(e: Event) {
         e.stopPropagation()
         if (reproduciendo.value) {
            await manipulateDevice(props.device.id, 'pause')
            reproduciendo.value = false
            emit('update:state', 'paused')
         } else {
            await manipulateDevice(props.device.id, 'play')
            reproduciendo.value = true
            emit('update:state', 'playing')
         }
      }
      return () => h('button',
         { class: ['card-action-btn', { active: reproduciendo.value }], onClick: toggle },
         [
            reproduciendo.value
               ? h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'currentColor' }, [
                    h('rect', { x: 6, y: 4, width: 4, height: 16 }),
                    h('rect', { x: 14, y: 4, width: 4, height: 16 })
                 ])
               : h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'currentColor' }, [
                    h('polygon', { points: '5 3 19 12 5 21 5 3' })
                 ])
         ]
      )
   }
})

export const GrifoCardActions = defineComponent({
   props: { device: { type: Object, required: true } },
   emits: ['update:state'],
   setup(props, { emit }) {
      const abierto = ref(props.device.state?.status === 'opened')
      async function toggle(e: Event) {
         e.stopPropagation()
         const action = abierto.value ? 'close' : 'open'
         abierto.value = !abierto.value
         emit('update:state', abierto.value ? 'opened' : 'closed')
         await manipulateDevice(props.device.id, action)
      }
      return () => h('button',
         { class: ['card-action-btn', { active: abierto.value }], onClick: toggle },
         [
            h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
               h('path', { d: 'M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z' }),
               h('path', { d: 'M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97' })
            ])
         ]
      )
   }
})
