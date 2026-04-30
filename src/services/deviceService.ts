import { apiDelete, apiGet, apiPost } from '@/utils/api'

let cachedTypes: Record<string, string> | null = null

//getters
export async function getDeviceTypeId(name: string): Promise<string> {
   if (!cachedTypes) {
      const types = await apiGet('/devicetypes')
      cachedTypes = {}        
      for (const t of types) {
         cachedTypes[t.name] = t.id
      }
   }
   return cachedTypes[name]
  }



//creators
export async function newDeviceInRoom(name: string, type: Object, room: Object) {
   console.log('body:', {name, type, room, metadata: {}}) 
   return await apiPost('/devices', {name, type, room, metadata: {}})
}




//deleters