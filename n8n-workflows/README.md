# 🎯 N8N WORKFLOW ATUALIZADO - WEBHOOK ÚNICO

## 📋 RESUMO

Este diretório contém o **Workflow 1 (MAIN) atualizado** para processar leads de **4 landing pages** através de um **webhook único** no N8N.

**Versão:** v3.2 - Webhook Único
**Data:** 16 de Janeiro de 2025
**Autor:** Claude Code AI Assistant

---

## 🗂️ ARQUIVOS NESTE DIRETÓRIO

| Arquivo | Descrição | Tamanho |
|---------|-----------|---------|
| **WORKFLOW_1_MAIN_ATUALIZADO.json** | JSON do workflow atualizado para importar no N8N | ~75KB |
| **RELATORIO_MUDANCAS.md** | Documentação detalhada de todas as mudanças realizadas | ~25KB |
| **COMANDOS_TESTE_CURL.md** | 5 comandos curl para testar as 4 origens + fallback | ~15KB |
| **GOOGLE_SHEETS_ESTRUTURA.md** | Estrutura completa das 31 colunas + fórmulas úteis | ~18KB |
| **INSTRUCOES_IMPORTACAO.md** | Guia passo a passo de importação e configuração | ~22KB |
| **README.md** | Este arquivo (índice geral) | ~8KB |

---

## 🚀 QUICK START

### **1. Leia Primeiro (5 minutos):**
- `RELATORIO_MUDANCAS.md` → Entenda o que foi alterado

### **2. Prepare Ambiente (15 minutos):**
- `GOOGLE_SHEETS_ESTRUTURA.md` → Crie/atualize planilha com 31 colunas

### **3. Importe Workflow (20 minutos):**
- `INSTRUCOES_IMPORTACAO.md` → Siga passo a passo

### **4. Teste Sistema (10 minutos):**
- `COMANDOS_TESTE_CURL.md` → Execute 5 testes

**TOTAL: ~50 minutos para implementação completa**

---

## 📊 O QUE MUDOU?

### **Resumo Executivo:**

| Aspecto | Antes (v3.1) | Depois (v3.2) |
|---------|--------------|---------------|
| **Webhook Path** | `/webhook-lead-capture` | `/leads-geral` |
| **Landing Pages** | 1 (chatbot-estetica) | 4 (todas) |
| **Identificação** | origem (fixo) | origemCodigo + paginaOrigem |
| **Google Sheets** | 29 colunas | 31 colunas (+2) |
| **Nodes Alterados** | - | 9 nodes atualizados |

### **4 Landing Pages Suportadas:**

1. **LP_Agencia_Trafego** → Agência Local - Tráfego Pago
2. **LP_Agentes_IA** → Agentes de IA Empresarial
3. **LP_Chatbot_Estetica** → Chatbot para Estética
4. **LP_Consultoria_PME** → Consultoria PME

---

## 🎯 NODES MODIFICADOS

### **Principais Alterações:**

1. **🎯 Webhook - Captura Lead**
   - Path: `webhook-lead-capture` → `leads-geral`

2. **⚙️ Code - Validar e Formatar**
   - Adiciona processamento de campos `origem` e `landing_page`
   - Mapeia códigos para descrições amigáveis
   - Fallback para `LP_Desconhecida`

3. **📊 Google Sheets - Salvar Lead**
   - Adiciona 2 colunas: `origemCodigo` (Q), `paginaOrigem` (R)

4. **🔍 Perplexity, 🎯 GPT-4, ✉️ Claude**
   - Prompts atualizados para incluir dados de origem
   - Análises contextualizadas por tipo de LP

5. **📲 Telegram - Pedir Aprovação**
   - Notificação mostra origem do lead

---

## 📂 ESTRUTURA GOOGLE SHEETS

### **Colunas Novas (Obrigatórias):**

**Coluna Q - origemCodigo:**
- Código curto da LP (ex: `LP_Agencia_Trafego`)
- Usado para filtros e análises programáticas

**Coluna R - paginaOrigem:**
- Nome legível da LP (ex: `Agência Local - Tráfego Pago`)
- Usado para relatórios e visualizações

### **Total de Colunas: 31**
A até AE (timestamp, nome, email, ..., idioma)

Ver detalhes completos em: `GOOGLE_SHEETS_ESTRUTURA.md`

---

## 🧪 COMANDOS DE TESTE

### **Teste Rápido (1 origem):**

```bash
curl -X POST https://mjrmkt.app.n8n.cloud/webhook/leads-geral \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "LP_Agencia_Trafego",
    "landing_page": "Agência Local - Tráfego Pago",
    "nome": "Maria Santos",
    "email": "maria@exemplo.pt",
    "whatsapp": "912345678",
    "interesse": "Tráfego pago",
    "servico": "Meta Ads"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Lead capturado e processado com sucesso!",
  "origem": "LP_Agencia_Trafego"
}
```

### **Teste Completo (4 origens):**

Ver comandos detalhados em: `COMANDOS_TESTE_CURL.md`

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Pré-Implementação:**
- [ ] Ler `RELATORIO_MUDANCAS.md` completo
- [ ] Fazer backup do Workflow 1 atual (v3.1)
- [ ] Exportar configurações importantes (Sheet ID, Chat ID, etc.)

### **Google Sheets:**
- [ ] Criar/atualizar planilha com 31 colunas
- [ ] Adicionar colunas Q (origemCodigo) e R (paginaOrigem)
- [ ] Formatar cabeçalhos (negrito, cor de fundo)
- [ ] Congelar linha 1
- [ ] Dar permissão de Editor para conta N8N OAuth

### **N8N:**
- [ ] Importar `WORKFLOW_1_MAIN_ATUALIZADO.json`
- [ ] Configurar 6 credenciais (Perplexity, OpenAI, Claude, Sheets, Telegram, SMTP)
- [ ] Atualizar Google Sheets ID em 3 nodes
- [ ] Atualizar Telegram Chat ID em 4 nodes
- [ ] Ativar workflow

### **Testes:**
- [ ] Executar teste curl de LP_Agencia_Trafego
- [ ] Executar teste curl de LP_Agentes_IA
- [ ] Executar teste curl de LP_Chatbot_Estetica
- [ ] Executar teste curl de LP_Consultoria_PME
- [ ] Executar teste curl sem origem (fallback)

### **Validações:**
- [ ] Verificar 5 leads no Google Sheets
- [ ] Confirmar colunas Q e R preenchidas corretamente
- [ ] Verificar 5 notificações no Telegram com origem
- [ ] Conferir execuções no N8N (todas verdes)
- [ ] Validar emails gerados mencionam contexto da LP

### **Produção:**
- [ ] Atualizar URL webhook nos 4 formulários (se mudou)
- [ ] Testar lead real de cada LP
- [ ] Monitorar primeiras 10 conversões
- [ ] Criar dashboard de análise por origem

---

## 📈 BENEFÍCIOS DA ATUALIZAÇÃO

### **Operacionais:**
✅ **1 webhook único** vs 4 separados → gestão centralizada
✅ **Manutenção simplificada** → mudanças aplicam-se a todas LPs
✅ **Configuração reduzida** → apenas 1 URL no N8N

### **Analíticos:**
✅ **Rastreamento por origem** → qual LP converte melhor?
✅ **ROI por landing page** → onde investir mais?
✅ **Dashboards centralizados** → todos os dados em 1 planilha

### **De Personalização:**
✅ **Análises IA contextualizadas** → Perplexity adapta por LP
✅ **Emails personalizados** → Claude ajusta tom por origem
✅ **Scoring preciso** → GPT-4 considera tipo de LP

### **Futuros:**
✅ **Fácil adicionar LPs** → apenas atualizar mapa de origens
✅ **Testes A/B** → comparar versões de páginas
✅ **Automações condicionais** → ações diferentes por origem

---

## 🔄 COMPATIBILIDADE

### **Workflows 2, 3, 4 - Não Precisam Alteração**

Os workflows de follow-up continuam funcionando porque:

✅ Leem dados do Google Sheets (que tem colunas extras)
✅ Ignoram `origemCodigo` e `paginaOrigem` se não usarem
✅ Compatibilidade retroativa 100%

**Melhorias Futuras Opcionais:**
- Email 2: Mencionar origem no contexto
- WhatsApp: Ajustar mensagem por LP
- Nurturing: Sequências diferentes por origem

---

## 🚨 TROUBLESHOOTING RÁPIDO

### **Problema: Webhook retorna 404**
→ Verifique workflow está **Active** e path = `leads-geral`

### **Problema: origemCodigo vazio no Sheets**
→ Formulário não está enviando campo `origem` (verifique HTML hidden fields)

### **Problema: Erro no Google Sheets node**
→ Confirme OAuth2 tem permissão Editor e Sheet ID correto

### **Problema: Notificação Telegram não chega**
→ Verifique Chat ID e confirme iniciou conversa com o bot

Ver troubleshooting completo em: `INSTRUCOES_IMPORTACAO.md`

---

## 📞 PRÓXIMOS PASSOS

1. **Imediatamente:**
   - [ ] Importar workflow atualizado
   - [ ] Configurar credenciais
   - [ ] Executar bateria de testes

2. **Curto Prazo (esta semana):**
   - [ ] Validar com leads reais das 4 LPs
   - [ ] Monitorar primeiras conversões
   - [ ] Ajustar se necessário

3. **Médio Prazo (próximo mês):**
   - [ ] Analisar performance por LP
   - [ ] Criar dashboard de métricas
   - [ ] Identificar LP com melhor ROI
   - [ ] Otimizar LPs de baixa performance

4. **Longo Prazo (3 meses):**
   - [ ] Considerar personalizar Email 2 e WhatsApp por origem
   - [ ] Criar sequências de nurturing específicas por LP
   - [ ] Implementar testes A/B de variações de LPs

---

## 📚 DOCUMENTAÇÃO ADICIONAL

### **Dentro deste diretório:**
- `RELATORIO_MUDANCAS.md` → **LEIA PRIMEIRO** (mudanças detalhadas)
- `INSTRUCOES_IMPORTACAO.md` → Passo a passo completo
- `COMANDOS_TESTE_CURL.md` → Testes validados
- `GOOGLE_SHEETS_ESTRUTURA.md` → Estrutura + fórmulas

### **Relacionado (outros arquivos):**
- `docs/CONFIGURACAO-N8N-WEBHOOK-UNICO.md` → Documentação original do webhook
- `config/webhooks.js.example` → Template de configuração frontend
- `.gitignore` → Proteção de arquivos sensíveis

### **Recursos Externos:**
- [N8N Documentation](https://docs.n8n.io)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 🎉 CONCLUSÃO

Com esta atualização, seu sistema AMJ de captura de leads está:

✅ **Centralizado** → 1 webhook para 4 landing pages
✅ **Rastreável** → Identifica origem de cada lead
✅ **Escalável** → Fácil adicionar novas LPs
✅ **Analisável** → Dashboards e métricas por origem
✅ **Personalizado** → IAs adaptam análises por LP

**Tempo Estimado Total de Implementação:** 50-60 minutos

**Resultado:** Sistema profissional de gestão de leads multi-origem.

---

## 📄 VERSÃO

**Workflow:** v3.2 - Webhook Único
**Criado em:** 16 de Janeiro de 2025
**Última Atualização:** 16 de Janeiro de 2025
**Próxima Revisão:** Fevereiro de 2025 (após análise de performance)

---

## 👤 AUTOR

**Claude Code AI Assistant**
- Sessão ID: `0157MwkxSz3XqUhSaJPguJzi`
- Branch: `claude/landing-pages-analysis-optimization-0157MwkxSz3XqUhSaJPguJzi`
- Modelo: Claude Sonnet 4.5

---

## 📧 SUPORTE

Para questões ou problemas:

1. Consulte troubleshooting em `INSTRUCOES_IMPORTACAO.md`
2. Verifique execuções no N8N (Executions tab)
3. Teste APIs manualmente (comandos em troubleshooting)
4. Revise documentação N8N oficial

---

**Boa implementação! 🚀**
