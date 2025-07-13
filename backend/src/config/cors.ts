import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    const whiteList = [
      process.env.FRONTEND_URL,  // tu frontend Netlify
      undefined                  // para peticiones sin origin (ej: Postman)
    ]

    if (whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS error: origen ${origin} no permitido`))
    }
  },
  credentials: true, // si usas cookies o headers de autenticación
}
