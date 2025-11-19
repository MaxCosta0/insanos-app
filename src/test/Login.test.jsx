import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'
import { AuthProvider } from '../context/AuthContext'
import authService from '../services/authService'

// Mock do authService
vi.mock('../services/authService', () => ({
  default: {
    login: vi.fn(),
    getCurrentUser: vi.fn(),
    checkAuth: vi.fn(),
    logout: vi.fn(),
  },
}))

// Mock do react-router-dom navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderLogin() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authService.getCurrentUser.mockReturnValue(null)
    authService.checkAuth.mockResolvedValue({ authenticated: false })
  })

  it('deve renderizar o formulário de login', async () => {
    renderLogin()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('deve fazer login com sucesso e redirecionar', async () => {
    const user = userEvent.setup()
    
    authService.login = vi.fn().mockResolvedValue({
      token: 'fake-token',
      username: 'testuser',
      email: 'test@email.com',
      roles: ['ROLE_USER'],
    })

    renderLogin()

    await waitFor(() => {
      expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    })

    const usernameInput = screen.getByLabelText(/usuário/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('testuser', 'password123')
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('deve mostrar erro quando login falhar', async () => {
    const user = userEvent.setup()
    
    authService.login = vi.fn().mockRejectedValue({
      response: {
        data: { message: 'Credenciais inválidas' },
        status: 401,
      },
    })

    renderLogin()

    await waitFor(() => {
      expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    })

    const usernameInput = screen.getByLabelText(/usuário/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('deve desabilitar campos durante o loading', async () => {
    const user = userEvent.setup()
    
    // Simula um login que demora
    authService.login = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => setTimeout(resolve, 1000))
    })

    renderLogin()

    await waitFor(() => {
      expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    })

    const usernameInput = screen.getByLabelText(/usuário/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Deve mostrar estado de loading
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /entrando/i })).toBeInTheDocument()
    })

    expect(usernameInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
  })
})
