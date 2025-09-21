/*
          # [Operation Name]
          Adicionar campo de saldo e preparar para dashboard

          ## Query Description: [Esta migração adiciona um campo `balance` à tabela `profiles` para gerenciar o saldo dos usuários. Também garante que as políticas de segurança permitam que os usuários acessem seu próprio saldo. Essa alteração é fundamental para a funcionalidade do painel do revendedor.]

          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]

          ## Structure Details:
          - Tabela afetada: `public.profiles`
          - Coluna adicionada: `balance` (numeric(10, 2), default 0.00)

          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [No]
          - Auth Requirements: [Usuário logado para acessar seu perfil]

          ## Performance Impact:
          - Indexes: [Nenhum]
          - Triggers: [Nenhum]
          - Estimated Impact: [Baixo. Apenas adiciona uma nova coluna com um valor padrão.]
          */

-- Adiciona a coluna de saldo na tabela de perfis se ela não existir
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00;

-- Garante que a política de seleção para perfis próprios está ativa
-- Isso permite que os usuários leiam seu próprio saldo
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);
