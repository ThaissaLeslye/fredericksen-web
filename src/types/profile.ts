export interface Profile {
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
    medicaments: string[];
    allergies: string[];
    bloodType: string;
}


export type UpdateProfilePayload = Pick<Profile, 'medicaments' | 'allergies' | 'bloodType'>;