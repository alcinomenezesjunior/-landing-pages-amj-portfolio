# Configuração N8N - Webhook Único

## 🔗 Webhook URL

**https://mjrmkt.app.n8n.cloud/webhook/leads-geral**

Este webhook recebe leads de **todas as 4 landing pages** do portfolio AMJ.

---

## 📊 Estrutura dos Dados Recebidos

Cada lead virá com os seguintes campos obrigatórios:

### Campos Comuns (Todas as Landing Pages)

```json
{
  "origem": "LP_Agencia_Trafego",
  "landing_page": "Agência Local - Tráfego Pago",
  "timestamp": "2025-01-16T14:30:00.000Z"
}
```

**Possíveis valores de `origem`:**
- `LP_Agencia_Trafego` - Agência Local (Tráfego Pago)
- `LP_Agentes_IA` - Agentes de IA Empresarial
- `LP_Chatbot_Estetica` - Chatbot para Estética
- `LP_Consultoria_PME` - Consultoria PME

---

### Estrutura Completa por Landing Page

#### 1. LP_Agencia_Trafego

```json
{
  "origem": "LP_Agencia_Trafego",
  "landing_page": "Agência Local - Tráfego Pago",
  "timestamp": "2025-01-16T14:30:00.000Z",
  "nome": "João Silva",
  "whatsapp": "+351912345678",
  "email": "joao@exemplo.pt",
  "instagram": "@clinicabeleza",
  "consent": "sim"
}
```

**Campos específicos:**
- `instagram` - Handle do Instagram
- `consent` - Consentimento RGPD (sempre "sim")

---

#### 2. LP_Agentes_IA

```json
{
  "origem": "LP_Agentes_IA",
  "landing_page": "Agentes de IA Empresarial",
  "timestamp": "2025-01-16T14:30:00.000Z",
  "nome": "Maria Santos",
  "empresa": "Tech Solutions Lda",
  "whatsapp": "+351923456789",
  "sector": "E-commerce"
}
```

**Campos específicos:**
- `empresa` - Nome da empresa
- `sector` - Setor de atuação (E-commerce, Serviços B2B, Saúde & Bem-estar, Educação, Imobiliário, Outros)

---

#### 3. LP_Chatbot_Estetica

```json
{
  "origem": "LP_Chatbot_Estetica",
  "landing_page": "Chatbot para Estética",
  "timestamp": "2025-01-16T14:30:00.000Z",
  "nome": "Ana Costa",
  "email": "ana@esteticabeleza.pt",
  "whatsapp": "+351934567890",
  "instagram": "@esteticabeleza",
  "clientesAtivos": "10-30",
  "marcacoesAtivas": "sim",
  "curiosidade": "teste-gratis",
  "planoIntegracao": "iniciar-breve"
}
```

**Campos específicos:**
- `clientesAtivos` - Quantidade de clientes ativos
- `marcacoesAtivas` - Se já usa sistema de marcação (sim/não)
- `curiosidade` - Motivo de interesse (teste-gratis, anuncio, recomendacao, pesquisa)
- `planoIntegracao` - Quando planeia integrar (iniciar-breve, explorar-opcoes, avaliar)

---

#### 4. LP_Consultoria_PME

```json
{
  "origem": "LP_Consultoria_PME",
  "landing_page": "Consultoria PME",
  "timestamp": "2025-01-16T14:30:00.000Z",
  "nome": "Carlos Pereira",
  "email": "carlos@empresalider.pt",
  "empresa": "Empresa Líder Lda",
  "whatsapp_ddi": "+351",
  "whatsapp_num": "945678901",
  "selo": "pme-lider",
  "browserName": "Chrome",
  "osName": "Windows",
  "deviceType": "desktop",
  "ipAddress": "85.123.45.67"
}
```

**Campos específicos:**
- `whatsapp_ddi` - Indicativo do país (ex: +351, +55, +244)
- `whatsapp_num` - Número de telefone sem indicativo
- `selo` - Tipo de selo PME (pme-lider, pme-excelencia, candidato, nenhum)
- `browserName` - Nome do navegador
- `osName` - Sistema operativo
- `deviceType` - Tipo de dispositivo (desktop/mobile/tablet)
- `ipAddress` - Endereço IP do visitante

---

## 🗂️ Estrutura Google Sheet Recomendada

### Criar planilha: **"Leads - Todas Landing Pages"**

#### Colunas Base (A-H):

| Coluna | Nome | Tipo | Descrição |
|--------|------|------|-----------|
| A | Timestamp | Datetime | Data/hora de submissão |
| B | Origem | Text | Identificador da LP (LP_Agencia_Trafego, etc) |
| C | Landing Page | Text | Nome descritivo da landing page |
| D | Nome | Text | Nome do lead |
| E | Email | Text | Email do lead |
| F | WhatsApp | Text | Número WhatsApp completo |
| G | Empresa | Text | Nome da empresa (quando aplicável) |
| H | Status | Dropdown | Novo, Contactado, Qualificado, Convertido, Perdido |

#### Colunas Adicionais (I-P):

| Coluna | Nome | Tipo | Descrição |
|--------|------|------|-----------|
| I | Instagram | Text | Handle Instagram (quando aplicável) |
| J | Setor | Text | Setor de atuação (quando aplicável) |
| K | Selo PME | Text | Tipo de selo PME (quando aplicável) |
| L | Device | Text | Tipo de dispositivo |
| M | IP Address | Text | IP do visitante (quando aplicável) |
| N | Notas | Text | Observações manuais |
| O | Data Contacto | Date | Data do primeiro contacto |
| P | Responsável | Text | Quem está a tratar o lead |

---

## ⚙️ Configuração no N8N

### Workflow Recomendado:

```
1. Webhook Node (Trigger)
   ↓
2. Set Node (Formatação)
   ↓
3. IF Node (Roteamento por Origem)
   ↓
4. Google Sheets Node (Gravação)
   ↓
5. Email Node (Notificação - Opcional)
```

---

### 1️⃣ **Webhook Node**

**Configuração:**
- **HTTP Method:** POST
- **Path:** `/leads-geral`
- **Response Mode:** On Received
- **Response Data:** JSON
- **Response Code:** 200

**Body esperado:** JSON com estrutura variável por landing page (ver acima)

---

### 2️⃣ **Set Node** (Formatação/Normalização)

**Objetivo:** Padronizar dados e adicionar campos calculados

**Operações:**
```javascript
// Converter timestamp para timezone PT
{{ DateTime.fromISO($json.timestamp).setZone('Europe/Lisbon').toFormat('dd/MM/yyyy HH:mm:ss') }}

// Adicionar status padrão
Status: "Novo"

// Normalizar WhatsApp (juntar DDI + Número para PME)
{{ $json.whatsapp_ddi || '' }}{{ $json.whatsapp_num || $json.whatsapp || '' }}

// Extrair nome curto (primeiro nome)
{{ $json.nome.split(' ')[0] }}
```

---

### 3️⃣ **IF Node** (Roteamento Condicional - Opcional)

**Condições:**

```javascript
// Branch 1: Leads de PME com selo certificado
{{ $json.origem === 'LP_Consultoria_PME' && ['pme-lider', 'pme-excelencia'].includes($json.selo) }}
→ Ação: Enviar email VIP + Adicionar tag "HOT" no CRM

// Branch 2: Leads de Chatbot Estética com interesse imediato
{{ $json.origem === 'LP_Chatbot_Estetica' && $json.planoIntegracao === 'iniciar-breve' }}
→ Ação: Notificar vendas imediatamente

// Branch 3: Leads de Agentes IA de setores premium
{{ $json.origem === 'LP_Agentes_IA' && ['E-commerce', 'Serviços B2B'].includes($json.sector) }}
→ Ação: Agendar follow-up automático em 24h

// Branch 4: Outros leads
→ Ação: Fluxo padrão
```

---

### 4️⃣ **Google Sheets Node**

**Configuração:**
- **Operation:** Append
- **Spreadsheet:** "Leads - Todas Landing Pages"
- **Sheet:** "Leads" (ou criar abas por origem)
- **Data Mode:** Auto-Map Columns

**Mapeamento de Campos:**

| Coluna Sheet | Campo N8N | Fallback |
|--------------|-----------|----------|
| Timestamp | `{{ $json.timestamp_formatted }}` | `{{ $now }}` |
| Origem | `{{ $json.origem }}` | - |
| Landing Page | `{{ $json.landing_page }}` | - |
| Nome | `{{ $json.nome }}` | - |
| Email | `{{ $json.email }}` | "" |
| WhatsApp | `{{ $json.whatsapp_completo }}` | `{{ $json.whatsapp }}` |
| Empresa | `{{ $json.empresa }}` | "" |
| Status | "Novo" | - |
| Instagram | `{{ $json.instagram }}` | "" |
| Setor | `{{ $json.sector }}` | "" |
| Selo PME | `{{ $json.selo }}` | "" |
| Device | `{{ $json.deviceType }}` | "" |
| IP Address | `{{ $json.ipAddress }}` | "" |

---

### 5️⃣ **Email Node** (Notificação - Opcional)

**Quando:** Apenas leads quentes (PME certificadas, interesse imediato)

**Template:**

```
Subject: 🔥 NOVO LEAD QUENTE - {{ $json.landing_page }}

Olá,

Novo lead de ALTA PRIORIDADE recebido!

📋 Dados:
• Nome: {{ $json.nome }}
• Origem: {{ $json.landing_page }}
• Email: {{ $json.email }}
• WhatsApp: {{ $json.whatsapp_completo }}
• Empresa: {{ $json.empresa }}

🎯 Motivo da Prioridade:
• {{ $json.selo === 'pme-lider' ? 'Empresa PME Líder certificada' : '' }}
• {{ $json.planoIntegracao === 'iniciar-breve' ? 'Interesse imediato em integração' : '' }}

⏰ Recomendação: Contactar nas próximas 2 horas.

---
Enviado automaticamente pelo N8N Webhook Handler
```

---

## 📈 Vantagens desta Configuração

### ✅ **Gestão Centralizada**
- Todos os leads em 1 única planilha
- Visão consolidada de todas as fontes
- Dashboards comparativos entre LPs

### ✅ **Manutenção Simplificada**
- 1 automação vs 4 separadas
- 1 URL de webhook para configurar
- Mudanças afetam todas as LPs simultaneamente

### ✅ **Escalabilidade**
- Fácil adicionar novas landing pages
- Basta adicionar novo valor em `origem`
- Não precisa criar novos webhooks

### ✅ **Análise de Performance**
- Filtros por `origem` na Google Sheet
- Relatórios de conversão por LP
- Identificação de melhor fonte de leads

### ✅ **Automações Condicionais**
- Tratamento diferenciado por origem
- Leads VIP (PME certificadas) com prioridade
- Follow-ups automáticos segmentados

---

## 🧪 Testando a Implementação

### Passo 1: Ativar o Workflow no N8N
1. Criar workflow conforme descrito acima
2. Ativar webhook (status: Active)
3. Copiar URL do webhook gerado

### Passo 2: Testar Envio de Cada LP

**Teste 1 - Agência:**
```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "LP_Agencia_Trafego",
    "landing_page": "Agência Local - Tráfego Pago",
    "timestamp": "2025-01-16T10:00:00.000Z",
    "nome": "Teste Agencia",
    "email": "teste@agencia.pt",
    "whatsapp": "+351912000001",
    "instagram": "@testeagencia",
    "consent": "sim"
  }'
```

**Teste 2 - Agentes IA:**
```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "LP_Agentes_IA",
    "landing_page": "Agentes de IA Empresarial",
    "timestamp": "2025-01-16T10:05:00.000Z",
    "nome": "Teste IA",
    "empresa": "Empresa Teste Lda",
    "whatsapp": "+351912000002",
    "sector": "E-commerce"
  }'
```

**Teste 3 - Chatbot Estética:**
```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "LP_Chatbot_Estetica",
    "landing_page": "Chatbot para Estética",
    "timestamp": "2025-01-16T10:10:00.000Z",
    "nome": "Teste Chatbot",
    "email": "teste@chatbot.pt",
    "whatsapp": "+351912000003",
    "instagram": "@testeestetica",
    "clientesAtivos": "10-30",
    "marcacoesAtivas": "sim",
    "curiosidade": "teste-gratis",
    "planoIntegracao": "iniciar-breve"
  }'
```

**Teste 4 - PME:**
```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type": application/json" \
  -d '{
    "origem": "LP_Consultoria_PME",
    "landing_page": "Consultoria PME",
    "timestamp": "2025-01-16T10:15:00.000Z",
    "nome": "Teste PME",
    "email": "teste@pme.pt",
    "empresa": "PME Teste Lda",
    "whatsapp_ddi": "+351",
    "whatsapp_num": "912000004",
    "selo": "pme-lider",
    "deviceType": "desktop",
    "ipAddress": "192.168.1.1"
  }'
```

### Passo 3: Validar na Google Sheet
- Verificar se 4 linhas foram criadas
- Confirmar que campo `origem` está correto em cada uma
- Validar que campos específicos estão preenchidos

---

## 🔧 Troubleshooting

### Problema: Webhook não recebe dados

**Causas possíveis:**
1. Workflow não está ativado no N8N
2. URL do webhook incorreta no código
3. CORS bloqueando requisição

**Solução:**
```javascript
// No N8N Webhook Node, habilitar CORS:
Response Headers:
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
```

---

### Problema: Dados não aparecem na Google Sheet

**Causas possíveis:**
1. Credenciais Google Sheets expiradas
2. Mapeamento de colunas incorreto
3. Nome da planilha errado

**Solução:**
- Reconectar conta Google no N8N
- Verificar nomes exatos das colunas (case-sensitive)
- Usar "Auto-Map" para testar primeiro

---

### Problema: Campos específicos vazios

**Causa:** Campos opcionais não enviados por algumas LPs

**Solução:** Usar expressões com fallback:
```javascript
{{ $json.email || '' }}
{{ $json.empresa || 'N/A' }}
{{ $json.ipAddress || 'Desconhecido' }}
```

---

## 📞 Suporte

Para questões sobre esta configuração:
- **Email:** contacto@alcinomenezesjunior.com
- **Documentação N8N:** https://docs.n8n.io/workflows/webhooks/

---

**Última atualização:** 16 de Janeiro de 2025
**Versão:** 1.0
**Autor:** AMJ - Estratégia Digital
