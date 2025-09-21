/*
# Migração Corretiva: Sistema de Autenticação e Estoque
Correção final para resolver conflitos de triggers e implementar sistema de estoque

## Query Description: 
Esta operação corrige problemas de sintaxe SQL e implementa de forma segura:
1. Sistema de autenticação com criação automática de perfis
2. Tabela de estoque de produtos com dados fictícios
3. Políticas RLS adequadas para segurança
A operação é segura e não afeta dados existentes.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Tabelas: profiles, product_stock
- Triggers: handle_new_user, update_profiles_updated_at
- Funções: handle_new_user()
- Políticas RLS: Para profiles e product_stock

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Baseado em auth.users

## Performance Impact:
- Indexes: Adicionados para otimização
- Triggers: Criados para automação
- Estimated Impact: Baixo impacto, melhorias de performance
*/

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Criar função para atualizar updated_at se não existir
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para lidar com novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger para novos usuários
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Habilitar RLS na tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Criar tabela de estoque se não existir
CREATE TABLE IF NOT EXISTS product_stock (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    size TEXT NOT NULL CHECK (size IN ('P', 'M', 'G', 'GG', 'XG')),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, size)
);

-- Criar trigger para atualizar updated_at na tabela product_stock
DROP TRIGGER IF EXISTS update_product_stock_updated_at ON product_stock;
CREATE TRIGGER update_product_stock_updated_at
    BEFORE UPDATE ON product_stock
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS na tabela product_stock
ALTER TABLE product_stock ENABLE ROW LEVEL SECURITY;

-- Política para visualizar estoque (público)
DROP POLICY IF EXISTS "Anyone can view stock" ON product_stock;
CREATE POLICY "Anyone can view stock"
    ON product_stock FOR SELECT
    TO public
    USING (true);

-- Inserir dados de estoque fictício apenas se a tabela estiver vazia
DO $$
DECLARE
    team_record RECORD;
    size_option TEXT;
    stock_count INTEGER;
BEGIN
    -- Verificar se já existem dados de estoque
    IF NOT EXISTS (SELECT 1 FROM product_stock LIMIT 1) THEN
        -- Para cada time existente
        FOR team_record IN SELECT id FROM teams LOOP
            -- Para cada tamanho
            FOR size_option IN SELECT unnest(ARRAY['P', 'M', 'G', 'GG', 'XG']) LOOP
                -- Gerar estoque aleatório (0 a 24 unidades)
                stock_count := floor(random() * 25)::INTEGER;
                
                INSERT INTO product_stock (team_id, size, stock_quantity)
                VALUES (team_record.id, size_option, stock_count)
                ON CONFLICT (team_id, size) DO NOTHING;
            END LOOP;
        END LOOP;
    END IF;
END
$$;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_product_stock_team_id ON product_stock(team_id);
CREATE INDEX IF NOT EXISTS idx_product_stock_size ON product_stock(size);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
