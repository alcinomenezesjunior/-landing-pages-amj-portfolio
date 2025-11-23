# V2 - AI Agent Node + Tools

✅ **VERSÃO ACTUAL** - Em uso na landing page.

## Stack Tecnológico

- **n8n**: Orquestração de workflow
- **AI Agent Node**: Claude Sonnet 4 com tools
- **Google Calendar**: Verificação e criação de marcações
- **Stripe**: Pagamentos de depósito
- **WhatsApp Cloud API**: Comunicação com clientes

## Tools Disponíveis

| Tool | Função |
|------|--------|
| `check_availability` | Verifica horários disponíveis |
| `create_booking` | Cria marcação no calendário |
| `cancel_booking` | Cancela e processa reembolso |
| `reschedule_booking` | Reagenda marcação |
| `generate_payment_link` | Gera link Stripe para depósito |
| `process_refund` | Processa reembolso parcial/total |

## Ficheiros

- `DEMO_Essenza_Prime_AI_Agent.json` - Workflow principal
- `SETUP_GUIDE.md` - Guia de configuração
- `CHANGELOG.md` - Histórico de alterações

## Configuração

Ver `SETUP_GUIDE.md` para instruções completas.
