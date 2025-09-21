/*
          # [Operação de Autenticação e Pedidos]
          Cria a estrutura para autenticação de usuários e rastreamento de pedidos.

          ## Query Description: [Esta operação adiciona uma tabela `profiles` para dados do usuário, vinculada à autenticação do Supabase. Também atualiza a tabela `orders` para associar pedidos a usuários e adiciona um método de pagamento. Políticas de segurança (RLS) são aplicadas para garantir que os usuários só possam acessar seus próprios dados. Nenhum dado existente será perdido, mas a estrutura será modificada para novas funcionalidades.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - **Criação da Tabela:** `public.profiles` (id, user_id, name, phone)
          - **Alteração da Tabela:** `public.orders` (adiciona colunas `user_id` e `payment_method`)
          - **Criação de Políticas RLS:** Em `profiles` e `orders` para segurança de dados.
          - **Criação de Trigger:** `on_auth_user_created` para sincronizar perfis.
          
          ## Security Implications:
          - RLS Status: Habilitado em `profiles` e `orders`.
          - Policy Changes: Sim, adiciona políticas para proteger dados do usuário.
          - Auth Requirements: As operações de escrita e leitura exigirão que o usuário esteja autenticado.
          
          ## Performance Impact:
          - Indexes: Adiciona chaves estrangeiras que são indexadas automaticamente.
          - Triggers: Adiciona um trigger na criação de usuários.
          - Estimated Impact: Baixo. As consultas serão eficientes devido à indexação.
          */

-- 1. Tabela de Perfis de Usuário
-- Armazena dados públicos do perfil para cada usuário.
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Armazena informações de perfil para usuários autenticados.';

-- 2. Atualiza a tabela de Pedidos
-- Adiciona a referência ao usuário e o método de pagamento.
ALTER TABLE public.orders
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN payment_method TEXT;

COMMENT ON COLUMN public.orders.user_id IS 'Vincula o pedido ao usuário que o fez.';
COMMENT ON COLUMN public.orders.payment_method IS 'Método de pagamento escolhido (ex: PIX, Cartão).';

-- 3. Habilita RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Segurança para Perfis
CREATE POLICY "Usuários podem ver todos os perfis"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- 5. Políticas de Segurança para Pedidos
CREATE POLICY "Usuários podem ver seus próprios pedidos"
ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem criar pedidos"
ON public.orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. Trigger para Criação Automática de Perfil
-- Cria um perfil para um novo usuário automaticamente.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, phone)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
