import { ref, shallowRef } from 'vue'
import { apiClient } from '@/infrastructure/http/apiClient'
import type { Profile, UpdateProfilePayload } from '@/types/profile'

export function useProfile() {
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const success = ref<boolean>(false)

    const medicaments = shallowRef<string[]>([])
    const allergies = shallowRef<string[]>([])
    const bloodType = ref<string>('')

    async function loadProfile(): Promise<void> {
        loading.value = true
        error.value = null
        try {
            const response = await apiClient.get<Profile>('/mvp1/profile')
            medicaments.value = response.data.medicaments
            allergies.value = response.data.allergies
            bloodType.value = response.data.bloodType
        } catch {
            error.value = 'Não foi possível carregar os dados do perfil.'
        } finally {
            loading.value = false
        }
    }

    async function updateProfile(): Promise<boolean> {
        if (!bloodType.value.trim()) {
            error.value = 'O tipo sanguíneo é obrigatório.'
            return false
        }

        if (medicaments.value.length === 0 || allergies.value.length === 0) {
            error.value = 'Medicamentos e Alergias precisam conter ao menos um registro.'
            return false
        }

        loading.value = true
        error.value = null
        success.value = false

        const payload: UpdateProfilePayload = {
            medicaments: medicaments.value,
            allergies: allergies.value,
            bloodType: bloodType.value
        }

        try {
            await apiClient.patch<void>('/mvp1/profile', payload)
            success.value = true
            return true
        } catch {
            error.value = 'Falha ao atualizar o perfil médico. Tente novamente.'
            return false
        } finally {
            loading.value = false
        }
    }

    function setMedicaments(list: string[]): void {
        medicaments.value = [...list]
    }

    function setAllergies(list: string[]): void {
        allergies.value = [...list]
    }

    return {
        loading,
        error,
        success,
        medicaments,
        allergies,
        bloodType,
        loadProfile,
        updateProfile,
        setMedicaments,
        setAllergies
    }
}