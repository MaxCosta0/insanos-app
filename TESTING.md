# 🧪 Guia de Testes Automatizados

## Tecnologias Utilizadas

- **Vitest** - Framework de testes rápido e moderno
- **React Testing Library** - Biblioteca para testar componentes React
- **Jest DOM** - Matchers customizados para o DOM
- **User Event** - Simulação de interações do usuário

## Estrutura de Testes

```
src/test/
├── setup.js                 # Configuração global dos testes
├── authService.test.js      # Testes do serviço de autenticação
├── AuthContext.test.jsx     # Testes do contexto de autenticação
├── LoginForm.test.jsx       # Testes do componente LoginForm
├── Login.test.jsx           # Testes da página de Login
└── Home.test.jsx            # Testes da página Home
```

## Comandos Disponíveis

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch (reexecuta ao salvar)
```bash
npm test
```

### Executar testes uma única vez
```bash
npm run test:run
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

### Executar testes com UI interativa
```bash
npm run test:ui
```

## Cobertura de Testes

### AuthService (src/services/authService.js)
✅ Login com sucesso  
✅ Login com erro  
✅ Registro de usuário  
✅ Registro com erro  
✅ Logout  
✅ Obter usuário atual  
✅ Verificar autenticação  
✅ Obter dados do usuário  

### AuthContext (src/context/AuthContext.jsx)
✅ Inicialização sem usuário  
✅ Carregamento de usuário do localStorage  
✅ Validação de token  
✅ Logout quando token inválido  
✅ Identificação de usuário admin  

### LoginForm (src/components/LoginForm.jsx)
✅ Renderização de campos  
✅ Digitação de usuário e senha  
✅ Toggle de visibilidade da senha  
✅ Submissão do formulário  
✅ Exibição de erros  
✅ Estado de loading  
✅ Checkbox "manter conectado"  

### Login Page (src/pages/Login.jsx)
✅ Renderização do formulário  
✅ Login bem-sucedido com redirecionamento  
✅ Exibição de erros de login  
✅ Estado de loading durante login  

### Home Page (src/pages/Home.jsx)
✅ Mensagem de boas-vindas  
✅ Botão de logout  
✅ Funcionalidade de logout  

## Boas Práticas Implementadas

1. **Isolamento de Testes**
   - Cada teste é independente
   - LocalStorage é limpo após cada teste
   - Mocks são resetados automaticamente

2. **Testes de Integração**
   - Testa comportamento real dos componentes
   - Simula interações do usuário
   - Verifica fluxos completos

3. **Mocks Adequados**
   - APIs são mockadas para evitar chamadas reais
   - Console logs são silenciados nos testes
   - Window.location é mockado

4. **Assertions Claras**
   - Usa matchers semânticos do Jest DOM
   - Testa comportamentos, não implementação
   - Mensagens de erro descritivas

## Exemplo de Execução

```bash
$ npm test

 ✓ src/test/authService.test.js (15 tests) 543ms
   ✓ AuthService
     ✓ login
       ✓ deve fazer login com sucesso e salvar dados no localStorage
       ✓ deve lançar erro quando login falhar
     ✓ register
       ✓ deve registrar usuário com sucesso
       ✓ deve lançar erro quando registro falhar
     ✓ logout
       ✓ deve remover dados do localStorage
     ✓ getCurrentUser
       ✓ deve retornar usuário do localStorage
       ✓ deve retornar null quando não há usuário
       ✓ deve retornar null quando dados estão corrompidos
     ✓ checkAuth
       ✓ deve verificar autenticação com sucesso
       ✓ deve retornar null quando verificação falhar
     ✓ getMe
       ✓ deve obter dados do usuário com sucesso
       ✓ deve retornar null quando falhar

 Test Files  5 passed (5)
      Tests  35 passed (35)
   Start at  19:00:00
   Duration  2.31s
```

## Relatório de Cobertura

Execute `npm run test:coverage` para ver o relatório completo de cobertura de código.

O relatório HTML será gerado em `coverage/index.html`.

## Adicionando Novos Testes

### Estrutura Básica de um Teste

```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '../components/MyComponent'

describe('MyComponent', () => {
  it('deve renderizar corretamente', () => {
    render(<MyComponent />)
    
    expect(screen.getByText('Texto Esperado')).toBeInTheDocument()
  })

  it('deve responder a cliques', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<MyComponent onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalled()
  })
})
```

## CI/CD

Os testes devem ser executados antes de cada commit:

```bash
# No seu pipeline
npm run test:run
npm run test:coverage
```

## Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "window is not defined"
Certifique-se que `vitest.config.js` tem `environment: 'jsdom'`

### Testes lentos
Use `vi.mock()` para mockar dependências pesadas

---

**Mantenha os testes atualizados!** 🚀
