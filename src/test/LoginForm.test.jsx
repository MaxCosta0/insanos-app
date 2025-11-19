import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../components/LoginForm'

describe('LoginForm', () => {
  const defaultProps = {
    username: '',
    password: '',
    keepLoggedIn: false,
    onUsernameChange: vi.fn(),
    onPasswordChange: vi.fn(),
    onKeepLoggedInChange: vi.fn(),
    onSubmit: vi.fn(),
    loading: false,
    error: '',
  }

  it('deve renderizar todos os campos do formulário', () => {
    render(<LoginForm {...defaultProps} />)

    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument()
    expect(screen.getByText(/manter-me conectado/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('deve chamar onChange ao digitar username', async () => {
    const user = userEvent.setup()
    const onUsernameChange = vi.fn()

    render(<LoginForm {...defaultProps} onUsernameChange={onUsernameChange} />)

    const usernameInput = screen.getByLabelText(/usuário/i)
    await user.type(usernameInput, 'testuser')

    expect(onUsernameChange).toHaveBeenCalledTimes(8) // uma vez por caractere
  })

  it('deve chamar onChange ao digitar senha', async () => {
    const user = userEvent.setup()
    const onPasswordChange = vi.fn()

    render(<LoginForm {...defaultProps} onPasswordChange={onPasswordChange} />)

    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    await user.type(passwordInput, 'password123')

    expect(onPasswordChange).toHaveBeenCalledTimes(11)
  })

  it('deve alternar visibilidade da senha ao clicar no botão', async () => {
    const user = userEvent.setup()

    render(<LoginForm {...defaultProps} password="mypassword" />)

    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button', { name: /mostrar senha/i })
    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('deve chamar onSubmit ao enviar o formulário', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((e) => e.preventDefault())

    render(
      <LoginForm
        {...defaultProps}
        username="testuser"
        password="password123"
        onSubmit={onSubmit}
      />
    )

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    await user.click(submitButton)

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('deve mostrar mensagem de erro quando fornecida', () => {
    render(<LoginForm {...defaultProps} error="Credenciais inválidas" />)

    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument()
  })

  it('deve desabilitar campos quando loading for true', () => {
    render(<LoginForm {...defaultProps} loading={true} />)

    expect(screen.getByLabelText(/usuário/i)).toBeDisabled()
    expect(screen.getByPlaceholderText(/••••••••/)).toBeDisabled()
    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled()
  })

  it('deve mostrar texto "Entrando..." quando loading', () => {
    render(<LoginForm {...defaultProps} loading={true} />)

    expect(screen.getByRole('button', { name: /entrando/i })).toBeInTheDocument()
  })

  it('deve chamar onKeepLoggedInChange ao marcar checkbox', async () => {
    const user = userEvent.setup()
    const onKeepLoggedInChange = vi.fn()

    render(<LoginForm {...defaultProps} onKeepLoggedInChange={onKeepLoggedInChange} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(onKeepLoggedInChange).toHaveBeenCalled()
  })
})
