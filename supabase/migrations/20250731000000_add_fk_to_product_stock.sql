/*
# [Fix] Adicionar Relação de Chave Estrangeira
Corrige o erro "Could not find a relationship" ao adicionar a chave estrangeira que faltava entre as tabelas `product_stock` e `teams`.

## Descrição da Query:
Esta operação estabelece uma relação formal entre o estoque de produtos e os times. Ela garante que cada entrada de estoque esteja associada a um time válido e permite que o Supabase realize junções (joins) entre as tabelas de forma eficiente. A cláusula `ON DELETE CASCADE` garante que, se um time for removido, todas as suas entradas de estoque também serão removidas, mantendo a integridade dos dados.

## Metadados:
- Categoria do Esquema: "Estrutural"
- Nível de Impacto: "Baixo"
- Requer Backup: false
- Reversível: true (removendo a restrição)

## Detalhes da Estrutura:
- Tabela Afetada: `public.product_stock`
- Coluna Afetada: `team_id`
- Restrição Adicionada: `product_stock_team_id_fkey` (FOREIGN KEY)

## Implicações de Segurança:
- Status RLS: Inalterado
- Mudanças de Política: Não
- Requisitos de Autenticação: Nenhum

## Impacto no Desempenho:
- Índices: Adiciona um índice implícito na coluna `team_id` da tabela `product_stock`, o que pode melhorar o desempenho das consultas que filtram ou juntam por `team_id`.
- Triggers: Nenhum
- Impacto Estimado: Positivo para consultas que juntam `teams` e `product_stock`.
*/

-- Adiciona a restrição de chave estrangeira para criar a relação entre product_stock e teams.
-- Isso permite que o PostgREST (API do Supabase) identifique e use a relação para joins.
ALTER TABLE public.product_stock
ADD CONSTRAINT product_stock_team_id_fkey
FOREIGN KEY (team_id)
REFERENCES public.teams(id)
ON DELETE CASCADE;
