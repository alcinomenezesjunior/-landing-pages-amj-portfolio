# 🧪 COMANDOS DE TESTE - WEBHOOK ÚNICO N8N

## 📋 INSTRUÇÕES GERAIS

### **Antes de Testar:**

1. ✅ **Importar Workflow 1 atualizado** no N8N
2. ✅ **Ativar o workflow** (botão "Active" ON)
3. ✅ **Copiar URL do webhook** (Production URL)
4. ✅ **Substituir** `https://mjrmkt.app.n8n.cloud/webhook/leads-geral` nos comandos abaixo pela URL real se diferente

### **Como Testar:**

1. Copie o comando curl completo de cada origem
2. Cole no terminal (Linux/Mac) ou Git Bash (Windows)
3. Execute com `Enter`
4. Verifique:
   - ✅ Resposta HTTP 200 OK
   - ✅ Lead aparece no Google Sheets
   - ✅ Campos `origemCodigo` e `paginaOrigem` corretos
   - ✅ Notificação Telegram recebida
   - ✅ Email gerado corretamente

---

## 🎯 TESTE 1: LP_AGENCIA_TRAFEGO

### **Origem:** Landing Page Agência - Tráfego Pago

### **Comando:**

```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "LP_Agencia_Trafego",
    "landing_page": "Agência Local - Tráfego Pago",
    "timestamp": "2025-01-16T14:30:00.000Z",
    "nome": "Maria Santos",
    "email": "maria.santos@clinicabeleza.pt",
    "whatsapp": "912345678",
    "instagram": "@clinicabeleza",
    "interesse": "Tráfego pago para clínica de estética",
    "servico": "Meta Ads e Google Ads",
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    "country": "Portugal",
    "region": "Lisboa",
    "city": "Lisboa",
    "isp": "MEO",
    "referrer": "https://google.com",
    "language": "pt-PT"
  }'
```

### **Resposta Esperada:**

```json
{
  "success": true,
  "message": "Lead capturado e processado com sucesso!",
  "leadEmail": "maria.santos@clinicabeleza.pt",
  "leadScore": 75,
  "status": "Quente 🔥",
  "origem": "LP_Agencia_Trafego",
  "timestamp": "2025-01-16T14:35:12.543Z"
}
```

### **Validações:**
- [ ] Campo `origemCodigo` = `LP_Agencia_Trafego`
- [ ] Campo `paginaOrigem` = `Agência Local - Tráfego Pago`
- [ ] Campo `origem` = `Landing Page Agência - Tráfego Pago`
- [ ] Email menciona contexto de tráfego pago
- [ ] Telegram mostra origem corretamente

---

## 🤖 TESTE 2: LP_AGENTES_IA

### **Origem:** Landing Page Agentes de IA Empresarial

### **Comando:**

```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "LP_Agentes_IA",
    "landing_page": "Agentes de IA Empresarial",
    "timestamp": "2025-01-16T15:15:00.000Z",
    "nome": "João Ferreira",
    "email": "joao.ferreira@empresaxyz.pt",
    "whatsapp": "938765432",
    "instagram": "@empresaxyz",
    "interesse": "Automação com agentes de IA",
    "servico": "Agentes IA para atendimento empresarial",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "country": "Portugal",
    "region": "Porto",
    "city": "Porto",
    "isp": "NOS",
    "referrer": "Direto",
    "language": "pt-PT"
  }'
```

### **Resposta Esperada:**

```json
{
  "success": true,
  "message": "Lead capturado e processado com sucesso!",
  "leadEmail": "joao.ferreira@empresaxyz.pt",
  "leadScore": 82,
  "status": "Quente 🔥",
  "origem": "LP_Agentes_IA",
  "timestamp": "2025-01-16T15:20:45.123Z"
}
```

### **Validações:**
- [ ] Campo `origemCodigo` = `LP_Agentes_IA`
- [ ] Campo `paginaOrigem` = `Agentes de IA Empresarial`
- [ ] Campo `origem` = `Landing Page Agentes de IA`
- [ ] Email menciona automação empresarial
- [ ] Perplexity analisa contexto de agentes IA

---

## 💬 TESTE 3: LP_CHATBOT_ESTETICA

### **Origem:** Landing Page Chatbot para Estética

### **Comando:**

```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "LP_Chatbot_Estetica",
    "landing_page": "Chatbot para Estética",
    "timestamp": "2025-01-16T16:00:00.000Z",
    "nome": "Ana Costa",
    "email": "ana@espacoestetica.pt",
    "whatsapp": "965432187",
    "instagram": "@espacoestetica",
    "interesse": "Chatbot WhatsApp para clínica",
    "servico": "Automação de atendimento WhatsApp",
    "userAgent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36",
    "country": "Portugal",
    "region": "Braga",
    "city": "Braga",
    "isp": "Vodafone",
    "referrer": "https://facebook.com",
    "language": "pt-PT"
  }'
```

### **Resposta Esperada:**

```json
{
  "success": true,
  "message": "Lead capturado e processado com sucesso!",
  "leadEmail": "ana@espacoestetica.pt",
  "leadScore": 68,
  "status": "Morno 🟡",
  "origem": "LP_Chatbot_Estetica",
  "timestamp": "2025-01-16T16:05:33.789Z"
}
```

### **Validações:**
- [ ] Campo `origemCodigo` = `LP_Chatbot_Estetica`
- [ ] Campo `paginaOrigem` = `Chatbot para Estética`
- [ ] Campo `origem` = `Landing Page Chatbot Estética`
- [ ] Email menciona automação de atendimento
- [ ] GPT-4 considera interesse em chatbot no scoring

---

## 🏢 TESTE 4: LP_CONSULTORIA_PME

### **Origem:** Landing Page Consultoria PME

### **Comando:**

```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "LP_Consultoria_PME",
    "landing_page": "Consultoria PME",
    "timestamp": "2025-01-16T17:30:00.000Z",
    "nome": "Carlos Oliveira",
    "email": "carlos@pme-consulting.pt",
    "whatsapp": "927654321",
    "instagram": "",
    "interesse": "Consultoria em automação para PME",
    "servico": "Consultoria completa",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "country": "Portugal",
    "region": "Coimbra",
    "city": "Coimbra",
    "isp": "MEO",
    "referrer": "https://linkedin.com",
    "language": "pt-PT"
  }'
```

### **Resposta Esperada:**

```json
{
  "success": true,
  "message": "Lead capturado e processado com sucesso!",
  "leadEmail": "carlos@pme-consulting.pt",
  "leadScore": 71,
  "status": "Morno 🟡",
  "origem": "LP_Consultoria_PME",
  "timestamp": "2025-01-16T17:35:22.456Z"
}
```

### **Validações:**
- [ ] Campo `origemCodigo` = `LP_Consultoria_PME`
- [ ] Campo `paginaOrigem` = `Consultoria PME`
- [ ] Campo `origem` = `Landing Page Consultoria PME`
- [ ] Email menciona eficiência operacional
- [ ] Claude personaliza para contexto empresarial

---

## 🧪 TESTE 5: ORIGEM DESCONHECIDA (Fallback)

### **Cenário:** Lead enviado sem campos de origem (teste de robustez)

### **Comando:**

```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2025-01-16T18:00:00.000Z",
    "nome": "Lead Sem Origem",
    "email": "teste@exemplo.pt",
    "whatsapp": "911111111",
    "instagram": "",
    "interesse": "Teste sem origem",
    "servico": "Teste",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "country": "Portugal",
    "region": "Lisboa",
    "city": "Lisboa",
    "isp": "MEO",
    "referrer": "Direto",
    "language": "pt-PT"
  }'
```

### **Resposta Esperada:**

```json
{
  "success": true,
  "message": "Lead capturado e processado com sucesso!",
  "leadEmail": "teste@exemplo.pt",
  "leadScore": 45,
  "status": "Frio ❄️",
  "origem": "LP_Desconhecida",
  "timestamp": "2025-01-16T18:05:11.222Z"
}
```

### **Validações:**
- [ ] Campo `origemCodigo` = `LP_Desconhecida` (fallback funcionou)
- [ ] Campo `paginaOrigem` = `Não especificada` (fallback funcionou)
- [ ] Workflow **não quebrou** apesar de campos ausentes
- [ ] Lead processado normalmente

---

## 📊 CHECKLIST DE VALIDAÇÃO COMPLETA

### **Google Sheets - Verificar Estrutura:**

Após executar os 5 testes acima, sua planilha deve ter **5 novas linhas** com esta estrutura:

| nome | email | origemCodigo | paginaOrigem | origem |
|------|-------|--------------|--------------|--------|
| Maria Santos | maria.santos@... | LP_Agencia_Trafego | Agência Local - Tráfego Pago | Landing Page Agência - Tráfego Pago |
| João Ferreira | joao.ferreira@... | LP_Agentes_IA | Agentes de IA Empresarial | Landing Page Agentes de IA |
| Ana Costa | ana@... | LP_Chatbot_Estetica | Chatbot para Estética | Landing Page Chatbot Estética |
| Carlos Oliveira | carlos@... | LP_Consultoria_PME | Consultoria PME | Landing Page Consultoria PME |
| Lead Sem Origem | teste@... | LP_Desconhecida | Não especificada | Não especificada |

### **Telegram - Verificar Notificações:**

Você deve receber **5 notificações** no Telegram, cada uma mostrando:

```
🔔 **NOVO LEAD AMJ - APROVAÇÃO NECESSÁRIA**

...
🌐 **Origem:** [Nome da LP correspondente]
...
```

### **Perplexity/GPT-4 - Verificar Análises:**

Nos campos `notasEnriquecimento` e `observacoes` da planilha, verifique se a IA mencionou/considerou a origem do lead.

---

## 🔧 TROUBLESHOOTING

### **Problema 1: Erro 404 Not Found**

**Causa:** URL do webhook incorreta ou workflow não ativo

**Solução:**
1. Verifique se workflow está **Active** no N8N
2. Copie a **Production URL** do webhook node
3. Atualize URL nos comandos curl

---

### **Problema 2: Resposta 500 Internal Server Error**

**Causa:** Erro no processamento do workflow (código ou credenciais)

**Solução:**
1. Abra **Executions** no N8N
2. Localize execução com erro
3. Identifique node que falhou
4. Verifique:
   - Credenciais API (Perplexity, OpenAI, Claude)
   - Formato JSON dos prompts
   - Código JavaScript nos Code nodes

---

### **Problema 3: Lead não aparece no Google Sheets**

**Causa:** Permissões ou ID da planilha incorreto

**Solução:**
1. Verifique **Google Sheets OAuth2** credentials
2. Confirme **Sheet ID** no node Google Sheets
3. Verifique se planilha tem sheet chamada **"Leads"**
4. Garanta que conta OAuth tem permissão de escrita

---

### **Problema 4: Campo `origemCodigo` vazio ou errado**

**Causa:** Formulário não está enviando campo `origem`

**Solução:**
1. Verifique HTML do formulário (campos hidden presentes?)
2. Verifique JavaScript do formulário (campos incluídos no POST?)
3. Teste com curl primeiro para validar N8N
4. Se curl funciona mas formulário não → problema no frontend

---

### **Problema 5: Notificação Telegram não chega**

**Causa:** Credenciais Telegram ou Chat ID incorreto

**Solução:**
1. Verifique **Telegram Bot Token** nas credenciais
2. Confirme **Chat ID** está correto
3. Teste enviando mensagem manual via Telegram node
4. Certifique-se que iniciou conversa com o bot (@BotFather)

---

## 📈 ANÁLISE DE RESULTADOS

### **Após Todos os Testes:**

1. **Filtrar Google Sheets por `origemCodigo`:**
   ```
   =FILTER(A:Z, Q:Q="LP_Agencia_Trafego")
   ```
   (Assumindo coluna Q = origemCodigo)

2. **Contar Leads por Origem:**
   ```
   =COUNTIF(Q:Q, "LP_Agencia_Trafego")
   ```

3. **Calcular Lead Score Médio por Origem:**
   ```
   =AVERAGEIF(Q:Q, "LP_Agencia_Trafego", J:J)
   ```
   (Assumindo coluna J = leadScore)

4. **Taxa de Conversão por Origem:**
   ```
   = (Leads Quentes de LP_X) / (Total Leads LP_X) * 100
   ```

---

## ✅ CONCLUSÃO DO TESTE

Se todos os 5 testes passaram:

- ✅ **Webhook único está funcionando perfeitamente**
- ✅ **Identificação de origem está correta**
- ✅ **Fallbacks estão protegendo contra erros**
- ✅ **Google Sheets recebendo dados completos**
- ✅ **IAs usando dados de origem nas análises**

**Próximo Passo:** Validar com leads reais das 4 landing pages em produção.

---

## 🚀 COMANDOS RÁPIDOS (Copiar e Colar)

### **Testar Todas as 4 Origens de Uma Vez:**

```bash
# LP_Agencia_Trafego
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral -H "Content-Type: application/json" -d '{"origem": "LP_Agencia_Trafego", "landing_page": "Agência Local - Tráfego Pago", "nome": "Maria Santos", "email": "maria.santos@clinicabeleza.pt", "whatsapp": "912345678", "instagram": "@clinicabeleza", "interesse": "Tráfego pago", "servico": "Meta Ads"}'

# LP_Agentes_IA
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral -H "Content-Type: application/json" -d '{"origem": "LP_Agentes_IA", "landing_page": "Agentes de IA Empresarial", "nome": "João Ferreira", "email": "joao.ferreira@empresaxyz.pt", "whatsapp": "938765432", "instagram": "@empresaxyz", "interesse": "Agentes IA", "servico": "Automação"}'

# LP_Chatbot_Estetica
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral -H "Content-Type: application/json" -d '{"origem": "LP_Chatbot_Estetica", "landing_page": "Chatbot para Estética", "nome": "Ana Costa", "email": "ana@espacoestetica.pt", "whatsapp": "965432187", "instagram": "@espacoestetica", "interesse": "Chatbot", "servico": "WhatsApp"}'

# LP_Consultoria_PME
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral -H "Content-Type: application/json" -d '{"origem": "LP_Consultoria_PME", "landing_page": "Consultoria PME", "nome": "Carlos Oliveira", "email": "carlos@pme-consulting.pt", "whatsapp": "927654321", "interesse": "Consultoria", "servico": "Automação PME"}'
```

**Aguarde ~30-60 segundos** para cada lead ser processado completamente.

Depois verifique Google Sheets e Telegram para confirmar os 4 leads.
