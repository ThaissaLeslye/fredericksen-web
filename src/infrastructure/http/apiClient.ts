import axios from 'axios'
import { tokenService } from '../token/tokenService'

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    timeout: 5000,
})

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

apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                window.dispatchEvent(new CustomEvent('auth:expired'))
            }

            if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
                window.dispatchEvent(new CustomEvent('network:midflight-error'))
            }
        }
        return Promise.reject(error)
    }
)