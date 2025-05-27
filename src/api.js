import axios from 'axios'
// Maneja la ruta del backend hecho en python con FastApi, esto se puede eliminar o cambiar por la ruta del nuevo backend, que se hará en express.js
const api = axios.create({
    baseURL: "http://10.208.31.170:8000" // ruta del pc de despliegue del backEnd 
})

// Interceptor de respuesta
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login" // redirección inmediata
    }
    return Promise.reject(error)
  }
)

export default api