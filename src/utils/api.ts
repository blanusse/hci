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
   const res = await api.post(ruta, body)
   return res.data
}

export async function apiGet(ruta: string){
   const res = await api.get(ruta)
   return res.data
}

export async function apiDelete(ruta :string) {
   const res = await api.delete(ruta)
   return res.data
}
