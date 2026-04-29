import { apiDelete, apiGet, apiPost } from '@/utils/api'

export async function getHomes(){
   return await apiGet('/homes')
}



export async function createHome(name: string){
   return await apiPost('/homes', {name, metadata: {}})
}

export async function getRooms(homeId: string){
   return await apiGet(`/homes/${homeId}/rooms`)
}

export async function getRoomDevices(roomId: string){
   return await apiGet(`/rooms/${roomId}/devices`)
}

export async function deleteHome(homeId: string){
   return await apiDelete(`/homes/${homeId}`)
}

export async function deleteRoomFromHome(roomId: string){
   return await apiDelete(`/homes/rooms/${roomId}`)
}




//faltan mas funciones de la API



// casa campo