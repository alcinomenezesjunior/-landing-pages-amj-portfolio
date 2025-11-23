# 🚀 GUIA DE CONFIGURAÇÃO
## Demo Chatbot Essenza Prime Clinic v2.0

**Última actualização:** 21 Novembro 2025

---

## 📋 PRÉ-REQUISITOS

Antes de começar, certifica-te que tens:

- [x] Conta n8n (cloud ou self-hosted)
- [x] Conta Supabase (gratuita)
- [x] Conta Stripe (modo test)
- [x] Conta Meta Business Suite
- [x] Número WhatsApp (+351 926 699 009)
- [x] API Key da Anthropic (Claude)
- [x] Acesso ao Google Calendar

---

## 🗄️ PASSO 1: CONFIGURAR SUPABASE

### 1.1 Criar Projeto

1. Acede a [https://supabase.com](https://supabase.com)
2. Cria um novo projeto
3. Anota o `Project URL` e `anon/public key`
4. Anota o `service_role key` (Settings → API)

### 1.2 Executar Schema SQL

1. No Supabase, vai a **SQL Editor**
2. Copia todo o conteúdo de `SUPABASE_SCHEMA.sql`
3. Cola no editor e executa (**Run**)
4. Verifica que todas as 8 tabelas foram criadas:
   - clients
   - appointments
   - conversations
   - pending_upsells
   - scheduled_messages
   - attendance_confirmations
   - professionals
   - services

### 1.3 Verificar Dados

Executa no SQL Editor:

```sql
SELECT COUNT(*) FROM professionals; -- Deve retornar 8
SELECT COUNT(*) FROM services;      -- Deve retornar 17
```

---

## 💳 PASSO 2: CONFIGURAR STRIPE

### 2.1 Criar Conta Test

1. Acede a [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Ativa **Test Mode** (toggle no canto superior direito)
3. Vai a **Developers → API Keys**
4. Anota a **Secret key** (começa com `sk_test_`)
5. Anota a **Publishable key** (começa com `pk_test_`)

### 2.2 Configurar Webhook

1. Vai a **Developers → Webhooks**
2. Clica **Add endpoint**
3. URL: `https://n8n.alcinomenezesjunior.com/webhook/stripe-webhook`
4. Eventos a adicionar:
   - `checkout.session.completed`
   - `charge.refunded`
5. Clica **Add endpoint**
6. Anota o **Signing secret** (começa com `whsec_`)

---

## 📱 PASSO 3: CONFIGURAR WHATSAPP CLOUD API

### 3.1 Meta Business Suite

1. Acede a [https://business.facebook.com](https://business.facebook.com)
2. Cria uma **Business App** (se ainda não tens)
3. Adiciona o produto **WhatsApp**
4. Seleciona o número **+351 926 699 009**
5. Anota o **Phone Number ID**
6. Anota o **WhatsApp Business Account ID**

### 3.2 Obter Token de Acesso

1. Vai a **WhatsApp → API Setup**
2. Gera um **Permanent Access Token**:
   - Seleciona as permissões: `whatsapp_business_messaging`
   - Copia o token gerado
3. Guarda o token (começa com `EAA...`)

### 3.3 Configurar Webhook

1. Vai a **WhatsApp → Configuration**
2. Edita **Webhook**
3. **Callback URL**: `https://n8n.alcinomenezesjunior.com/webhook/testar-bot-whatsapp`
4. **Verify Token**: cria um token seguro (ex: `essenza-prime-2025`)
5. Subscreve aos eventos:
   - `messages`
6. Salva e verifica

---

## 🤖 PASSO 4: CONFIGURAR N8N

### 4.1 Adicionar Credenciais

No n8n, vai a **Credentials** e adiciona:

#### **Anthropic API**
- Nome: `Anthropic API`
- API Key: `sk-ant-...` (da tua conta Anthropic)

#### **Supabase**
- Nome: `Supabase - Essenza Prime`
- Host: `https://[project-id].supabase.co`
- Service Role Key: `eyJhbGci...`

#### **Stripe**
- Nome: `Stripe API - Test`
- Secret Key: `sk_test_...`

#### **WhatsApp Cloud API**
- Nome: `WhatsApp Cloud API Token`
- Tipo: HTTP Header Auth
- Name: `Authorization`
- Value: `Bearer EAA...` (o teu permanent token)

#### **Google Calendar**
- Nome: `Google Calendar OAuth2`
- Segue o fluxo OAuth
- Seleciona o Calendar: `Agenda Demo Estética`

### 4.2 Importar Workflow

1. No n8n, clica **Import from File**
2. Seleciona `DEMO_Essenza_Prime_AI_Agent.json`
3. O workflow é importado com todos os nós

### 4.3 Configurar Variáveis de Ambiente

No n8n, adiciona estas variáveis:

```
WHATSAPP_PHONE_NUMBER_ID=xxxxx
GOOGLE_CALENDAR_ID=d682359e9a244ab7f9a7f7e925d05bf9a6def533796af78a1ecba749103b59c8@group.calendar.google.com
```

### 4.4 Verificar Nós

Abre cada nó e verifica que as credenciais estão correctamente associadas:

- **Webhook – WhatsApp Incoming**: Webhook path correcto
- **Supabase nodes**: Credencial `Supabase - Essenza Prime`
- **AI Agent**: Credencial `Anthropic API`
- **WhatsApp – Send Message**: Credencial `WhatsApp Cloud API Token`

### 4.5 Ativar Workflow

1. Clica **Save**
2. Ativa o workflow (toggle ON)
3. Webhook fica disponível em: `https://n8n.alcinomenezesjunior.com/webhook/testar-bot-whatsapp`

---

## 🧪 PASSO 5: TESTAR O SISTEMA

### 5.1 Teste Básico

1. Envia uma mensagem WhatsApp para **+351 926 699 009**: "Olá"
2. Deves receber a mensagem de boas-vindas
3. No n8n, verifica que o workflow foi executado (ver **Executions**)
4. No Supabase, verifica que foi criado registo em `clients` e `conversations`

### 5.2 Teste de Marcação Completa

1. Pede informação sobre "Limpeza de Pele"
2. Solicita marcação
3. Bot deve verificar disponibilidade
4. Escolhe um horário
5. Fornece nome e email quando pedido
6. Bot gera link de pagamento Stripe
7. Acede ao link e paga (modo test)
8. Bot confirma marcação
9. Verifica Google Calendar — evento deve estar criado
10. Verifica Supabase `appointments` — registo deve existir

---

## ⚙️ PASSO 6: IMPLEMENTAÇÃO DAS TOOLS

O workflow base contém as definições das 8 Tools, mas a lógica de cada Tool deve ser implementada em sub-workflows ou function nodes separados.

### Tools a Implementar:

#### 1. **check_availability**
- Consulta Google Calendar
- Cruza com horários dos profissionais (tabela `professionals`)
- Retorna slots disponíveis

#### 2. **create_booking**
- Cria evento no Google Calendar
- Insere registo em `appointments`
- Agenda lembretes (T-24h, T-1h)

#### 3. **generate_payment_link**
- Cria Stripe Checkout Session
- Inclui metadata (serviço, cliente, data)
- Retorna URL

#### 4. **cancel_booking**
- Calcula política de reembolso
- Remove evento do Calendar
- Atualiza `appointments`
- Processa refund se necessário

#### 5. **reschedule_booking**
- Remove evento antigo
- Cria novo evento
- Atualiza `appointments`

#### 6. **process_refund**
- Chama Stripe Refund API
- Atualiza `appointments`

#### 7. **get_care_instructions**
- Consulta tabela `services`
- Retorna `pre_care` ou `post_care`

#### 8. **get_professional_info**
- Consulta tabela `professionals`
- Retorna serviços, horário ou bio

---

## 🔄 PASSO 7: SISTEMA DE MENSAGENS AGENDADAS

Criar workflow separado que corre a cada 5 minutos:

1. Consulta `scheduled_messages` onde `sent = false` e `scheduled_for <= NOW()`
2. Para cada mensagem:
   - Envia via WhatsApp
   - Marca `sent = true` e `sent_at = NOW()`

---

## 🔗 PASSO 7.5: WORKFLOWS AUXILIARES

### Importar Workflows Adicionais

Além do workflow principal, precisas importar 2 workflows auxiliares:

#### 7.5.1 Stripe Webhook Workflow

1. No n8n, clica **Import from File**
2. Seleciona `STRIPE_WEBHOOK_WORKFLOW.json`
3. Verifica credenciais:
   - Supabase: `Supabase - Essenza Prime`
   - WhatsApp: `WhatsApp Cloud API Token`
4. **Ativa o workflow**

**Webhook URL:** `https://n8n.alcinomenezesjunior.com/webhook/stripe-webhook`

**O que faz:**
- Recebe evento `checkout.session.completed` do Stripe
- Atualiza status do appointment para `confirmed`
- Marca `deposit_paid = true`
- Envia mensagem de confirmação ao cliente no WhatsApp
- Sugere upsell se aplicável

#### 7.5.2 Scheduled Messages Workflow

1. No n8n, clica **Import from File**
2. Seleciona `SCHEDULED_MESSAGES_WORKFLOW.json`
3. Verifica credenciais (mesmas do anterior)
4. **Ativa o workflow**

**Trigger:** Corre automaticamente a cada 5 minutos

**O que faz:**
- Consulta tabela `scheduled_messages` para mensagens pendentes
- Filtra mensagens com `sent = false` e `scheduled_for <= NOW()`
- Envia cada mensagem via WhatsApp:
  - **reminder_24h:** Lembrete 24h antes + cuidados pré
  - **reminder_1h:** Lembrete 1h antes
  - **post_care:** Cuidados pós-procedimento (T+2h)
  - **follow_up_7d:** Follow-up comercial (T+7 dias)
- Marca mensagens como enviadas (`sent = true`)

---

## 🛠️ PASSO 7.6: IMPLEMENTAR AS TOOLS

As 8 Tools estão **definidas** no AI Agent mas **não implementadas**. Para torná-las funcionais:

### Opção A: Implementação Manual (Recomendado para Demo)

Consulta o ficheiro `TOOLS_IMPLEMENTATION.md` que contém:
- Código completo de cada tool
- Exemplos de integração
- Helpers e funções auxiliares

**Tools a implementar:**
1. ✅ `check_availability` - Verifica slots livres no calendário
2. ✅ `create_booking` - Cria marcação + evento + mensagens agendadas
3. ✅ `generate_payment_link` - Gera Stripe Checkout Session
4. ✅ `cancel_booking` - Cancela + processa reembolso
5. ✅ `reschedule_booking` - Move marcação para nova data
6. ✅ `process_refund` - Processa reembolso Stripe
7. ✅ `get_care_instructions` - Retorna cuidados pré/pós
8. ✅ `get_professional_info` - Info sobre profissionais

### Opção B: Usar Workflows Pré-Construídos

Para produção, recomenda-se criar sub-workflows separados para cada tool.

**Próximo passo:** Ver `TOOLS_IMPLEMENTATION.md` para código completo.

---

## 📊 PASSO 8: MONITORIZAÇÃO

### Dashboards Supabase

Cria queries úteis:

```sql
-- Marcações de hoje
SELECT * FROM upcoming_appointments WHERE date = CURRENT_DATE;

-- Mensagens pendentes
SELECT * FROM messages_to_send_today;

-- Estatísticas gerais
SELECT * FROM clinic_stats;
```

### Logs n8n

- Monitora **Executions** para erros
- Ativa **Error Workflow** para alertas

---

## 🚨 TROUBLESHOOTING

### Problema: Bot não responde

**Solução:**
1. Verifica que workflow está ativo
2. Verifica webhook WhatsApp configurado
3. Verifica logs n8n (Executions)
4. Testa webhook manualmente (Postman)

### Problema: AI Agent dá erro

**Solução:**
1. Verifica API Key Anthropic
2. Verifica quota disponível
3. Reduz `maxTokens` se necessário

### Problema: Pagamento não confirma

**Solução:**
1. Verifica webhook Stripe configurado
2. Verifica signing secret correcto
3. Testa com cartão test: `4242 4242 4242 4242`

---

## ✅ CHECKLIST FINAL

- [ ] Supabase: 8 tabelas criadas com dados
- [ ] Stripe: Webhook configurado (test mode)
- [ ] WhatsApp: Webhook verificado
- [ ] n8n: Todas credenciais adicionadas
- [ ] n8n: Workflow importado e ativo
- [ ] Teste básico: Mensagem "Olá" funciona
- [ ] Teste marcação: Fluxo completo OK
- [ ] Google Calendar: Eventos aparecem
- [ ] Supabase: Registos criados correctamente

---

## 🎉 PRÓXIMOS PASSOS

1. Implementar lógica detalhada das 8 Tools
2. Criar workflow de mensagens agendadas
3. Adicionar sistema de confirmação de comparecimento
4. Implementar upsells automáticos
5. Criar dashboard de métricas
6. Testar exaustivamente todos os cenários

---

**Suporte:** Para dúvidas, consulta a documentação completa ou contacta via GitHub Issues.
