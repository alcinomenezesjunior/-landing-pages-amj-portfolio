# 🤖 Chatbot Essenza Prime Clinic - Demo

Sistema de chatbot WhatsApp com AI Agent para gestão automatizada de marcações numa clínica de estética.

---

## 📂 ESTRUTURA DO PROJETO

Este projeto contém **duas versões** do chatbot:

```
chatbot-estetica-demo/
├── v1-http-request/          # Versão 1: HTTP Request + Anthropic API (descontinuada)
├── v2-ai-agent/              # Versão 2: AI Agent + Tools (ACTUAL)
└── README.md                 # Este ficheiro
```

---

## 🆚 COMPARAÇÃO DAS VERSÕES

### v1-http-request (Descontinuada)
- ❌ Usa HTTP Request directo para Anthropic API
- ❌ Não tem sistema de Tools
- ❌ Lógica mais complexa e menos escalável
- ❌ Manutenção difícil

### v2-ai-agent (ACTUAL) ✅
- ✅ Usa AI Agent node nativo do n8n
- ✅ Sistema de Tools modular
- ✅ Integração com Supabase, Stripe, Google Calendar
- ✅ Mensagens agendadas automáticas
- ✅ Mais fácil de manter e expandir

---

## 🎯 VERSÃO RECOMENDADA

**Usa a v2-ai-agent!**

Para começar, vê a documentação completa em:
```
v2-ai-agent/README.md
```

---

## 📚 DOCUMENTAÇÃO ADICIONAL

Ficheiros de suporte (na raiz do projeto):
- **SETUP_GUIDE.md**: Guia completo de configuração
- **TOOLS_IMPLEMENTATION.md**: Como implementar as 8 Tools
- **GUIA_IMPORTACAO.md**: Como importar workflows no n8n

---

## 🚀 QUICK START

1. Vai para a pasta `v2-ai-agent/`
2. Lê o README.md
3. Segue os passos de configuração
4. Importa o workflow no n8n

---

**Projecto:** [AMJ Automação & IA](https://www.alcinomenezesjunior.com)  
**Última actualização:** 23 Novembro 2025
