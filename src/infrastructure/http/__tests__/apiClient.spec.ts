import { describe, it, expect, beforeEach, vi } from 'vitest'
import { apiClient } from '../apiClient'
import { tokenService } from '../../token/tokenService'
import axios from 'axios'

describe('apiClient', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it('should inject Authorization header if token exists', async () => {
        tokenService.setToken('mock-jwt-token')

        const dummyConfig = { headers: {} } as any
        const requestInterceptor = (apiClient.interceptors.request as any).handlers[0].fulfilled

        const result = requestInterceptor(dummyConfig)
        expect(result.headers.Authorization).toBe('Bearer mock-jwt-token')
    })

    it('should dispatch auth:expired event on 401 response error', async () => {
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
        const responseInterceptorError = (apiClient.interceptors.response as any).handlers[0].rejected

        const mockAxiosError = {
            isAxiosError: true,
            response: { status: 401 }
        }
        vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

        await expect(responseInterceptorError(mockAxiosError)).rejects.toEqual(mockAxiosError)
        expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent))
        expect(dispatchSpy.mock.calls[0][0].type).toBe('auth:expired')
    })
})