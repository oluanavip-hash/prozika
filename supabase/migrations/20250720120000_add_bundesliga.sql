/*
          # [Operation Name]
          Adicionar Liga (Bundesliga) e Times

          ## Query Description:
          Este script adiciona uma nova categoria de liga ('Bundesliga') e insere os 15 principais times associados a ela. A operação é segura e não afetará dados existentes, pois utiliza a cláusula "ON CONFLICT DO NOTHING" para evitar a inserção de duplicatas. Nenhum dado será perdido.

          ## Metadata:
          - Schema-Category: "Data"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - Tabela afetada: public.leagues (INSERT)
          - Tabela afetada: public.teams (INSERT)

          ## Security Implications:
          - RLS Status: Habilitado (as políticas existentes serão aplicadas aos novos dados)
          - Policy Changes: Não
          - Auth Requirements: Não

          ## Performance Impact:
          - Indexes: Nenhum
          - Triggers: Nenhum
          - Estimated Impact: Mínimo, apenas inserção de novas linhas.
          */
INSERT INTO public.leagues (id, name) VALUES (8, 'Bundesliga') ON CONFLICT (id) DO NOTHING;

INSERT INTO public.teams (name, league_id, image1, image2, price) VALUES
('Bayern Munich', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/DD0000/FFFFFF/png?text=Bayern+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/000000/FFFFFF/png?text=Bayern+2', 149.99),
('Borussia Dortmund', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FDE100/000000/png?text=Dortmund+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/000000/FDE100/png?text=Dortmund+2', 149.99),
('RB Leipzig', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FFFFFF/E60026/png?text=Leipzig+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/0A1C3D/FFFFFF/png?text=Leipzig+2', 149.99),
('Bayer Leverkusen', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/E32221/000000/png?text=Leverkusen+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/000000/FFFFFF/png?text=Leverkusen+2', 149.99),
('Eintracht Frankfurt', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/000000/E30613/png?text=Frankfurt+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FFFFFF/000000/png?text=Frankfurt+2', 149.99),
('VfL Wolfsburg', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/66B032/FFFFFF/png?text=Wolfsburg+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FFFFFF/66B032/png?text=Wolfsburg+2', 149.99),
('Borussia Mönchengladbach', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/000000/00A54F/png?text=Gladbach+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FFFFFF/000000/png?text=Gladbach+2', 149.99),
('VfB Stuttgart', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FFFFFF/E30613/png?text=Stuttgart+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/E30613/FFFFFF/png?text=Stuttgart+2', 149.99),
('SC Freiburg', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/000000/FFFFFF/png?text=Freiburg+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/E30613/FFFFFF/png?text=Freiburg+2', 149.99),
('Union Berlin', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/E30613/FFFFFF/png?text=Union+Berlin+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FDE100/000000/png?text=Union+Berlin+2', 149.99),
('Hertha BSC', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/005CA9/FFFFFF/png?text=Hertha+BSC+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FFFFFF/005CA9/png?text=Hertha+BSC+2', 149.99),
('FC Schalke 04', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/005CA9/FFFFFF/png?text=Schalke+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FFFFFF/005CA9/png?text=Schalke+2', 149.99),
('Werder Bremen', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/009655/FFFFFF/png?text=Bremen+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FFFFFF/009655/png?text=Bremen+2', 149.99),
('Hamburger SV', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/005CA9/FFFFFF/png?text=Hamburg+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FFFFFF/005CA9/png?text=Hamburg+2', 149.99),
('1. FC Köln', 8, 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/FFFFFF/E30613/png?text=Köln+1', 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/E30613/FFFFFF/png?text=Köln+2', 149.99)
ON CONFLICT (name) DO NOTHING;
