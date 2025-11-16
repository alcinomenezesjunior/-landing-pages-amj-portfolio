# 📋 RELATÓRIO DE MUDANÇAS - WORKFLOW 1 ATUALIZADO

## 🎯 OBJETIVO DA ATUALIZAÇÃO

Adaptar o Workflow 1 (MAIN) para processar leads de **4 landing pages** através de um **webhook único**, identificando automaticamente a origem de cada lead.

---

## 📊 RESUMO EXECUTIVO

| Item | Antes | Depois |
|------|-------|--------|
| **Webhook Path** | `/webhook-lead-capture` | `/leads-geral` |
| **Landing Pages Suportadas** | 1 (chatbot-estetica) | 4 (todas) |
| **Campos de Identificação** | origem (fixo) | origemCodigo + paginaOrigem |
| **Colunas Google Sheets** | 29 colunas | 31 colunas (+2) |
| **Nodes Modificados** | - | 4 nodes |
| **Nodes Criados** | - | 0 (apenas atualizados) |

---

## 🔧 MUDANÇAS DETALHADAS POR NODE

### **NODE 1: 🎯 Webhook - Captura Lead**

**ID:** `webhook-trigger`

**MUDANÇA:**
```json
// ANTES
{
  "parameters": {
    "path": "webhook-lead-capture"
  },
  "name": "🎯 Webhook - Captura Lead"
}

// DEPOIS
{
  "parameters": {
    "path": "leads-geral"
  },
  "name": "🎯 Webhook - Captura Lead (ÚNICO)"
}
```

**POR QUE?**
- Unificar recepção de todas as 4 landing pages
- Path agora corresponde ao endpoint implementado: `https://mjrmkt.app.n8n.cloud/webhook/leads-geral`

**IMPACTO:**
- ✅ Todos os formulários das 4 LPs enviam para este webhook
- ✅ Identifica origem pelos campos hidden `origem` e `landing_page`

---

### **NODE 2: Sticky Note - Fase 1**

**ID:** `sticky-fase1`

**MUDANÇA:**
```markdown
# ANTES
## 📥 FASE 1: CAPTURA DE LEADS
**Objetivo:** Receber leads do formulário /chatbot-estetica

# DEPOIS
## 📥 FASE 1: CAPTURA DE LEADS - WEBHOOK ÚNICO
**Objetivo:** Receber leads das 4 landing pages

**Origens Suportadas:**
- LP_Agencia_Trafego (Agência Tráfego Pago)
- LP_Agentes_IA (Agentes IA Empresarial)
- LP_Chatbot_Estetica (Chatbot Estética)
- LP_Consultoria_PME (Consultoria PME)
```

**POR QUE?**
- Documentação clara das 4 origens suportadas
- Facilita debug e entendimento do workflow

---

### **NODE 3: ⚙️ Code - Validar e Formatar**

**ID:** `code-validate-format`

**MUDANÇA PRINCIPAL:**

#### **A) Processamento de Origem (NOVO)**

```javascript
// ===== CÓDIGO ADICIONADO NO INÍCIO =====

// Captura campos de origem do formulário
const origemCodigo = data.origem || 'LP_Desconhecida';
const paginaOrigem = data.landing_page || 'Não especificada';

// Mapear código de origem para descrição amigável
const origemMap = {
  'LP_Agencia_Trafego': 'Landing Page Agência - Tráfego Pago',
  'LP_Agentes_IA': 'Landing Page Agentes de IA',
  'LP_Chatbot_Estetica': 'Landing Page Chatbot Estética',
  'LP_Consultoria_PME': 'Landing Page Consultoria PME'
};

const origemDescricao = origemMap[origemCodigo] || paginaOrigem;
```

**POR QUE?**
- Converte código curto (`LP_Agencia_Trafego`) em descrição legível
- Fallback para `LP_Desconhecida` se campo não vier do formulário
- Permite rastreamento preciso da origem do lead

#### **B) Campos Adicionados ao Output**

```javascript
output.push({
  json: {
    // ... campos existentes ...

    // ===== CAMPOS DE ORIGEM (NOVOS) =====
    origem: origemDescricao,           // Ex: "Landing Page Agência - Tráfego Pago"
    origemCodigo: origemCodigo,        // Ex: "LP_Agencia_Trafego"
    paginaOrigem: paginaOrigem,        // Ex: "Agência Local - Tráfego Pago"

    // ... resto dos campos ...
  }
});
```

**IMPACTO:**
- ✅ Toda análise IA downstream recebe dados de origem
- ✅ Perplexity pode personalizar pesquisa por tipo de LP
- ✅ Emails podem referenciar a página de origem

---

### **NODE 4: 🔍 Perplexity - Enriquecimento Lead**

**ID:** `perplexity-enrichment`

**MUDANÇA:**

```javascript
// PROMPT ATUALIZADO - Seção de Dados do Lead
"**DADOS DO LEAD:**
Nome: {{ $json.nome }}
Email: {{ $json.email }}
Instagram: {{ $json.instagram }}
WhatsApp: {{ $json.whatsapp }}
Cidade: {{ $json.cidade }}, {{ $json.distrito }}
Interesse: {{ $json.interesse }}
Serviço: {{ $json.servico }}
Dispositivo: {{ $json.dispositivo }}
Origem: {{ $json.paginaOrigem }} ({{ $json.origemCodigo }})  // <- NOVO
"
```

**POR QUE?**
- Perplexity pode ajustar análise baseado na origem
- Ex: Lead de LP_Consultoria_PME → foco em eficiência operacional
- Ex: Lead de LP_Chatbot_Estetica → foco em atendimento automatizado

**IMPACTO:**
- ✅ Análises mais contextualizadas por tipo de interesse
- ✅ Recomendações de pacote mais precisas

---

### **NODE 5: 🎯 GPT-4 - Lead Scoring**

**ID:** `gpt4-lead-scoring`

**MUDANÇA:**

```javascript
// PROMPT ATUALIZADO - Seção de Dados do Lead
"**DADOS DO LEAD:**
Nome: {{ $json.nome }}
Email: {{ $json.email }}
Instagram: {{ $json.instagram }}
WhatsApp: {{ $json.whatsapp }}
Cidade: {{ $json.cidade }}, {{ $json.distrito }}
Dispositivo: {{ $json.dispositivo }}
Navegador: {{ $json.navegador }}
Interesse: {{ $json.interesse }}
Serviço: {{ $json.servico }}
Referrer: {{ $json.referrer }}
Origem: {{ $json.paginaOrigem }} ({{ $json.origemCodigo }})  // <- NOVO
"
```

**POR QUE?**
- Scoring pode considerar qual LP converteu o lead
- Algumas LPs podem ter leads mais qualificados que outras
- Permite análise de performance por origem

**IMPACTO:**
- ✅ Lead scoring mais preciso
- ✅ Possibilidade de ajustar pontuação por origem no futuro

---

### **NODE 6: 📊 Google Sheets - Salvar Lead**

**ID:** `sheets-save-lead`

**MUDANÇA:**

```json
{
  "columns": {
    "mappingMode": "defineBelow",
    "value": {
      // ... colunas existentes (29) ...

      // ===== COLUNAS NOVAS (+2) =====
      "origemCodigo": "={{ $json.origemCodigo }}",     // Coluna 17 (após "origem")
      "paginaOrigem": "={{ $json.paginaOrigem }}",     // Coluna 18

      // ... resto das colunas ...
    }
  }
}
```

**ESTRUTURA COMPLETA (31 colunas):**

| # | Coluna | Descrição | Exemplo |
|---|--------|-----------|---------|
| 1 | timestamp | Data/hora captura | 2025-01-16T15:30:00.000Z |
| 2 | nome | Nome do lead | João Silva |
| 3 | email | Email | joao@exemplo.pt |
| 4 | instagram | Instagram | @clinicabeleza |
| 5 | whatsapp | WhatsApp (formatado) | 351912345678 |
| 6 | status | Classificação do lead | Quente 🔥 |
| 7 | dataContacto | Data do último contato | 16/01/2025 15:30 |
| 8 | meioContacto | Canal usado | Email |
| 9 | notasEnriquecimento | Análise Perplexity | (texto longo) |
| 10 | leadScore | Pontuação 0-100 | 75 |
| 11 | emailEnviado | Status email | Sim - Email 1 |
| 12 | whatsappEnviado | Status WhatsApp | Não |
| 13 | ultimaInteracao | Última interação | 2025-01-16T15:30:00Z |
| 14 | interesse | Interesse manifestado | Tráfego pago |
| 15 | servico | Serviço específico | Meta Ads |
| 16 | origem | Descrição da origem | Landing Page Agência - Tráfego Pago |
| **17** | **origemCodigo** | **Código da LP (NOVO)** | **LP_Agencia_Trafego** |
| **18** | **paginaOrigem** | **Nome da LP (NOVO)** | **Agência Local - Tráfego Pago** |
| 19 | valorProposta | Valor proposta enviada | €990 |
| 20 | probabilidadeConversao | Prob. conversão | 70-90% |
| 21 | observacoes | Observações gerais | Score: 75/100... |
| 22 | linkWhatsapp | Link WhatsApp | https://wa.me/351912345678 |
| 23 | dispositivo | Dispositivo usado | Mobile |
| 24 | navegador | Navegador | Chrome |
| 25 | os | Sistema operacional | Android |
| 26 | pais | País | Portugal |
| 27 | distrito | Distrito | Lisboa |
| 28 | cidade | Cidade | Lisboa |
| 29 | provedor | Provedor ISP | MEO |
| 30 | referrer | Origem do tráfego | Direto |
| 31 | idioma | Idioma do browser | pt-PT |

**POR QUE?**
- **origemCodigo**: Permite filtros e dashboards por origem (fórmulas Excel/Sheets)
- **paginaOrigem**: Nome legível para humanos (relatórios)

**IMPACTO:**
- ✅ Análise de performance por landing page
- ✅ Filtros no Google Sheets por origem
- ✅ Dashboards de conversão por LP
- ✅ Identificação de LPs mais eficazes

---

### **NODE 7: ✉️ Claude - Gerar Email 1**

**ID:** `claude-email-generation`

**MUDANÇA:**

```javascript
// PROMPT ATUALIZADO - Seção de Dados do Lead
"**DADOS DO LEAD:**
Nome: {{ $json.nome }}
Email: {{ $json.email }}
Cidade: {{ $json.cidade }}, {{ $json.distrito }}
Instagram: {{ $json.instagram }}
Interesse manifestado: {{ $json.interesse }}
Serviço específico: {{ $json.servico }}
Lead Score: {{ $json.leadScore }}/100
Classificação: {{ $json.status }}
Origem: {{ $json.paginaOrigem }} ({{ $json.origemCodigo }})  // <- NOVO
"
```

**POR QUE?**
- Claude pode personalizar email baseado na origem
- Ex: Se veio de LP_Agentes_IA, mencionar automação empresarial
- Ex: Se veio de LP_Chatbot_Estetica, focar em atendimento estético

**IMPACTO:**
- ✅ Emails mais contextualizados
- ✅ Taxa de resposta potencialmente maior
- ✅ Lead sente que foi realmente compreendido

---

### **NODE 8: 📲 Telegram - Pedir Aprovação**

**ID:** `telegram-approval`

**MUDANÇA:**

```markdown
# MENSAGEM TELEGRAM ATUALIZADA

🔔 **NOVO LEAD AMJ - APROVAÇÃO NECESSÁRIA**

**Lead #{{ $json.leadScore }}** - {{ $json.status }}

👤 **Nome:** {{ $json.nome }}
📧 **Email:** {{ $json.email }}
📱 **WhatsApp:** {{ $json.whatsapp }}
📍 **Localização:** {{ $json.cidade }}, {{ $json.distrito }}
🎯 **Interesse:** {{ $json.interesse }}
🌐 **Origem:** {{ $json.paginaOrigem }}  // <- NOVO

**📊 Score:** {{ $json.leadScore }}/100
**🎲 Conversão:** {{ $json.probabilidadeConversao }}

(... resto da mensagem ...)
```

**POR QUE?**
- Você sabe imediatamente de qual LP o lead veio
- Ajuda a validar se email está adequado à origem
- Facilita decisão de aprovação

**IMPACTO:**
- ✅ Contexto completo para decisão de aprovação
- ✅ Rastreamento de qual LP está gerando mais leads

---

### **NODE 9: ✅ Webhook Response - Sucesso**

**ID:** `webhook-response`

**MUDANÇA:**

```json
{
  "responseBody": "={{ {
    \"success\": true,
    \"message\": \"Lead capturado e processado com sucesso!\",
    \"leadEmail\": $json.email,
    \"leadScore\": $json.leadScore,
    \"status\": $json.status,
    \"origem\": $json.origemCodigo,  // <- NOVO
    \"timestamp\": $now.toISO()
  } }}"
}
```

**POR QUE?**
- Confirmação de qual origem foi processada
- Facilita debugging de problemas por LP específica

**IMPACTO:**
- ✅ Logs mais informativos
- ✅ Debug mais rápido se houver problemas

---

## 📈 BENEFÍCIOS DA ATUALIZAÇÃO

### **1. Operacionais**
- ✅ **1 webhook único** vs 4 webhooks separados → mais fácil de gerenciar
- ✅ **Manutenção centralizada** → mudanças aplicam-se a todas as LPs
- ✅ **Configuração simplificada** → apenas 1 URL no N8N

### **2. Analíticos**
- ✅ **Rastreamento por origem** → saber qual LP converte melhor
- ✅ **Análise de performance** → comparar LPs lado a lado
- ✅ **Dashboards centralizados** → todos os dados em 1 planilha

### **3. De Personalização**
- ✅ **Análise IA contextualizada** → Perplexity ajusta por origem
- ✅ **Emails personalizados** → Claude adapta tom por LP
- ✅ **Scoring preciso** → GPT-4 considera origem do lead

### **4. Futuros**
- ✅ **Fácil adicionar novas LPs** → apenas adicionar ao mapa de origens
- ✅ **Testes A/B por LP** → comparar versões de páginas
- ✅ **Automações condicionais** → ações diferentes por origem

---

## ⚠️ COMPATIBILIDADE

### **Workflows 2, 3, 4 - NÃO PRECISAM ALTERAÇÃO**

**POR QUE?**
- Workflows 2, 3 e 4 leem dados do **Google Sheets**
- Novos campos `origemCodigo` e `paginaOrigem` estarão disponíveis na Sheet
- Workflows podem usar esses campos se quiserem, mas não é obrigatório

**OPCIONAL - MELHORIAS FUTURAS:**
- Email 2: Pode mencionar origem no contexto
- WhatsApp: Pode ajustar mensagem por origem
- Nurturing: Pode criar sequências diferentes por origem

---

## 🔍 VALIDAÇÃO DAS MUDANÇAS

### **Checklist de Teste**

- [ ] Webhook recebe dados de LP_Agencia_Trafego corretamente
- [ ] Webhook recebe dados de LP_Agentes_IA corretamente
- [ ] Webhook recebe dados de LP_Chatbot_Estetica corretamente
- [ ] Webhook recebe dados de LP_Consultoria_PME corretamente
- [ ] Campo `origemCodigo` está correto no Google Sheets
- [ ] Campo `paginaOrigem` está correto no Google Sheets
- [ ] Perplexity recebe e usa dados de origem na análise
- [ ] GPT-4 recebe e usa dados de origem no scoring
- [ ] Claude recebe e usa dados de origem no email
- [ ] Telegram mostra origem corretamente na notificação
- [ ] Webhook response retorna origem correta

---

## 📝 NOTAS TÉCNICAS

### **Fallbacks Implementados**

**1. Origem Desconhecida:**
```javascript
const origemCodigo = data.origem || 'LP_Desconhecida';
```
- Se formulário não enviar campo `origem`, usa fallback
- Previne erros se houver problemas no frontend

**2. Página Não Especificada:**
```javascript
const paginaOrigem = data.landing_page || 'Não especificada';
```
- Se formulário não enviar `landing_page`, usa fallback

**3. Descrição Padrão:**
```javascript
const origemDescricao = origemMap[origemCodigo] || paginaOrigem;
```
- Se código não estiver no mapa, usa nome da página diretamente
- Permite adicionar novas LPs sem quebrar workflow

### **Adicionando Nova Landing Page no Futuro**

**PASSO 1:** Adicionar ao mapa de origens no Code node:
```javascript
const origemMap = {
  'LP_Agencia_Trafego': 'Landing Page Agência - Tráfego Pago',
  'LP_Agentes_IA': 'Landing Page Agentes de IA',
  'LP_Chatbot_Estetica': 'Landing Page Chatbot Estética',
  'LP_Consultoria_PME': 'Landing Page Consultoria PME',
  'LP_Nova_Pagina': 'Landing Page Nova Página'  // <- ADICIONAR AQUI
};
```

**PASSO 2:** Atualizar Sticky Note com nova origem

**PASSO 3:** Testar com curl (ver seção de comandos de teste)

**PRONTO!** Nenhuma outra alteração necessária.

---

## 🎯 CONCLUSÃO

O Workflow 1 está agora **totalmente preparado** para receber leads das 4 landing pages através de um webhook único.

**Vantagens:**
- ✅ Gestão centralizada
- ✅ Rastreamento completo de origem
- ✅ Análises IA mais contextualizadas
- ✅ Fácil manutenção e expansão

**Próximos Passos:**
1. Importar workflow atualizado no N8N
2. Atualizar estrutura Google Sheets (adicionar 2 colunas)
3. Testar com comandos curl
4. Validar leads reais das 4 LPs
