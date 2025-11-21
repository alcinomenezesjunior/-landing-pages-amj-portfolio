# CHANGELOG
## Demo Chatbot Essenza Prime Clinic

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.

---

## [2.1.0] - 2025-11-21

### 🎉 Adicionado
- **Workflows Auxiliares Completos**
  - `STRIPE_WEBHOOK_WORKFLOW.json`: Processa webhooks do Stripe
  - `SCHEDULED_MESSAGES_WORKFLOW.json`: Envia mensagens automáticas a cada 5 minutos

- **Documentação de Implementação das Tools**
  - `TOOLS_IMPLEMENTATION.md`: Código completo e detalhado das 8 Tools
  - Exemplos práticos de integração no workflow principal
  - Helpers e funções auxiliares JavaScript
  - Instruções de implementação via Code nodes ou sub-workflows

- **Sistema de Confirmações de Pagamento**
  - Webhook Stripe recebe evento `checkout.session.completed`
  - Atualiza automaticamente status do appointment para `confirmed`
  - Marca `deposit_paid = true` no Supabase
  - Envia mensagem WhatsApp de confirmação ao cliente
  - Sugere upsell automático baseado no serviço marcado

- **Sistema de Mensagens Agendadas Funcional**
  - Query automática de mensagens pendentes a cada 5 minutos
  - Lembretes T-24h com cuidados pré-procedimento personalizados
  - Lembretes T-1h antes da consulta
  - Cuidados pós-procedimento T+2h após consulta
  - Follow-up comercial T+7 dias com sugestão de upsell
  - Marcação automática de mensagens como enviadas

### 📝 Melhorado
- **SETUP_GUIDE.md**
  - Adicionado **PASSO 7.5**: Workflows Auxiliares
    - Instruções detalhadas para importar Stripe Webhook
    - Instruções para importar Scheduled Messages
  - Adicionado **PASSO 7.6**: Implementar as Tools
    - Referência ao `TOOLS_IMPLEMENTATION.md`
    - Lista completa das 8 tools com descrição
  - Melhor organização e flow de configuração

### 🔧 Técnico
- Workflows totalmente funcionais em ambiente de desenvolvimento
- Credenciais configuráveis via variáveis de ambiente
- Error handling robusto em Code nodes críticos
- Integração completa: n8n + Supabase + Stripe + WhatsApp + Google Calendar
- Templates de mensagens personalizados por tipo

---

## [2.0.0] - 2025-11-21

### 🎉 Adicionado
- **Sistema completo com AI Agent (Claude Sonnet 4)**
  - 8 Tools funcionais para operações complexas
  - System prompt em português PT-PT de 3000+ palavras
  - Gestão de contexto conversacional completa

- **Base de dados Supabase**
  - 8 tabelas: clients, appointments, conversations, pending_upsells, scheduled_messages, attendance_confirmations, professionals, services
  - Dados pré-carregados: 8 profissionais, 17 serviços
  - Triggers automáticos para atualização de estatísticas
  - RLS (Row Level Security) configurado

- **Integração Stripe Payments**
  - Sistema de depósitos (50% antecipado)
  - Links de pagamento automáticos
  - Política de reembolso automatizada (7 dias, 3-7 dias, <3 dias, <24h)

- **Google Calendar**
  - Criação automática de eventos
  - Sincronização com horários dos profissionais
  - Verificação de disponibilidade em tempo real

- **Sistema de Mensagens Automáticas**
  - Lembretes T-24h (com cuidados pré)
  - Lembretes T-1h
  - Confirmação de comparecimento T+15min
  - Follow-up T+30min se atrasado
  - Cuidados pós-procedimento T+2h
  - Follow-up comercial T+7dias

- **Upsell/Downsell Inteligente**
  - Sugestões de serviços complementares após confirmação
  - Ofertas alternativas quando cliente quer cancelar por preço
  - Descontos automáticos de 10-15%

- **Documentação Completa**
  - SETUP_GUIDE.md com passo-a-passo detalhado
  - SUPABASE_SCHEMA.sql totalmente comentado
  - Workflow n8n estruturado e documentado

### 🔧 Alterado
- Migração de v1 (HTTP Request simples) para v2 (AI Agent avançado)
- Substituição de lógica manual por inteligência artificial
- Personalidade elegante e profissional em PT-PT

### ❌ Removido
- Versão v1-http-request (deprecated)
- Respostas hardcoded e limitadas

---

## [1.0.0] - 2025-11-18 (Deprecated)

### 🎉 Inicial
- Workflow básico com HTTP Request
- Respostas limitadas predefinidas
- Sem integração com base de dados
- Sem sistema de pagamentos

**Nota:** Esta versão foi descontinuada. Use v2.0.0 para funcionalidade completa.

---

## 🚀 Roadmap Futuro

### [2.1.0] - Planeado
- [ ] Dashboard de métricas em tempo real
- [ ] Sistema de confirmação de comparecimento via WhatsApp
- [ ] Distribuição inteligente de marcações entre profissionais
- [ ] Análise de sentiment para detecção de insatisfação
- [ ] Integração com CRM (HubSpot/Pipedrive)

### [2.2.0] - Planeado
- [ ] Multi-língua (EN, ES)
- [ ] Voice notes support
- [ ] Imagens e documentos (exames, prescrições)
- [ ] Lembretes via SMS backup

### [3.0.0] - Longo Prazo
- [ ] Modo agência (multi-clínica)
- [ ] White-label para revenda
- [ ] Mobile app companion
- [ ] Integração com sistemas POS

---

**Formato do changelog:** [Keep a Changelog](https://keepachangelog.com/pt/)  
**Versionamento:** [Semantic Versioning](https://semver.org/lang/pt/)
