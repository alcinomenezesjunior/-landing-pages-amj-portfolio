# Workflows N8N – Chatbot Estética WhatsApp IA

Este diretório contém os workflows N8N usados nos projetos de automação, em especial o **demo de chatbot para estúdios de estética via WhatsApp**.

---

## 1. Workflow principal

**Ficheiro:**  
`DEMO_Chatbot_Estetica_Testar_Bot_WhatsApp_IA.json`

**Objetivo:**  
Bot demo de marcação para landing page `/chatbot-estetica` usando WhatsApp Cloud + Claude (Anthropic) + Google Sheets.

### Fluxo resumido

1. Utilizador clica no botão “Testar Bot no WhatsApp” na landing page.
2. WhatsApp envia mensagem inicial para o webhook do N8N.
3. O bot responde em PT-PT, estilo recepcionista natural.
4. Sugere serviços e horários.
5. Confirma uma “marcação demo”.
6. (Opcional) Envia lembrete passado algum tempo.

---

## 2. Integrações usadas

- **WhatsApp Cloud API**
  - Recebe e envia mensagens.
- **Google Sheets**
  - Documento: `Bot_Demo_Chatbot_Estetica`
  - Sheet: `sessoes_bot`
  - Colunas esperadas:
    - `whatsapp`
    - `estado`
    - `servico`
    - `slot`
    - `historico`
    - `createdAt`
    - `updatedAt`
- **Anthropic Claude API**
  - Modelo atual: `claude-sonnet-4-20250514`
  - Endpoint: `https://api.anthropic.com/v1/messages`
  - Credencial no N8N: `llmApi` (tipo `Anthropic`)

---

## 3. Estrutura por fases (no canvas do N8N)

### FASE 1 – RECEBER MENSAGEM

- **Webhook – Testar Bot1**
  - Método: `POST`
  - Recebe corpo com pelo menos:
    - `whatsapp` (número no formato internacional)
    - `mensagem` (texto enviado pelo utilizador)

- **Code – Parse WhatsApp Message1**
  - Normaliza o payload do WhatsApp.
  - Extrai:
    - `userMessage`
    - `whatsapp` normalizado
  - **IMPORTANTE:** `userMessage` nasce aqui e é reutilizado mais à frente.

---

### FASE 2 – SESSÃO (Google Sheets)

- **Google Sheets – Get/Upsert Session1**
  - Documento: `Bot_Demo_Chatbot_Estetica`
  - Sheet: `sessoes_bot`
  - Operação: `Append or Update Row`
  - Coluna de match: `whatsapp`
  - Grava/atualiza:
    - `whatsapp`
    - `estado`
    - `servico`
    - `slot`
    - `historico`
    - `createdAt`
    - `updatedAt`

> A linha da sessão é o “estado” da conversa por número de telemóvel.

---

### FASE 3 – CHAMAR IA (Anthropic Claude)

- **Code – Build LLM Input1**
  - Junta:
    - Estado atual (de Sheets)
    - Mensagem atual do utilizador
    - Serviços disponíveis
    - Slots/horários disponíveis
  - Prepara:
    - `system` (texto do prompt de sistema em PT-PT)
    - `llmPayload.messages` (lista de mensagens para enviar à API)

  - ⚠️ **Ponto crítico – NÃO ALTERAR SEM SABER:**

    ```js
    const userMessage = $('Code – Parse WhatsApp Message1').item.json.userMessage;
    ```

    Este acesso via `$('nome do node')` é o que garante que temos sempre a mensagem correta do utilizador, mesmo que o input direto venha do Google Sheets.

- **HTTP Request – LLM1**
  - URL: `https://api.anthropic.com/v1/messages`
  - Auth: credencial `llmApi` (tipo Anthropic)
  - Headers:
    - `anthropic-version: 2023-06-01`
    - `content-type: application/json`
  - Body:
    - `model: claude-sonnet-4-20250514`
    - `max_tokens: 500`
    - `temperature: 0.7`
    - `system: ...` (prompt montado no node anterior)
    - `messages: ...` (lista de mensagens no formato Anthropic)

---

### FASE 4 – PROCESSAR & RESPONDER

- **Code – Apply LLM Decision1**
  - Faz parse da resposta da IA (JSON).
  - Atualiza:
    - `estado`
    - `servico`
    - `slot`
    - `historico`
    - flags de lembrete / reset, etc.

- **Google Sheets – Update Session1**
  - Grava o novo estado na linha correspondente ao `whatsapp`.

- **HTTP Request – Send WhatsApp Message1**
  - Envia a resposta da IA de volta para o utilizador via WhatsApp Cloud.

---

### FASE 5 – LEMBRETE DEMO

- **IF – Should Schedule Reminder1**
  - Verifica se deve agendar lembrete (por ex: `should_schedule_reminder == true`).

- **Code – Compute Reminder Time1**
  - Calcula a data/hora do lembrete (no demo é curto, em produção seria a data real).

- **Wait – Reminder1**
  - Aguarda até à data/hora calculada.

- **HTTP Request – Send Reminder1**
  - Envia a mensagem de lembrete para o WhatsApp.

---

## 4. Regras para futuras alterações

Para qualquer alteração neste workflow:

1. **NÃO alterar sem motivo:**
   - A forma como o `userMessage` é lido:

     ```js
     const userMessage = $('Code – Parse WhatsApp Message1').item.json.userMessage;
     ```

   - O modelo Anthropic em `HTTP Request – LLM1`:

     ```json
     "model": "claude-sonnet-4-20250514"
     ```

2. Se for usar ferramentas de IA (Claude Code, ChatGPT, etc.) para editar o ficheiro:
   - Deixar claro no prompt que:
     - Este ficheiro é o “source of truth”.
     - As duas regras acima não devem ser revertidas.

3. Sempre que o workflow for alterado no N8N:
   - Exportar novamente o JSON.
   - Atualizar este ficheiro no repositório para manter tudo sincronizado.

---
