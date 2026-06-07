import { describe, it, expect, beforeEach, vi } from 'vitest'
import router from '../index'
import { tokenService } from '../../infrastructure/token/tokenService'

describe('Router Navigation Guards', () => {
    beforeEach(async () => {
        localStorage.clear()
        vi.restoreAllMocks()
        await router.push('/')
    })

    it('should redirect an unauthenticated user to login when accessing a protected route', async () => {
        vi.spyOn(tokenService, 'getToken').mockReturnValue(null)

        await router.push('/profile')

        expect(router.currentRoute.value.name).toBe('login')
    })

    it('should redirect an authenticated user to home when trying to access the login page', async () => {
        vi.spyOn(tokenService, 'getToken').mockReturnValue('mock-jwt-token')

        await router.push('/login')

        expect(router.currentRoute.value.name).toBe('home')
    })

    it('should allow access to auth callback route even without a token', async () => {
        vi.spyOn(tokenService, 'getToken').mockReturnValue(null)

        await router.push('/auth/callback')

        expect(router.currentRoute.value.name).toBe('auth-callback')
    })
})