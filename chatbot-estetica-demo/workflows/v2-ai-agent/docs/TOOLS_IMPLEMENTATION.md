# 🔧 Implementação das 8 Tools do AI Agent

Este documento detalha como implementar cada uma das 8 Tools definidas no AI Agent para tornar o chatbot totalmente funcional.

---

## 📌 NOTA IMPORTANTE

O n8n AI Agent node **define** as tools mas **não as executa automaticamente**. Existem 3 abordagens para implementação:

### Opção 1: Tools como Sub-Workflows (Recomendado para Produção)
Criar workflows separados que o AI Agent chama via HTTP Request

### Opção 2: Tools como Function Nodes (Mais Simples)
Implementar lógica diretamente em Code nodes após o AI Agent

### Opção 3: Tools como Endpoints Externos
Criar API endpoints que executam as operações

**Para esta demo, vamos usar Opção 2 (Function Nodes) por ser mais direto.**

---

## 🛠️ TOOL 1: check_availability

### Input
```json
{
  "service_name": "Limpeza de Pele Profunda",
  "date_from": "2025-11-25",
  "date_to": "2025-11-27",
  "professional_name": "Dra. Bruna Cortez" // opcional
}
```

### Lógica de Implementação

```javascript
// Code Node: Check Availability
const input = $input.item.json;
const serviceName = input.service_name;
const dateFrom = new Date(input.date_from);
const dateTo = new Date(input.date_to);
const professionalName = input.professional_name;

// 1. Query Supabase para obter info do serviço
// (implementar chamada Supabase)
const service = await getService(serviceName);
const durationMinutes = service.duration_max || 60;

// 2. Query Supabase para encontrar profissionais que fazem o serviço
// (implementar chamada Supabase)
const professionals = await getProfessionalsForService(serviceName);

// 3. Para cada profissional, obter horário de trabalho
const availableSlots = [];

for (const prof of professionals) {
  if (professionalName && prof.name !== professionalName) continue;

  const schedule = prof.schedule; // JSON com horários por dia

  // 4. Query Google Calendar para obter eventos existentes
  // (implementar chamada Google Calendar API)
  const existingEvents = await getCalendarEvents(dateFrom, dateTo);

  // 5. Calcular slots livres
  const slots = calculateFreeSlots(schedule, existingEvents, dateFrom, dateTo, durationMinutes);

  availableSlots.push(...slots);
}

// 6. Retornar top 5 slots
const topSlots = availableSlots.slice(0, 5);

return {
  json: {
    available_slots: topSlots.map(slot => ({
      date: slot.date,
      time: slot.time,
      professional: slot.professional
    }))
  }
};

// Helper functions
function calculateFreeSlots(schedule, events, fromDate, toDate, duration) {
  const slots = [];
  let currentDate = new Date(fromDate);

  while (currentDate <= toDate) {
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][currentDate.getDay()];
    const daySchedule = schedule[dayName];

    if (daySchedule) {
      const workStart = parseTime(daySchedule.start);
      const workEnd = parseTime(daySchedule.end);

      // Generate slots every 30 minutes
      let slotTime = workStart;
      while (slotTime < workEnd - duration) {
        const slotEnd = slotTime + duration;

        // Check if slot is free (no overlap with existing events)
        const isFree = !events.some(event => {
          const eventStart = new Date(event.start).getTime();
          const eventEnd = new Date(event.end).getTime();
          return (slotTime < eventEnd && slotEnd > eventStart);
        });

        if (isFree) {
          slots.push({
            date: formatDate(currentDate),
            time: formatTime(slotTime),
            professional: professionalName
          });
        }

        slotTime += 30; // 30 min intervals
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
}
```

### Output Esperado
```json
{
  "available_slots": [
    {"date": "2025-11-25", "time": "10:00", "professional": "Dra. Bruna Cortez"},
    {"date": "2025-11-25", "time": "14:30", "professional": "Sra. Sílvia Ramos"},
    {"date": "2025-11-26", "time": "11:00", "professional": "Dra. Bruna Cortez"}
  ]
}
```

---

## 🛠️ TOOL 2: create_booking

### Input
```json
{
  "service_name": "Limpeza de Pele Profunda",
  "professional_name": "Dra. Bruna Cortez",
  "date": "2025-11-25",
  "time_start": "10:00",
  "duration_minutes": 60,
  "client_name": "Maria Silva",
  "client_phone": "351912345678",
  "client_email": "maria@example.com",
  "price": 40,
  "deposit": 20,
  "stripe_payment_id": "pi_xxx"
}
```

### Implementação via Sub-Workflow

Criar workflow separado: `CREATE_BOOKING_TOOL.json`

**Trigger:** Webhook POST `/tools/create-booking`

**Fluxo:**
1. **Google Calendar - Create Event**
   - Calendar ID: `d682359e9a244ab7f9a7f7e925d05bf9a6def533796af78a1ecba749103b59c8@group.calendar.google.com`
   - Summary: `[MARCAÇÃO] {{service_name}} - {{client_name}}`
   - Description: Template com dados completos
   - Start: `{{date}}T{{time_start}}`
   - Duration: `{{duration_minutes}}`

2. **Supabase - Insert Appointment**
   ```sql
   INSERT INTO appointments (
     client_id, service, professional, date, time_start,
     duration_minutes, price, deposit, deposit_paid,
     stripe_payment_id, google_calendar_event_id, status
   ) VALUES (...)
   ```

3. **Supabase - Insert Scheduled Messages** (5 vezes)
   - **T-24h:** `scheduled_for = date - INTERVAL '24 hours'`
   - **T-1h:** `scheduled_for = date - INTERVAL '1 hour'`
   - **T+15min:** `scheduled_for = date + duration + INTERVAL '15 minutes'`
   - **T+2h:** `scheduled_for = date + duration + INTERVAL '2 hours'`
   - **T+7d:** `scheduled_for = date + INTERVAL '7 days'`

4. **Return Success**

### Template de Evento Google Calendar

```
═══════════════════════════════
DADOS DO CLIENTE
═══════════════════════════════
Nome: {{client_name}}
WhatsApp: {{client_phone}}
Email: {{client_email}}

═══════════════════════════════
DETALHES DA MARCAÇÃO
═══════════════════════════════
Serviço: {{service_name}}
Profissional: {{professional_name}}
Duração: {{duration_minutes}} min

═══════════════════════════════
PAGAMENTO
═══════════════════════════════
Preço Total: €{{price}}
Depósito (50%): €{{deposit}}
Estado: {{deposit_paid ? 'Pago' : 'Pendente'}}
Stripe ID: {{stripe_payment_id}}

═══════════════════════════════
SISTEMA
═══════════════════════════════
Criado via: Chatbot WhatsApp
Timestamp: {{created_at}}
```

---

## 🛠️ TOOL 3: generate_payment_link

### Implementação Directa via Code Node

```javascript
// Code Node: Generate Stripe Payment Link
const input = $input.item.json;

const stripeSecretKey = $env.STRIPE_SECRET_KEY; // ou usar credencial
const amountCents = input.amount_cents;
const serviceName = input.service_name;
const clientEmail = input.client_email;
const clientPhone = input.client_phone;
const bookingDate = input.booking_date;
const bookingTime = input.booking_time;

// HTTP Request para Stripe API
const response = await $http.request({
  method: 'POST',
  url: 'https://api.stripe.com/v1/checkout/sessions',
  headers: {
    'Authorization': `Bearer ${stripeSecretKey}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  form: {
    'mode': 'payment',
    'success_url': 'https://www.alcinomenezesjunior.com/chatbot-estetica?pagamento=sucesso',
    'cancel_url': 'https://www.alcinomenezesjunior.com/chatbot-estetica?pagamento=cancelado',
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][product_data][name]': `Depósito - ${serviceName}`,
    'line_items[0][price_data][unit_amount]': amountCents,
    'line_items[0][quantity]': 1,
    'metadata[phone]': clientPhone,
    'metadata[service]': serviceName,
    'metadata[date]': bookingDate,
    'metadata[time]': bookingTime,
    'customer_email': clientEmail
  }
});

return {
  json: {
    success: true,
    payment_url: response.url,
    session_id: response.id
  }
};
```

---

## 🛠️ TOOL 4: cancel_booking

### Lógica Completa

```javascript
// Code Node: Cancel Booking
const input = $input.item.json;
const clientPhone = input.client_phone;
const bookingDate = input.booking_date;
const reason = input.reason;

// 1. Query appointment
const appointment = await supabase
  .from('appointments')
  .select('*')
  .eq('date', bookingDate)
  .single();

// 2. Calculate refund percentage
const appointmentDate = new Date(appointment.date);
const today = new Date();
const daysUntil = Math.ceil((appointmentDate - today) / (1000 * 60 * 60 * 24));

let refundPercentage = 0;
if (daysUntil >= 7) refundPercentage = 100;
else if (daysUntil >= 3) refundPercentage = 75;
else if (daysUntil >= 1) refundPercentage = 50;
else refundPercentage = 25;

const refundAmount = (appointment.deposit * refundPercentage / 100).toFixed(2);

// 3. Process Stripe refund if applicable
if (appointment.stripe_payment_id && refundPercentage > 0) {
  const refundResponse = await $http.request({
    method: 'POST',
    url: 'https://api.stripe.com/v1/refunds',
    headers: {
      'Authorization': `Bearer ${stripeSecretKey}`
    },
    form: {
      'payment_intent': appointment.stripe_payment_id,
      'amount': Math.round(refundAmount * 100), // cents
      'reason': 'requested_by_customer'
    }
  });
}

// 4. Delete Google Calendar event
await deleteCalendarEvent(appointment.google_calendar_event_id);

// 5. Update appointment
await supabase
  .from('appointments')
  .update({
    status: 'cancelled',
    cancelled_at: new Date().toISOString(),
    cancellation_reason: reason,
    refund_amount: refundAmount
  })
  .eq('id', appointment.id);

// 6. Delete scheduled messages
await supabase
  .from('scheduled_messages')
  .delete()
  .eq('appointment_id', appointment.id);

return {
  json: {
    success: true,
    refund_percentage: refundPercentage,
    refund_amount: parseFloat(refundAmount),
    message: `Marcação cancelada. Reembolso de ${refundPercentage}% processado.`
  }
};
```

---

## 🛠️ TOOL 5: reschedule_booking

Reutilizar lógica de:
1. `cancel_booking` (mas sem reembolso)
2. `check_availability` (verificar novo slot)
3. `create_booking` (criar nova marcação)

---

## 🛠️ TOOL 6: process_refund

Já implementado dentro de `cancel_booking`. Pode ser extraído como função reutilizável.

---

## 🛠️ TOOL 7: get_care_instructions

### Implementação Simples

```javascript
// Code Node: Get Care Instructions
const input = $input.item.json;
const serviceName = input.service_name;
const instructionType = input.instruction_type; // 'pre' or 'post'

// Query Supabase
const service = await supabase
  .from('services')
  .select('pre_care, post_care')
  .eq('name', serviceName)
  .single();

const instructions = instructionType === 'pre'
  ? service.pre_care
  : service.post_care;

return {
  json: {
    instructions: instructions || 'Nenhuma instrução especial.'
  }
};
```

---

## 🛠️ TOOL 8: get_professional_info

### Implementação

```javascript
// Code Node: Get Professional Info
const input = $input.item.json;
const professionalName = input.professional_name;
const infoType = input.info_type; // 'services', 'schedule', 'bio'

// Query Supabase
const professional = await supabase
  .from('professionals')
  .select('*')
  .ilike('name', `%${professionalName}%`)
  .single();

let result = {};

switch(infoType) {
  case 'services':
    result = {
      professional: professional.name,
      services: professional.services.join(', ')
    };
    break;

  case 'schedule':
    const schedule = professional.schedule;
    const formattedSchedule = Object.entries(schedule)
      .map(([day, hours]) => `${capitalize(day)}: ${hours.start}-${hours.end}`)
      .join(', ');
    result = {
      professional: professional.name,
      schedule: formattedSchedule
    };
    break;

  case 'bio':
    result = {
      professional: professional.name,
      bio: professional.bio || 'Sem informação disponível.'
    };
    break;
}

return {json: result};
```

---

## 🚀 INTEGRAÇÃO NO WORKFLOW PRINCIPAL

### Abordagem Recomendada

Após o **AI Agent Node**, adicionar um **Switch Node** que detecta qual tool foi chamada:

```
[AI Agent]
   ↓
[Switch - Detect Tool Called]
   ├─ Route 1: check_availability → [Execute Tool 1 Logic]
   ├─ Route 2: create_booking → [Execute Tool 2 Logic]
   ├─ Route 3: generate_payment_link → [Execute Tool 3 Logic]
   ├─ Route 4: cancel_booking → [Execute Tool 4 Logic]
   ├─ Route 5: reschedule_booking → [Execute Tool 5 Logic]
   ├─ Route 6: process_refund → [Execute Tool 6 Logic]
   ├─ Route 7: get_care_instructions → [Execute Tool 7 Logic]
   └─ Route 8: get_professional_info → [Execute Tool 8 Logic]
```

Cada rota executa a lógica da tool e retorna resultado ao AI Agent para continuar a conversa.

---

## 📝 NOTAS FINAIS

1. **Teste cada tool individualmente** antes de integrar no workflow principal
2. **Use variáveis de ambiente** para credenciais (Stripe, Supabase)
3. **Implemente error handling** em todos os Code nodes
4. **Valide inputs** antes de processar
5. **Log eventos importantes** para debug

---

**Próximo Passo:** Implementar estas tools no workflow principal ou como sub-workflows separados conforme a complexidade do sistema.
