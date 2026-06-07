import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserProfile } from '../composables/useUserProfile'
import { apiClient } from '@/infrastructure/http/apiClient'

vi.mock('@/infrastructure/http/apiClient', () => ({
    apiClient: {
        get: vi.fn()
    }
}))

describe('useUserProfile', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should initialize with default pristine states', () => {
        const { profile, loading, error } = useUserProfile()

        expect(profile.value).toBeNull()
        expect(loading.value).toBe(false)
        expect(error.value).toBeNull()
    })

    it('should successfully capture and populate user profile metadata from backend node', async () => {
        const mockUser = {
            id: 'uuid-123',
            name: 'Thaisa Lourenço',
            email: 'fulana@gmail.com',
            photoUrl: 'https://foto.url'
        }

        vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockUser })

        const { profile, loading, error, fetchProfile } = useUserProfile()

        const promise = fetchProfile()
        expect(loading.value).toBe(true)

        await promise

        expect(loading.value).toBe(false)
        expect(profile.value).toEqual(mockUser)
        expect(error.value).toBeNull()
        expect(apiClient.get).toHaveBeenCalledWith('/mvp1/user/me', expect.objectContaining({
            signal: expect.any(AbortSignal)
        }))
    })

    it('should gracefully handle network crash and set deterministic error string', async () => {
        vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Internal Server Error'))

        const { profile, loading, error, fetchProfile } = useUserProfile()

        await fetchProfile()

        expect(loading.value).toBe(false)
        expect(profile.value).toBeNull()
        expect(error.value).toBe('Não foi possível carregar os dados do perfil.')
    })
})