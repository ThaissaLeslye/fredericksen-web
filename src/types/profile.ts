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

export type UpdateProfilePayload = Pick<Profile, 'medications' | 'allergies' | 'bloodType'>


export const BLOOD_TYPE_MAP: Record<BackendBloodType, string> = {
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-'
} as const