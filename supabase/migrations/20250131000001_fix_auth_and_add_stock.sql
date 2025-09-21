/*
# Correção do Sistema de Autenticação e Adição de Estoque

Esta migração corrige o sistema de autenticação criando automaticamente perfis de usuário
e adiciona sistema de estoque para os tamanhos dos produtos.

## Query Description: 
Esta operação criará triggers para criação automática de perfis, tabelas de estoque e 
políticas RLS necessárias. É uma operação segura que não afeta dados existentes.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Criação de trigger para auto-criação de perfis
- Tabela de estoque por produto e tamanho
- Políticas RLS para profiles
- Função para criação automática de perfis

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Perfis criados automaticamente

## Performance Impact:
- Indexes: Added for performance
- Triggers: Added for auto-profile creation
- Estimated Impact: Minimal performance impact, improves user experience
*/

-- Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Criar função para criar perfil automaticamente
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

-- Criar trigger para executar a função quando um novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criar tabela de estoque para produtos
CREATE TABLE IF NOT EXISTS public.product_stock (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES public.teams(id) ON DELETE CASCADE,
    size VARCHAR(10) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, size)
);

-- Habilitar RLS na tabela product_stock
ALTER TABLE public.product_stock ENABLE ROW LEVEL SECURITY;

-- Criar política RLS para product_stock (público para leitura)
CREATE POLICY "Anyone can view product stock"
    ON public.product_stock FOR SELECT
    TO PUBLIC
    USING (true);

-- Inserir estoque fictício para todos os produtos existentes
INSERT INTO public.product_stock (team_id, size, stock_quantity)
SELECT 
    t.id,
    s.size,
    FLOOR(RANDOM() * 20) + 5 as stock_quantity  -- Entre 5 e 24 unidades
FROM public.teams t
CROSS JOIN (
    VALUES ('P'), ('M'), ('G'), ('GG'), ('XG')
) AS s(size)
ON CONFLICT (team_id, size) DO NOTHING;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_product_stock_team_id ON public.product_stock(team_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at na tabela profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

-- Trigger para atualizar updated_at na tabela product_stock
CREATE TRIGGER update_product_stock_updated_at
    BEFORE UPDATE ON public.product_stock
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();
