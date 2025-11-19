# 🌐 Guia: Acessar pelo Celular usando Ngrok

## Problema
Quando você acessa `https://symmetrical-sundrily-anjanette.ngrok-free.dev` pelo celular, o frontend carrega, mas ele tenta fazer login em `http://localhost:8080/api`, que não existe no celular.

## Solução
Você precisa expor **DUAS portas** via ngrok:
1. Frontend (porta 5173) - já está exposto
2. Backend (porta 8080) - precisa expor também

## 📋 Passo a Passo

### 1. Inicie o Backend
```bash
cd insanos-server
mvn spring-boot:run
```

### 2. Exponha o Backend via Ngrok (Terminal 1)
```bash
ngrok http 8080
```

Você receberá uma URL como:
```
https://abc-123-def.ngrok-free.app -> http://localhost:8080
```

**COPIE essa URL do backend!**

### 3. Exponha o Frontend via Ngrok (Terminal 2)
```bash
ngrok http 5173
```

Você receberá:
```
https://symmetrical-sundrily-anjanette.ngrok-free.dev -> http://localhost:5173
```

### 4. Configure o .env
No arquivo `.env`, adicione a URL do ngrok do **backend**:

```env
VITE_API_URL=https://abc-123-def.ngrok-free.app/api
```
*(Substitua pela URL real que o ngrok forneceu para a porta 8080)*

### 5. Reinicie o Frontend
```bash
npm run dev
```

### 6. Acesse pelo Celular
Abra no celular:
```
https://symmetrical-sundrily-anjanette.ngrok-free.dev
```

Agora o celular conseguirá fazer login porque a API também está acessível via ngrok!

---

## 🔧 Alternativa: Usar Rede Local (Sem Ngrok)

Se estiver na mesma rede Wi-Fi:

1. Descubra seu IP:
```bash
hostname -I
```

2. Configure o `.env`:
```env
# Deixe vazio para auto-detectar
```

3. Acesse pelo celular:
```
http://192.168.18.169:5173
```

4. O backend também deve estar em:
```
http://192.168.18.169:8080
```

---

## ⚠️ Importante

- Quando usar ngrok, você **DEVE** ter dois túneis ativos (um para 5173 e outro para 8080)
- A URL do ngrok muda toda vez que você reinicia (no plano gratuito)
- Lembre-se de atualizar o `.env` sempre que a URL do backend mudar
