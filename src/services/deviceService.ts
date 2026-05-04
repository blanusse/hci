import { apiDelete, apiGet, apiPatch, apiPost } from '@/utils/api'
import { deleteRoomFromHome, getRoomDevices,  } from './homeService'

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

//carga en cachedTypes los ids de los tipos con su nombre
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

//devuelve la info de un dispositivo
export async function getDevice(deviceId: string){
   return await apiGet(`devices/${deviceId}`)
}

//devuelve el tipo de dispositivo
export async function getDeviceType(deviceType: string){
   const id = await getDeviceTypeId(deviceType)
   return await apiGet(`devicetypes/${id}`)
}
export async function getDeviceState(deviceId: string){
   return await apiGet(`devices/${deviceId}/state`)
}

export async function getDeviceTypeById(typeId: string){
   return await apiGet(`devicetypes/${typeId}`)
}

export async function getDeviceLogs(limit: number, offset:number) {
   return await apiGet(`/devices/logs/limit/${limit}/offset/${offset}`)
}

export async function getDeviceTypesInfo(): Promise<Record<string, { powerWatts: number; name: string }>> {
   const types = await apiGet('/devicetypes')
   const map: Record<string, { powerWatts: number; name: string }> = {}
   for (const t of types) {
      map[t.id] = { powerWatts: t.powerUsage ?? 0, name: t.name ?? '' }
   }
   return map
}



//creators
export async function newDeviceInRoom(name: string, type: Object, room: Object, metadata: object={}) {
   return await apiPost('/devices', {name, type, room, metadata})
}

export async function moverDevice(deviceId: string, roomDestinoId: string){
   await deleteDeviceFromRoom(deviceId)
   await apiPost(`/rooms/${roomDestinoId}/devices/${deviceId}`, {})
}




//deleters


export async function deleteDevice(deviceId: string) {
   return await apiDelete(`/devices/${deviceId}`)
}

export async function deleteDeviceFromRoom(deviceId: string){
   await apiDelete(`/rooms/devices/${deviceId}`)
}

export async function deleteRoom(roomId: string) {
   const devices = await getRoomDevices(roomId)
   for(const device of devices){
      await deleteDeviceFromRoom(device.id)
      await deleteDevice(device.id)
   }
   await deleteRoomFromHome(roomId)
   return await apiDelete(`/rooms/${roomId}`)
}






//patchers

export async function manipulateDevice(deviceId: string, actionName: string , params: any[] = []) {
   return await apiPatch(`/devices/${deviceId}/${actionName}`, params)
}