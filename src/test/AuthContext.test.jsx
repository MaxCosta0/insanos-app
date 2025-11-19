import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import authService from '../services/authService'

// Mock do authService
vi.mock('../services/authService', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    checkAuth: vi.fn(),
  },
}))

// Componente de teste para usar o hook
function TestComponent() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="admin">{isAdmin ? 'true' : 'false'}</div>
      <div data-testid="username">{user?.username || 'no user'}</div>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve inicializar sem usuário', async () => {
    authService.getCurrentUser.mockReturnValue(null)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('username')).toHaveTextContent('no user')
    expect(screen.getByTestId('admin')).toHaveTextContent('false')
  })

  it('deve carregar usuário do localStorage e validar token', async () => {
    const mockUser = {
      token: 'fake-token',
      username: 'testuser',
      email: 'test@email.com',
      roles: ['ROLE_USER'],
    }

    authService.getCurrentUser.mockReturnValue(mockUser)
    authService.checkAuth.mockResolvedValue({ authenticated: true })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    })

    expect(screen.getByTestId('username')).toHaveTextContent('testuser')
    expect(authService.checkAuth).toHaveBeenCalled()
  })

  it('deve fazer logout se token for inválido', async () => {
    const mockUser = {
      token: 'invalid-token',
      username: 'testuser',
    }

    authService.getCurrentUser.mockReturnValue(mockUser)
    authService.checkAuth.mockResolvedValue({ authenticated: false })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    })
  })

  it('deve identificar usuário admin', async () => {
    const mockUser = {
      token: 'fake-token',
      username: 'adminuser',
      roles: ['ROLE_ADMIN'],
    }

    authService.getCurrentUser.mockReturnValue(mockUser)
    authService.checkAuth.mockResolvedValue({ authenticated: true })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('admin')).toHaveTextContent('true')
    })
  })
})
