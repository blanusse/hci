import { apiDelete, apiGet, apiPost } from '@/utils/api'
import { deleteRoom, getDeviceLogs } from './deviceService'

//getters

export async function getHomes(){
   return await apiGet('/homes')
}

export async function getHome(homeId: string){
   return await apiGet(`/homes/${homeId}`)

}

export async function getEvents(limit = 50) {                                                                                                             
     return await getDeviceLogs(limit, 0) 
  }  
export async function getRooms(homeId: string){
   return await apiGet(`/homes/${homeId}/rooms`)
}

export async function getRoomDevices(roomId: string){
   return await apiGet(`/rooms/${roomId}/devices`)
}

export async function getHomeMembers(homeId: string) {
   return await apiGet(`/homes/${homeId}/share`)
}

//creators

export async function createHome(name: string, icon: string, ownerEmail: string, ownerName: string){
   return await apiPost('/homes', {name, metadata: {icon, ownerEmail, ownerName}})
}

export async function createRoomInHome(home: Object, name: string, icon: string =''){
   return await apiPost(`/rooms`, {name,home, metadata: {icon}})
}


export async function shareHome(homeId: string, emails: string[]) {
   return await apiPost(`/homes/${homeId}/share`, { emails })
}


//deletes

export async function deleteHome(homeId: string){
   const rooms = await getRooms(homeId)
   for(const room of rooms){
      await deleteRoom(room.id)
   }
   return await apiDelete(`/homes/${homeId}`)
}

export async function deleteRoomFromHome(roomId: string){
   return await apiDelete(`/homes/rooms/${roomId}`)
}

export async function removeHomeMember(homeId: string, userMail: string) {
   console.log(homeId, userMail)
   return await apiDelete(`/homes/${homeId}/share/`, {emails: [userMail]})
}



//faltan mas funciones de la API

