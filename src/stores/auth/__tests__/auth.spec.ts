import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore, type UserSession } from '../auth'

describe('useAuthStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it('should initialize with default empty state', () => {
        const store = useAuthStore()
        expect(store.user).toBeNull()
        expect(store.token).toBeNull()
        expect(store.isAuthenticated).toBe(false)
    })

    it('should correctly populate state on setSession', () => {
        const store = useAuthStore()
        const mockUser: UserSession = {
            id: 'uuid-123',
            name: 'Thaisa Lourenço',
            email: 'fulana.tal@gmail.com',
            photoUrl: 'https://foto.url'
        }
        const mockToken = 'mock-jwt-token'

        store.setSession(mockToken, mockUser)

        expect(store.token).toBe(mockToken)
        expect(store.user).toEqual(mockUser)
        expect(store.isAuthenticated).toBe(true)
        expect(localStorage.getItem('auth_token')).toBe(mockToken)
    })

    it('should clean memory and storage keys completely on logout', () => {
        const store = useAuthStore()
        const mockUser: UserSession = {
            id: 'uuid-123',
            name: 'Thaisa Lourenço',
            email: 'fulana.tal@gmail.com',
            photoUrl: 'https://foto.url'
        }

        store.setSession('some-token', mockUser)

        vi.spyOn(window, 'location', 'get').mockReturnValue({
            ...window.location,
            href: ''
        })

        store.logout()

        expect(store.user).toBeNull()
        expect(store.token).toBeNull()
        expect(store.isAuthenticated).toBe(false)

        expect(localStorage.length).toBe(0)
    })
})