import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import { AuthProvider } from '../context/AuthContext'
import authService from '../services/authService'

// Mock do authService
vi.mock('../services/authService', () => ({
  default: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    checkAuth: vi.fn(),
  },
}))

function renderHome() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar mensagem de boas-vindas com nome do usuário', async () => {
    const mockUser = {
      token: 'fake-token',
      username: 'testuser',
      email: 'test@email.com',
      roles: ['ROLE_USER'],
    }

    authService.getCurrentUser.mockReturnValue(mockUser)
    authService.checkAuth.mockResolvedValue({ authenticated: true })

    renderHome()

    await waitFor(() => {
      expect(screen.getByText(/bem-vindo, testuser!/i)).toBeInTheDocument()
    })
  })

  it('deve ter botão de sair', async () => {
    const mockUser = {
      token: 'fake-token',
      username: 'testuser',
      email: 'test@email.com',
      roles: ['ROLE_USER'],
    }

    authService.getCurrentUser.mockReturnValue(mockUser)
    authService.checkAuth.mockResolvedValue({ authenticated: true })

    renderHome()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
    })
  })

  it('deve fazer logout ao clicar no botão sair', async () => {
    const user = userEvent.setup()
    const mockUser = {
      token: 'fake-token',
      username: 'testuser',
      email: 'test@email.com',
      roles: ['ROLE_USER'],
    }

    authService.getCurrentUser.mockReturnValue(mockUser)
    authService.checkAuth.mockResolvedValue({ authenticated: true })

    renderHome()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
    })

    const logoutButton = screen.getByRole('button', { name: /sair/i })
    await user.click(logoutButton)

    expect(authService.logout).toHaveBeenCalled()
  })
})
