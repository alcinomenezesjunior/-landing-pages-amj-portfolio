# 🤖 Essenza Prime Clinic - AI Agent Chatbot v2.0

Sistema completo de chatbot WhatsApp com AI Agent para automatização de marcações, pagamentos e follow-up em clínica de estética.

---

## 📂 ESTRUTURA DO PROJETO

```
v2-ai-agent/
├── workflows/                    # Workflows n8n
│   ├── BACKEND_ESSENZA_ATUALIZADO.json      # ⭐ Workflow principal
│   ├── STRIPE_WEBHOOK_WORKFLOW.json         # Webhook pagamentos
│   ├── SCHEDULED_MESSAGES_WORKFLOW.json     # Mensagens agendadas
│   └── META_VERIFY_FINAL.json               # Verificação webhook Meta
├── database/                     # Schema SQL
│   └── SUPABASE_SCHEMA.sql                  # Estrutura completa BD
├── docs/                         # Documentação
│   ├── SETUP_GUIDE.md                       # Guia de configuração
│   ├── TOOLS_IMPLEMENTATION.md              # Implementação das Tools
│   ├── GUIA_IMPORTACAO.md                   # Como importar workflows
│   ├── CONFIGURAR_WEBHOOK_WHATSAPP.md       # Setup Meta WhatsApp
│   └── PROJECT_CONTEXT_CHATBOT_ESTETICA.md  # Contexto do projeto
├── referencias/                  # Ficheiros de referência
│   ├── equipa-politicas.md                  # Info equipa e políticas
│   └── servicos-procedimentos.md            # Catálogo de serviços
├── CHANGELOG.md                  # Histórico de mudanças
└── README.md                     # Este ficheiro
```

---

## 🎯 WORKFLOW PRINCIPAL

**Ficheiro:** `workflows/BACKEND_ESSENZA_ATUALIZADO.json`

### Fluxo de Funcionamento:
```
1. WhatsApp → Webhook recebe mensagem
2. Parse Message → Extrai dados (phone, texto)
3. Valid Message? → Filtra mensagens inválidas
4. Get Client → Busca cliente no Supabase
5. Client Exists? → Cria novo cliente se necessário
6. Get Conversation → Busca histórico de conversa
7. Merge Data → Consolida informação
8. [AI AGENT AQUI] → Processa com Claude + Tools
9. Update Conversation → Guarda conversa
10. Send WhatsApp → Envia resposta
11. Webhook Response → Confirma recebimento
```

---

## ⚙️ WORKFLOWS AUXILIARES

### 1. STRIPE_WEBHOOK_WORKFLOW.json
- **Trigger:** Webhook Stripe (`checkout.session.completed`)
- **Função:** Confirma pagamento, actualiza appointment, envia WhatsApp
- **Webhook URL:** `https://n8n.alcinomenezesjunior.com/webhook/stripe-webhook`

### 2. SCHEDULED_MESSAGES_WORKFLOW.json
- **Trigger:** Cron (a cada 5 minutos)
- **Função:** Envia lembretes e follow-ups automáticos
- **Tipos de mensagem:**
  - `reminder_24h`: Lembrete 24h antes
  - `reminder_1h`: Lembrete 1h antes
  - `post_care`: Cuidados pós-procedimento
  - `follow_up_7d`: Follow-up comercial

### 3. META_VERIFY_FINAL.json
- **Trigger:** Webhook GET (verificação Meta)
- **Função:** Responde ao challenge do Meta para verificar webhook
- **Uso:** One-time setup (desactivar depois de verificar)

---

## 🗄️ BASE DE DADOS SUPABASE

**Ficheiro:** `database/SUPABASE_SCHEMA.sql`

### Tabelas Principais:
- **clients**: Dados dos clientes (phone, name, email, stats)
- **appointments**: Marcações (service, professional, date, status, payment)
- **conversations**: Histórico de conversas WhatsApp (messages JSONB, state)
- **scheduled_messages**: Mensagens agendadas para envio
- **professionals**: Info dos profissionais (8 profissionais pré-carregados)
- **services**: Catálogo de serviços (19 serviços pré-carregados)
- **pending_upsells**: Sistema de upsell automático
- **attendance_confirmations**: Confirmação de comparecimento

### Views:
- `upcoming_appointments`: Próximas marcações
- `messages_to_send_today`: Mensagens pendentes
- `clinic_stats`: Estatísticas gerais

---

## 🔧 CONFIGURAÇÃO

### Pré-requisitos:
- ✅ n8n v1.120.4+
- ✅ Conta Supabase
- ✅ WhatsApp Business API (Meta)
- ✅ Stripe (modo test)
- ✅ Anthropic API (Claude)
- ✅ Google Calendar (opcional)

### Passo a passo completo:
Ver ficheiro: `docs/SETUP_GUIDE.md`

---

## 🤖 AI AGENT + TOOLS

O sistema define 8 Tools que o AI Agent pode usar:

1. **check_availability** - Verifica slots livres
2. **create_booking** - Cria marcação + evento + mensagens
3. **generate_payment_link** - Gera link Stripe
4. **cancel_booking** - Cancela + reembolso
5. **reschedule_booking** - Remarca para nova data
6. **process_refund** - Processa reembolso Stripe
7. **get_care_instructions** - Cuidados pré/pós
8. **get_professional_info** - Info sobre profissionais

**Implementação:** Ver `docs/TOOLS_IMPLEMENTATION.md`

---

## 📋 FICHEIROS DE REFERÊNCIA

### equipa-politicas.md
- Estrutura da equipa (8 profissionais)
- Política de pagamento (depósito 50%)
- Política de cancelamento (reembolso gradual)

### servicos-procedimentos.md
- Catálogo completo de serviços
- Procedimentos de cada tratamento
- Cuidados pré e pós-procedimento

---

## 🚀 QUICK START

### 1. Configurar Supabase
```bash
# No Supabase SQL Editor, executar:
database/SUPABASE_SCHEMA.sql
```

### 2. Importar Workflow Principal
```
n8n → Import from File → workflows/BACKEND_ESSENZA_ATUALIZADO.json
```

### 3. Configurar Credenciais
- Supabase (service_role key)
- WhatsApp Cloud API (Bearer token)
- Anthropic API (Claude key)

### 4. Configurar Webhook WhatsApp
Ver: `docs/CONFIGURAR_WEBHOOK_WHATSAPP.md`

### 5. Testar
```bash
curl -X POST https://n8n.alcinomenezesjunior.com/webhook/testar-bot-whatsapp \
  -H "Content-Type: application/json" \
  -d '{"body": {...}}'  # Estrutura WhatsApp
```

---

## ⚠️ ESTADO ACTUAL DO PROJETO

### ✅ Completo:
- Webhook WhatsApp verificado com Meta
- Schema Supabase criado e populado
- Workflow principal estruturado
- Workflows auxiliares (Stripe, mensagens agendadas)

### ⚠️ Pendente:
- **Corrigir nós Supabase** no workflow principal
  - Operações antigas (select → getMany, insert → create)
  - Configurar campos corretamente
- **Adicionar nós em falta:**
  - Supabase Get Conversation
  - Supabase Update Conversation
- **Testar fluxo completo** end-to-end

---

## 🔄 PRÓXIMOS PASSOS

1. Abrir `workflows/BACKEND_ESSENZA_ATUALIZADO.json` no n8n
2. Corrigir nós Supabase (actualizar operações e campos)
3. Testar com cURL
4. Adicionar AI Agent (opcional - se quiser lógica inteligente)
5. Implementar Tools (opcional - para funcionalidades avançadas)

---

## 📞 SUPORTE

**Projeto:** AMJ Automação & IA  
**Website:** [alcinomenezesjunior.com](https://www.alcinomenezesjunior.com)  
**GitHub:** [landing-pages-amj-portfolio](https://github.com/alcinomenezesjunior/landing-pages-amj-portfolio)

---

**Última actualização:** 23 Novembro 2025  
**Versão:** 2.0 (AI Agent + Tools)
