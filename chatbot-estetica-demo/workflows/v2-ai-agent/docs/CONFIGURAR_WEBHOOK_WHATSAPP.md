# 🔧 CONFIGURAR WEBHOOK WHATSAPP - GUIA COMPLETO

## O PROBLEMA
A Meta envia um pedido GET de verificação e o n8n precisa responder com o `hub.challenge`.

---

## SOLUÇÃO: MODIFICAR O WORKFLOW

### PASSO 1: Alterar o Webhook para aceitar GET e POST

1. Clica no nó **"Webhook – WhatsApp Incoming"**
2. Em **HTTP Method**, muda de `POST` para `=` (All Methods) ou adiciona um segundo webhook para GET

**OU mais simples:**
Muda o webhook para aceitar qualquer método.

---

### PASSO 2: Adicionar nó de verificação

Depois do Webhook, adiciona um nó **Code** chamado "Verificar Challenge" com este código:

```javascript
// Verificar se é pedido de verificação da Meta (GET com hub.challenge)
const query = $input.item.json.query || {};
const hubMode = query['hub.mode'];
const hubChallenge = query['hub.challenge'];
const hubVerifyToken = query['hub.verify_token'];

// Token que definiste na Meta (deve corresponder!)
const MY_VERIFY_TOKEN = 'WHATSAPICLOUD_AMJ_2025';

if (hubMode === 'subscribe' && hubVerifyToken === MY_VERIFY_TOKEN) {
  // É um pedido de verificação - responder com o challenge
  return {
    json: {
      isVerification: true,
      challenge: hubChallenge
    }
  };
}

// Não é verificação - é uma mensagem normal
const body = $input.item.json.body || {};
return {
  json: {
    isVerification: false,
    body: body
  }
};
```

---

### PASSO 3: Adicionar IF para separar verificação de mensagens

Adiciona um nó **IF** depois do Code acima:

- **Condição**: `{{$json.isVerification}}` equals `true`
- **True** → Vai para "Respond to Webhook" com o challenge
- **False** → Continua o fluxo normal (Parse Message, etc.)

---

### PASSO 4: Responder ao Challenge

Para o ramo TRUE (verificação), adiciona um nó **Respond to Webhook**:

1. **Respond With**: `Text`
2. **Response Body**: `={{$json.challenge}}`

⚠️ IMPORTANTE: Deve ser TEXT, não JSON! A Meta espera apenas o número.

---

### PASSO 5: Usar Production URL

1. **Activa o workflow** (toggle verde)
2. No nó Webhook, clica em **"Production URL"**
3. Copia o URL: `https://n8n.alcinomenezesjunior.com/webhook/testar-bot-whatsapp`

---

## CONFIGURAÇÃO NA META

1. Vai ao **Meta Business Suite** → **WhatsApp** → **Configuration**
2. Em **Callback URL**: `https://n8n.alcinomenezesjunior.com/webhook/testar-bot-whatsapp`
   - ⚠️ SEM `-test` no URL!
3. Em **Verify Token**: `WHATSAPICLOUD_AMJ_2025`
4. Clica **"Verify and Save"**

---

## FLUXO VISUAL

```
[Webhook GET/POST]
       │
       ▼
[Code: Verificar Challenge]
       │
       ▼
[IF: isVerification?]
     │         │
   TRUE      FALSE
     │         │
     ▼         ▼
[Respond    [Code: Parse Message]
 Text:           │
 challenge]      ▼
              [resto do fluxo...]
```

---

## TESTE RÁPIDO

Antes de configurar na Meta, testa o webhook manualmente:

```bash
curl "https://n8n.alcinomenezesjunior.com/webhook/testar-bot-whatsapp?hub.mode=subscribe&hub.challenge=12345&hub.verify_token=WHATSAPICLOUD_AMJ_2025"
```

Se responder `12345`, está a funcionar! ✅

---

## ERROS COMUNS

| Erro | Solução |
|------|---------|
| URL com `-test` | Usar Production URL (sem -test) |
| Workflow não activo | Activar o workflow (toggle verde) |
| Resposta em JSON | Mudar para Text puro |
| Token não corresponde | Verificar que o token é exactamente igual |
