import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useProfile } from '../composables/useProfile'
import { apiClient } from '@/infrastructure/http/apiClient'

vi.mock('@/infrastructure/http/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        patch: vi.fn()
    }
}))

describe('useProfile Composable', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should initialize with correct default pristine states as strings', () => {
        const { medications, allergies, bloodType, loading, error, success } = useProfile()

        expect(medications.value).toBe('')
        expect(allergies.value).toBe('')
        expect(bloodType.value).toBe('')
        expect(loading.value).toBe(false)
        expect(error.value).toBeNull()
        expect(success.value).toBe(false)
    })

    it('should successfully fetch profile metadata from backend node structure', async () => {
        const mockProfile = {
            id: 'uuid-123',
            name: 'Thaisa Leslye Lourenço',
            email: 'fulana.tal@gmail.com',
            photoUrl: null,
            medications: 'Med1, Med2',
            allergies: 'N/A',
            bloodType: 'O_POSITIVE'
        }

        vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockProfile })

        const { medications, allergies, bloodType, loadProfile } = useProfile()
        await loadProfile()

        expect(medications.value).toBe('Med1, Med2')
        expect(allergies.value).toBe('N/A')
        expect(bloodType.value).toBe('O_POSITIVE')
        expect(apiClient.get).toHaveBeenCalledWith('/mvp1/profile')
    })

    it('should successfully persist completely empty or cleared values without local blocking', async () => {
        vi.mocked(apiClient.get).mockResolvedValueOnce({
            data: {
                id: 'uuid-123',
                name: 'Thaisa Leslye Lourenço',
                email: 'fulana.tal@gmail.com',
                photoUrl: null,
                medications: 'Med1, Med2',
                allergies: 'Poeira',
                bloodType: 'O_POSITIVE'
            }
        })
        vi.mocked(apiClient.patch).mockResolvedValueOnce({ data: {} })

        const { medications, allergies, bloodType, success, error, updateProfile, loadProfile } = useProfile()
        await loadProfile()

        medications.value = ''
        allergies.value = ''
        bloodType.value = ''

        const result = await updateProfile()

        expect(result).toBe(true)
        expect(success.value).toBe(true)
        expect(error.value).toBeNull()
        expect(apiClient.patch).toHaveBeenCalledWith('/mvp1/profile', {
            medications: '',
            allergies: '',
            bloodType: null
        })
    })

    it('should fire PATCH request with exact contract nomenclature when payloads are filled', async () => {
        vi.mocked(apiClient.patch).mockResolvedValueOnce({ data: {} })

        const { medications, allergies, bloodType, success, error, updateProfile } = useProfile()

        medications.value = 'Dipirona'
        allergies.value = 'Poeira'
        bloodType.value = 'O_NEGATIVE'

        const result = await updateProfile()

        expect(result).toBe(true)
        expect(success.value).toBe(true)
        expect(error.value).toBeNull()
        expect(apiClient.patch).toHaveBeenCalledWith('/mvp1/profile', {
            medications: 'Dipirona',
            allergies: 'Poeira',
            bloodType: 'O_NEGATIVE'
        })
    })

    it('should forward data without execution or mutations when handling malicious XSS scripts inside input states', async () => {
        vi.mocked(apiClient.patch).mockResolvedValueOnce({ data: {} })
        const { medications, updateProfile } = useProfile()

        const maliciousPayload = "<script>alert('xss')</script>"
        medications.value = maliciousPayload

        const result = await updateProfile()

        expect(result).toBe(true)
        expect(apiClient.patch).toHaveBeenCalledWith('/mvp1/profile', expect.objectContaining({
            medications: maliciousPayload
        }))
    })

    it('should return false immediately from updateProfile if loading state is active', async () => {
        const TestComponent = defineComponent({
            setup() {
                const { loading, updateProfile } = useProfile()
                return { loading, updateProfile }
            },
            template: '<div />'
        })
        const wrapper = mount(TestComponent)
        wrapper.vm.loading = true

        const result = await wrapper.vm.updateProfile()
        expect(result).toBe(false)
    })

    it('should clear previous success timer when updateProfile runs successfully again', async () => {
        vi.mocked(apiClient.patch).mockResolvedValue({ data: {} })
        vi.useFakeTimers()
        const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

        const TestComponent = defineComponent({
            setup() {
                const { medications, updateProfile } = useProfile()
                return { medications, updateProfile }
            },
            template: '<div />'
        })
        const wrapper = mount(TestComponent)

        wrapper.vm.medications = 'Primeiro Medicamento'
        await wrapper.vm.updateProfile()

        wrapper.vm.medications = 'Segundo Medicamento (Modificado)'
        await wrapper.vm.updateProfile()

        expect(clearTimeoutSpy).toHaveBeenCalled()
        vi.useRealTimers()
    })

    it('should clear active success timer when component triggers onUnmounted lifecycle hook', async () => {
        vi.mocked(apiClient.patch).mockResolvedValue({ data: {} })
        vi.useFakeTimers()
        const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

        const TestComponent = defineComponent({
            setup() {
                const { medications, updateProfile } = useProfile()
                return { medications, updateProfile }
            },
            template: '<div />'
        })
        const wrapper = mount(TestComponent)
        wrapper.vm.medications = 'Medicamento de Desmonte'
        await wrapper.vm.updateProfile()

        wrapper.unmount()

        expect(clearTimeoutSpy).toHaveBeenCalled()
        vi.useRealTimers()
    })
})