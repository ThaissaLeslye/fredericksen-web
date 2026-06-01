import axios from 'axios'
import { tokenService } from '../token/tokenService'

export const apiClient = axios.create({
    baseURL: (import.meta.env.VITE_API_URL as string) || '',
    timeout: 5000, // RNF03: Limite de 5s para performance
})

// Interceptor de Requisição: Puxa o token dinamicamente
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenService.getToken()
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: unknown) => Promise.reject(error)
)

// Interceptor de Resposta: Intercepta 401 (RFE04) de forma isolada
apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            window.dispatchEvent(new CustomEvent('auth:expired'))
        }
        return Promise.reject(error)
    }
)