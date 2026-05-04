import axios from 'axios'

const api = axios.create({
   baseURL: 'https://hci.it.itba.edu.ar/api',
   headers: {
      'Content-Type': 'application/json',
      'X-API-Key': import.meta.env.VITE_API_KEY,
   }
})

api.interceptors.request.use((config) =>{
   const token = localStorage.getItem('token')
   if(token){
      config.headers.Authorization = `Bearer ${token}`
   }
   return config
})


export async function apiPost(ruta: string, body: object){
   try{
      
      const res = await api.post(ruta, body)
      return res.data
   }
   catch(e: any){
      console.error(`POST ${ruta}:`, e.response?.data ?? e.message)
      throw e
   }
}

export async function apiGet(ruta: string){
   try{
      const res = await api.get(ruta)
      return res.data
   }
   catch(e: any){
      console.error(`GET ${ruta}:`, e.response?.data ?? e.message)
      throw e
   }
}

export async function apiDelete(ruta :string, body: object={}) {
   try{
      const res = await api.delete(ruta, {data: body})
      return res.data
   }
   catch(e: any){
      console.error(`DELETE ${ruta}:`, e.response?.data ?? e.message)
      throw e
   }
}

export async function apiPut(ruta: string, body: object) {
   try{
      const res = await api.put(ruta, body)
      return res.data
   }
   catch(e: any){
      console.error(`PUT ${ruta}:`, e.response?.data ?? e.message)
      throw e
   }
}

export async function apiPatch(ruta :string, params: any[] = []) {
   try{

      const res = await api.patch(ruta, params)
      console.log('params:', params)
      console.log('ruta:', ruta)
      console.log('ans:', res)
      return res.data
   }
   catch(e: any){
      console.error(`PATCH ${ruta}:`, e.response?.data ?? e.message)
      throw e
   }
}

