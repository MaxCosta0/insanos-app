# Insanos App

Aplicação React para o sistema Insanos.

## 🚀 Como Executar

### Instalação
```bash
npm install
```

### Desenvolvimento

#### No Computador (localhost)
```bash
npm run dev
```
Acesse: `http://localhost:5173`

#### Acessando pelo Celular na Mesma Rede

1. **Inicie o backend** (insanos-server) com acesso pela rede:
   ```bash
   cd insanos-server
   mvn spring-boot:run
   ```
   O backend deve estar acessível em `http://SEU_IP:8080`

2. **Inicie o frontend**:
   ```bash
   npm run dev
   ```

3. **No celular**, acesse:
   ```
   http://192.168.18.169:5173
   ```
   _(Use o IP da sua máquina na rede local)_

### ⚙️ Configuração da API

A aplicação detecta automaticamente o endereço da API:
- Se acessar via `localhost` → usa `http://localhost:8080/api`
- Se acessar via IP da rede → usa `http://SEU_IP:8080/api`

Para forçar um endereço específico, crie um arquivo `.env`:
```bash
cp .env.example .env
```

E defina:
```env
VITE_API_URL=http://192.168.18.169:8080/api
```

### 📱 Troubleshooting - Acesso pelo Celular

#### Usando Ngrok

**IMPORTANTE:** Você precisa expor DUAS portas via ngrok (frontend E backend).

Veja o guia completo em [NGROK_GUIDE.md](./NGROK_GUIDE.md)

**Resumo rápido:**
```bash
# Terminal 1: Exponha o backend (porta 8080)
ngrok http 8080

# Terminal 2: Exponha o frontend (porta 5173)  
ngrok http 5173

# Configure o .env com a URL do ngrok do BACKEND
# VITE_API_URL=https://sua-url-ngrok-backend.ngrok-free.app/api
```

#### Usando Rede Local (sem ngrok)

Se não conseguir acessar pelo celular:

1. **Verifique se o celular está na mesma rede Wi-Fi**
2. **Verifique o firewall**:
   ```bash
   # No Linux, permitir portas 5173 e 8080
   sudo ufw allow 5173
   sudo ufw allow 8080
   ```
3. **Descubra o IP da sua máquina**:
   ```bash
   hostname -I
   ```
4. **Verifique se o backend aceita conexões externas**
   - O arquivo `application.properties` do backend deve ter:
   ```properties
   cors.allowed.origins=http://localhost:5173,http://192.168.18.169:5173
   ```

### 🔧 Build para Produção
```bash
npm run build
npm run preview
```

## 🧪 Testes

Este projeto possui cobertura completa de testes automatizados.

### Executar Testes
```bash
# Modo watch (reexecuta ao salvar)
npm test

# Executar uma vez
npm run test:run

# Com relatório de cobertura
npm run test:coverage

# Interface visual
npm run test:ui
```

### Cobertura de Testes
- ✅ 32 testes passando
- ✅ AuthService - 12 testes
- ✅ AuthContext - 4 testes  
- ✅ LoginForm - 9 testes
- ✅ Login Page - 4 testes
- ✅ Home Page - 3 testes

Veja mais detalhes em [TESTING.md](./TESTING.md)

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

