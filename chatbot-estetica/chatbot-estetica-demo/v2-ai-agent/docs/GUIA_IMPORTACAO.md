# 🚀 GUIA DE IMPORTAÇÃO - Essenza Prime Chatbot

## ✅ PASSO 1: Importar o Backend (5 minutos)

### 1.1. Abrir o n8n
- Abre o teu n8n v1.120.4
- Vai em **Workflows** → **Add Workflow** (ou clica no + no canto superior esquerdo)

### 1.2. Importar o JSON
- Clica nos **3 pontinhos** (⋮) no canto superior direito
- Escolhe **Import from file...**
- Seleciona o ficheiro: **`IMPORT_ME_Backend_Only.json`**
- Clica **Import**

✅ **SE DEU CERTO:** Vais ver um workflow com 12 nós conectados:
- Webhook WhatsApp
- Code Parse Message
- IF Valid Message
- Supabase Get Client
- IF Client Exists
- Supabase Create Client
- Supabase Get Conversation
- Code Merge Data
- PLACEHOLDER AI Response (este nó vamos substituir)
- Supabase Update Conversation
- WhatsApp Send Message
- Webhook Response

❌ **SE DEU ERRO:** Tira um print do erro e envia-me. NÃO deve dar erro porque não tem AI Agent.

---

## 🔧 PASSO 2: Configurar Credenciais (10 minutos)

Agora precisas configurar as credenciais (APIs) dos serviços.

### 2.1. Supabase
Clica em **qualquer nó verde "Supabase"** → vai aparecer um aviso de credencial em falta.

1. Clica em **"Create New Credential"**
2. Preenche:
   - **Host**: O URL do teu projeto Supabase (ex: `https://xxx.supabase.co`)
   - **Service Role Secret**: A tua chave `service_role` (encontra em Supabase → Settings → API)
3. Clica **Save**

### 2.2. WhatsApp Cloud API
Clica no nó **"WhatsApp – Send Message"** → vai aparecer aviso de credencial.

1. Clica em **"Create New Credential"**
2. Tipo: **Header Auth**
3. Preenche:
   - **Name**: `Authorization`
   - **Value**: `Bearer SEU_TOKEN_WHATSAPP`
4. Clica **Save**

### 2.3. Google Calendar (OPCIONAL - só se quiseres testar Tools)
Se quiseres adicionar as Tools mais tarde:
- Clica em qualquer nó "Google Calendar"
- Configura OAuth2 (segue wizard do n8n)

### 2.4. Stripe (OPCIONAL - só se quiseres testar Tools)
- Clica no nó "Tool 3 – Create Stripe Session"
- Adiciona credencial Header Auth com `Authorization: Bearer sk_test_...`

---

## 🎯 PASSO 3: Testar o Backend (5 minutos)

### 3.1. Salvar o Workflow
- Clica em **Save** no canto superior direito
- Dá um nome: "Essenza Prime - Backend Test"

### 3.2. Ativar o Webhook
- Clica no nó **"Webhook – WhatsApp Incoming"**
- Verás um URL tipo: `https://teu-n8n.com/webhook/testar-bot-whatsapp`
- Copia esse URL (vais precisar dele)

### 3.3. Ativar o Workflow
- No canto superior direito, ativa o botão **"Active"** (fica verde)

### 3.4. Testar com cURL (ou Postman)
Abre o terminal e executa:

```bash
curl -X POST https://TEU_N8N_URL/webhook/testar-bot-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "entry": [{
        "changes": [{
          "value": {
            "messages": [{
              "from": "351912345678",
              "text": {"body": "Olá, quero testar!"},
              "id": "msg123",
              "timestamp": "1234567890"
            }]
          }
        }]
      }]
    }
  }'
```

✅ **SE FUNCIONOU:** O workflow vai processar e tentar enviar resposta WhatsApp (pode falhar se credenciais não estiverem OK, mas os nós Supabase devem executar).

---

## 🤖 PASSO 4: Adicionar o AI Agent (15 minutos)

Agora vem a parte IMPORTANTE: adicionar o AI Agent manualmente.

### 4.1. Encontrar o Nó PLACEHOLDER
- Procura o nó chamado **"PLACEHOLDER – AI Response"** (tem um ⚠️ amarelo)
- Este é o nó que vamos SUBSTITUIR

### 4.2. Adicionar AI Agent
1. Clica no **+** entre **"Code – Merge Data"** e **"PLACEHOLDER – AI Response"**
2. No menu que abre, escreve: **AI Agent**
3. Seleciona **"AI Agent"** (da lista)
4. Um novo nó AI Agent aparece

### 4.3. Conectar o AI Agent
1. **Apaga a conexão** antiga entre "Code – Merge Data" e "PLACEHOLDER"
2. **Conecta** "Code – Merge Data" **→** "AI Agent"
3. **Conecta** "AI Agent" **→** "Supabase – Update Conversation"
4. **Apaga** o nó "PLACEHOLDER – AI Response" (já não precisas dele)

### 4.4. Adicionar Anthropic Chat Model
O AI Agent precisa de um modelo LLM conectado.

1. Clica no nó **"AI Agent"**
2. No painel da direita, vai aparecer a configuração
3. Procura a secção **"Model"**
4. Clica em **"+ Add Sub-Node"** ou no **ícone de chain/link**
5. Escolhe **"Anthropic Chat Model"**
6. Configura:
   - **Model**: `claude-sonnet-4-5-20250929` (ou o que quiseres)
   - **Credential**: Adiciona a tua Anthropic API key
   - **Temperature**: `0.7`
   - **Max Tokens**: `1500`

### 4.5. Configurar o System Message
Ainda no AI Agent:

1. Procura o campo **"System Message"** (pode estar em "Options" → "System Message")
2. Cola o seguinte prompt (ou cria o teu próprio):

```
És a assistente virtual da Essenza Prime Clinic, uma clínica de estética premium em Cascais.

Responde de forma profissional mas acolhedora, em Português de Portugal (PT-PT).

Podes ajudar com:
- Informações sobre tratamentos
- Marcação de consultas
- Verificação de disponibilidade

Quando o cliente envia a primeira mensagem, apresenta-te de forma elegante.
```

### 4.6. Configurar o Prompt
Procura o campo **"Prompt"** ou **"User Message":

```
={{$json.message}}
```

Isto passa a mensagem do utilizador para o AI Agent.

### 4.7. Configurar Chat History (OPCIONAL)
Se quiseres memória de conversa:

```
={{$json.conversationHistory}}
```

---

## ✅ PASSO 5: Testar o AI Agent (5 minutos)

### 5.1. Salvar Tudo
- Clica em **Save**

### 5.2. Executar Teste
- Clica no nó **"Webhook – WhatsApp Incoming"**
- Clica em **"Listen for Test Event"**
- Envia uma mensagem de teste (como no passo 3.4)
- Vê a execução a correr node por node

✅ **SE FUNCIONOU:** Verás o AI Agent a processar e responder!

---

## 🛠️ PASSO 6: Adicionar Tools (AVANÇADO - OPCIONAL)

Se quiseres que o AI Agent use ferramentas (check availability, create booking, etc.), precisas:

### 6.1. Criar Tool Nodes
1. Clica no **AI Agent**
2. Procura secção **"Tools"**
3. Clica em **"+ Add Tool"**
4. Escolhe **"Call n8n Workflow Tool"**
5. Seleciona um workflow que implementa a tool (precisarias criar workflows separados para cada tool)

**ALTERNATIVA MAIS SIMPLES:**
Importa o workflow completo original (com as 3 Tools já implementadas) MAS apaga o AI Agent de lá, e adiciona manualmente como fizeste acima.

---

## 📋 RESUMO DO QUE FIZESTE

✅ Importaste o backend (Webhook + Supabase + WhatsApp)
✅ Configuraste credenciais
✅ Adicionaste AI Agent manualmente (contorna o bug)
✅ Conectaste Anthropic Chat Model
✅ Testaste o fluxo completo

---

## 🆘 PROBLEMAS COMUNS

### "Could not find property option" ao importar
- ✅ **RESOLVIDO:** Usa o `IMPORT_ME_Backend_Only.json` que não tem AI Agent

### AI Agent não responde
- Verifica se a credencial Anthropic está correta
- Verifica se o modelo está selecionado
- Verifica se o prompt está configurado: `={{$json.message}}`

### WhatsApp não envia mensagem
- Verifica credencial WhatsApp Cloud API
- Verifica se a variável de ambiente `WHATSAPP_PHONE_NUMBER_ID` está configurada

### Supabase dá erro
- Verifica se as tabelas `clients`, `conversations` existem
- Verifica se a credencial tem a `service_role` key (não a `anon` key)

---

## 📞 PRECISA DE AJUDA?

Envia-me:
1. Print do erro (se houver)
2. Em que passo estás
3. O que já tentaste

Vamos resolver juntos! 💪
