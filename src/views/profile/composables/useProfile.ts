import { ref, onUnmounted } from 'vue'
import { apiClient } from '@/infrastructure/http/apiClient'
import type { Profile, UpdateProfilePayload, BackendBloodType } from '@/types/profile'
import { API_ENDPOINTS } from '@/infrastructure/http/endpoints'

export function useProfile() {
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const success = ref<boolean>(false)

    const medications = ref<string>('')
    const allergies = ref<string>('')
    const bloodType = ref<BackendBloodType | ''>('')

    let pristineSnapshot = { medications: '', allergies: '', bloodType: '' }

    let successTimer: ReturnType<typeof setTimeout> | null = null

    function createSnapshot(): void {
        pristineSnapshot = {
            medications: medications.value,
            allergies: allergies.value,
            bloodType: bloodType.value
        }
    }

    function isDirty(): boolean {
        return (
            medications.value !== pristineSnapshot.medications ||
            allergies.value !== pristineSnapshot.allergies ||
            bloodType.value !== pristineSnapshot.bloodType
        )
    }

    async function loadProfile(): Promise<void> {
        loading.value = true
        error.value = null
        try {
            const response = await apiClient.get<Profile>(API_ENDPOINTS.PROFILE.BASE)
            medications.value = response.data.medications || ''
            allergies.value = response.data.allergies || ''
            bloodType.value = response.data.bloodType || ''

            createSnapshot()
        } catch {
            error.value = 'Não foi possível carregar os dados do perfil.'
        } finally {
            loading.value = false
        }
    }

    async function updateProfile(): Promise<boolean> {
        if (loading.value) return false
        if (!isDirty()) return false

        error.value = null
        success.value = false

        loading.value = true

        const payload: UpdateProfilePayload = {
            medications: medications.value,
            allergies: allergies.value,
            bloodType: bloodType.value === '' ? null : bloodType.value
        }

        try {
            await apiClient.patch<void>('/mvp1/profile', payload)

            createSnapshot()

            if (successTimer) clearTimeout(successTimer)

            success.value = true

            successTimer = setTimeout(() => {
                success.value = false
            }, 3000)

            return true
        } catch {
            error.value = 'Falha ao atualizar o perfil médico. Tente novamente.'
            return false
        } finally {
            loading.value = false
        }
    }

    onUnmounted(() => {
        if (successTimer) clearTimeout(successTimer)
    })

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