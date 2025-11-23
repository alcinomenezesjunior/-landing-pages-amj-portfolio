-- ═══════════════════════════════════════════════════════════════
-- ESSENZA PRIME CLINIC - DATABASE SCHEMA
-- Supabase (PostgreSQL)
-- Versão: 2.0
-- Data: 21 Novembro 2025
-- ═══════════════════════════════════════════════════════════════

-- Extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- TABELA: clients
-- Armazena informações dos clientes que interagem com o chatbot
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

-- Index para busca por telefone (campo mais usado)
CREATE INDEX idx_clients_phone ON clients(phone);

-- ═══════════════════════════════════════════════════════════════
-- TABELA: appointments
-- Regista todas as marcações criadas pelo chatbot
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
    -- Status possíveis: pending_payment, confirmed, completed, no_show, cancelled
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

-- Indexes para queries comuns
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_professional ON appointments(professional);

-- ═══════════════════════════════════════════════════════════════
-- TABELA: conversations
-- Mantém contexto de conversa para cada cliente
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb,
    -- Array de objetos {role, content, timestamp}
    current_state VARCHAR(50) DEFAULT 'inicio',
    -- States: inicio, exploring, choosing_service, choosing_slot,
    --         pending_payment, confirmed, post_care
    context JSONB DEFAULT '{}'::jsonb,
    -- Context: {service_discussed, slot_selected, temp_booking, etc}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para busca por telefone
CREATE INDEX idx_conversations_phone ON conversations(phone);

-- ═══════════════════════════════════════════════════════════════
-- TABELA: pending_upsells
-- Guarda ofertas de upsell não aceites para retry posterior
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
-- Fila de mensagens agendadas (lembretes, confirmações, follow-ups)
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

-- Index para mensagens pendentes (query mais comum)
CREATE INDEX idx_scheduled_messages_pending
ON scheduled_messages(scheduled_for)
WHERE sent = FALSE;

-- ═══════════════════════════════════════════════════════════════
-- TABELA: attendance_confirmations
-- Regista tentativas de confirmação de comparecimento
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
-- TABELA: professionals
-- Lista de profissionais da clínica com seus horários e serviços
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    services TEXT[], -- Array de serviços que realiza
    schedule JSONB,  -- Horário por dia da semana
    bio TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir profissionais da Essenza Prime Clinic
INSERT INTO professionals (name, role, services, schedule, bio) VALUES

('Dr. Gustavo Mendonça', 'Médico Esteta',
 ARRAY['Peeling Médio', 'Peeling Profundo', 'Harmonização Facial', 'Preenchimentos'],
 '{"monday": {"start": "10:00", "end": "16:00"}, "tuesday": {"start": "10:00", "end": "16:00"}, "wednesday": {"start": "10:00", "end": "16:00"}, "thursday": {"start": "10:00", "end": "16:00"}, "friday": {"start": "10:00", "end": "16:00"}}'::jsonb,
 'Médico especialista em estética facial com mais de 10 anos de experiência em procedimentos minimamente invasivos.'),

('Dra. Bruna Cortez', 'Biomédica Esteta',
 ARRAY['Microagulhamento', 'Peeling Superficial', 'Peeling Médio', 'Limpeza de Pele Profunda', 'Radiofrequência Facial', 'Radiofrequência Corporal'],
 '{"tuesday": {"start": "13:00", "end": "19:00"}, "thursday": {"start": "13:00", "end": "19:00"}, "friday": {"start": "13:00", "end": "19:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb,
 'Biomédica especializada em procedimentos estéticos avançados e tecnologias de rejuvenescimento.'),

('Sra. Sílvia Ramos', 'Esteticista Facial',
 ARRAY['Limpeza de Pele Profunda', 'Massagem Terapêutica', 'Radiofrequência Facial'],
 '{"monday": {"start": "10:00", "end": "19:00"}, "wednesday": {"start": "10:00", "end": "19:00"}, "friday": {"start": "10:00", "end": "19:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb,
 'Esteticista com foco em tratamentos faciais personalizados e cuidados com a pele.'),

('Sra. Carla Magalhães', 'Esteticista Corporal',
 ARRAY['Massagem Modeladora', 'Drenagem Linfática', 'Criolipólise', 'Radiofrequência Corporal', 'Ultrassom Corporal'],
 '{"monday": {"start": "13:00", "end": "19:00"}, "tuesday": {"start": "13:00", "end": "19:00"}, "wednesday": {"start": "13:00", "end": "19:00"}, "thursday": {"start": "13:00", "end": "19:00"}, "friday": {"start": "13:00", "end": "19:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb,
 'Especialista em tratamentos corporais para redução de medidas e modelação corporal.'),

('Sra. Inês Duarte', 'Especialista Micropigmentação',
 ARRAY['Microblading Sobrancelhas', 'Micropigmentação Lábios', 'Micropigmentação Eyeliner'],
 '{"monday": {"start": "10:00", "end": "16:00"}, "wednesday": {"start": "10:00", "end": "16:00"}, "thursday": {"start": "10:00", "end": "16:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb,
 'Especialista certificada em micropigmentação estética com técnicas de última geração.'),

('Sra. Larissa Galvão', 'Esteticista Multidisciplinar',
 ARRAY['Limpeza de Pele Profunda', 'Peeling Superficial', 'Microagulhamento', 'Massagem Detox', 'Criolipólise'],
 '{"tuesday": {"start": "10:00", "end": "19:00"}, "friday": {"start": "10:00", "end": "13:00"}}'::jsonb,
 'Esteticista com experiência em diversas técnicas faciais e corporais.'),

('Sr. Pedro Moreira', 'Terapeuta Corporal',
 ARRAY['Massagem Terapêutica', 'Radiofrequência Corporal', 'Criolipólise'],
 '{"monday": {"start": "16:00", "end": "19:00"}, "wednesday": {"start": "16:00", "end": "19:00"}, "friday": {"start": "16:00", "end": "19:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb,
 'Terapeuta especializado em massagens terapêuticas e tratamentos de relaxamento.'),

('Sra. Renata Pinto', 'Assistente/Consultora',
 ARRAY['Avaliação Inicial'],
 '{"monday": {"start": "10:00", "end": "19:00"}, "tuesday": {"start": "10:00", "end": "19:00"}, "wednesday": {"start": "10:00", "end": "19:00"}, "thursday": {"start": "10:00", "end": "19:00"}, "friday": {"start": "10:00", "end": "19:00"}, "saturday": {"start": "10:00", "end": "14:00"}}'::jsonb,
 'Consultora de estética que realiza avaliações iniciais e orienta clientes sobre tratamentos adequados.');

-- ═══════════════════════════════════════════════════════════════
-- TABELA: services
-- Catálogo completo de serviços oferecidos pela clínica
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
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir serviços da Essenza Prime Clinic

-- ═══════════════════════════════════════════════════════════════
-- TRATAMENTOS FACIAIS
-- ═══════════════════════════════════════════════════════════════

INSERT INTO services (name, category, duration_min, duration_max, price, deposit, description, contraindications, pre_care, post_care, upsell_service, upsell_discount, downsell_service) VALUES

('Limpeza de Pele Profunda', 'Facial', 60, 90, 40, 20,
 'Higienização profunda, esfoliação suave, extração de comedões, máscara purificante e hidratação intensiva. Ideal para todos os tipos de pele.',
 ARRAY['Infecções ativas na pele', 'Lesões abertas', 'Dermatites severas', 'Herpes labial ativa'],
 'Nenhuma preparação especial necessária. Pode vir com maquilhagem que será removida durante o tratamento.',
 'Evitar maquilhagem nas primeiras 24 horas. Aplicar protetor solar SPF 50+ diariamente. Evitar sauna, piscina e exercício intenso por 48 horas. Hidratar a pele 2-3 vezes ao dia.',
 'Peeling Superficial', 10, NULL),

('Peeling Superficial', 'Facial', 30, 45, 80, 40,
 'Renovação celular com ácidos suaves (glicólico, salicílico ou láctico). Melhora textura, uniformiza tom e reduz manchas superficiais.',
 ARRAY['Gestação', 'Lactação', 'Uso recente de isotretinoína', 'Queimadura solar', 'Rosácea severa'],
 'Suspender uso de ácidos e retinoides 3 dias antes do tratamento. Evitar exposição solar 7 dias antes.',
 'Evitar sol direto por 7 dias. Protetor solar SPF 50+ obrigatório. Hidratar intensamente 2-3 vezes ao dia. Não usar ácidos ou esfoliantes por 5 dias. Pode ocorrer descamação leve.',
 'Radiofrequência Facial', 10, 'Limpeza de Pele Profunda'),

('Peeling Médio', 'Facial', 45, 60, 160, 80,
 'Tratamento profundo com TCA ou ácido retinóico para manchas persistentes, cicatrizes de acne e rugas moderadas. Resultados mais significativos.',
 ARRAY['Gestação', 'Lactação', 'Herpes ativa', 'Doenças autoimunes', 'Queloides', 'Infecções ativas'],
 'Suspender ácidos e retinoides 7-10 dias antes. Consulta prévia obrigatória. Teste de sensibilidade. Profilaxia antiviral se histórico de herpes.',
 'Cuidados intensivos por 2 semanas. Não arrancar descamações. Protetor solar SPF 50+ rigoroso. Evitar sol direto por 30 dias. Hidratar constantemente. Vermelhidão e descamação esperadas por 7-10 dias.',
 NULL, NULL, 'Peeling Superficial'),

('Radiofrequência Facial', 'Facial', 30, 45, 100, 50,
 'Tecnologia que aquece camadas profundas da pele estimulando produção de colágeno. Combate flacidez, melhora contorno facial e reduz linhas finas.',
 ARRAY['Marcapassos', 'Implantes metálicos na face', 'Gestação', 'Problemas de tireoide não controlados'],
 'Não usar ácidos ou retinoides 24 horas antes. Vir com pele limpa sem maquilhagem.',
 'Vermelhidão normal por 2-4 horas. Evitar sauna e banhos muito quentes por 48 horas. Hidratar bem a pele. Resultados progressivos ao longo de 3 meses.',
 'Microagulhamento', 10, NULL),

('Microagulhamento', 'Facial', 45, 60, 120, 60,
 'Indução percutânea de colágeno através de microlesões controladas. Trata cicatrizes de acne, rugas, manchas e melhora textura geral da pele.',
 ARRAY['Infecções ativas', 'Queloides', 'Diabetes descontrolada', 'Uso de anticoagulantes', 'Herpes ativa'],
 'Suspender ácidos e retinoides 5 dias antes. Não fazer depilação facial 48h antes.',
 'Evitar exposição solar por 7 dias. Não usar maquilhagem por 48 horas. Hidratar constantemente. Vermelhidão esperada por 24-48h. Protetor solar SPF 50+ obrigatório.',
 NULL, NULL, 'Radiofrequência Facial'),

('Ultrassom Microfocado (HIFU)', 'Facial', 60, 90, 200, 100,
 'Tecnologia de ultrassom focado para lifting não cirúrgico. Atinge camada profunda (SMAS) estimulando produção intensa de colágeno.',
 ARRAY['Marcapassos', 'Implantes metálicos', 'Gestação', 'Epilepsia', 'Inflamações ativas'],
 'Vir com pele limpa e bem hidratada. Remover toda maquilhagem.',
 'Possível vermelhidão e leve inchaço por 24-48 horas. Resultados progressivos ao longo de 3-6 meses. Hidratar bem.',
 NULL, NULL, NULL),

('Harmonização Facial', 'Facial', 60, 90, 600, 300,
 'Procedimento médico com preenchedores de ácido hialurónico para equilíbrio e proporção facial. Melhora volume, contornos e simetria.',
 ARRAY['Gestação', 'Lactação', 'Infecções ativas', 'Alergia a ácido hialurónico', 'Doenças autoimunes'],
 'Consulta médica prévia obrigatória. Evitar anti-inflamatórios e álcool 3 dias antes.',
 'Evitar exercício físico intenso por 24-48 horas. Não massajar área tratada. Possível inchaço e pequenos hematomas. Gelo se necessário. Evitar sol direto.',
 NULL, NULL, 'Radiofrequência Facial');

-- ═══════════════════════════════════════════════════════════════
-- TRATAMENTOS CORPORAIS
-- ═══════════════════════════════════════════════════════════════

INSERT INTO services (name, category, duration_min, duration_max, price, deposit, description, contraindications, pre_care, post_care, upsell_service, upsell_discount, downsell_service) VALUES

('Massagem Terapêutica', 'Corporal', 50, 60, 50, 25,
 'Massagem relaxante para alívio de tensões musculares, melhora circulação e proporciona bem-estar geral. Técnicas manuais personalizadas.',
 ARRAY['Febre', 'Infecções de pele', 'Trombose venosa profunda', 'Fraturas recentes'],
 'Nenhuma preparação especial necessária. Evitar refeição pesada antes.',
 'Beber bastante água para eliminar toxinas. Evitar banho muito quente imediatamente após. Descansar se possível.',
 'Drenagem Linfática', 15, NULL),

('Massagem Modeladora', 'Corporal', 50, 60, 60, 30,
 'Técnica intensiva com manobras vigorosas para combater celulite, gordura localizada e flacidez. Melhora contorno corporal.',
 ARRAY['Varizes severas', 'Trombose', 'Gestação', 'Problemas renais'],
 'Nenhuma preparação especial. Hidratar-se bem no dia.',
 'Possível vermelhidão temporária. Hidratar a pele. Beber muita água. Evitar alimentos muito salgados.',
 NULL, NULL, 'Massagem Terapêutica'),

('Drenagem Linfática', 'Corporal', 50, 60, 60, 30,
 'Massagem suave que estimula o sistema linfático. Reduz retenção de líquidos, inchaço e melhora circulação. Ideal pós-operatório.',
 ARRAY['Infecções agudas', 'Insuficiência cardíaca grave', 'Trombose ativa', 'Hipotensão severa'],
 'Nenhuma preparação especial.',
 'Beber muita água (2-3 litros) nas 24h seguintes. Evitar sal. Urinar frequentemente é normal. Alimentação leve.',
 NULL, NULL, NULL),

('Radiofrequência Corporal', 'Corporal', 45, 60, 100, 50,
 'Tecnologia de aquecimento profundo que combate flacidez, celulite e gordura localizada. Estimula colágeno e melhora textura da pele.',
 ARRAY['Marcapassos', 'Implantes metálicos', 'Gestação', 'Problemas de tireoide'],
 'Nenhuma preparação especial. Hidratar bem a pele.',
 'Hidratar intensamente a zona tratada. Evitar sauna e banhos muito quentes por 48 horas. Beber água.',
 NULL, NULL, NULL),

('Criolipólise', 'Corporal', 60, 90, 120, 60,
 'Redução de gordura localizada através de congelamento controlado das células adiposas. Resultados progressivos e duradouros.',
 ARRAY['Crioglobulinemia', 'Urticária ao frio', 'Gestação', 'Hérnia na região', 'Neuropatia'],
 'Nenhuma preparação especial. Não fazer dietas extremas antes.',
 'Massagem vigorosa na zona tratada recomendada após 2 semanas. Resultados visíveis em 30-60 dias. Possível vermelhidão e dormência temporária.',
 'Radiofrequência Corporal', 15, NULL),

('Massagem Detox', 'Corporal', 50, 60, 55, 28,
 'Massagem drenante combinada com técnicas de desintoxicação. Elimina toxinas, reduz inchaço e melhora qualidade da pele.',
 ARRAY['Infecções agudas', 'Problemas renais graves'],
 'Nenhuma preparação especial.',
 'Beber muita água. Evitar álcool e alimentos processados nas 24h seguintes.',
 NULL, NULL, NULL);

-- ═══════════════════════════════════════════════════════════════
-- MICROPIGMENTAÇÃO
-- ═══════════════════════════════════════════════════════════════

INSERT INTO services (name, category, duration_min, duration_max, price, deposit, description, contraindications, pre_care, post_care, upsell_service, upsell_discount, downsell_service) VALUES

('Microblading Sobrancelhas', 'Micropigmentação', 90, 120, 250, 125,
 'Técnica fio a fio que simula pelos naturais. Resultado hiper-realista que dura 12-18 meses. Inclui design personalizado e retoque após 30 dias.',
 ARRAY['Gestação', 'Lactação', 'Diabetes descontrolada', 'Queloides', 'Psoríase na área', 'Hemofilia'],
 'Não depilar ou tingir sobrancelhas 7 dias antes. Evitar sol direto. Não consumir álcool 24h antes. Suspender anticoagulantes se médico permitir.',
 'Não molhar sobrancelhas por 7 dias. Aplicar pomada cicatrizante 3 vezes ao dia. Não coçar ou arrancar crostas. Não fazer sauna, piscina ou praia por 15 dias. Proteger do sol.',
 'Micropigmentação Lábios', 10, NULL),

('Micropigmentação Lábios', 'Micropigmentação', 90, 120, 280, 140,
 'Contorno, preenchimento ou efeito aquarela para lábios mais definidos e com cor. Resultado natural que dura 12-24 meses. Inclui retoque.',
 ARRAY['Herpes ativa', 'Gestação', 'Lactação', 'Queloides', 'Psoríase labial'],
 'Profilaxia antiviral obrigatória se histórico de herpes (iniciar 3 dias antes). Esfoliar lábios suavemente. Hidratar bem.',
 'Não molhar lábios por 7 dias. Pomada cicatrizante constantemente. Evitar alimentos ácidos, picantes e muito quentes. Não beijar. Não usar batom por 10 dias.',
 NULL, NULL, NULL),

('Micropigmentação Eyeliner', 'Micropigmentação', 60, 90, 240, 120,
 'Delineado permanente nas pálpebras para olhar mais expressivo. Efeito natural ou marcado conforme desejado. Dura 12-18 meses.',
 ARRAY['Glaucoma', 'Inflamação ocular ativa', 'Gestação', 'Cirurgia ocular recente', 'Blefarite'],
 'Remover extensões de pestanas 7 dias antes. Não usar lentes de contato 24h antes e 48h depois. Não usar maquilhagem nos olhos.',
 'Não molhar olhos por 7 dias. Não usar maquilhagem na zona por 10 dias. Óculos de sol obrigatório. Compressas frias se inchaço. Não coçar.',
 NULL, NULL, NULL);

-- ═══════════════════════════════════════════════════════════════
-- CONSULTAS
-- ═══════════════════════════════════════════════════════════════

INSERT INTO services (name, category, duration_min, duration_max, price, deposit, description, contraindications, pre_care, post_care, upsell_service, upsell_discount, downsell_service) VALUES

('Avaliação Inicial', 'Consulta', 30, 30, 0, 0,
 'Consulta gratuita para avaliação de necessidades, análise da pele e recomendação de tratamentos personalizados.',
 ARRAY[]::TEXT[],
 'Nenhuma preparação necessária. Pode vir com maquilhagem.',
 'Nenhum cuidado especial após a consulta.',
 NULL, NULL, NULL);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS E TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Função para actualizar updated_at automaticamente
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

-- Função para actualizar estatísticas do cliente quando marcação é completada
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
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

-- Habilitar RLS em todas as tabelas sensíveis
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_upsells ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_confirmations ENABLE ROW LEVEL SECURITY;

-- Política para service_role (acesso total via n8n)
CREATE POLICY "Service role has full access to clients"
    ON clients FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to appointments"
    ON appointments FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to conversations"
    ON conversations FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to pending_upsells"
    ON pending_upsells FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to scheduled_messages"
    ON scheduled_messages FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to attendance_confirmations"
    ON attendance_confirmations FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════════
-- VIEWS ÚTEIS
-- ═══════════════════════════════════════════════════════════════

-- View para próximas marcações
CREATE VIEW upcoming_appointments AS
SELECT
    a.id,
    a.date,
    a.time_start,
    a.service,
    a.professional,
    a.status,
    c.name as client_name,
    c.phone as client_phone,
    c.email as client_email
FROM appointments a
JOIN clients c ON a.client_id = c.id
WHERE a.date >= CURRENT_DATE
  AND a.status IN ('confirmed', 'pending_payment')
ORDER BY a.date, a.time_start;

-- View para mensagens pendentes de hoje
CREATE VIEW messages_to_send_today AS
SELECT
    sm.id,
    sm.appointment_id,
    sm.client_phone,
    sm.message_type,
    sm.scheduled_for,
    sm.message_content,
    a.service,
    c.name as client_name
FROM scheduled_messages sm
JOIN appointments a ON sm.appointment_id = a.id
JOIN clients c ON a.client_id = c.id
WHERE DATE(sm.scheduled_for) = CURRENT_DATE
  AND sm.sent = FALSE
ORDER BY sm.scheduled_for;

-- View para estatísticas gerais
CREATE VIEW clinic_stats AS
SELECT
    COUNT(DISTINCT c.id) as total_clients,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN c.id END) as clients_with_appointments,
    COUNT(*) FILTER (WHERE a.status = 'completed') as total_appointments_completed,
    COUNT(*) FILTER (WHERE a.status = 'no_show') as total_no_shows,
    COUNT(*) FILTER (WHERE a.status = 'cancelled') as total_cancelled,
    ROUND(AVG(a.price) FILTER (WHERE a.status = 'completed'), 2) as avg_ticket,
    SUM(a.price) FILTER (WHERE a.status = 'completed') as total_revenue
FROM clients c
LEFT JOIN appointments a ON c.id = a.client_id;

-- ═══════════════════════════════════════════════════════════════
-- FIM DO SCHEMA
-- ═══════════════════════════════════════════════════════════════

-- Para verificar que tudo foi criado corretamente:
SELECT 'Schema created successfully!' as status;
