


export async function apiPost(ruta: string, body: object){
   const res = await fetch(`https://hci.it.itba.edu.ar/api${ruta}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'X-API-Key': import.meta.env.VITE_API_KEY,
         },
         body: JSON.stringify(body),
      })
      return await res.json()
}