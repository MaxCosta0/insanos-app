import { describe, it, expect, beforeEach, vi } from 'vitest'
import authService from '../services/authService'
import api from '../services/api'

// Mock do módulo api
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('deve fazer login com sucesso e salvar dados no localStorage', async () => {
      const mockResponse = {
        data: {
          token: 'fake-jwt-token',
          type: 'Bearer',
          id: 1,
          username: 'testuser',
          email: 'test@email.com',
          roles: ['ROLE_USER'],
        },
      }

      api.post.mockResolvedValueOnce(mockResponse)

      const result = await authService.login('testuser', 'password123')

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        username: 'testuser',
        password: 'password123',
      })
      expect(result).toEqual(mockResponse.data)
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data))
    })

    it('deve lançar erro quando login falhar', async () => {
      const mockError = {
        response: {
          data: { message: 'Credenciais inválidas' },
          status: 401,
        },
      }

      api.post.mockRejectedValueOnce(mockError)

      await expect(authService.login('testuser', 'wrongpassword')).rejects.toEqual(mockError)
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('register', () => {
    it('deve registrar usuário com sucesso', async () => {
      const mockResponse = {
        data: {
          message: 'Usuário registrado com sucesso!',
        },
      }

      api.post.mockResolvedValueOnce(mockResponse)

      const result = await authService.register('newuser', 'new@email.com', 'password123')

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        username: 'newuser',
        email: 'new@email.com',
        password: 'password123',
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('deve lançar erro quando registro falhar', async () => {
      const mockError = {
        response: {
          data: { message: 'Username já está em uso!' },
          status: 400,
        },
      }

      api.post.mockRejectedValueOnce(mockError)

      await expect(
        authService.register('existinguser', 'test@email.com', 'password123')
      ).rejects.toEqual(mockError)
    })
  })

  describe('logout', () => {
    it('deve remover dados do localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ token: 'fake-token' }))

      authService.logout()

      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('deve retornar usuário do localStorage', () => {
      const mockUser = {
        token: 'fake-token',
        username: 'testuser',
        email: 'test@email.com',
      }

      localStorage.setItem('user', JSON.stringify(mockUser))

      const result = authService.getCurrentUser()

      expect(result).toEqual(mockUser)
    })

    it('deve retornar null quando não há usuário', () => {
      const result = authService.getCurrentUser()

      expect(result).toBeNull()
    })

    it('deve retornar null quando dados estão corrompidos', () => {
      localStorage.setItem('user', 'invalid-json')

      const result = authService.getCurrentUser()

      expect(result).toBeNull()
    })
  })

  describe('checkAuth', () => {
    it('deve verificar autenticação com sucesso', async () => {
      const mockResponse = {
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@email.com',
          roles: ['ROLE_USER'],
          authenticated: true,
        },
      }

      api.get.mockResolvedValueOnce(mockResponse)

      const result = await authService.checkAuth()

      expect(api.get).toHaveBeenCalledWith('/auth/check')
      expect(result).toEqual(mockResponse.data)
    })

    it('deve retornar null quando verificação falhar', async () => {
      api.get.mockRejectedValueOnce(new Error('Network error'))

      const result = await authService.checkAuth()

      expect(result).toBeNull()
    })
  })

  describe('getMe', () => {
    it('deve obter dados do usuário com sucesso', async () => {
      const mockResponse = {
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@email.com',
          roles: ['ROLE_USER'],
        },
      }

      api.get.mockResolvedValueOnce(mockResponse)

      const result = await authService.getMe()

      expect(api.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockResponse.data)
    })

    it('deve retornar null quando falhar', async () => {
      api.get.mockRejectedValueOnce(new Error('Network error'))

      const result = await authService.getMe()

      expect(result).toBeNull()
    })
  })
})
