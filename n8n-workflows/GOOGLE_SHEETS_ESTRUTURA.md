# 📊 ESTRUTURA GOOGLE SHEETS ATUALIZADA - AMJ Lead System

## 🎯 OVERVIEW

**Nome da Planilha:** Leads captados
**Nome da Sheet:** Leads
**Total de Colunas:** 31 (29 originais + 2 novas)
**Novas Colunas:** `origemCodigo` (coluna Q), `paginaOrigem` (coluna R)

---

## 📋 ESTRUTURA COMPLETA DAS 31 COLUNAS

| Coluna | Nome do Campo | Tipo | Descrição | Exemplo | Obrigatório |
|--------|---------------|------|-----------|---------|-------------|
| **A** | timestamp | Data/Hora | Data e hora de captura do lead | 2025-01-16T15:30:00.000Z | ✅ Sim |
| **B** | nome | Texto | Nome completo do lead | João Silva | ✅ Sim |
| **C** | email | Texto | Email do lead | joao@exemplo.pt | ✅ Sim |
| **D** | instagram | Texto | Handle Instagram (com @) | @clinicabeleza | ❌ Não |
| **E** | whatsapp | Texto | WhatsApp formatado (351...) | 351912345678 | ✅ Sim |
| **F** | status | Texto | Classificação do lead (Quente/Morno/Frio) | Quente 🔥 | ✅ Sim |
| **G** | dataContacto | Texto | Data do último contato realizado | 16/01/2025 15:30 | ❌ Não |
| **H** | meioContacto | Texto | Canal do último contato (Email/WhatsApp) | Email | ❌ Não |
| **I** | notasEnriquecimento | Texto Longo | Análise completa do Perplexity | (texto longo) | ✅ Sim |
| **J** | leadScore | Número | Pontuação de 0-100 | 75 | ✅ Sim |
| **K** | emailEnviado | Texto | Status de envio de emails | Sim - Email 1 e 2 | ✅ Sim |
| **L** | whatsappEnviado | Texto | Status de envio WhatsApp | Sim | ✅ Sim |
| **M** | ultimaInteracao | Data/Hora | Timestamp última interação | 2025-01-16T15:35:00Z | ✅ Sim |
| **N** | interesse | Texto | Interesse manifestado no formulário | Tráfego pago para clínica | ❌ Não |
| **O** | servico | Texto | Serviço específico solicitado | Meta Ads | ❌ Não |
| **P** | origem | Texto | Descrição completa da origem | Landing Page Agência - Tráfego Pago | ✅ Sim |
| **Q** | **origemCodigo** | **Texto** | **Código curto da landing page (NOVO)** | **LP_Agencia_Trafego** | **✅ Sim** |
| **R** | **paginaOrigem** | **Texto** | **Nome legível da LP (NOVO)** | **Agência Local - Tráfego Pago** | **✅ Sim** |
| **S** | valorProposta | Texto | Valor da proposta enviada | €990 | ❌ Não |
| **T** | probabilidadeConversao | Texto | Faixa de probabilidade de conversão | 70-90% | ✅ Sim |
| **U** | observacoes | Texto Longo | Observações gerais + justificativa scoring | Score: 75/100 \| Quente... | ✅ Sim |
| **V** | linkWhatsapp | URL | Link direto para WhatsApp do lead | https://wa.me/351912345678 | ✅ Sim |
| **W** | dispositivo | Texto | Dispositivo usado (Mobile/Desktop) | Mobile | ✅ Sim |
| **X** | navegador | Texto | Navegador usado | Chrome | ✅ Sim |
| **Y** | os | Texto | Sistema operacional | Android | ✅ Sim |
| **Z** | pais | Texto | País de origem | Portugal | ✅ Sim |
| **AA** | distrito | Texto | Distrito em Portugal | Lisboa | ❌ Não |
| **AB** | cidade | Texto | Cidade | Lisboa | ❌ Não |
| **AC** | provedor | Texto | Provedor de internet (ISP) | MEO | ❌ Não |
| **AD** | referrer | Texto | Origem do tráfego | https://google.com | ❌ Não |
| **AE** | idioma | Texto | Idioma do navegador | pt-PT | ✅ Sim |

---

## 🆕 DETALHES DAS NOVAS COLUNAS

### **Coluna Q: origemCodigo**

**Propósito:** Código curto e padronizado para identificar a landing page de origem.

**Valores Possíveis:**
- `LP_Agencia_Trafego` → Landing Page Agência Tráfego Pago
- `LP_Agentes_IA` → Landing Page Agentes de IA
- `LP_Chatbot_Estetica` → Landing Page Chatbot Estética
- `LP_Consultoria_PME` → Landing Page Consultoria PME
- `LP_Desconhecida` → Origem não identificada (fallback)

**Casos de Uso:**
1. **Filtros:** `=FILTER(A:AE, Q:Q="LP_Agencia_Trafego")`
2. **Contagem:** `=COUNTIF(Q:Q, "LP_Agencia_Trafego")`
3. **Dashboards:** Tabelas dinâmicas agrupando por origemCodigo
4. **Análise:** Comparar performance entre landing pages

**Exemplo:**
```
LP_Agencia_Trafego
```

---

### **Coluna R: paginaOrigem**

**Propósito:** Nome legível e descritivo da landing page para leitura humana.

**Valores Possíveis:**
- `Agência Local - Tráfego Pago`
- `Agentes de IA Empresarial`
- `Chatbot para Estética`
- `Consultoria PME`
- `Não especificada` (fallback)

**Casos de Uso:**
1. **Relatórios:** Nome amigável em visualizações
2. **Emails Internos:** Referência clara à LP em comunicações
3. **Apresentações:** Gráficos com nomes legíveis

**Exemplo:**
```
Agência Local - Tráfego Pago
```

---

## 🔧 COMO CRIAR A PLANILHA ATUALIZADA

### **OPÇÃO 1: Criar Nova Planilha do Zero**

#### **Passo 1: Criar Nova Google Sheets**
1. Acesse [Google Sheets](https://sheets.google.com)
2. Clique em **+ Novo** → **Planilha em branco**
3. Renomeie para: **Leads captados**

#### **Passo 2: Criar Cabeçalhos**

Cole esta linha na **linha 1** (copie célula por célula ou cole tudo em A1 e separe):

```
timestamp | nome | email | instagram | whatsapp | status | dataContacto | meioContacto | notasEnriquecimento | leadScore | emailEnviado | whatsappEnviado | ultimaInteracao | interesse | servico | origem | origemCodigo | paginaOrigem | valorProposta | probabilidadeConversao | observacoes | linkWhatsapp | dispositivo | navegador | os | pais | distrito | cidade | provedor | referrer | idioma
```

**OU copie esta fórmula e cole em A1:**

```
={"timestamp","nome","email","instagram","whatsapp","status","dataContacto","meioContacto","notasEnriquecimento","leadScore","emailEnviado","whatsappEnviado","ultimaInteracao","interesse","servico","origem","origemCodigo","paginaOrigem","valorProposta","probabilidadeConversao","observacoes","linkWhatsapp","dispositivo","navegador","os","pais","distrito","cidade","provedor","referrer","idioma"}
```

#### **Passo 3: Formatar Cabeçalhos**
1. Selecione linha 1
2. **Negrito** (Ctrl+B ou Cmd+B)
3. **Cor de fundo:** Azul claro ou cinza claro
4. **Congelar linha 1:** Ver → Congelar → 1 linha

#### **Passo 4: Formatar Colunas Específicas**

**Colunas de Data/Hora (A, M):**
- Formato: `dd/MM/yyyy HH:mm:ss`

**Coluna de Lead Score (J):**
- Formato: Número
- Sem casas decimais

**Colunas de Texto Longo (I, U):**
- Largura: 300-400px
- Quebra de texto ativada

**Coluna linkWhatsapp (V):**
- Inserir hyperlink: `=HYPERLINK(V2, "WhatsApp")`

---

### **OPÇÃO 2: Adicionar Colunas a Planilha Existente**

Se você já tem a planilha com 29 colunas:

#### **Passo 1: Localizar Coluna "origem"**
- Deve estar na coluna **P**

#### **Passo 2: Inserir 2 Novas Colunas**
1. Clique com botão direito na coluna **Q** (valorProposta)
2. Escolha **Inserir 2 colunas à esquerda**

#### **Passo 3: Adicionar Cabeçalhos**
- Coluna **Q** (nova): `origemCodigo`
- Coluna **R** (nova): `paginaOrigem`

#### **Passo 4: Formatar Cabeçalhos**
- Aplicar mesmo estilo das outras colunas (negrito, cor de fundo)

#### **Passo 5: Validar Estrutura**
Verifique a ordem final das colunas:
```
... | origem | origemCodigo | paginaOrigem | valorProposta | ...
     coluna P   coluna Q       coluna R       coluna S
```

---

## 📊 FÓRMULAS E ANÁLISES ÚTEIS

### **1. Contar Leads por Origem**

Cole em uma célula separada (ex: célula AF2):

```
=QUERY(Q:Q, "SELECT Q, COUNT(Q) WHERE Q <> '' AND Q <> 'origemCodigo' GROUP BY Q LABEL Q 'Origem', COUNT(Q) 'Total Leads'")
```

**Resultado:**
```
Origem                  | Total Leads
LP_Agencia_Trafego      | 45
LP_Agentes_IA           | 32
LP_Chatbot_Estetica     | 58
LP_Consultoria_PME      | 21
```

---

### **2. Lead Score Médio por Origem**

```
=QUERY({Q:Q, J:J}, "SELECT Col1, AVG(Col2) WHERE Col1 <> '' AND Col1 <> 'origemCodigo' GROUP BY Col1 LABEL Col1 'Origem', AVG(Col2) 'Score Médio'")
```

**Resultado:**
```
Origem                  | Score Médio
LP_Agencia_Trafego      | 72.3
LP_Agentes_IA           | 68.5
LP_Chatbot_Estetica     | 65.1
LP_Consultoria_PME      | 70.8
```

---

### **3. Taxa de Conversão (Leads Quentes) por Origem**

```
=QUERY({Q:Q, F:F}, "SELECT Col1, COUNT(Col2) WHERE Col2 LIKE '%Quente%' AND Col1 <> 'origemCodigo' GROUP BY Col1 LABEL Col1 'Origem', COUNT(Col2) 'Leads Quentes'")
```

**Resultado:**
```
Origem                  | Leads Quentes
LP_Agencia_Trafego      | 18
LP_Agentes_IA           | 12
LP_Chatbot_Estetica     | 20
LP_Consultoria_PME      | 8
```

---

### **4. Filtrar Apenas Leads de Uma LP Específica**

```
=FILTER(A:AE, Q:Q="LP_Chatbot_Estetica", A:A<>"")
```

Retorna todas as colunas apenas dos leads da LP Chatbot Estética.

---

### **5. Gráfico de Pizza - Distribuição de Leads por Origem**

1. Criar tabela com fórmula do item 1 acima
2. Selecionar tabela
3. **Inserir** → **Gráfico**
4. Tipo: **Gráfico de pizza**
5. Customizar cores por LP

---

### **6. Dashboard de Performance por LP**

Crie uma nova sheet chamada **"Dashboard"** com:

**Tabela 1: Resumo Geral**
```
| Métrica                    | LP_Agencia | LP_Agentes_IA | LP_Chatbot | LP_PME |
|----------------------------|------------|---------------|------------|--------|
| Total Leads                | 45         | 32            | 58         | 21     |
| Lead Score Médio           | 72.3       | 68.5          | 65.1       | 70.8   |
| Leads Quentes (%)          | 40%        | 37.5%         | 34.5%      | 38.1%  |
| Email Enviado (%)          | 95%        | 93%           | 97%        | 91%    |
| WhatsApp Enviado (%)       | 80%        | 78%           | 85%        | 75%    |
```

**Fórmulas:**
```
Total Leads LP_Agencia (B2):
=COUNTIF(Leads!Q:Q, "LP_Agencia_Trafego")

Score Médio LP_Agencia (B3):
=AVERAGEIF(Leads!Q:Q, "LP_Agencia_Trafego", Leads!J:J)

Leads Quentes % (B4):
=COUNTIFS(Leads!Q:Q, "LP_Agencia_Trafego", Leads!F:F, "*Quente*") / COUNTIF(Leads!Q:Q, "LP_Agencia_Trafego")
```

---

## 🎨 FORMATAÇÃO CONDICIONAL RECOMENDADA

### **1. Destaque de Lead Score (Coluna J)**

**Regra 1 - Quente (Verde):**
- Aplicar ao intervalo: `J2:J1000`
- Formato: **Texto verde, fundo verde claro**
- Condição: `Valor da célula >= 80`

**Regra 2 - Morno (Amarelo):**
- Aplicar ao intervalo: `J2:J1000`
- Formato: **Texto laranja, fundo amarelo claro**
- Condição: `Valor da célula >= 50 E Valor da célula < 80`

**Regra 3 - Frio (Cinza):**
- Aplicar ao intervalo: `J2:J1000`
- Formato: **Texto cinza, fundo cinza claro**
- Condição: `Valor da célula < 50`

---

### **2. Destaque de Origem (Coluna Q)**

**Regra 1 - LP_Agencia_Trafego:**
- Formato: Fundo azul claro
- Condição: `Texto contém "LP_Agencia_Trafego"`

**Regra 2 - LP_Agentes_IA:**
- Formato: Fundo roxo claro
- Condição: `Texto contém "LP_Agentes_IA"`

**Regra 3 - LP_Chatbot_Estetica:**
- Formato: Fundo verde claro
- Condição: `Texto contém "LP_Chatbot_Estetica"`

**Regra 4 - LP_Consultoria_PME:**
- Formato: Fundo laranja claro
- Condição: `Texto contém "LP_Consultoria_PME"`

**Regra 5 - LP_Desconhecida:**
- Formato: Fundo vermelho claro
- Condição: `Texto contém "LP_Desconhecida"`

---

### **3. Email/WhatsApp Enviado (Colunas K, L)**

**Email Enviado - SIM (Verde):**
- Aplicar ao intervalo: `K2:K1000`
- Formato: Fundo verde claro
- Condição: `Texto contém "Sim"`

**WhatsApp Enviado - SIM (Verde):**
- Aplicar ao intervalo: `L2:L1000`
- Formato: Fundo verde claro
- Condição: `Texto contém "Sim"`

---

## 🔒 PERMISSÕES E COMPARTILHAMENTO

### **Configurar Acesso do N8N:**

1. **Compartilhar Planilha:**
   - Clique em **Compartilhar** (canto superior direito)
   - Adicione o email da conta Google usada no N8N OAuth2
   - Permissão: **Editor**

2. **Copiar ID da Planilha:**
   - URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
   - Copie `YOUR_SHEET_ID`

3. **Atualizar Workflow N8N:**
   - Abra Workflow 1 no N8N
   - Node: **📊 Google Sheets - Salvar Lead (COM ORIGEM)**
   - Campo `documentId`: Cole o Sheet ID
   - Campo `sheetName`: `Leads` (deve ser exatamente este nome)

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após criar/atualizar a planilha:

- [ ] **31 colunas** presentes (A até AE)
- [ ] Coluna **Q** = `origemCodigo`
- [ ] Coluna **R** = `paginaOrigem`
- [ ] Cabeçalhos formatados (negrito, cor de fundo)
- [ ] Linha 1 congelada
- [ ] Permissão de **Editor** para conta N8N
- [ ] Sheet ID copiado e colado no workflow
- [ ] Nome da sheet = **"Leads"** (exato, case-sensitive)
- [ ] Teste com curl retorna dados corretos nas colunas Q e R

---

## 📈 EXEMPLO DE DADOS

Após executar testes curl, sua planilha deve ter dados assim:

| timestamp | nome | email | whatsapp | origem | origemCodigo | paginaOrigem | leadScore | status |
|-----------|------|-------|----------|--------|--------------|--------------|-----------|--------|
| 2025-01-16T15:30:00Z | Maria Santos | maria@... | 351912345678 | Landing Page Agência - Tráfego Pago | LP_Agencia_Trafego | Agência Local - Tráfego Pago | 75 | Quente 🔥 |
| 2025-01-16T16:00:00Z | João Ferreira | joao@... | 351938765432 | Landing Page Agentes de IA | LP_Agentes_IA | Agentes de IA Empresarial | 82 | Quente 🔥 |
| 2025-01-16T16:30:00Z | Ana Costa | ana@... | 351965432187 | Landing Page Chatbot Estética | LP_Chatbot_Estetica | Chatbot para Estética | 68 | Morno 🟡 |
| 2025-01-16T17:00:00Z | Carlos Oliveira | carlos@... | 351927654321 | Landing Page Consultoria PME | LP_Consultoria_PME | Consultoria PME | 71 | Morno 🟡 |

---

## 🚀 CONCLUSÃO

Com a estrutura atualizada de **31 colunas**, você terá:

✅ **Rastreamento completo** de origem de leads
✅ **Análises por landing page** (performance, ROI, conversão)
✅ **Dashboards dinâmicos** com fórmulas QUERY
✅ **Filtros avançados** por origem
✅ **Relatórios profissionais** com nomes legíveis

**Próximo Passo:** Importar Workflow 1 atualizado no N8N e conectar à planilha.
