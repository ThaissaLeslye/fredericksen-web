import { describe, it, expect, vi, beforeEach } from 'vitest'
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

    it('should initialize with correct default pristine states', () => {
        const { medicaments, allergies, bloodType, loading, error, success } = useProfile()

        expect(medicaments.value).toEqual([])
        expect(allergies.value).toEqual([])
        expect(bloodType.value).toBe('')
        expect(loading.value).toBe(false)
        expect(error.value).toBeNull()
        expect(success.value).toBe(false)
    })

    it('should successfully fetch profile metadata from backend node', async () => {
        const mockProfile = {
            id: 'uuid-123',
            name: 'Thaisa Leslye Lourenço',
            email: 'fulana.tal@gmail.com',
            photoUrl: null,
            medicaments: ['Med1', 'Med2'],
            allergies: ['N/A'],
            bloodType: 'O+'
        }

        vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockProfile })

        const { medicaments, allergies, bloodType, loadProfile } = useProfile()
        await loadProfile()

        expect(medicaments.value).toEqual(['Med1', 'Med2'])
        expect(allergies.value).toEqual(['N/A'])
        expect(bloodType.value).toBe('O+')
        expect(apiClient.get).toHaveBeenCalledWith('/mvp1/profile')
    })

    it('should reject update locally if bloodType is blank', async () => {
        const { bloodType, error, updateProfile, setMedicaments, setAllergies } = useProfile()

        bloodType.value = '   '
        setMedicaments(['Med1'])
        setAllergies(['N/A'])

        // RF03: Rejeita submissão local por ausência de tipo sanguíneo
        const result = await updateProfile()

        expect(result).toBe(false)
        expect(error.value).toBe('O tipo sanguíneo é obrigatório.')
        expect(apiClient.patch).not.toHaveBeenCalled()
    })

    it('should reject update locally if arrays are empty', async () => {
        const { bloodType, error, updateProfile } = useProfile()

        bloodType.value = 'A+'
        // medicaments e allergies vazios por padrão

        // RFE03: Rejeita a submissão localmente se dados médicos obrigatórios estiverem ausentes
        const result = await updateProfile()

        expect(result).toBe(false)
        expect(error.value).toBe('Medicamentos e Alergias precisam conter ao menos um registro.')
        expect(apiClient.patch).not.toHaveBeenCalled()
    })

    it('should fire PATCH request and set success when validations pass', async () => {
        vi.mocked(apiClient.patch).mockResolvedValueOnce({ data: {} })

        const { bloodType, success, error, updateProfile, setMedicaments, setAllergies } = useProfile()

        bloodType.value = 'O-'
        setMedicaments(['Dipirona'])
        setAllergies(['Poeira'])

        // RF03: Executa o PATCH sob payload validado de forma limpa
        const result = await updateProfile()

        expect(result).toBe(true)
        expect(success.value).toBe(true)
        expect(error.value).toBeNull()
        expect(apiClient.patch).toHaveBeenCalledWith('/mvp1/profile', {
            bloodType: 'O-',
            medicaments: ['Dipirona'],
            allergies: ['Poeira']
        })
    })
})