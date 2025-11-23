# 🤖 PROJETO: CHATBOT ESTÉTICA - AMJ AUTOMAÇÃO & IA

## Documento de Contexto Completo
**Versão**: 1.0  
**Data**: 21 de Novembro de 2025  
**Autor**: Menezes Jr. (AMJ Automação & IA)

---

## 📋 ÍNDICE

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Decisões Tomadas](#2-decisões-tomadas)
3. [Arquitetura Técnica](#3-arquitetura-técnica)
4. [Estrutura de Preços](#4-estrutura-de-preços)
5. [Funcionalidades Detalhadas](#5-funcionalidades-detalhadas)
6. [Base de Conhecimento](#6-base-de-conhecimento)
7. [Credenciais e Acessos](#7-credenciais-e-acessos)
8. [Estrutura do GitHub](#8-estrutura-do-github)
9. [Cronograma e Próximos Passos](#9-cronograma-e-próximos-passos)
10. [Histórico de Decisões](#10-histórico-de-decisões)

---

## 1. VISÃO GERAL DO PROJETO

### 1.1 Objetivo
Criar um sistema completo de chatbot de marcação automática para demonstração na landing page `/chatbot-estetica`. O demo simula uma clínica de estética real (Essenza Prime Clinic) e serve para:
- Demonstrar valor aos prospects
- Justificar os preços dos planos vendidos
- Converter visitantes em clientes

### 1.2 O Que Está Sendo Vendido
Serviço de automação de marcações via WhatsApp com IA para clínicas/estúdios de estética em Portugal (e futuramente Europa).

### 1.3 Landing Page
- **URL**: https://www.alcinomenezesjunior.com/chatbot-estetica
- **Número WhatsApp Demo**: +351 926 699 009
- **Clínica Fictícia**: Essenza Prime Clinic, Unipessoal Lda.
- **Localização Fictícia**: Cascais, Lisboa

### 1.4 Estratégia de Mercado
- **Fase 1**: Portugal (validação)
- **Fase 2**: Espanha (mercado 5x maior, língua similar)
- **Fase 3**: Itália, França, UK

---

## 2. DECISÕES TOMADAS

### 2.1 Decisões Técnicas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Workflow Engine | n8n | Já em uso, flexível, self-hosted |
| IA/LLM | Claude Sonnet 4 via AI Agent Node | Mais moderno que HTTP Request direto |
| Base de Dados | Supabase (PostgreSQL) | Gratuito, rápido, profissional (em vez de Google Sheets) |
| Pagamentos | Stripe (modo sandbox para demo) | Standard da indústria, reembolsos automáticos |
| Calendário | Google Calendar | Verificação e criação de eventos reais |
| Mensagens | WhatsApp Cloud API | Canal preferido do público-alvo |

### 2.2 Decisões de Produto

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Nº de Planos | 4 (Starter, Essencial, Pro, Enterprise) | Cobrir desde profissional individual até clínica grande |
| Black Friday | Abandonada | Parece desespero; preferimos lançamento sólido |
| Tom do Bot | Finge ser clínica real (não menciona ser demo) | Mais imersivo e impressionante |
| Multilíngue | Sim, estrutura preparada | Expansão para Espanha/Itália |
| Timeline | Completo (~7-8 dias) em vez de MVP | Solução robusta vale mais que rapidez |

### 2.3 Decisões de UX

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Interface | WhatsApp Real (não widget) | Mais profissional e autêntico |
| Mensagem Inicial | Bot apresenta a clínica proativamente | Prospect não conhece a clínica fictícia |
| Livro de Reclamações | Informa mas não processa | Demonstra profissionalismo sem complexidade |

---

## 3. ARQUITETURA TÉCNICA

### 3.1 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (WhatsApp)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  WhatsApp Cloud API                          │
│                  (Meta Business Suite)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      n8n Workflow                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Webhook   │→ │  AI Agent   │→ │  Tools      │         │
│  │  (entrada)  │  │  (Claude)   │  │  (actions)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    Supabase     │ │ Google Calendar │ │     Stripe      │
│   (PostgreSQL)  │ │   (Marcações)   │ │  (Pagamentos)   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 3.2 Fluxo Principal

```
1. Cliente envia mensagem no WhatsApp
2. WhatsApp Cloud API envia webhook para n8n
3. n8n processa e envia para AI Agent (Claude)
4. AI Agent usa Tools para:
   - Verificar disponibilidade (Google Calendar)
   - Criar marcação (Google Calendar)
   - Gerar link de pagamento (Stripe)
   - Processar reembolso (Stripe)
   - Guardar dados (Supabase)
5. AI Agent gera resposta natural em PT-PT
6. n8n envia resposta via WhatsApp Cloud API
7. Sistema agenda lembretes e follow-ups
```

### 3.3 Tools do AI Agent

| Tool | Função |
|------|--------|
| `check_availability` | Verifica horários disponíveis no Google Calendar |
| `create_booking` | Cria marcação no calendário |
| `cancel_booking` | Cancela e calcula reembolso |
| `reschedule_booking` | Reagenda marcação |
| `generate_payment_link` | Gera link Stripe para depósito |
| `process_refund` | Processa reembolso parcial/total |
| `get_care_instructions` | Obtém cuidados pré/pós procedimento |
| `get_professional_info` | Informação sobre profissionais |

### 3.4 Base de Dados (Supabase)

**Tabelas principais:**

```sql
-- Clientes
clients (id, phone, name, email, created_at, total_spent, num_appointments)

-- Marcações
appointments (id, client_id, service, professional, date, time_start, 
              duration_minutes, status, price, deposit_paid, stripe_payment_id)

-- Upsells pendentes
pending_upsells (id, client_id, original_service, suggested_service, 
                 discount_percentage, offer_again_date, accepted)

-- Histórico de conversas
conversations (id, client_id, messages, current_state, updated_at)

-- Confirmações de comparecimento
attendance_confirmations (id, appointment_id, status, confirmed_at, 
                          confirmed_by, follow_up_sent)
```

---

## 4. ESTRUTURA DE PREÇOS

### 4.1 Tabela de Planos

| Plano | Setup | Mensal | Target |
|-------|-------|--------|--------|
| **Starter** | €490 | €149 | Profissional individual, 1 serviço |
| **Essencial** | €990 | €249 | Pequeno gabinete, até 5 serviços |
| **Pro** | €1.690 | €449 | Clínica média, multi-serviços |
| **Enterprise** | €2.990 | €699 | Clínica grande, multi-profissionais |

### 4.2 Diferenciação Por Plano

| Funcionalidade | Starter | Essencial | Pro | Enterprise |
|----------------|---------|-----------|-----|------------|
| Marcação automática WhatsApp | ✅ | ✅ | ✅ | ✅ |
| Google Calendar | ✅ | ✅ | ✅ | ✅ |
| Lembretes T-24h / T-1h | ✅ | ✅ | ✅ | ✅ |
| Nº de serviços | 1 | 5 | 15 | Ilimitado |
| Nº de profissionais | 1 | 1 | 3 | Ilimitado |
| Pagamentos Stripe | ❌ | ✅ | ✅ | ✅ |
| Reembolsos automáticos | ❌ | ❌ | ✅ | ✅ |
| Confirmação comparecimento | ❌ | ❌ | ✅ | ✅ |
| Upsell/Downsell | ❌ | ❌ | ✅ | ✅ |
| Cuidados pré/pós | ❌ | ✅ | ✅ | ✅ |
| Múltiplas agendas | ❌ | ❌ | ❌ | ✅ |
| Dashboard KPIs | ❌ | ❌ | Básico | Completo |
| Suporte | Email | Email | WhatsApp | Prioritário |

---

## 5. FUNCIONALIDADES DETALHADAS

### 5.1 Fluxo de Marcação Completo

```
1. Cliente indica interesse num serviço
2. Bot explica o serviço (duração, preço, o que inclui)
3. Bot pergunta se quer marcar
4. Bot verifica disponibilidade (Tool: check_availability)
5. Bot apresenta 3-5 opções de horário
6. Cliente escolhe
7. Bot pede: nome completo, email
8. Bot confirma todos os dados
9. Bot gera link de pagamento (Tool: generate_payment_link)
10. Cliente paga depósito (50%)
11. Stripe confirma pagamento via webhook
12. Bot cria marcação (Tool: create_booking)
13. Bot envia confirmação
14. Sistema agenda lembretes
```

### 5.2 Sistema de Lembretes

| Momento | Canal | Conteúdo |
|---------|-------|----------|
| T-24h | WhatsApp | Lembrete + cuidados pré-procedimento |
| T-1h | WhatsApp | Lembrete rápido |
| T+15min | WhatsApp (clínica) | Pedido confirmação comparecimento |
| T+30min | WhatsApp (clínica) | Follow-up se "ATRASADO" |
| T+2h | WhatsApp | Cuidados pós-procedimento (se confirmado) |
| T+7 dias | WhatsApp | Follow-up satisfação + upsell |
| Fim do dia | WhatsApp (clínica) | Alerta pendentes não confirmados |

### 5.3 Política de Cancelamento

| Prazo | Reembolso | Retenção |
|-------|-----------|----------|
| 7+ dias antes | 100% | 0% |
| 3-7 dias antes | 75% | 25% |
| < 3 dias (até 24h) | 50% | 50% |
| < 24 horas | 25% | 75% |
| No-show | 0% | 100% |

### 5.4 Upsell e Downsell

**Upsell (após marcação confirmada):**
- Limpeza de Pele → Peeling Superficial (10% desconto)
- Peeling Superficial → Radiofrequência Facial (10%)
- Microblading → Micropigmentação Lábios (10%)

**Downsell (no cancelamento por preço):**
- Peeling Médio (€160) → Peeling Superficial (€80)
- Harmonização Facial (€600) → Radiofrequência Facial (€100)

---

## 6. BASE DE CONHECIMENTO

### 6.1 Clínica Demo

- **Nome**: Essenza Prime Clinic, Unipessoal Lda.
- **Localização**: Cascais, Lisboa
- **Horário**: Segunda a Sexta 10:00-19:00, Sábado 10:00-14:00
- **Telefone/WhatsApp**: +351 926 699 009
- **Email**: atendimento@essenzaprimeclinic.pt

### 6.2 Equipa (8 Profissionais)

| Nome | Função | Dias |
|------|--------|------|
| Dr. Gustavo Mendonça | Médico Esteta | Seg-Sex 10:00-16:00 |
| Dra. Bruna Cortez | Biomédica Esteta | Ter/Qui/Sex 13:00-19:00, Sáb 10:00-14:00 |
| Sra. Sílvia Ramos | Esteticista Facial | Seg/Qua/Sex 10:00-19:00, Sáb 10:00-14:00 |
| Sra. Carla Magalhães | Esteticista Corporal | Seg-Sex 13:00-19:00, Sáb 10:00-14:00 |
| Sra. Inês Duarte | Micropigmentação | Seg/Qua/Qui 10:00-16:00, Sáb 10:00-14:00 |
| Sra. Larissa Galvão | Esteticista Multi | Ter 10:00-19:00, Sex 10:00-13:00 |
| Sr. Pedro Moreira | Terapeuta Corporal | Seg/Qua/Sex 16:00-19:00, Sáb 10:00-14:00 |
| Sra. Renata Pinto | Assistente | Seg-Sex 10:00-19:00, Sáb 10:00-14:00 |

### 6.3 Catálogo de Serviços

**Tratamentos Faciais:**
- Limpeza de Pele Profunda: €40 (60-90 min)
- Peeling Superficial: €80 (30-45 min)
- Peeling Médio: €160 (45-60 min)
- Radiofrequência Facial: €100 (30-45 min)
- Microagulhamento: €120 (45-60 min)
- HIFU: €200 (60-90 min)
- Harmonização Facial: €600 (60-90 min)

**Tratamentos Corporais:**
- Massagem Terapêutica: €50 (50-60 min)
- Massagem Modeladora: €60 (50-60 min)
- Drenagem Linfática: €60 (50-60 min)
- Radiofrequência Corporal: €100 (45-60 min)
- Criolipólise: €120 (60-90 min)
- Massagem Detox: €55 (50-60 min)

**Micropigmentação:**
- Microblading Sobrancelhas: €250 (90-120 min)
- Micropigmentação Lábios: €280 (90-120 min)
- Micropigmentação Eyeliner: €240 (60-90 min)

**Consultas:**
- Avaliação Inicial: Gratuita (30 min)

### 6.4 Documentos de Referência

Os documentos completos estão no GitHub:
- `knowledge-base/servicos-procedimentos.md` — Guia técnico completo de procedimentos
- `knowledge-base/equipa-politicas.md` — Equipa, horários e políticas comerciais

---

## 7. CREDENCIAIS E ACESSOS

### 7.1 Supabase

```
Organização: AMJ Automacao & IA
Projeto: essenza-prime-demo
Plano: Free

Project URL: https://udxmyclqkraludzkqone.supabase.co
Project ID: udxmyclqkraludzkqone
Anon Public Key: [guardada no Bitwarden]
Service Role Key: [guardada no Bitwarden]
Database Password: [guardada no Bitwarden]
```

### 7.2 Stripe

```
Modo: Sandbox (teste)
Conta: Pessoal (freelancer)
Publishable Key: pk_test_... [guardada no Bitwarden]
Secret Key: sk_test_... [guardada no Bitwarden]
```

### 7.3 Google Calendar

```
Calendar ID: d682359e9a244ab7f9a7f7e925d05bf9a6def533796af78a1ecba749103b59c8@group.calendar.google.com
Nome: Agenda Demo Estética
Credencial n8n: googleSheetsOAuth2Api (verificar se tem scope Calendar)
```

### 7.4 WhatsApp Cloud API

```
Número: +351 926 699 009
Status: A configurar
Webhook URL: https://n8n.alcinomenezesjunior.com/webhook/testar-bot-whatsapp
```

### 7.5 Anthropic (Claude)

```
Modelo: claude-sonnet-4-20250514
Credencial n8n: Já configurada
```

---

## 8. ESTRUTURA DO GITHUB

### 8.1 Repositório

**URL**: https://github.com/alcinomenezesjunior/-landing-pages-amj-portfolio

### 8.2 Estrutura de Pastas

```
-landing-pages-amj-portfolio/
│
├── chatbot-estetica/                    ← Landing Page
│   ├── index.html
│   ├── script.js
│   ├── script.min.js
│   ├── styles.css
│   └── styles.min.css
│
├── chatbot-estetica-demo/               ← Demo Essenza Prime
│   ├── workflows/
│   │   ├── v1-http-request/             ← Versão antiga (deprecated)
│   │   │   └── DEMO_Chatbot_Estetica_Testar_Bot_WhatsApp_IA.json
│   │   └── v2-ai-agent/                 ← Versão actual (a criar)
│   │       ├── DEMO_Essenza_Prime_AI_Agent.json
│   │       └── SETUP_GUIDE.md
│   ├── knowledge-base/
│   │   ├── servicos-procedimentos.md
│   │   └── equipa-politicas.md
│   └── README.md
│
├── n8n-workflows/                       ← Workflows de leads (separado)
│   └── WORKFLOW_1_MAIN_ATUALIZADO.json
│
└── ... (outras pastas)
```

---

## 9. CRONOGRAMA E PRÓXIMOS PASSOS

### 9.1 Timeline Estimado (~7-8 dias)

| Dia | Tarefa |
|-----|--------|
| 1 | Finalizar prompt + Claude Code gerar workflow |
| 2 | Configurar WhatsApp Cloud API |
| 3 | Importar workflow + configurar credenciais n8n |
| 4 | Criar tabelas no Supabase |
| 5 | Testes e ajustes do bot |
| 6 | Actualizar copy da LP |
| 7 | Testes end-to-end + polish |
| 8 | Go-live |

### 9.2 Próximos Passos Imediatos

1. ✅ GitHub reorganizado
2. ✅ Stripe Sandbox configurado
3. ✅ Supabase configurado
4. ⏳ Criar prompt final para Claude Code
5. ⏳ Configurar WhatsApp Cloud API
6. ⏳ Gerar workflow com Claude Code
7. ⏳ Actualizar copy da LP

---

## 10. HISTÓRICO DE DECISÕES

### Conversa Original: 21 Nov 2025

**Tópicos discutidos:**
1. Análise do workflow existente (HTTP Request vs AI Agent Node)
2. Decisão de migrar para AI Agent Node
3. Integração com Google Calendar real
4. Configuração da WhatsApp Cloud API
5. Estrutura de preços (4 planos)
6. Abandono da estratégia Black Friday
7. Sistema de confirmação de comparecimento
8. Upsell/Downsell automáticos
9. Migração de Google Sheets para Supabase
10. Expansão para mercado europeu
11. Estrutura multilíngue da LP

**Principais insights:**
- O demo deve parecer uma clínica real para máximo impacto
- Funcionalidades avançadas justificam preços premium
- Supabase é mais profissional que Google Sheets
- Portugal é mercado de validação; Espanha é próximo passo natural

---

## ANEXOS

### A. Links Úteis

- Landing Page: https://www.alcinomenezesjunior.com/chatbot-estetica
- GitHub: https://github.com/alcinomenezesjunior/-landing-pages-amj-portfolio
- n8n: https://n8n.alcinomenezesjunior.com
- Supabase: https://supabase.com/dashboard/project/udxmyclqkraludzkqone
- Stripe: https://dashboard.stripe.com/test/dashboard
- Meta Business Suite: https://business.facebook.com

### B. Documentos Relacionados

1. PROMPT_CLAUDE_CODE_FINAL.md — Prompt completo para Claude Code
2. Gabinete-Estetica-Guia-Completo — Knowledge base de procedimentos
3. Essenza-Prime-Clinic-Equipa-Pagamento — Knowledge base de equipa e políticas

---

**FIM DO DOCUMENTO DE CONTEXTO**

*Última actualização: 21 de Novembro de 2025*
