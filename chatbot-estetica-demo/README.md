# 🤖 Demo Chatbot Essenza Prime Clinic v2.0

Sistema completo de chatbot de marcação automática para demonstração na landing page `/chatbot-estetica`.

---

## 📁 Estrutura do Projeto

```
chatbot-estetica-demo/
│
├── workflows/
│   └── v2-ai-agent/
│       ├── DEMO_Essenza_Prime_AI_Agent.json    ← Workflow n8n principal
│       ├── SETUP_GUIDE.md                       ← Guia de configuração completo
│       ├── SUPABASE_SCHEMA.sql                  ← Schema base de dados (8 tabelas)
│       └── CHANGELOG.md                         ← Histórico de alterações
│
├── knowledge-base/                              ← (A criar: docs dos serviços)
│
└── README.md                                    ← Este ficheiro
```

---

## 🎯 Objectivo

Demonstrar o valor completo do sistema de chatbot aos prospects que visitam a landing page, justificando os preços dos planos vendidos (€149-€699/mês).

---

## 🏥 Clínica Demo: Essenza Prime Clinic

**Localização:** Cascais, Lisboa  
**Tipo:** Clínica de estética premium  
**Equipa:** 8 profissionais  
**Serviços:** 17 tratamentos (facial, corporal, micropigmentação)  
**WhatsApp:** +351 926 699 009

---

## 🚀 Stack Tecnológico

| Componente | Tecnologia |
|------------|------------|
| Workflow Engine | n8n (self-hosted ou cloud) |
| AI Agent | Claude Sonnet 4 (Anthropic) |
| Base de Dados | Supabase (PostgreSQL) |
| Pagamentos | Stripe (modo sandbox/test) |
| Agendamento | Google Calendar API |
| Mensagens | WhatsApp Cloud API (Meta) |

---

## 📋 Funcionalidades Implementadas

### Core
- ✅ Atendimento 24/7 em português PT-PT
- ✅ Gestão de contexto conversacional
- ✅ 8 Tools para operações complexas
- ✅ Verificação de disponibilidade em tempo real
- ✅ Marcação automática no Google Calendar
- ✅ Sistema de depósitos (50%) via Stripe

### Automações
- ✅ Lembretes T-24h (com cuidados pré-procedimento)
- ✅ Lembretes T-1h
- ✅ Confirmação de comparecimento T+15min
- ✅ Cuidados pós-procedimento T+2h
- ✅ Follow-up comercial T+7 dias

### Inteligência Comercial
- ✅ Upsell automático após marcação confirmada
- ✅ Downsell quando cliente cancela por preço
- ✅ Descontos dinâmicos (10-15%)

### Políticas
- ✅ Cancelamento: 100% (7+ dias), 75% (3-7d), 50% (<3d), 25% (<24h)
- ✅ Reembolsos automáticos via Stripe
- ✅ No-show tracking

---

## 📊 Dados Demo

### Profissionais (8)
1. Dr. Gustavo Mendonça — Médico Esteta
2. Dra. Bruna Cortez — Biomédica Esteta
3. Sra. Sílvia Ramos — Esteticista Facial
4. Sra. Carla Magalhães — Esteticista Corporal
5. Sra. Inês Duarte — Especialista Micropigmentação
6. Sra. Larissa Galvão — Esteticista Multidisciplinar
7. Sr. Pedro Moreira — Terapeuta Corporal
8. Sra. Renata Pinto — Assistente/Consultora

### Serviços (17)
#### Faciais (7)
- Limpeza de Pele Profunda — €40
- Peeling Superficial — €80
- Peeling Médio — €160
- Radiofrequência Facial — €100
- Microagulhamento — €120
- Ultrassom Microfocado (HIFU) — €200
- Harmonização Facial — €600

#### Corporais (6)
- Massagem Terapêutica — €50
- Massagem Modeladora — €60
- Drenagem Linfática — €60
- Radiofrequência Corporal — €100
- Criolipólise — €120
- Massagem Detox — €55

#### Micropigmentação (3)
- Microblading Sobrancelhas — €250
- Micropigmentação Lábios — €280
- Micropigmentação Eyeliner — €240

#### Consultas (1)
- Avaliação Inicial — Gratuita

---

## 🔧 Instalação Rápida

1. **Supabase:** Executa `SUPABASE_SCHEMA.sql`
2. **n8n:** Importa `DEMO_Essenza_Prime_AI_Agent.json`
3. **Credenciais:** Configura todas as APIs (Anthropic, Stripe, WhatsApp, Google)
4. **Testa:** Envia "Olá" para +351 926 699 009

**Guia completo:** Ver `SETUP_GUIDE.md`

---

## 📝 Changelog

Ver `CHANGELOG.md` para histórico completo de versões.

**Versão atual:** 2.0.0 (21 Novembro 2025)

---

## 💼 Planos Comercializados na Landing Page

| Plano | Setup | Mensalidade | Target |
|-------|-------|-------------|--------|
| **Starter** | €490 | €149 | Profissional individual |
| **Essencial** | €990 | €249 | Pequenos gabinetes (até 5 serviços) |
| **Pro** | €449 | €449 | Clínicas médias (até 15 serviços, 3 prof) |
| **Enterprise** | €2.990 | €699 | Clínicas multi-profissionais |

---

## 🤝 Suporte

Para questões técnicas ou dúvidas de implementação:
- GitHub Issues: [alcinomenezesjunior/-landing-pages-amj-portfolio](https://github.com/alcinomenezesjunior/-landing-pages-amj-portfolio/issues)
- Email: contacto@alcinomenezesjunior.com

---

## 📄 Licença

Propriedade de AMJ Automação & IA. Todos os direitos reservados.

Este é um sistema demo para demonstração comercial.
