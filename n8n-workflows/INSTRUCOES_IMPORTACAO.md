# 📥 INSTRUÇÕES DE IMPORTAÇÃO - WORKFLOW 1 ATUALIZADO

## 🎯 OBJETIVO

Importar o Workflow 1 atualizado (v3.2 - Webhook Único) no N8N, substituindo ou coexistindo com a versão anterior.

---

## ⚠️ ANTES DE COMEÇAR

### **Pré-requisitos Obrigatórios:**

- [x] Acesso ao N8N (https://mjrmkt.app.n8n.cloud)
- [x] Credenciais configuradas no N8N:
  - [ ] **Perplexity API** (HTTP Header Auth)
  - [ ] **OpenAI API** (HTTP Header Auth)
  - [ ] **Anthropic Claude API** (HTTP Header Auth)
  - [ ] **Google Sheets OAuth2** (OAuth2)
  - [ ] **Telegram Bot API** (Telegram credentials)
  - [ ] **SMTP Hostinger** (SMTP credentials)
- [x] Google Sheets criada com 31 colunas (ver `GOOGLE_SHEETS_ESTRUTURA.md`)
- [x] Telegram Bot criado e Chat ID obtido
- [x] Arquivo `WORKFLOW_1_MAIN_ATUALIZADO.json` baixado

---

## 🔄 ESTRATÉGIA DE MIGRAÇÃO

Você tem **2 opções**:

### **OPÇÃO A: Substituir Workflow Antigo (RECOMENDADO)**

✅ **Vantagens:**
- Apenas 1 workflow ativo (mais limpo)
- Webhook path `/leads-geral` ativo imediatamente
- Menos confusão

❌ **Desvantagens:**
- Perde workflow antigo (mas pode exportar antes como backup)

**Quando usar:** Se já testou o novo workflow e está funcionando.

---

### **OPÇÃO B: Criar Novo Workflow (Coexistência Temporária)**

✅ **Vantagens:**
- Mantém workflow antigo funcionando
- Pode comparar lado a lado
- Rollback fácil se houver problemas

❌ **Desvantagens:**
- 2 workflows ativos simultaneamente
- Precisa desativar um deles depois

**Quando usar:** Se quer testar antes de substituir definitivamente.

---

## 📦 OPÇÃO A: SUBSTITUIR WORKFLOW ANTIGO

### **Passo 1: Fazer Backup do Workflow Atual**

1. Acesse N8N: https://mjrmkt.app.n8n.cloud
2. Abra o workflow **"1_AMJ_Lead_System_v3.1_COMPLETO_Twilio_CORRIGIDO"**
3. Clique nos **3 pontos** (⋮) no canto superior direito
4. Escolha **Download**
5. Salve como: `WORKFLOW_1_BACKUP_v3.1_[DATA].json`

**Exemplo:**
```
WORKFLOW_1_BACKUP_v3.1_16-01-2025.json
```

⚠️ **IMPORTANTE:** Guarde este arquivo em local seguro. É seu backup.

---

### **Passo 2: Desativar Workflow Antigo**

1. No workflow aberto
2. Toggle **Active** no canto superior direito → OFF (cinza)
3. Aguarde confirmação: "Workflow deactivated"

---

### **Passo 3: Exportar Configurações Importantes**

Antes de deletar, **copie manualmente** estas informações para um arquivo de texto:

```
=== CONFIGURAÇÕES DO WORKFLOW ANTIGO ===

Google Sheets:
- Sheet ID: YOUR_SHEET_ID_AQUI
- Sheet Name: Leads

Telegram:
- Chat ID: YOUR_CHAT_ID_AQUI

APIs Credenciais (IDs):
- Perplexity API: perplexity-api-key
- OpenAI API: openai-api-key
- Anthropic API: anthropic-api-key
- Google Sheets OAuth: google-sheets-oauth
- Telegram Bot: telegram-bot-credentials
- SMTP Hostinger: smtp-hostinger

Outros IDs de Workflows (Execute Workflow nodes):
- AMJ_Email_Sequence_2
- AMJ_WhatsApp_Twilio_Followup
- AMJ_Lead_Nurturing
```

Salve como: `CONFIGURACOES_WORKFLOW_BACKUP.txt`

---

### **Passo 4: Deletar Workflow Antigo (Opcional)**

Se quiser limpar completamente:

1. Clique nos **3 pontos** (⋮)
2. Escolha **Delete**
3. Confirme: "Yes, delete workflow"

**OU mantenha desativado** e apenas desative-o (mais seguro).

---

### **Passo 5: Importar Workflow Novo**

1. Na tela principal do N8N
2. Clique em **+ Add workflow** (canto superior direito)
3. Clique nos **3 pontos** (⋮)
4. Escolha **Import from File**
5. Selecione: `WORKFLOW_1_MAIN_ATUALIZADO.json`
6. Clique **Import**

Aguarde: "Workflow imported successfully"

---

### **Passo 6: Configurar Credenciais**

O workflow importado virá **SEM credenciais** (por segurança). Você precisa associá-las manualmente:

#### **6.1: Perplexity API**

1. Clique no node: **🔍 Perplexity - Enriquecimento Lead**
2. Aba **Credentials**
3. Dropdown: Selecione **Perplexity API** (ou crie nova)
4. Se criar nova:
   - Name: `Perplexity API`
   - Header Name: `Authorization`
   - Header Value: `Bearer SEU_API_KEY_PERPLEXITY`
5. **Save**

#### **6.2: OpenAI API**

1. Clique no node: **🎯 GPT-4 - Lead Scoring**
2. Aba **Credentials**
3. Dropdown: Selecione **OpenAI API** (ou crie nova)
4. Se criar nova:
   - Name: `OpenAI API`
   - Header Name: `Authorization`
   - Header Value: `Bearer SEU_API_KEY_OPENAI`
5. **Save**

#### **6.3: Anthropic Claude API**

1. Clique no node: **✉️ Claude - Gerar Email 1**
2. Aba **Credentials**
3. Dropdown: Selecione **Anthropic Claude API** (ou crie nova)
4. Se criar nova:
   - Name: `Anthropic Claude API`
   - Header Name: `x-api-key`
   - Header Value: `SEU_API_KEY_ANTHROPIC`
5. **Save**

#### **6.4: Google Sheets OAuth2**

1. Clique no node: **📊 Google Sheets - Salvar Lead (COM ORIGEM)**
2. Aba **Credentials**
3. Dropdown: Selecione **Google Sheets OAuth2** (existente)
4. Se não existir, crie OAuth2:
   - Siga tutorial N8N: https://docs.n8n.io/integrations/builtin/credentials/google/oauth-generic/
5. **Save**

⚠️ **IMPORTANTE:** Verifique se a conta OAuth tem permissão de **Editor** na planilha.

#### **6.5: Telegram Bot**

1. Clique no node: **📲 Telegram - Pedir Aprovação**
2. Aba **Credentials**
3. Dropdown: Selecione **Telegram Bot** (existente)
4. Se criar nova:
   - Bot Token: Obtido do @BotFather
   - Chat ID: Seu ID de chat pessoal
5. **Save**

Repita para nodes:
- **📱 Telegram - Receber Resposta**
- **✅ Telegram - Confirmar Envio**
- **❌ Telegram - Email Rejeitado**

#### **6.6: SMTP Hostinger**

1. Clique no node: **📧 Email - Enviar ao Lead**
2. Aba **Credentials**
3. Dropdown: Selecione **SMTP Hostinger** (existente)
4. Se criar nova:
   - Host: `smtp.hostinger.com`
   - Port: `465`
   - Secure: **Yes**
   - User: `contato@alcinomenezesjunior.com`
   - Password: Sua senha SMTP
5. **Save**

---

### **Passo 7: Atualizar Google Sheets ID**

1. Abra sua Google Sheets
2. Copie o **Sheet ID** da URL:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
                                          ^^^^^^^^^^^^^^^^^^^
                                          Este é o Sheet ID
   ```

3. No N8N, clique no node: **📊 Google Sheets - Salvar Lead (COM ORIGEM)**
4. Campo **Document**:
   - Modo: **By URL**
   - Cole: `https://docs.google.com/spreadsheets/d/SEU_SHEET_ID`
5. Campo **Sheet Name**: `Leads` (exato, case-sensitive)
6. **Save**

Repita para nodes:
- **🔍 Sheets - Buscar Lead Aprovado**
- **✅ Sheets - Marcar Email Enviado**

---

### **Passo 8: Atualizar Telegram Chat ID**

1. Obtenha seu Chat ID:
   - Envie mensagem para @userinfobot no Telegram
   - Copie o ID retornado (ex: `123456789`)

2. No N8N, clique em cada node Telegram:
   - **📲 Telegram - Pedir Aprovação**
   - **✅ Telegram - Confirmar Envio**
   - **❌ Telegram - Email Rejeitado**

3. Campo **Chat ID**: Cole seu Chat ID
4. **Save** em cada um

---

### **Passo 9: Ativar Webhook**

1. Clique no node: **🎯 Webhook - Captura Lead (ÚNICO)**
2. Verifique configurações:
   - **Path**: `leads-geral` ✅
   - **HTTP Method**: POST ✅
   - **Response Mode**: Using 'Respond to Webhook' Node ✅
3. **Save**

4. **Copie a Production URL** (aparece no node quando workflow está ativo):
   ```
   https://mjrmkt.app.n8n.cloud/webhook/leads-geral
   ```

---

### **Passo 10: Ativar Workflow**

1. Toggle **Active** no canto superior direito → ON (verde)
2. Aguarde: "Workflow activated"

---

### **Passo 11: Testar com curl**

Execute um teste rápido:

```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "LP_Agencia_Trafego",
    "landing_page": "Agência Local - Tráfego Pago",
    "nome": "Teste Importação",
    "email": "teste@exemplo.pt",
    "whatsapp": "912345678",
    "interesse": "Teste",
    "servico": "Teste"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Lead capturado e processado com sucesso!",
  "origem": "LP_Agencia_Trafego"
}
```

---

### **Passo 12: Verificar Execução**

1. No N8N, clique em **Executions** (aba esquerda)
2. Localize última execução (verde = sucesso, vermelho = erro)
3. Clique para ver detalhes
4. Verifique cada node:
   - ✅ **Webhook** recebeu dados
   - ✅ **Code** processou origem corretamente
   - ✅ **Perplexity** retornou análise
   - ✅ **GPT-4** retornou score
   - ✅ **Google Sheets** salvou lead
   - ✅ **Claude** gerou email
   - ✅ **Telegram** enviou notificação

---

### **Passo 13: Validar Google Sheets**

1. Abra sua Google Sheets
2. Verifique última linha:
   - Coluna **Q** (origemCodigo): `LP_Agencia_Trafego` ✅
   - Coluna **R** (paginaOrigem): `Agência Local - Tráfego Pago` ✅
   - Todos os outros dados preenchidos ✅

---

### **Passo 14: Validar Telegram**

1. Abra Telegram
2. Verifique se recebeu notificação:
   ```
   🔔 **NOVO LEAD AMJ - APROVAÇÃO NECESSÁRIA**
   ...
   🌐 **Origem:** Agência Local - Tráfego Pago
   ```

---

## ✅ CHECKLIST DE VALIDAÇÃO COMPLETA

Após importação e testes:

- [ ] Workflow importado com sucesso
- [ ] Todas as 6 credenciais configuradas
- [ ] Google Sheets ID atualizado
- [ ] Telegram Chat ID atualizado
- [ ] Workflow ativado (toggle verde)
- [ ] Webhook URL copiada
- [ ] Teste curl retornou HTTP 200
- [ ] Lead apareceu no Google Sheets
- [ ] Campos `origemCodigo` e `paginaOrigem` corretos
- [ ] Notificação Telegram recebida
- [ ] Execução no N8N sem erros (todos nodes verdes)

---

## 🔄 OPÇÃO B: CRIAR NOVO WORKFLOW (COEXISTÊNCIA)

Se preferir testar o novo workflow sem deletar o antigo:

### **Passo 1: Importar Como Novo**

1. Na tela principal do N8N
2. Clique em **+ Add workflow**
3. Clique nos **3 pontos** (⋮)
4. Escolha **Import from File**
5. Selecione: `WORKFLOW_1_MAIN_ATUALIZADO.json`
6. **Import**

### **Passo 2: Renomear para Diferenciar**

1. Clique no nome do workflow (topo)
2. Renomeie para: `1_AMJ_Lead_System_v3.2_WEBHOOK_UNICO_TESTE`
3. **Save**

### **Passo 3: Configurar Credenciais**

Siga **Passos 6-8 da Opção A**.

### **Passo 4: Desativar Workflow Antigo Temporariamente**

1. Abra workflow v3.1 (antigo)
2. Toggle **Active** → OFF

### **Passo 5: Ativar Novo Workflow**

1. Abra workflow v3.2 (novo)
2. Toggle **Active** → ON

### **Passo 6: Testar**

Execute todos os testes curl (ver `COMANDOS_TESTE_CURL.md`).

### **Passo 7: Decidir**

Depois de validar:

**SE TUDO FUNCIONOU:**
- Delete workflow v3.1 (antigo)
- Renomeie v3.2 para: `1_AMJ_Lead_System_v3.2_WEBHOOK_UNICO`

**SE HOUVE PROBLEMAS:**
- Desative v3.2
- Reative v3.1
- Debug v3.2 até resolver

---

## 🚨 TROUBLESHOOTING

### **Problema 1: "Workflow imported with missing credentials"**

**Causa:** Normal - credenciais não são exportadas por segurança.

**Solução:** Configure manualmente (Passo 6 da Opção A).

---

### **Problema 2: "Node execution failed: Google Sheets"**

**Causa:** Credencial OAuth2 sem permissão ou Sheet ID incorreto.

**Solução:**
1. Verifique se conta Google tem permissão de **Editor** na planilha
2. Re-autentique OAuth2:
   - Node Google Sheets → Credentials → Reconnect
3. Confirme Sheet ID correto
4. Confirme sheet name = "Leads" (exato)

---

### **Problema 3: "Node execution failed: Perplexity/OpenAI/Claude"**

**Causa:** API key inválida ou expirada.

**Solução:**
1. Teste API key manualmente:
   ```bash
   # Perplexity
   curl -X POST https://api.perplexity.ai/chat/completions \
     -H "Authorization: Bearer YOUR_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"llama-3.1-sonar-small-128k-online","messages":[{"role":"user","content":"test"}]}'

   # OpenAI
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_KEY"

   # Claude
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: YOUR_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{"model":"claude-sonnet-4-20250514","max_tokens":10,"messages":[{"role":"user","content":"test"}]}'
   ```

2. Se erro, gere nova API key
3. Atualize credencial no N8N

---

### **Problema 4: "Telegram bot not responding"**

**Causa:** Bot token inválido ou não iniciou conversa com bot.

**Solução:**
1. Verifique token com @BotFather: `/mybots` → Seu bot → API Token
2. Inicie conversa com o bot (envie /start)
3. Obtenha Chat ID novamente: @userinfobot
4. Atualize Chat ID em todos os nodes Telegram

---

### **Problema 5: "Webhook returns 404"**

**Causa:** Workflow não está ativo ou path incorreto.

**Solução:**
1. Verifique workflow está **Active** (verde)
2. Confirme path do webhook: `leads-geral` (sem `/` no início)
3. Use Production URL copiada do próprio node Webhook

---

### **Problema 6: "origemCodigo" e "paginaOrigem" vazios no Sheets**

**Causa:** Formulário não está enviando campos `origem` e `landing_page`.

**Solução:**
1. Se testando com curl, confirme JSON inclui:
   ```json
   {
     "origem": "LP_Agencia_Trafego",
     "landing_page": "Agência Local - Tráfego Pago"
   }
   ```

2. Se testando com formulário real, verifique HTML:
   ```html
   <input type="hidden" name="origem" value="LP_Agencia_Trafego">
   <input type="hidden" name="landing_page" value="Agência Local - Tráfego Pago">
   ```

3. Se campos vêm vazios, Code node usa fallback `LP_Desconhecida` - isso é correto.

---

## 📝 NOTAS FINAIS

### **Workflows 2, 3, 4 - Não Precisam Modificação**

Os workflows de follow-up (Email 2, WhatsApp, Nurturing) **continuam funcionando** sem alterações porque:

✅ Leem dados do Google Sheets (que agora tem colunas extras)
✅ Podem ignorar `origemCodigo` e `paginaOrigem` se não precisarem
✅ Compatibilidade retroativa garantida

**Opcional - Melhorias Futuras:**
- Adicionar lógica condicional por origem nos emails/WhatsApp
- Criar sequências de nurturing diferentes por LP

---

### **Atualizar URL nos Formulários (Se Mudou)**

Se a URL do webhook mudou, atualize nos 4 formulários:

**agencia/script.js** (linha 75):
```javascript
await fetch('https://mjrmkt.app.n8n.cloud/webhook/leads-geral', {
```

**agentes-ia/script.js** (linha 249):
```javascript
await fetch('https://mjrmkt.app.n8n.cloud/webhook/leads-geral', {
```

**chatbot-estetica/script.js** (linha 335):
```javascript
const url = 'https://mjrmkt.app.n8n.cloud/webhook/leads-geral';
```

**pme/index.html** (linha 761):
```javascript
await fetch('https://mjrmkt.app.n8n.cloud/webhook/leads-geral', {
```

---

## 🎉 CONCLUSÃO

Se seguiu todos os passos:

✅ Workflow 1 atualizado (v3.2) importado e funcionando
✅ Webhook único `/leads-geral` ativo
✅ Identificação de origem das 4 LPs funcionando
✅ Google Sheets com estrutura de 31 colunas
✅ Testes curl validados
✅ Sistema pronto para receber leads reais

**Próximo Passo:** Executar bateria completa de testes com as 4 origens (ver `COMANDOS_TESTE_CURL.md`).

---

## 📞 SUPORTE

Se encontrou problemas não listados no Troubleshooting:

1. Verifique **Executions** no N8N para ver erro exato
2. Exporte execução com erro (Download) para análise
3. Consulte documentação N8N: https://docs.n8n.io
4. Verifique se todas as APIs estão com créditos/quota disponível
