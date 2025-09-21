/*
# Correção de Conflitos de Migração

Esta migração corrige conflitos de objetos já existentes e garante que o sistema
de autenticação e estoque funcione corretamente.

## Query Description:
Esta operação verifica e corrige conflitos de migração existentes, incluindo triggers,
funções e tabelas duplicadas. É uma operação de correção que não afeta dados existentes
e garante que o sistema funcione corretamente.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Corrige triggers duplicados
- Verifica e cria tabelas em falta
- Atualiza políticas RLS conforme necessário
- Popula estoque fictício se necessário

## Security Implications:
- RLS Status: Mantido/Habilitado conforme necessário
- Policy Changes: Apenas correções/atualizações
- Auth Requirements: Mantém autenticação baseada em auth.users

## Performance Impact:
- Indexes: Mantidos/Corrigidos conforme necessário
- Triggers: Corrigidos para evitar duplicação
- Estimated Impact: Mínimo - apenas correções
*/

-- ============================================================================
-- 1. CORREÇÃO DE CONFLITOS DE TRIGGERS
-- ============================================================================

-- Remover trigger existente se houver conflito e recriar
DO $$
BEGIN
    -- Drop trigger if exists
    DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
    
    -- Drop function if exists
    DROP FUNCTION IF EXISTS update_updated_at_column();
    
    -- Recreate function
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';
    
    -- Recreate trigger
    CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
END $$;

-- ============================================================================
-- 2. VERIFICAR E CRIAR TABELA PROFILES SE NÃO EXISTIR
-- ============================================================================

DO $$
BEGIN
    -- Create profiles table if not exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        CREATE TABLE profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            full_name TEXT,
            phone TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- ============================================================================
-- 3. VERIFICAR E CRIAR TABELA PRODUCT_STOCK SE NÃO EXISTIR
-- ============================================================================

DO $$
BEGIN
    -- Create product_stock table if not exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_stock') THEN
        CREATE TABLE product_stock (
            id SERIAL PRIMARY KEY,
            team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
            size TEXT NOT NULL,
            stock_quantity INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(team_id, size)
        );
    END IF;
END $$;

-- ============================================================================
-- 4. FUNÇÃO PARA CRIAÇÃO AUTOMÁTICA DE PERFIS
-- ============================================================================

-- Drop and recreate profile creation function
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'phone'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 5. CONFIGURAÇÃO DE RLS (ROW LEVEL SECURITY)
-- ============================================================================

-- Enable RLS on profiles if not already enabled
DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles') THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON profiles;

-- Create RLS policies for profiles
CREATE POLICY "Usuários podem ver seus próprios perfis" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Enable RLS on product_stock if not already enabled
DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'product_stock') THEN
        ALTER TABLE product_stock ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies and recreate for product_stock
DROP POLICY IF EXISTS "Todos podem ver estoque" ON product_stock;

-- Create RLS policy for product_stock (read-only for all)
CREATE POLICY "Todos podem ver estoque" ON product_stock
    FOR SELECT USING (true);

-- ============================================================================
-- 6. POPULAR ESTOQUE FICTÍCIO SE NECESSÁRIO
-- ============================================================================

-- Insert stock data only if table is empty
DO $$
DECLARE
    team_record RECORD;
    size_array TEXT[] := ARRAY['P', 'M', 'G', 'GG', 'XG'];
    size_item TEXT;
    stock_qty INTEGER;
BEGIN
    -- Check if product_stock table is empty
    IF NOT EXISTS (SELECT 1 FROM product_stock LIMIT 1) THEN
        -- Loop through all teams
        FOR team_record IN SELECT id FROM teams LOOP
            -- For each team, create stock for all sizes
            FOREACH size_item IN ARRAY size_array LOOP
                -- Generate random stock between 0 and 24 (some will be out of stock)
                stock_qty := FLOOR(RANDOM() * 25);
                
                INSERT INTO product_stock (team_id, size, stock_quantity)
                VALUES (team_record.id, size_item, stock_qty)
                ON CONFLICT (team_id, size) DO NOTHING;
            END LOOP;
        END LOOP;
    END IF;
END $$;

-- ============================================================================
-- 7. VERIFICAR E CRIAR TRIGGER PARA UPDATE DE PRODUCT_STOCK
-- ============================================================================

DO $$
BEGIN
    -- Create trigger for product_stock updated_at if not exists
    DROP TRIGGER IF EXISTS update_product_stock_updated_at ON product_stock;
    
    CREATE TRIGGER update_product_stock_updated_at
        BEFORE UPDATE ON product_stock
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
END $$;

-- ============================================================================
-- 8. VERIFICAÇÃO FINAL E LOGS
-- ============================================================================

-- Verificar se tudo foi criado corretamente
DO $$
DECLARE
    profiles_count INTEGER;
    stock_count INTEGER;
    teams_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profiles_count FROM profiles;
    SELECT COUNT(*) INTO stock_count FROM product_stock;
    SELECT COUNT(*) INTO teams_count FROM teams;
    
    RAISE NOTICE 'Migração completada com sucesso!';
    RAISE NOTICE 'Perfis criados: %', profiles_count;
    RAISE NOTICE 'Registros de estoque: %', stock_count;
    RAISE NOTICE 'Times cadastrados: %', teams_count;
END $$;
