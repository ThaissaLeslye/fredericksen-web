import { ref } from 'vue'
import { apiClient } from '@/infrastructure/http/apiClient'
import type { Profile, UpdateProfilePayload, BackendBloodType } from '@/types/profile'

export function useProfile() {
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const success = ref<boolean>(false)

    const medications = ref<string>('')
    const allergies = ref<string>('')
    const bloodType = ref<BackendBloodType | ''>('')

    async function loadProfile(): Promise<void> {
        loading.value = true
        error.value = null
        try {
            const response = await apiClient.get<Profile>('/mvp1/profile')
            medications.value = response.data.medications || ''
            allergies.value = response.data.allergies || ''
            bloodType.value = response.data.bloodType || ''
        } catch {
            error.value = 'Não foi possível carregar os dados do perfil.'
        } finally {
            loading.value = false
        }
    }

    async function updateProfile(fieldsToUpdate?: Partial<UpdateProfilePayload>): Promise<boolean> {
        error.value = null
        success.value = false

        const finalMedications = fieldsToUpdate?.medications ?? medications.value
        const finalAllergies = fieldsToUpdate?.allergies ?? allergies.value
        const finalBloodType = fieldsToUpdate?.bloodType ?? bloodType.value

        loading.value = true

        const payload: UpdateProfilePayload = {
            medications: finalMedications,
            allergies: finalAllergies,
            bloodType: (finalBloodType || null) as unknown as BackendBloodType
        }

        try {
            await apiClient.patch<void>('/mvp1/profile', payload)

            medications.value = finalMedications
            allergies.value = finalAllergies
            bloodType.value = finalBloodType

            success.value = true
            return true
        } catch {
            // RFE02: Tratamento de erro caso a persistência falhe
            error.value = 'Falha ao atualizar o perfil médico. Tente novamente.'
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        success,
        medications,
        allergies,
        bloodType,
        loadProfile,
        updateProfile
    }
}