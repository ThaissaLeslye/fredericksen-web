import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useUserProfile } from '../composables/useUserProfile'
import { apiClient } from '@/infrastructure/http/apiClient'
import axios from 'axios'

vi.mock('@/infrastructure/http/apiClient', () => ({
    apiClient: {
        get: vi.fn()
    }
}))

describe('useUserProfile', () => {

    const mockAbort = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.restoreAllMocks()
        mockAbort.mockClear()

        vi.mock('axios', async (importOriginal) => {
            const actual = await importOriginal<typeof axios>()
            return {
                ...actual,
                isCancel: vi.fn()
            }
        })
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

    it('should silently ignore errors triggered by an intentional AbortController cancel request', async () => {
        const cancelError = new Error('Canceled')
        vi.mocked(apiClient.get).mockRejectedValueOnce(cancelError)
        vi.spyOn(axios, 'isCancel').mockReturnValueOnce(true)

        const { profile, loading, error, fetchProfile } = useUserProfile()

        await fetchProfile()

        expect(profile.value).toBeNull()
        expect(error.value).toBeNull()
        expect(loading.value).toBe(true)
    })

    it('should abort the previous flight request when fetchProfile is called multiple times consecutively', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: {} })

        const { fetchProfile } = useUserProfile()

        fetchProfile()

        expect(mockAbort).toHaveBeenCalled()
    })

    it('should abort any pending active request when the host component unmounts', () => {
        vi.mocked(apiClient.get).mockReturnValue(new Promise(() => { }))

        const TestComponent = defineComponent({
            setup() {
                const { fetchProfile } = useUserProfile()
                fetchProfile()
                return {}
            },
            template: '<div />'
        })

        const wrapper = mount(TestComponent)
        wrapper.unmount()

        expect(mockAbort).toHaveBeenCalled()
    })
})