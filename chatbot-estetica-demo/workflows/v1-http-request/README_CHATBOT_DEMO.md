# 🤖 Workflow n8n: Demo Chatbot Estética WhatsApp + IA

## 📋 Descrição

Workflow de demonstração para a landing page `/chatbot-estetica`, que simula um sistema de marcação de serviços de estética via WhatsApp, utilizando Anthropic Claude como agente conversacional.

**Objetivo:** Demonstrar aos visitantes da landing page como funciona um chatbot inteligente de marcação, com conversa natural em português de Portugal.

---

## 🎯 Funcionalidades

### 1️⃣ **Recepção de Mensagens WhatsApp**
- Webhook para receber mensagens da WhatsApp Cloud API
- Validação e normalização de números de telefone (formato PT: 351XXXXXXXXX)
- Suporte apenas para mensagens de texto

### 2️⃣ **Gestão de Sessão (Google Sheets)**
- Persistência de conversas por número de WhatsApp
- Máquina de estados: `inicio` → `a_explorar` → `a_escolher_servico` → `a_escolher_horario` → `confirmado`
- Histórico de conversa (últimas 20 mensagens)
- Campos guardados: estado, serviço escolhido, slot, histórico, timestamps

### 3️⃣ **Agente IA Conversacional (Anthropic Claude)**
- **Modelo:** Claude 3.5 Sonnet (via API `/v1/messages`)
- **Persona:** Recepcionista virtual de estúdio de estética PT-PT
- **Tom:** Amigável, profissional, direto, frases curtas para WhatsApp
- **Output:** JSON estruturado com decisões (reply, next_state, service, slot, flags)

### 4️⃣ **Catálogo de Serviços (Demo)**
| Serviço | Duração | Preço |
|---------|---------|-------|
| Limpeza de Pele | 60 min | €45 |
| Massagem Relaxante | 50 min | €50 |
| Tratamento Facial Anti-idade | 75 min | €70 |
| Depilação a Laser | 30 min | €60 |
| Manicure e Pedicure | 60 min | €35 |

### 5️⃣ **Sistema de Lembretes (Demo)**
- Quando uma marcação é confirmada, agenda lembrete automático
- **Modo demo:** Envia lembrete 1 minuto após confirmação
- **Produção:** Adaptável para enviar no horário real da marcação

---

## 🏗️ Arquitetura do Workflow

### Fluxo Completo

```
WhatsApp → Webhook → Parse → Get/Upsert Session (Sheets)
    → Build LLM Input → HTTP Request LLM (Claude)
    → Apply LLM Decision → Update Session (Sheets)
    → Send WhatsApp Message
    → [IF confirmado] → Compute Reminder Time → Wait → Send Reminder
```

### Nodes Principais

**FASE 1: RECEBER MENSAGEM**
1. **Webhook – Testar Bot** - Recebe POST da WhatsApp Cloud API
2. **Code – Parse WhatsApp Message** - Extrai e normaliza dados

**FASE 2: SESSÃO E CONTEXTO**
3. **Google Sheets – Get/Upsert Session** - Recupera/cria sessão
4. **Code – Build LLM Input** - Prepara payload para IA (catálogo + slots + histórico)

**FASE 3: AGENTE IA**
5. **HTTP Request – LLM** - Chama Anthropic Claude com system prompt PT-PT

**FASE 4: PROCESSAR E RESPONDER**
6. **Code – Apply LLM Decision** - Parse resposta (`content[0].text`)
7. **Google Sheets – Update Session** - Persiste novo estado
8. **HTTP Request – Send WhatsApp Message** - Envia resposta

**FASE 5: LEMBRETE (CONDICIONAL)**
9. **IF – Should Schedule Reminder** - Verifica se deve agendar
10. **Code – Compute Reminder Time** - Calcula quando enviar
11. **Wait – Reminder** - Aguarda até horário
12. **HTTP Request – Send Reminder** - Envia lembrete

---

## 📦 Configuração

### Credenciais Necessárias

#### 1. **Anthropic API** (`anthropicApi`)
- Nome da credencial: `llmApi`
- API Key: [tua chave da Anthropic]
- Base URL: `https://api.anthropic.com`

#### 2. **Google Sheets OAuth2** (`googleSheetsOAuth2Api`)
- Documento: `Bot_Demo_Chatbot_Estetica`
- Sheet: `sessoes_bot`
- Colunas: `whatsapp | estado | servico | slot | historico | createdAt | updatedAt`

#### 3. **WhatsApp Cloud API** (`whatsappCloudApi`)
- Phone Number ID: [do WhatsApp Business]
- Access Token: [da Meta Developer]

### Webhook
- **Path:** `/testar-bot-whatsapp`
- **Method:** POST
- **Response Mode:** responseNode

---

## 🚀 Como Usar

### 1. Importar no n8n
```bash
Workflows → Import from File → DEMO_Chatbot_Estetica_Testar_Bot_WhatsApp_IA.json
```

### 2. Criar Google Sheet
```
Nome: Bot_Demo_Chatbot_Estetica
Sheet: sessoes_bot

Colunas (Header):
whatsapp | estado | servico | slot | historico | createdAt | updatedAt
```

### 3. Configurar Webhook no WhatsApp Business
```
Meta Developer Console → WhatsApp → Configuration
Callback URL: https://SEU_N8N_URL/webhook/testar-bot-whatsapp
Subscribe to: messages
```

### 4. Testar
Enviar mensagem WhatsApp:
```
Quero testar o chatbot de marcação
```

---

## 🎨 Personalização

### Alterar Catálogo
Node `Code – Build LLM Input`:
```javascript
const servicosDisponiveis = [
  { nome: 'Teu Serviço', duracao: 'XX min', preco: '€XX' },
];
```

### Alterar Tempo Lembrete
Node `Code – Compute Reminder Time`:
```javascript
const reminderTime = new Date(now.getTime() + 60 * 1000); // mudar 60
```

---

## 🔧 Detalhes Técnicos

### Formato Resposta IA
```json
{
  "reply": "Mensagem PT-PT",
  "next_state": "inicio|a_explorar|a_escolher_servico|a_escolher_horario|confirmado",
  "service": "Nome do serviço ou vazio",
  "slot": "Horário ou vazio",
  "should_schedule_reminder": true/false,
  "should_reset": false
}
```

### Estados da Máquina
- **inicio** - Saudação
- **a_explorar** - Explorando serviços
- **a_escolher_servico** - Escolhendo serviço
- **a_escolher_horario** - Escolhendo horário
- **confirmado** - Marcação confirmada

---

## 📊 Validação Atual

### ✅ Verificações Realizadas

**JSON:**
- ✅ Sintaxe válida e importável no n8n

**Antropic API:**
- ✅ URL correta: `https://api.anthropic.com/v1/messages`
- ✅ Headers: `anthropic-version: 2023-06-01`
- ✅ Credencial: `anthropicApi` (nome: `llmApi`)
- ✅ Body formato Anthropic (system + messages)
- ✅ Parse resposta: `content[0].text`

**Conexões:**
- ✅ Code – Apply LLM Decision → Google Sheets Update + IF Reminder

### ⚠️ Notas de Configuração

O workflow atual utiliza:
- **Modelo:** `claude-3-5-sonnet-latest`
- **Google Sheets operation:** `update` (1º node) + `appendOrUpdate` (2º node)
- **Google Sheets IDs:** Nomes simbólicos (`Bot_Demo_Chatbot_Estetica`, `sessoes_bot`)

Se a versão no n8n usa configurações diferentes (ex: `claude-sonnet-4-20250514`, IDs específicos), ajustar após importação.

---

## 🐛 Troubleshooting

### Bot não responde
- ✅ Verificar webhook configurado no WhatsApp
- ✅ Verificar credencial Anthropic válida
- ✅ Ver logs de execução no n8n

### Erro parsing JSON
- ✅ Ver resposta raw da Anthropic
- ✅ Confirmar system prompt pede JSON válido
- ✅ Aumentar `max_tokens` se necessário

### Sessão não persiste
- ✅ Verificar Google Sheets com permissões
- ✅ Confirmar coluna `whatsapp` existe
- ✅ Ver `matchingColumns` correto

---

## 📝 Modo Demo vs Produção

### Modo Demo (atual)
- Horários gerados automaticamente (próximos 3 dias)
- Lembretes enviados 1 minuto após confirmação
- Sem validação de calendário real

### Produção (adaptações necessárias)
1. Integrar com calendário real (Google Calendar)
2. Validar slots disponíveis
3. Enviar lembretes no horário real
4. Adicionar confirmação por e-mail
5. Integrar com CRM/gestão de clientes

---

## 🔗 Links Úteis

- [Documentação Anthropic API](https://docs.anthropic.com/)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [n8n Documentation](https://docs.n8n.io/)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

## 📄 Versão

**Workflow:** Demo Chatbot Estética WhatsApp IA
**Modelo IA:** Claude 3.5 Sonnet (Anthropic)
**Última Atualização:** 20 de Novembro de 2025
**Status:** ✅ Validado e pronto para importação

---

**Desenvolvido com:** n8n + Anthropic Claude + WhatsApp Cloud API + Google Sheets

