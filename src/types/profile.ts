export type BackendBloodType =
    | 'A_POSITIVE'
    | 'A_NEGATIVE'
    | 'B_POSITIVE'
    | 'B_NEGATIVE'
    | 'AB_POSITIVE'
    | 'AB_NEGATIVE'
    | 'O_POSITIVE'
    | 'O_NEGATIVE'

export interface Profile {
    id: string
    name: string
    email: string
    photoUrl: string | null
    medications: string
    allergies: string
    bloodType: BackendBloodType
}

export interface UpdateProfilePayload {
    medications: string
    allergies: string
    bloodType: BackendBloodType | null
}

export const BLOOD_TYPE_OPTIONS = [
    { value: 'A_POSITIVE', label: 'A+' },
    { value: 'A_NEGATIVE', label: 'A-' },
    { value: 'B_POSITIVE', label: 'B+' },
    { value: 'B_NEGATIVE', label: 'B-' },
    { value: 'AB_POSITIVE', label: 'AB+' },
    { value: 'AB_NEGATIVE', label: 'AB-' },
    { value: 'O_POSITIVE', label: 'O+' },
    { value: 'O_NEGATIVE', label: 'O-' }
] as const