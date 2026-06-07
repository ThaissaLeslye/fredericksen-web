const V1 = '/mvp1' as const

export const API_ENDPOINTS = {
    AUTH: {
        GOOGLE_LOGIN: `${V1}/auth/google`,
        GOOGLE_CALLBACK: `${V1}/auth/google/callback`,
    },
    USER: {
        ME: `${V1}/user/me`,
    },
    PROFILE: {
        BASE: `${V1}/profile`,
    },
} as const

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS][keyof typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]]