import { apiDelete, apiGet, apiPatch, apiPost } from '@/utils/api'

//"mapa" con nameType - typeId
let cachedTypes: Record<string, string> | null = null

//"mapa" con typeId - nameType
let cachedTypesById: Record<string, string> | null = null

//getters

//carga en cachedTypes los tipos de dispositivos que hay con su id
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

export async function getDeviceTypeName(id: string): Promise<string>{
     if (!cachedTypesById) {
        const types = await apiGet('/devicetypes')
        cachedTypesById = {}
        for (const t of types) {
           cachedTypesById[t.id] = t.name
         }
      }
     return cachedTypesById[id]
} 

export async function getDevice(deviceId: string){
   return await apiGet(`devices/${deviceId}`)
}


export async function getDeviceType(deviceType: string){
   const id = await getDeviceTypeId(deviceType)
   return await apiGet(`devicetypes/${id}`)
}

//creators
export async function newDeviceInRoom(name: string, type: Object, room: Object) {
   console.log('body:', {name, type, room, metadata: {}}) 
   return await apiPost('/devices', {name, type, room, metadata: {}})
}

export async function moverDevice(deviceId: string, roomDestinoId: string){
   await apiDelete(`/rooms/devices/${deviceId}`)
   await apiPost(`/rooms/${roomDestinoId}/devices/${deviceId}`, {})
}




//deleters

export async function deleteDevice(deviceId: string) {
   return await apiDelete(`/devices/${deviceId}`)
}

//patchers

export async function manipulateDevice(deviceId: string, actionName: string , params: any[] = []) {
   return await apiPatch(`/devices/${deviceId}/${actionName}`, params)
}