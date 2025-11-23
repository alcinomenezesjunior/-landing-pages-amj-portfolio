# PROMPT FINAL — CLAUDE CODE
## Demo Chatbot Essenza Prime Clinic + Landing Page /chatbot-estetica

**Data**: 21 de Novembro de 2025  
**Projeto**: Chatbot Estética - AMJ Automação & IA  
**Versão**: 2.0 (Completa com Supabase, Stripe, AI Agent)

---

# 🎯 OBJECTIVO GERAL

Criar um sistema completo de chatbot de marcação automática para demonstração na landing page `/chatbot-estetica`. O sistema deve:

1. **Demonstrar valor** aos prospects que visitam a LP
2. **Simular uma clínica real** (Essenza Prime Clinic)
3. **Justificar os preços** dos planos vendidos (€149-€699/mês)
4. **Funcionar de forma completa** — não é MVP, é produto final

---

# 📁 ESTRUTURA DE ENTREGÁVEIS

O Claude Code deve gerar os seguintes ficheiros:

```
chatbot-estetica-demo/
│
├── workflows/
│   └── v2-ai-agent/
│       ├── DEMO_Essenza_Prime_AI_Agent.json      ← Workflow n8n principal
│       ├── SETUP_GUIDE.md                         ← Guia de configuração
│       ├── SUPABASE_SCHEMA.sql                    ← Script SQL para criar tabelas
│       └── CHANGELOG.md                           ← Histórico de alterações
│
├── knowledge-base/
│   ├── servicos-procedimentos.md                  ← Já existe, verificar
│   └── equipa-politicas.md                        ← Já existe, verificar
│
└── README.md                                      ← Actualizar com nova versão

chatbot-estetica/
│
├── index.html                                     ← ACTUALIZAR (CTA, copy, preços)
├── script.js                                      ← ACTUALIZAR se necessário
├── script.min.js                                  ← REGENERAR
├── styles.css                                     ← ACTUALIZAR se necessário
└── styles.min.css                                 ← REGENERAR

docs/
│
├── LP_COPY_IMPROVEMENTS.md                        ← Sugestões de copy
└── PRICING_TABLE.md                               ← Tabela de preços para LP
```

---

# 🔗 LOCALIZAÇÃO DOS FICHEIROS NO GITHUB

**Repositório**: https://github.com/alcinomenezesjunior/-landing-pages-amj-portfolio

**Landing Page actual**:
- URL: https://github.com/alcinomenezesjunior/-landing-pages-amj-portfolio/tree/main/chatbot-estetica
- Ficheiros: index.html, script.js, script.min.js, styles.css, styles.min.css

**Demo chatbot**:
- URL: https://github.com/alcinomenezesjunior/-landing-pages-amj-portfolio/tree/main/chatbot-estetica-demo
- Estrutura já criada com v1-http-request (deprecated) e v2-ai-agent (a criar)

**Workflow antigo (referência)**:
- URL: https://github.com/alcinomenezesjunior/-landing-pages-amj-portfolio/tree/main/chatbot-estetica-demo/workflows/v1-http-request
- Ficheiro: DEMO_Chatbot_Estetica_Testar_Bot_WhatsApp_IA.json

---

# 📱 PARTE 1: ACTUALIZAÇÃO DA LANDING PAGE

## 1.1 CTA "Testar Bot no WhatsApp"

Na secção `#demo` ("Vê Como Funciona na Prática"), actualizar o CTA para:

```html
<a class="btn btn-demo-cta" 
   href="https://wa.me/351926699009?text=Ol%C3%A1%21%20Quero%20testar%20o%20chatbot%20de%20marca%C3%A7%C3%A3o%20%F0%9F%A4%96" 
   onclick="trackWhatsAppDemo(event)" 
   rel="noopener noreferrer" 
   target="_blank">
  <i class="ri-whatsapp-line" aria-hidden="true"></i> Testar Bot no WhatsApp
</a>
```

**Número**: +351 926 699 009
**Mensagem pré-preenchida**: "Olá! Quero testar o chatbot de marcação 🤖"

## 1.2 Remover Referências a Black Friday/November

Remover:
- Timer de contagem regressiva (ou adaptar para "Lançamento")
- Badges "Black November"
- Textos de urgência/escassez artificial

Substituir por:
- Posicionamento de "Lançamento Oficial"
- Mensagens de valor, não de urgência

## 1.3 Actualizar Tabela de Preços

Substituir a secção de preços actual por 4 planos:

### NOVO PRICING (4 Planos)

```html
<!-- PLANO STARTER -->
<div class="pricing-card">
  <span class="badge">Para Começar</span>
  <h3>Starter</h3>
  <p class="subtitle">Profissional Individual</p>
  <div class="price">
    <span class="setup">€490 setup único</span>
    <span class="monthly">€149<small>/mês</small></span>
  </div>
  <ul class="features">
    <li>✅ WhatsApp Cloud + marcação automática</li>
    <li>✅ Google Calendar (1 agenda)</li>
    <li>✅ Lembretes T-24h e T-1h</li>
    <li>✅ 1 serviço configurado</li>
    <li>✅ 1 profissional</li>
    <li>✅ Suporte por email</li>
    <li>❌ Pagamentos online</li>
    <li>❌ Upsell/Downsell</li>
  </ul>
  <a href="#formulario" class="btn btn-outline">Quero este</a>
</div>

<!-- PLANO ESSENCIAL -->
<div class="pricing-card">
  <span class="badge">Pequenos Gabinetes</span>
  <h3>Essencial</h3>
  <p class="subtitle">Até 5 Serviços</p>
  <div class="price">
    <span class="setup">€990 setup único</span>
    <span class="monthly">€249<small>/mês</small></span>
  </div>
  <ul class="features">
    <li>✅ Tudo do Starter +</li>
    <li>✅ Até 5 serviços configurados</li>
    <li>✅ Pagamentos Stripe (depósitos)</li>
    <li>✅ Cuidados pré/pós automáticos</li>
    <li>✅ Registo em base de dados</li>
    <li>❌ Reembolsos automáticos</li>
    <li>❌ Confirmação comparecimento</li>
  </ul>
  <a href="#formulario" class="btn btn-outline">Quero este</a>
</div>

<!-- PLANO PRO (DESTACADO) -->
<div class="pricing-card featured">
  <span class="badge popular">⭐ Mais Popular</span>
  <h3>Pro</h3>
  <p class="subtitle">Clínicas Médias</p>
  <div class="price">
    <span class="setup">€1.690 setup único</span>
    <span class="monthly">€449<small>/mês</small></span>
  </div>
  <ul class="features">
    <li>✅ Tudo do Essencial +</li>
    <li>✅ Até 15 serviços</li>
    <li>✅ Até 3 profissionais</li>
    <li>✅ Reembolsos automáticos</li>
    <li>✅ Confirmação de comparecimento</li>
    <li>✅ Upsell/Downsell inteligente</li>
    <li>✅ Dashboard KPIs básico</li>
    <li>✅ Suporte WhatsApp</li>
  </ul>
  <a href="#formulario" class="btn btn-primary">Quero este</a>
</div>

<!-- PLANO ENTERPRISE -->
<div class="pricing-card">
  <span class="badge enterprise">Para Clínicas</span>
  <h3>Enterprise</h3>
  <p class="subtitle">Multi-Profissionais</p>
  <div class="price">
    <span class="setup">€2.990 setup único</span>
    <span class="monthly">€699<small>/mês</small></span>
  </div>
  <ul class="features">
    <li>✅ Tudo do Pro +</li>
    <li>✅ Serviços ilimitados</li>
    <li>✅ Profissionais ilimitados</li>
    <li>✅ Múltiplas agendas/calendários</li>
    <li>✅ Dashboard KPIs completo</li>
    <li>✅ Distribuição inteligente</li>
    <li>✅ Suporte prioritário</li>
    <li>✅ Integração BSP se necessário</li>
  </ul>
  <a href="#formulario" class="btn btn-outline">Agendar Diagnóstico</a>
</div>
```

## 1.4 Adicionar Secção de ROI

Adicionar após os preços:

```html
<section id="roi" class="section">
  <h2>💰 O Retorno do Investimento</h2>
  <div class="roi-calculator">
    <div class="roi-item">
      <h3>Sem Chatbot</h3>
      <ul>
        <li>❌ 3-5 clientes perdidos/mês por resposta lenta</li>
        <li>❌ 2-3 horas/dia a responder mensagens</li>
        <li>❌ 30% de no-shows sem lembretes</li>
        <li>❌ Zero upsells automáticos</li>
      </ul>
      <p class="total-loss">Perda estimada: <strong>€500-800/mês</strong></p>
    </div>
    <div class="roi-item highlighted">
      <h3>Com Chatbot AMJ</h3>
      <ul>
        <li>✅ Resposta 24/7 em segundos</li>
        <li>✅ Tempo livre para tratar clientes</li>
        <li>✅ Redução de 60-70% em no-shows</li>
        <li>✅ Upsells automáticos (+20% ticket médio)</li>
      </ul>
      <p class="total-gain">Investimento: <strong>€249/mês</strong> (Plano Essencial)</p>
    </div>
  </div>
  <p class="roi-conclusion">O chatbot paga-se a si próprio no primeiro mês.</p>
</section>
```

## 1.5 NÃO Alterar

- SEO (title, meta, canonical, structured data) — manter como está
- Tracking (GTM, GA4, Cookiebot) — manter
- Formulário de leads — manter (webhook já funciona)
- Popup de exit intent — manter
- Qualquer funcionalidade que já funcione

---

# 🤖 PARTE 2: WORKFLOW N8N COM AI AGENT

## 2.1 Arquitectura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                     WORKFLOW PRINCIPAL                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Webhook WhatsApp]                                             │
│       │                                                         │
│       ▼                                                         │
│  [Code - Parse Message]                                         │
│       │                                                         │
│       ▼                                                         │
│  [Supabase - Get/Create Client]                                 │
│       │                                                         │
│       ▼                                                         │
│  [Supabase - Get Conversation State]                            │
│       │                                                         │
│       ▼                                                         │
│  [AI Agent Node]                                                │
│       │  ├── Tool: check_availability                           │
│       │  ├── Tool: create_booking                               │
│       │  ├── Tool: cancel_booking                               │
│       │  ├── Tool: reschedule_booking                           │
│       │  ├── Tool: generate_payment_link                        │
│       │  ├── Tool: process_refund                               │
│       │  ├── Tool: get_care_instructions                        │
│       │  └── Tool: get_professional_info                        │
│       │                                                         │
│       ▼                                                         │
│  [Code - Process Response]                                      │
│       │                                                         │
│       ▼                                                         │
│  [Supabase - Update Conversation]                               │
│       │                                                         │
│       ▼                                                         │
│  [WhatsApp - Send Message]                                      │
│       │                                                         │
│       ▼                                                         │
│  [IF - Should Schedule Actions?]                                │
│       │                                                         │
│       ├── Schedule Reminder T-24h                               │
│       ├── Schedule Reminder T-1h                                │
│       ├── Schedule Confirmation Request T+15min                 │
│       ├── Schedule Post-Care T+2h                               │
│       └── Schedule Follow-up T+7days                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Webhook WhatsApp

```json
{
  "node": "Webhook – WhatsApp Incoming",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "httpMethod": "POST",
    "path": "testar-bot-whatsapp",
    "responseMode": "responseNode",
    "options": {}
  },
  "webhookId": "essenza-prime-demo"
}
```

## 2.3 AI Agent Node — Configuração

**Modelo**: Claude Sonnet 4 (claude-sonnet-4-20250514)
**Max Tokens**: 1500
**Temperature**: 0.7

### System Prompt Completo

```
És a assistente virtual da Essenza Prime Clinic, uma clínica de estética premium em Cascais, Lisboa.

═══════════════════════════════════════════════════════════════
PERSONALIDADE E TOM
═══════════════════════════════════════════════════════════════

- Nome: Não tens nome específico, és "a assistente da Essenza Prime"
- Tom: Profissional mas acolhedor, elegante, nunca robótico
- Linguagem: Português de Portugal (PT-PT), NUNCA brasileiro
  - "telemóvel" (não "celular")
  - "autocarro" (não "ônibus")
  - "marcação" (não "agendamento")
  - "pequeno-almoço" (não "café da manhã")
- Estilo: Frases claras e concisas, adequadas para WhatsApp
- Emojis: Usa com moderação (máximo 2 por mensagem)
- Comprimento: Respostas curtas para perguntas simples, detalhadas quando necessário

═══════════════════════════════════════════════════════════════
O TEU PAPEL
═══════════════════════════════════════════════════════════════

1. Apresentar a clínica e os serviços quando o cliente chega
2. Responder a perguntas sobre procedimentos, preços, durações
3. Informar sobre contraindicações quando relevante
4. Verificar disponibilidade de horários (usa tool check_availability)
5. Fazer marcações no calendário (usa tool create_booking)
6. Gerar links de pagamento para depósitos (usa tool generate_payment_link)
7. Processar cancelamentos e reagendamentos
8. Processar reembolsos conforme política
9. Sugerir upsells após marcação confirmada
10. Oferecer downsells quando cliente quer cancelar por preço

═══════════════════════════════════════════════════════════════
MENSAGEM INICIAL
═══════════════════════════════════════════════════════════════

Quando o cliente envia a primeira mensagem (ex: "Olá", "Quero testar", etc.),
responde com uma apresentação elegante:

"Bem-vinda à Essenza Prime Clinic! ✨

Sou a assistente virtual e posso ajudar-te com:
• Informações sobre tratamentos
• Marcação de consultas
• Verificação de disponibilidade

A nossa clínica em Cascais oferece tratamentos faciais, corporais e micropigmentação, com uma equipa de 8 especialistas.

Como posso ajudar-te hoje?"

═══════════════════════════════════════════════════════════════
DADOS DA CLÍNICA
═══════════════════════════════════════════════════════════════

Nome: Essenza Prime Clinic, Unipessoal Lda.
Morada: Cascais, Lisboa
Horário: Segunda a Sexta 10:00-19:00, Sábado 10:00-14:00
Telefone/WhatsApp: +351 926 699 009
Email: atendimento@essenzaprimeclinic.pt

═══════════════════════════════════════════════════════════════
EQUIPA (8 PROFISSIONAIS)
═══════════════════════════════════════════════════════════════

1. Dr. Gustavo Mendonça — Médico Esteta
   Serviços: Peelings médio/profundo, Harmonização, Preenchimentos
   Horário: Seg-Sex 10:00-16:00

2. Dra. Bruna Cortez — Biomédica Esteta
   Serviços: Microagulhamento, Peelings, Limpeza, Radiofrequência
   Horário: Ter/Qui/Sex 13:00-19:00, Sáb 10:00-14:00

3. Sra. Sílvia Ramos — Esteticista Facial
   Serviços: Limpeza de pele, Massagens, Radiofrequência facial
   Horário: Seg/Qua/Sex 10:00-19:00, Sáb 10:00-14:00

4. Sra. Carla Magalhães — Esteticista Corporal
   Serviços: Massagem modeladora, Drenagem, Criolipólise, RF corporal
   Horário: Seg-Sex 13:00-19:00, Sáb 10:00-14:00

5. Sra. Inês Duarte — Especialista Micropigmentação
   Serviços: Microblading, Micropigmentação lábios/olhos
   Horário: Seg/Qua/Qui 10:00-16:00, Sáb 10:00-14:00

6. Sra. Larissa Galvão — Esteticista Multidisciplinar
   Serviços: Limpeza, Peelings superficiais, Microagulhamento, Criolipólise
   Horário: Ter 10:00-19:00, Sex 10:00-13:00

7. Sr. Pedro Moreira — Terapeuta Corporal
   Serviços: Massagens, RF corporal, Criolipólise
   Horário: Seg/Qua/Sex 16:00-19:00, Sáb 10:00-14:00

8. Sra. Renata Pinto — Assistente/Consultora
   Serviços: Avaliação inicial, Orientação
   Horário: Seg-Sex 10:00-19:00, Sáb 10:00-14:00

═══════════════════════════════════════════════════════════════
CATÁLOGO DE SERVIÇOS
═══════════════════════════════════════════════════════════════

TRATAMENTOS FACIAIS:
• Limpeza de Pele Profunda — €40 (60-90 min)
• Peeling Superficial — €80 (30-45 min)
• Peeling Médio — €160 (45-60 min)
• Radiofrequência Facial — €100 (30-45 min)
• Microagulhamento — €120 (45-60 min)
• Ultrassom Microfocado (HIFU) — €200 (60-90 min)
• Harmonização Facial — €600 (60-90 min)

TRATAMENTOS CORPORAIS:
• Massagem Terapêutica — €50 (50-60 min)
• Massagem Modeladora — €60 (50-60 min)
• Drenagem Linfática — €60 (50-60 min)
• Radiofrequência Corporal — €100 (45-60 min)
• Criolipólise — €120 (60-90 min)
• Massagem Detox — €55 (50-60 min)

MICROPIGMENTAÇÃO:
• Microblading Sobrancelhas — €250 (90-120 min)
• Micropigmentação Lábios — €280 (90-120 min)
• Micropigmentação Eyeliner — €240 (60-90 min)

CONSULTAS:
• Avaliação Inicial — Gratuita (30 min)

═══════════════════════════════════════════════════════════════
POLÍTICA DE DEPÓSITO E PAGAMENTO
═══════════════════════════════════════════════════════════════

• Depósito: 50% do valor total para confirmar marcação
• Depósito mínimo: €20 (se procedimento < €40)
• Saldo: Pago no dia do procedimento
• Formas: MB WAY, Transferência, Multibanco, Cartão (presencial)

═══════════════════════════════════════════════════════════════
POLÍTICA DE CANCELAMENTO
═══════════════════════════════════════════════════════════════

• 7+ dias antes: 100% reembolso
• 3-7 dias antes: 75% reembolso (25% retenção)
• < 3 dias (até 24h): 50% reembolso
• < 24 horas: 25% reembolso
• Não comparecimento (no-show): 0% reembolso

═══════════════════════════════════════════════════════════════
FLUXO DE MARCAÇÃO
═══════════════════════════════════════════════════════════════

1. Cliente indica interesse num serviço
2. Explica o serviço (duração, preço, o que inclui)
3. Pergunta se quer marcar
4. Verifica disponibilidade (tool: check_availability)
5. Apresenta 3-5 opções de horário
6. Cliente escolhe
7. Pede: nome completo e email
8. Confirma todos os dados
9. Gera link de pagamento (tool: generate_payment_link)
10. Aguarda confirmação de pagamento
11. Cria marcação (tool: create_booking)
12. Envia confirmação final

═══════════════════════════════════════════════════════════════
UPSELL (Após Marcação Confirmada)
═══════════════════════════════════════════════════════════════

Quando uma marcação é confirmada, sugere um serviço complementar:

• Limpeza de Pele → Peeling Superficial (10% desconto)
• Peeling Superficial → Radiofrequência Facial (10%)
• Radiofrequência → Microagulhamento (10%)
• Massagem Terapêutica → Drenagem Linfática (15%)
• Microblading → Micropigmentação Lábios (10%)
• Criolipólise → RF Corporal (15%)

Exemplo de mensagem:
"A tua marcação está confirmada! ✅

💡 Muitas clientes combinam a Limpeza de Pele com um Peeling Superficial para resultados ainda melhores.

🎁 Por marcares agora, tens 10% de desconto: €80 → €72

Queres adicionar? A Dra. Bruna tem disponibilidade logo após."

═══════════════════════════════════════════════════════════════
DOWNSELL (No Cancelamento por Preço)
═══════════════════════════════════════════════════════════════

Se o cliente quer cancelar e menciona preço/dinheiro:

• Peeling Médio (€160) → Peeling Superficial (€80)
• Harmonização (€600) → Radiofrequência Facial (€100)
• Microagulhamento (€120) → Limpeza de Pele (€40)

Exemplo:
"Entendo que o Peeling Médio é um investimento maior.

Tenho uma alternativa: o Peeling Superficial (€80) também melhora manchas e textura, com menos tempo de recuperação.

O teu depósito de €80 cobre o valor total! Queres trocar em vez de cancelar?"

═══════════════════════════════════════════════════════════════
LIVRO DE RECLAMAÇÕES
═══════════════════════════════════════════════════════════════

Se perguntarem sobre reclamações:

"A Essenza Prime Clinic disponibiliza o Livro de Reclamações Eletrónico conforme a legislação portuguesa.

Podes aceder em: www.livroreclamacoes.pt

Se preferires resolver directamente, posso pedir a um responsável para te contactar. O que preferes?"

═══════════════════════════════════════════════════════════════
REGRAS IMPORTANTES
═══════════════════════════════════════════════════════════════

1. NUNCA inventes informação — usa apenas o que está acima
2. NUNCA digas que és demo ou teste — age como assistente real
3. SEMPRE verifica disponibilidade antes de confirmar marcação
4. SEMPRE confirma dados antes de criar evento
5. SEMPRE informa sobre depósito de 50%
6. SEMPRE usa PT-PT, nunca português do Brasil
7. Se não souberes algo, oferece contacto humano:
   "Posso pedir a um colega para te contactar para esclarecer isso."
8. Sê empática com cancelamentos — não julgues
9. Quando o cliente mencionar dificuldade financeira, oferece alternativas
10. Mantém histórico da conversa — não perguntes o que já foi dito
```

## 2.4 Tools do AI Agent

### Tool 1: check_availability

```json
{
  "name": "check_availability",
  "description": "Verifica horários disponíveis no Google Calendar para um serviço/profissional",
  "parameters": {
    "type": "object",
    "properties": {
      "service_name": {
        "type": "string",
        "description": "Nome do serviço (ex: 'Limpeza de Pele Profunda')"
      },
      "professional_name": {
        "type": "string",
        "description": "Nome do profissional preferido (opcional)"
      },
      "date_from": {
        "type": "string",
        "description": "Data inicial no formato YYYY-MM-DD"
      },
      "date_to": {
        "type": "string",
        "description": "Data final no formato YYYY-MM-DD"
      }
    },
    "required": ["service_name", "date_from", "date_to"]
  }
}
```

**Lógica de implementação:**
1. Identificar profissionais que fazem o serviço
2. Para cada profissional, consultar Google Calendar
3. Cruzar com horário de trabalho do profissional
4. Retornar slots disponíveis (máx 5)
5. Aplicar buffer de 15min entre consultas

### Tool 2: create_booking

```json
{
  "name": "create_booking",
  "description": "Cria uma marcação no Google Calendar e regista no Supabase",
  "parameters": {
    "type": "object",
    "properties": {
      "service_name": {"type": "string"},
      "professional_name": {"type": "string"},
      "date": {"type": "string", "description": "YYYY-MM-DD"},
      "time_start": {"type": "string", "description": "HH:MM"},
      "duration_minutes": {"type": "integer"},
      "client_name": {"type": "string"},
      "client_phone": {"type": "string"},
      "client_email": {"type": "string"},
      "price": {"type": "number"},
      "deposit": {"type": "number"},
      "stripe_payment_id": {"type": "string"}
    },
    "required": ["service_name", "professional_name", "date", "time_start", "duration_minutes", "client_name", "client_phone", "price"]
  }
}
```

**Lógica:**
1. Criar evento no Google Calendar
2. Inserir registo na tabela `appointments` do Supabase
3. Agendar lembretes (T-24h, T-1h)
4. Agendar confirmação de comparecimento (T+15min)
5. Retornar confirmação

### Tool 3: cancel_booking

```json
{
  "name": "cancel_booking",
  "description": "Cancela uma marcação e processa reembolso conforme política",
  "parameters": {
    "type": "object",
    "properties": {
      "client_phone": {"type": "string"},
      "booking_date": {"type": "string", "description": "YYYY-MM-DD"},
      "reason": {"type": "string", "description": "Motivo do cancelamento"}
    },
    "required": ["client_phone", "booking_date"]
  }
}
```

**Lógica:**
1. Encontrar marcação no Supabase
2. Calcular dias até a marcação
3. Aplicar política de reembolso
4. Se houver pagamento Stripe, processar refund
5. Remover evento do Google Calendar
6. Actualizar status no Supabase

### Tool 4: reschedule_booking

```json
{
  "name": "reschedule_booking",
  "description": "Reagenda uma marcação para nova data/hora",
  "parameters": {
    "type": "object",
    "properties": {
      "client_phone": {"type": "string"},
      "old_date": {"type": "string"},
      "new_date": {"type": "string"},
      "new_time": {"type": "string"}
    },
    "required": ["client_phone", "old_date", "new_date", "new_time"]
  }
}
```

### Tool 5: generate_payment_link

```json
{
  "name": "generate_payment_link",
  "description": "Gera um link Stripe Checkout para pagamento do depósito",
  "parameters": {
    "type": "object",
    "properties": {
      "amount_cents": {"type": "integer", "description": "Valor em cêntimos"},
      "service_name": {"type": "string"},
      "client_email": {"type": "string"},
      "client_phone": {"type": "string"},
      "booking_date": {"type": "string"},
      "booking_time": {"type": "string"}
    },
    "required": ["amount_cents", "service_name", "client_phone"]
  }
}
```

**Lógica:**
1. Criar Stripe Checkout Session
2. Incluir metadata (serviço, data, cliente)
3. Retornar URL do checkout

### Tool 6: process_refund

```json
{
  "name": "process_refund",
  "description": "Processa reembolso via Stripe",
  "parameters": {
    "type": "object",
    "properties": {
      "stripe_payment_id": {"type": "string"},
      "refund_percentage": {"type": "integer", "description": "0-100"},
      "reason": {"type": "string"}
    },
    "required": ["stripe_payment_id", "refund_percentage"]
  }
}
```

### Tool 7: get_care_instructions

```json
{
  "name": "get_care_instructions",
  "description": "Obtém cuidados pré ou pós procedimento",
  "parameters": {
    "type": "object",
    "properties": {
      "service_name": {"type": "string"},
      "instruction_type": {"type": "string", "enum": ["pre", "post"]}
    },
    "required": ["service_name", "instruction_type"]
  }
}
```

### Tool 8: get_professional_info

```json
{
  "name": "get_professional_info",
  "description": "Obtém informação sobre um profissional",
  "parameters": {
    "type": "object",
    "properties": {
      "professional_name": {"type": "string"},
      "info_type": {"type": "string", "enum": ["services", "schedule", "bio"]}
    },
    "required": ["professional_name"]
  }
}
```

---

# 🗄️ PARTE 3: SUPABASE — ESTRUTURA DE DADOS

## 3.1 Script SQL Completo

```sql
-- ═══════════════════════════════════════════════════════════════
-- ESSENZA PRIME CLINIC - DATABASE SCHEMA
-- Supabase (PostgreSQL)
-- ═══════════════════════════════════════════════════════════════

-- Extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- TABELA: clients
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_spent DECIMAL(10,2) DEFAULT 0,
    num_appointments INTEGER DEFAULT 0,
    notes TEXT
);

-- Index para busca por telefone
CREATE INDEX idx_clients_phone ON clients(phone);

-- ═══════════════════════════════════════════════════════════════
-- TABELA: appointments
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    service VARCHAR(100) NOT NULL,
    professional VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME,
    duration_minutes INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending_payment',
    -- Status: pending_payment, confirmed, completed, no_show, cancelled
    price DECIMAL(10,2) NOT NULL,
    deposit DECIMAL(10,2),
    deposit_paid BOOLEAN DEFAULT FALSE,
    stripe_payment_id VARCHAR(100),
    stripe_refund_id VARCHAR(100),
    refund_amount DECIMAL(10,2),
    google_calendar_event_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    attendance_confirmed BOOLEAN,
    attendance_confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ═══════════════════════════════════════════════════════════════
-- TABELA: conversations
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb,
    current_state VARCHAR(50) DEFAULT 'inicio',
    -- States: inicio, exploring, choosing_service, choosing_slot, 
    --         pending_payment, confirmed, post_care
    context JSONB DEFAULT '{}'::jsonb,
    -- Context: service_discussed, slot_selected, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para busca por telefone
CREATE INDEX idx_conversations_phone ON conversations(phone);

-- ═══════════════════════════════════════════════════════════════
-- TABELA: pending_upsells
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE pending_upsells (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    original_service VARCHAR(100) NOT NULL,
    suggested_service VARCHAR(100) NOT NULL,
    discount_percentage INTEGER DEFAULT 10,
    offered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    offer_again_date DATE,
    accepted BOOLEAN,
    accepted_at TIMESTAMP WITH TIME ZONE
);

-- ═══════════════════════════════════════════════════════════════
-- TABELA: scheduled_messages
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE scheduled_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    client_phone VARCHAR(20) NOT NULL,
    message_type VARCHAR(50) NOT NULL,
    -- Types: reminder_24h, reminder_1h, attendance_check_15min, 
    --        attendance_check_30min, post_care, follow_up_7d
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    message_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para mensagens pendentes
CREATE INDEX idx_scheduled_messages_pending 
ON scheduled_messages(scheduled_for) 
WHERE sent = FALSE;

-- ═══════════════════════════════════════════════════════════════
-- TABELA: attendance_confirmations
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE attendance_confirmations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    request_type VARCHAR(20) NOT NULL,
    -- Types: first_check, follow_up, end_of_day
    response VARCHAR(20),
    -- Responses: yes, no, delayed, null (no response)
    responded_at TIMESTAMP WITH TIME ZONE,
    follow_up_needed BOOLEAN DEFAULT FALSE
);

-- ═══════════════════════════════════════════════════════════════
-- TABELA: professionals (para referência)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    services TEXT[], -- Array de serviços
    schedule JSONB,  -- Horário por dia da semana
    active BOOLEAN DEFAULT TRUE
);

-- Inserir profissionais
INSERT INTO professionals (name, role, services, schedule) VALUES
('Dr. Gustavo Mendonça', 'Médico Esteta', 
 ARRAY['Peeling Médio', 'Peeling Profundo', 'Harmonização Facial', 'Preenchimentos'],
 '{"monday": {"start": "10:00", "end": "16:00"}, "tuesday": {"start": "10:00", "end": "16:00"}, "wednesday": {"start": "10:00", "end": "16:00"}, "thursday": {"start": "10:00", "end": "16:00"}, "friday": {"start": "10:00", "end": "16:00"}}'::jsonb),

('Dra. Bruna Cortez', 'Biomédica Esteta',
 ARRAY['Microagulhamento', 'Peeling Superficial', 'Peeling Médio', 'Limpeza de Pele Profunda', 'Radiofrequência Facial', 'Radiofrequência Corporal'],
 '{"tuesday": {"start": "13:00", "end": "19:00"}, "thursday": {"start": "13:00", "end": "19:00"}, "friday": {"start": "13:00", "end": "19:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb),

('Sra. Sílvia Ramos', 'Esteticista Facial',
 ARRAY['Limpeza de Pele Profunda', 'Massagem Terapêutica', 'Radiofrequência Facial'],
 '{"monday": {"start": "10:00", "end": "19:00"}, "wednesday": {"start": "10:00", "end": "19:00"}, "friday": {"start": "10:00", "end": "19:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb),

('Sra. Carla Magalhães', 'Esteticista Corporal',
 ARRAY['Massagem Modeladora', 'Drenagem Linfática', 'Criolipólise', 'Radiofrequência Corporal', 'Ultrassom Corporal'],
 '{"monday": {"start": "13:00", "end": "19:00"}, "tuesday": {"start": "13:00", "end": "19:00"}, "wednesday": {"start": "13:00", "end": "19:00"}, "thursday": {"start": "13:00", "end": "19:00"}, "friday": {"start": "13:00", "end": "19:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb),

('Sra. Inês Duarte', 'Especialista Micropigmentação',
 ARRAY['Microblading Sobrancelhas', 'Micropigmentação Lábios', 'Micropigmentação Eyeliner'],
 '{"monday": {"start": "10:00", "end": "16:00"}, "wednesday": {"start": "10:00", "end": "16:00"}, "thursday": {"start": "10:00", "end": "16:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb),

('Sra. Larissa Galvão', 'Esteticista Multidisciplinar',
 ARRAY['Limpeza de Pele Profunda', 'Peeling Superficial', 'Microagulhamento', 'Massagem Detox', 'Criolipólise'],
 '{"tuesday": {"start": "10:00", "end": "19:00"}, "friday": {"start": "10:00", "end": "13:00"}}'::jsonb),

('Sr. Pedro Moreira', 'Terapeuta Corporal',
 ARRAY['Massagem Terapêutica', 'Radiofrequência Corporal', 'Criolipólise'],
 '{"monday": {"start": "16:00", "end": "19:00"}, "wednesday": {"start": "16:00", "end": "19:00"}, "friday": {"start": "16:00", "end": "19:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb),

('Sra. Renata Pinto', 'Assistente/Consultora',
 ARRAY['Avaliação Inicial'],
 '{"monday": {"start": "10:00", "end": "19:00"}, "tuesday": {"start": "10:00", "end": "19:00"}, "wednesday": {"start": "10:00", "end": "19:00"}, "thursday": {"start": "10:00", "end": "19:00"}, "friday": {"start": "10:00", "end": "19:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb);

-- ═══════════════════════════════════════════════════════════════
-- TABELA: services (para referência)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    duration_min INTEGER,
    duration_max INTEGER,
    price DECIMAL(10,2),
    deposit DECIMAL(10,2),
    description TEXT,
    contraindications TEXT[],
    pre_care TEXT,
    post_care TEXT,
    upsell_service VARCHAR(100),
    upsell_discount INTEGER,
    downsell_service VARCHAR(100),
    active BOOLEAN DEFAULT TRUE
);

-- Inserir serviços
INSERT INTO services (name, category, duration_min, duration_max, price, deposit, description, contraindications, pre_care, post_care, upsell_service, upsell_discount, downsell_service) VALUES

-- Faciais
('Limpeza de Pele Profunda', 'Facial', 60, 90, 40, 20, 
 'Higienização, esfoliação e hidratação intensiva',
 ARRAY['Infecções ativas', 'Lesões abertas', 'Dermatites severas'],
 'Nenhuma preparação especial necessária',
 'Evitar maquilhagem 24h. Protetor solar SPF 50+. Evitar sauna/piscina 48h.',
 'Peeling Superficial', 10, NULL),

('Peeling Superficial', 'Facial', 30, 45, 80, 40,
 'Renovação celular com ácidos suaves',
 ARRAY['Gestação', 'Lactação', 'Uso recente de isotretinoína'],
 'Suspender ácidos e retinoides 3 dias antes',
 'Evitar sol direto. SPF 50+ obrigatório. Hidratar 2-3x/dia.',
 'Radiofrequência Facial', 10, 'Limpeza de Pele Profunda'),

('Peeling Médio', 'Facial', 45, 60, 160, 80,
 'Tratamento profundo para manchas e rugas moderadas',
 ARRAY['Gestação', 'Lactação', 'Herpes ativa', 'Doenças autoimunes'],
 'Suspender ácidos 7-10 dias antes. Teste de sensibilidade.',
 'Cuidados intensivos 2 semanas. Não arrancar descamações. SPF 50+.',
 NULL, NULL, 'Peeling Superficial'),

('Radiofrequência Facial', 'Facial', 30, 45, 100, 50,
 'Estimula colágeno para combater flacidez',
 ARRAY['Marcapassos', 'Implantes metálicos', 'Gestação'],
 'Não usar ácidos 24h antes',
 'Vermelhidão normal 2-4h. Evitar sauna 48h. Hidratar.',
 'Microagulhamento', 10, NULL),

('Microagulhamento', 'Facial', 45, 60, 120, 60,
 'Estimulação de colágeno por microlesões',
 ARRAY['Infecções ativas', 'Queloides', 'Diabetes descontrolada'],
 'Suspender ácidos 5 dias antes',
 'Evitar sol 7 dias. Não usar maquilhagem 48h. Hidratar.',
 NULL, NULL, 'Radiofrequência Facial'),

('Ultrassom Microfocado (HIFU)', 'Facial', 60, 90, 200, 100,
 'Lifting não cirúrgico com ultrassom',
 ARRAY['Marcapassos', 'Implantes metálicos', 'Gestação'],
 'Vir com pele limpa',
 'Possível vermelhidão 24h. Resultados progressivos.',
 NULL, NULL, NULL),

('Harmonização Facial', 'Facial', 60, 90, 600, 300,
 'Procedimento médico para equilíbrio facial',
 ARRAY['Gestação', 'Lactação', 'Infecções ativas'],
 'Consulta prévia obrigatória',
 'Evitar exercício 24h. Não massajar. Gelo se necessário.',
 NULL, NULL, 'Radiofrequência Facial'),

-- Corporais
('Massagem Terapêutica', 'Corporal', 50, 60, 50, 25,
 'Massagem relaxante para alívio de tensões',
 ARRAY['Febre', 'Infecções de pele'],
 'Nenhuma preparação especial',
 'Beber água. Evitar banho quente imediato.',
 'Drenagem Linfática', 15, NULL),

('Massagem Modeladora', 'Corporal', 50, 60, 60, 30,
 'Técnica intensiva para celulite e medidas',
 ARRAY['Varizes severas', 'Trombose'],
 'Nenhuma preparação especial',
 'Possível vermelhidão. Hidratar.',
 NULL, NULL, 'Massagem Terapêutica'),

('Drenagem Linfática', 'Corporal', 50, 60, 60, 30,
 'Estimulação do sistema linfático',
 ARRAY['Infecções agudas', 'Insuficiência cardíaca'],
 'Nenhuma preparação especial',
 'Beber muita água. Evitar sal.',
 NULL, NULL, NULL),

('Radiofrequência Corporal', 'Corporal', 45, 60, 100, 50,
 'Tratamento para flacidez e celulite',
 ARRAY['Marcapassos', 'Implantes metálicos'],
 'Nenhuma preparação especial',
 'Hidratar a zona. Evitar sauna 48h.',
 NULL, NULL, NULL),

('Criolipólise', 'Corporal', 60, 90, 120, 60,
 'Redução de gordura localizada pelo frio',
 ARRAY['Crioglobulinemia', 'Urticária ao frio', 'Gestação'],
 'Nenhuma preparação especial',
 'Massagem local recomendada. Resultados em 30-60 dias.',
 'Radiofrequência Corporal', 15, NULL),

('Massagem Detox', 'Corporal', 50, 60, 55, 28,
 'Massagem drenante para eliminar toxinas',
 ARRAY['Infecções agudas'],
 'Nenhuma preparação especial',
 'Beber muita água.',
 NULL, NULL, NULL),

-- Micropigmentação
('Microblading Sobrancelhas', 'Micropigmentação', 90, 120, 250, 125,
 'Técnica fio a fio para sobrancelhas naturais',
 ARRAY['Gestação', 'Diabetes descontrolada', 'Queloides'],
 'Não depilar sobrancelhas 7 dias antes. Evitar sol.',
 'Não molhar 7 dias. Pomada cicatrizante 3x/dia. Não coçar.',
 'Micropigmentação Lábios', 10, NULL),

('Micropigmentação Lábios', 'Micropigmentação', 90, 120, 280, 140,
 'Contorno, preenchimento ou efeito aquarela',
 ARRAY['Herpes ativa', 'Gestação', 'Queloides'],
 'Profilaxia herpes se histórico. Esfoliar lábios.',
 'Não molhar 7 dias. Pomada cicatrizante. Evitar alimentos ácidos.',
 NULL, NULL, NULL),

('Micropigmentação Eyeliner', 'Micropigmentação', 60, 90, 240, 120,
 'Delineado permanente para olhos',
 ARRAY['Glaucoma', 'Inflamação ocular', 'Gestação'],
 'Remover extensões de pestanas. Não usar lentes 24h antes.',
 'Não molhar olhos 7 dias. Evitar maquilhagem zona. Óculos escuros.',
 NULL, NULL, NULL),

-- Consultas
('Avaliação Inicial', 'Consulta', 30, 30, 0, 0,
 'Consulta gratuita para avaliação e recomendação',
 ARRAY[]::TEXT[],
 'Nenhuma preparação',
 'Nenhum cuidado especial',
 NULL, NULL, NULL);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS E TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Função para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Função para actualizar total_spent do cliente
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE clients
        SET 
            total_spent = total_spent + NEW.price,
            num_appointments = num_appointments + 1
        WHERE id = NEW.client_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_stats_trigger
    AFTER UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_client_stats();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Política para service_role (acesso total)
CREATE POLICY "Service role has full access to clients"
    ON clients FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role has full access to appointments"
    ON appointments FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role has full access to conversations"
    ON conversations FOR ALL
    USING (true)
    WITH CHECK (true);
```

---

# 💳 PARTE 4: INTEGRAÇÃO STRIPE

## 4.1 Configuração

**Modo**: Sandbox (teste)
**Keys**: Guardadas no Bitwarden

## 4.2 Webhook Stripe

Criar webhook para receber eventos:

**URL**: `https://n8n.alcinomenezesjunior.com/webhook/stripe-webhook`

**Eventos a subscrever**:
- `checkout.session.completed` — Pagamento concluído
- `charge.refunded` — Reembolso processado

## 4.3 Fluxo de Pagamento

```
1. Bot gera Stripe Checkout Session (tool: generate_payment_link)
2. Cliente recebe link no WhatsApp
3. Cliente paga no Stripe
4. Stripe envia webhook checkout.session.completed
5. n8n recebe webhook
6. n8n actualiza appointment.deposit_paid = true
7. n8n cria evento no Google Calendar
8. n8n envia confirmação ao cliente
9. n8n agenda lembretes
```

## 4.4 Fluxo de Reembolso

```
1. Cliente pede cancelamento
2. Bot calcula reembolso conforme política
3. Bot confirma com cliente
4. Bot processa reembolso (tool: process_refund)
5. Stripe processa refund
6. Stripe envia webhook charge.refunded
7. n8n actualiza appointment (refund_amount, stripe_refund_id)
8. n8n remove evento do Google Calendar
9. Bot confirma reembolso ao cliente
```

---

# 📅 PARTE 5: INTEGRAÇÃO GOOGLE CALENDAR

## 5.1 Configuração

**Calendar ID**: `d682359e9a244ab7f9a7f7e925d05bf9a6def533796af78a1ecba749103b59c8@group.calendar.google.com`
**Nome**: Agenda Demo Estética

## 5.2 Formato dos Eventos

```
Título: [MARCAÇÃO] {Serviço} - {Nome Cliente}

Descrição:
═══════════════════════════════
DADOS DO CLIENTE
═══════════════════════════════
Nome: {nome}
WhatsApp: {telefone}
Email: {email}

═══════════════════════════════
DETALHES DA MARCAÇÃO
═══════════════════════════════
Serviço: {serviço}
Profissional: {profissional}
Duração: {duração} min

═══════════════════════════════
PAGAMENTO
═══════════════════════════════
Preço Total: €{preço}
Depósito (50%): €{depósito}
Estado: {Pago / Pendente}
Stripe ID: {stripe_payment_id}

═══════════════════════════════
SISTEMA
═══════════════════════════════
Criado via: Chatbot WhatsApp
ID Interno: {appointment_id}
Timestamp: {created_at}
```

---

# 📲 PARTE 6: SISTEMA DE MENSAGENS AUTOMÁTICAS

## 6.1 Lembrete T-24h (com cuidados pré)

```
Olá {nome}! 👋

Lembramos que tens marcação amanhã na Essenza Prime Clinic:

📅 {dia_semana}, {data} às {hora}
💆 {serviço}
👩‍⚕️ Com: {profissional}

📍 Cascais, Lisboa

{SE existem cuidados_pre:}
⚠️ PREPARAÇÃO IMPORTANTE:
{cuidados_pre}

💳 Saldo a pagar: €{saldo} (depósito já efectuado: €{deposito})

Até amanhã! ✨
```

## 6.2 Lembrete T-1h

```
Olá {nome}!

A tua consulta é daqui a 1 hora:

🕐 {hora}
💆 {serviço}

📍 Essenza Prime Clinic - Cascais

Até já! 😊
```

## 6.3 Confirmação Comparecimento T+15min (para clínica)

```
📋 CONFIRMAÇÃO DE CONSULTA

Cliente: {nome}
Serviço: {serviço}
Horário: {hora}
Profissional: {profissional}

O cliente compareceu?

Responda:
1️⃣ SIM - Compareceu
2️⃣ NÃO - Não compareceu
3️⃣ ATRASADO - Aguardando
```

## 6.4 Follow-up T+30min (se ATRASADO)

```
📋 ACTUALIZAÇÃO - {nome}

Ainda aguarda o cliente ou já compareceu?

1️⃣ SIM - Já está em atendimento
2️⃣ NÃO - Não veio (no-show)
```

## 6.5 Alerta Fim do Dia

```
⚠️ ALERTA: CONFIRMAÇÕES PENDENTES

Os seguintes clientes não tiveram confirmação hoje:

{lista de clientes pendentes}

Por favor, confirme o estado de cada um.
```

## 6.6 Cuidados Pós-Procedimento T+2h

```
Olá {nome}! 😊

Esperamos que tenhas gostado do teu {serviço} com {profissional}!

🌟 CUIDADOS PARA OS PRÓXIMOS DIAS:

{cuidados_pos}

❓ Alguma dúvida ou desconforto? Responde a esta mensagem!

Essenza Prime Clinic ✨
```

## 6.7 Follow-up T+7 dias

```
Olá {nome}! 👋

Já passaram 7 dias desde o teu {serviço}. Como estás a sentir os resultados?

{SE upsell_pendente:}
Lembras-te do {upsell_service} que sugerimos? 
Ainda tens {upsell_discount}% de desconto disponível esta semana.

Queres marcar a próxima sessão?
```

## 6.8 Mensagem No-Show

```
Olá {nome},

Notámos que não conseguiste comparecer à tua consulta de hoje.

Esperamos que esteja tudo bem contigo! 💜

⚠️ Conforme a nossa política, o depósito de €{deposito} não será reembolsado.

Mas queremos ajudar-te! Se quiseres reagendar, tens 15% de desconto na próxima marcação.

Queres que te mostre os próximos horários disponíveis?
```

---

# 🔧 PARTE 7: CONFIGURAÇÕES TÉCNICAS

## 7.1 Credenciais Necessárias no n8n

| Credencial | Tipo | Uso |
|------------|------|-----|
| Anthropic API | anthropicApi | AI Agent (Claude) |
| Google Calendar | googleCalendarOAuth2Api | Criar/ler eventos |
| Supabase | supabaseApi | Base de dados |
| Stripe | stripeApi | Pagamentos |
| WhatsApp Cloud API | whatsappCloudApi | Enviar/receber mensagens |

## 7.2 Variáveis de Ambiente (sugestão)

```
SUPABASE_URL=https://udxmyclqkraludzkqone.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
STRIPE_SECRET_KEY=sk_test_...
GOOGLE_CALENDAR_ID=d682359e9a244ab7f9a7f7e925d05bf9a6def533796af78a1ecba749103b59c8@group.calendar.google.com
WHATSAPP_PHONE_NUMBER_ID=<a configurar>
CLINIC_INTERNAL_PHONE=<número interno da clínica para confirmações>
```

## 7.3 Webhooks a Configurar

| Serviço | URL | Eventos |
|---------|-----|---------|
| WhatsApp | `https://n8n.alcinomenezesjunior.com/webhook/testar-bot-whatsapp` | messages |
| Stripe | `https://n8n.alcinomenezesjunior.com/webhook/stripe-webhook` | checkout.session.completed, charge.refunded |

---

# 📋 PARTE 8: GUIA DE CONFIGURAÇÃO (SETUP_GUIDE.md)

Gerar um ficheiro `SETUP_GUIDE.md` com passo-a-passo para:

1. **Configurar WhatsApp Cloud API no Meta Business Suite**
   - Criar App
   - Adicionar produto WhatsApp
   - Configurar número +351 926 699 009
   - Obter Phone Number ID e Access Token
   - Configurar webhook

2. **Configurar credenciais no n8n**
   - WhatsApp Cloud API
   - Supabase
   - Stripe
   - Google Calendar (verificar scope)

3. **Executar script SQL no Supabase**
   - Copiar SUPABASE_SCHEMA.sql
   - Executar no SQL Editor

4. **Importar workflow no n8n**
   - Importar JSON
   - Verificar todas as credenciais
   - Activar workflow

5. **Testar o sistema**
   - Enviar mensagem de teste
   - Verificar fluxo completo
   - Testar pagamento (modo sandbox)

---

# ✅ PARTE 9: CHECKLIST DE VALIDAÇÃO

## Landing Page
- [ ] CTA actualizado com +351 926 699 009
- [ ] Mensagem pré-preenchida correcta
- [ ] Referências Black Friday removidas
- [ ] Nova tabela de preços (4 planos)
- [ ] Secção ROI adicionada
- [ ] Ficheiros minificados regenerados

## Workflow n8n
- [ ] AI Agent Node com Claude Sonnet 4
- [ ] System prompt completo em PT-PT
- [ ] Todas as 8 Tools implementadas
- [ ] Integração Supabase (todas as tabelas)
- [ ] Integração Google Calendar
- [ ] Integração Stripe (pagamentos + reembolsos)
- [ ] Integração WhatsApp Cloud API
- [ ] Sistema de lembretes (T-24h, T-1h)
- [ ] Confirmação de comparecimento (T+15min, T+30min)
- [ ] Cuidados pós-procedimento (T+2h)
- [ ] Follow-up (T+7 dias)
- [ ] Lógica de upsell
- [ ] Lógica de downsell

## Base de Dados (Supabase)
- [ ] Tabela clients
- [ ] Tabela appointments
- [ ] Tabela conversations
- [ ] Tabela pending_upsells
- [ ] Tabela scheduled_messages
- [ ] Tabela attendance_confirmations
- [ ] Tabela professionals (com dados)
- [ ] Tabela services (com dados)
- [ ] Triggers e functions
- [ ] RLS configurado

## Documentação
- [ ] SETUP_GUIDE.md completo
- [ ] SUPABASE_SCHEMA.sql
- [ ] CHANGELOG.md
- [ ] README.md actualizado

---

# 🚀 RESUMO EXECUTIVO

**O que estamos a criar:**
Um sistema completo de chatbot de marcação para a clínica fictícia "Essenza Prime Clinic" que demonstra todas as capacidades do serviço vendido na landing page /chatbot-estetica.

**Stack tecnológico:**
- n8n (workflow automation)
- AI Agent Node com Claude Sonnet 4
- Supabase (PostgreSQL)
- Stripe (pagamentos)
- Google Calendar
- WhatsApp Cloud API

**Objectivo de negócio:**
Demonstrar valor aos prospects para justificar os planos de:
- Starter: €490 setup + €149/mês
- Essencial: €990 setup + €249/mês
- Pro: €1.690 setup + €449/mês
- Enterprise: €2.990 setup + €699/mês

**Tom do bot:**
Profissional, elegante, português de Portugal, nunca revela que é demo.

---

# FIM DO PROMPT

**Anexos necessários:**
- Ficheiros da landing page actual (index.html, script.js, styles.css)
- Knowledge base: servicos-procedimentos.md
- Knowledge base: equipa-politicas.md

**Nota para Claude Code:**
Este é um projecto complexo. Recomenda-se gerar os ficheiros por ordem:
1. Primeiro: SUPABASE_SCHEMA.sql
2. Segundo: Workflow n8n (JSON)
3. Terceiro: SETUP_GUIDE.md
4. Quarto: Actualizações da LP
