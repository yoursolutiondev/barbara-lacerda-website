-- ============================================
-- SCHEMA SUPABASE - BÁRBARA LACERDA
-- Sistema de Marcações para Salão de Cabeleireiro
-- ============================================

-- TABELA: services (Serviços)
-- Armazena todos os serviços oferecidos pelo salão
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- duração em minutos
  price DECIMAL(10, 2), -- preço em euros (pode ser NULL para "sob consulta")
  category VARCHAR(100), -- ex: "Cabelo", "Nails", "Estética"
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: professionals (Profissionais)
-- Armazena informações sobre cabeleireiras e outras profissionais
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  specialty VARCHAR(255), -- ex: "Especialista em Madeixas"
  bio TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: professional_services (Relação Profissionais-Serviços)
-- Define quais serviços cada profissional pode realizar
CREATE TABLE professional_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(professional_id, service_id)
);

-- TABELA: working_hours (Horário de Trabalho)
-- Define os horários de trabalho de cada profissional
CREATE TABLE working_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Domingo, 1=Segunda, etc
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: clients (Clientes)
-- Armazena informações dos clientes
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  birth_date DATE,
  notes TEXT, -- observações sobre preferências, alergias, etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: bookings (Marcações)
-- Armazena todas as marcações do salão
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled, no_show
  client_notes TEXT, -- observações do cliente
  internal_notes TEXT, -- observações internas (só visível para admin)
  cancellation_reason TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CHECK (end_time > start_time),
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show'))
);

-- TABELA: blocked_times (Horários Bloqueados)
-- Para bloqueiar horários específicos (férias, eventos, etc)
CREATE TABLE blocked_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CHECK (end_datetime > start_datetime)
);

-- TABELA: reviews (Avaliações)
-- Avaliações dos clientes sobre os serviços
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: gallery (Galeria)
-- Fotos do portfolio do salão
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  description TEXT,
  image_url TEXT NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- ============================================

CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_professional ON bookings(professional_id);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_working_hours_professional ON working_hours(professional_id);
CREATE INDEX idx_blocked_times_professional ON blocked_times(professional_id);
CREATE INDEX idx_professional_services_professional ON professional_services(professional_id);
CREATE INDEX idx_professional_services_service ON professional_services(service_id);

-- ============================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em tabelas relevantes
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_working_hours_updated_at BEFORE UPDATE ON working_hours
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ============================================

-- Ativar RLS em todas as tabelas
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (dados que clientes podem ver)
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read professionals" ON professionals FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read professional_services" ON professional_services FOR SELECT USING (TRUE);
CREATE POLICY "Public read working_hours" ON working_hours FOR SELECT USING (TRUE);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (TRUE);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (is_public = TRUE);

-- Políticas para clientes (podem ver e criar suas próprias marcações)
CREATE POLICY "Clients can read own bookings" ON bookings 
  FOR SELECT USING (client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Clients can create bookings" ON bookings 
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Clients can update own bookings" ON bookings 
  FOR UPDATE USING (client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'));

-- Políticas de administrador (acesso total)
-- Nota: Você precisará criar uma função is_admin() baseada no seu sistema de autenticação
CREATE POLICY "Admin full access services" ON services FOR ALL USING (is_admin());
CREATE POLICY "Admin full access professionals" ON professionals FOR ALL USING (is_admin());
CREATE POLICY "Admin full access bookings" ON bookings FOR ALL USING (is_admin());
CREATE POLICY "Admin full access clients" ON clients FOR ALL USING (is_admin());
CREATE POLICY "Admin full access blocked_times" ON blocked_times FOR ALL USING (is_admin());
CREATE POLICY "Admin full access gallery" ON gallery FOR ALL USING (is_admin());

-- ============================================
-- FUNÇÃO HELPER: Verificar disponibilidade
-- ============================================

CREATE OR REPLACE FUNCTION check_availability(
  p_professional_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
  is_available BOOLEAN;
BEGIN
  -- Verifica se há conflito com outras marcações
  SELECT NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE professional_id = p_professional_id
      AND booking_date = p_date
      AND status NOT IN ('cancelled', 'no_show')
      AND (
        (start_time <= p_start_time AND end_time > p_start_time)
        OR (start_time < p_end_time AND end_time >= p_end_time)
        OR (start_time >= p_start_time AND end_time <= p_end_time)
      )
  ) AND NOT EXISTS (
    -- Verifica se há horários bloqueados
    SELECT 1 FROM blocked_times
    WHERE professional_id = p_professional_id
      AND (p_date || ' ' || p_start_time)::TIMESTAMP >= start_datetime
      AND (p_date || ' ' || p_end_time)::TIMESTAMP <= end_datetime
  ) INTO is_available;
  
  RETURN is_available;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNÇÃO HELPER: Obter horários disponíveis
-- ============================================

CREATE OR REPLACE FUNCTION get_available_slots(
  p_professional_id UUID,
  p_date DATE,
  p_duration INTEGER -- duração em minutos
)
RETURNS TABLE (
  slot_time TIME
) AS $$
DECLARE
  current_time TIME;
  end_of_day TIME;
  slot_duration INTERVAL;
BEGIN
  slot_duration := (p_duration || ' minutes')::INTERVAL;
  
  -- Obter horário de trabalho para o dia da semana
  SELECT start_time, end_time INTO current_time, end_of_day
  FROM working_hours
  WHERE professional_id = p_professional_id
    AND day_of_week = EXTRACT(DOW FROM p_date)
    AND is_available = TRUE
  LIMIT 1;
  
  -- Gerar slots de 30 em 30 minutos
  WHILE current_time < end_of_day - slot_duration LOOP
    IF check_availability(
      p_professional_id, 
      p_date, 
      current_time, 
      current_time + slot_duration
    ) THEN
      slot_time := current_time;
      RETURN NEXT;
    END IF;
    current_time := current_time + INTERVAL '30 minutes';
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DADOS INICIAIS (SEEDS)
-- ============================================

-- Inserir serviços
INSERT INTO services (name, description, duration, price, category) VALUES
('Corte Feminino', 'Corte personalizado e modelado', 60, 35.00, 'Cabelo'),
('Coloração Completa', 'Coloração total com produtos premium', 120, 70.00, 'Cabelo'),
('Madeixas / Balaiagem', 'Técnicas modernas de iluminação', 180, 90.00, 'Cabelo'),
('Extensão Capilar', 'Mega hair com fios premium', 240, NULL, 'Cabelo'),
('Tratamento Capilar', 'Hidratação profunda e reconstrução', 90, 50.00, 'Cabelo'),
('Penteado / Styling', 'Penteados para eventos especiais', 60, 45.00, 'Cabelo'),
('Manicure', 'Cuidado completo das unhas', 45, 15.00, 'Nails'),
('Design de Sobrancelhas', 'Modelação e design profissional', 30, 12.00, 'Estética');

-- Inserir profissionais
INSERT INTO professionals (name, specialty, bio) VALUES
('Bárbara Lacerda', 'Especialista em Madeixas e Coloração', 'Fundadora do salão, especialista em colorimetria e técnicas modernas'),
('Carla Silva', 'Cortes e Penteados', 'Especialista em cortes modernos e penteados para eventos'),
('Sara Costa', 'Estética e Sobrancelhas', 'Profissional de estética, design de sobrancelhas e manicure');

-- Horários de trabalho padrão (Terça a Sábado, 10:00-20:00)
-- Terça (2)
INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time)
SELECT id, 2, '10:00', '20:00' FROM professionals;

-- Quarta (3)
INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time)
SELECT id, 3, '10:00', '20:00' FROM professionals;

-- Quinta (4)
INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time)
SELECT id, 4, '10:00', '20:00' FROM professionals;

-- Sexta (5)
INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time)
SELECT id, 5, '10:00', '20:00' FROM professionals;

-- Sábado (6)
INSERT INTO working_hours (professional_id, day_of_week, start_time, end_time)
SELECT id, 6, '10:00', '20:00' FROM professionals;

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Marcações com informações completas
CREATE VIEW bookings_detailed AS
SELECT 
  b.id,
  b.booking_date,
  b.start_time,
  b.end_time,
  b.status,
  c.name AS client_name,
  c.phone AS client_phone,
  c.email AS client_email,
  p.name AS professional_name,
  s.name AS service_name,
  s.price AS service_price,
  b.client_notes,
  b.internal_notes,
  b.created_at
FROM bookings b
JOIN clients c ON b.client_id = c.id
LEFT JOIN professionals p ON b.professional_id = p.id
LEFT JOIN services s ON b.service_id = s.id;

-- View: Estatísticas diárias
CREATE VIEW daily_stats AS
SELECT 
  booking_date,
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
  SUM(s.price) as total_revenue
FROM bookings b
LEFT JOIN services s ON b.service_id = s.id
GROUP BY booking_date
ORDER BY booking_date DESC;