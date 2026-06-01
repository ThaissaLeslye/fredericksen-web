import { describe, it, expect, beforeEach } from 'vitest'
import { tokenService } from '../tokenService'

describe('tokenService', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('should set and get token correctly', () => {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        tokenService.setToken(mockToken)
        expect(tokenService.getToken()).toBe(mockToken)
    })

    it('should return null if token does not exist', () => {
        expect(tokenService.getToken()).toBeNull()
    })

    it('should remove token correctly', () => {
        tokenService.setToken('test-token')
        tokenService.removeToken()
        expect(tokenService.getToken()).toBeNull()
    })
})