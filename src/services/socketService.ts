import { io } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth'


let socket: ReturnType<typeof io> | null = null

export function connectSocket(){
     if (socket) return socket  // ← no crear uno nuevo si ya existe
     const auth = useAuthStore()
     if (!auth.token) return null
      socket = io('https://hci.it.itba.edu.ar/', {
        auth: { token: auth.token }   
     })
     return socket
  }

export function getSocket(){
   return socket
}

