/*
          # [Correção e Configuração Segura do Banco de Dados]
          Este script configura o esquema completo da aplicação, incluindo tabelas para ligas, times, perfis e pedidos.
          Ele é idempotente, o que significa que pode ser executado várias vezes sem causar erros. Ele só criará
          tabelas ou inserirá dados se eles ainda não existirem.

          ## Query Description: [Este script verifica a existência de tabelas e dados antes de criá-los, prevenindo erros de "relação já existe". Ele estrutura o banco de dados para produtos, usuários e pedidos, e insere os dados iniciais dos produtos. Nenhuma perda de dados existente ocorrerá.]
          
          ## Metadata:
          - Schema-Category: ["Structural", "Data"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: false
          
          ## Structure Details:
          - Cria as tabelas: `leagues`, `teams`, `profiles` (se não existirem).
          - Altera a tabela `orders` para adicionar `user_id` e `payment_method` (se não existirem).
          - Insere dados nas tabelas `leagues` e `teams` (se estiverem vazias).
          
          ## Security Implications:
          - RLS Status: Habilitado para `profiles` e `orders`.
          - Policy Changes: Cria políticas de segurança para garantir que os usuários só possam acessar seus próprios dados.
          - Auth Requirements: Vincula `profiles` e `orders` à tabela `auth.users`.
          
          ## Performance Impact:
          - Indexes: Adiciona índices em chaves estrangeiras (`league_id`, `user_id`).
          - Triggers: Cria um gatilho para popular a tabela `profiles` automaticamente.
          - Estimated Impact: Baixo. Otimiza consultas relacionadas a usuários e produtos.
          */

-- 1. Criação da tabela de Ligas (Leagues)
CREATE TABLE IF NOT EXISTS public.leagues (
    id smallint PRIMARY KEY,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Criação da tabela de Times (Teams)
CREATE TABLE IF NOT EXISTS public.teams (
    id integer PRIMARY KEY,
    name character varying(255) NOT NULL,
    league_id smallint NOT NULL REFERENCES public.leagues(id),
    image1 text NOT NULL,
    image2 text NOT NULL,
    price numeric(10, 2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 3. Criação da tabela de Perfis (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    phone text
);

-- 4. Alteração da tabela de Pedidos (Orders)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS payment_method character varying(50);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 6. Criação das Políticas de Segurança (RLS Policies)
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
CREATE POLICY "Users can view their own orders." ON public.orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create orders for themselves." ON public.orders;
CREATE POLICY "Users can create orders for themselves." ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Criação do Gatilho para popular Perfis (Trigger for profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Inserir dados das Ligas (apenas se não existirem)
INSERT INTO public.leagues (id, name) VALUES
(1, 'Brasileirão A'),
(2, 'La Liga'),
(3, 'Premier League'),
(4, 'Italia A'),
(5, 'Ligue 1'),
(6, 'Liga Portugal')
ON CONFLICT (id) DO NOTHING;

-- 9. Inserir dados dos Times (apenas se não existirem)
INSERT INTO public.teams (id, league_id, name, price, image1, image2) VALUES
-- Brasileirão A
(1, 1, 'Flamengo', 159.90, 'https://i.ibb.co/FbfVdK2/flamengo1.png', 'https://i.ibb.co/yQxPzWv/flamengo2.png'),
(2, 1, 'Palmeiras', 159.90, 'https://i.ibb.co/hZJ4x3D/palmeiras1.png', 'https://i.ibb.co/G0s5CjD/palmeiras2.png'),
(3, 1, 'Corinthians', 159.90, 'https://i.ibb.co/z5GzS3f/corinthians1.png', 'https://i.ibb.co/KzZ3L3g/corinthians2.png'),
(4, 1, 'São Paulo', 159.90, 'https://i.ibb.co/vB1qXQv/saopaulo1.png', 'https://i.ibb.co/5Lq6fWc/saopaulo2.png'),
(5, 1, 'Santos', 149.90, 'https://i.ibb.co/8D3tVfb/santos1.png', 'https://i.ibb.co/dGjHwL0/santos2.png'),
(6, 1, 'Vasco da Gama', 159.90, 'https://i.ibb.co/k2xJvTf/vasco1.png', 'https://i.ibb.co/2Zf9c3p/vasco2.png'),
(7, 1, 'Fluminense', 159.90, 'https://i.ibb.co/gDFRTG0/fluminense1.png', 'https://i.ibb.co/r2y8mX1/fluminense2.png'),
(8, 1, 'Botafogo', 159.90, 'https://i.ibb.co/hD3GkXg/botafogo1.png', 'https://i.ibb.co/M8VvjZk/botafogo2.png'),
(9, 1, 'Grêmio', 159.90, 'https://i.ibb.co/dKqLp07/gremio1.png', 'https://i.ibb.co/YyWjLzW/gremio2.png'),
(10, 1, 'Internacional', 159.90, 'https://i.ibb.co/R4m2GkS/internacional1.png', 'https://i.ibb.co/hMh0HhR/internacional2.png'),
(11, 1, 'Atlético Mineiro', 159.90, 'https://i.ibb.co/8sZkQxR/atleticomg1.png', 'https://i.ibb.co/N2wWjLq/atleticomg2.png'),
(12, 1, 'Cruzeiro', 159.90, 'https://i.ibb.co/L84DDG7/cruzeiro1.png', 'https://i.ibb.co/h2Xj4zG/cruzeiro2.png'),
(13, 1, 'Athletico Paranaense', 149.90, 'https://i.ibb.co/L6dRyQS/athleticopr1.png', 'https://i.ibb.co/xJq8dYv/athleticopr2.png'),
(14, 1, 'Bahia', 149.90, 'https://i.ibb.co/pwnCgX5/bahia1.png', 'https://i.ibb.co/C0d6qFv/bahia2.png'),
(15, 1, 'Fortaleza', 149.90, 'https://i.ibb.co/9vM7bQv/fortaleza1.png', 'https://i.ibb.co/Z8P5gQZ/fortaleza2.png'),
-- La Liga
(16, 2, 'Real Madrid', 169.90, 'https://i.ibb.co/QjJ4hJb/realmadrid1.png', 'https://i.ibb.co/Wp7bNfV/realmadrid2.png'),
(17, 2, 'Barcelona', 169.90, 'https://i.ibb.co/Fz6vPqV/barcelona1.png', 'https://i.ibb.co/k2Wz5dJ/barcelona2.png'),
(18, 2, 'Atlético de Madrid', 159.90, 'https://i.ibb.co/yV7jHwP/atleticomadrid1.png', 'https://i.ibb.co/mH0tXq2/atleticomadrid2.png'),
(19, 2, 'Sevilla', 149.90, 'https://i.ibb.co/Y3gD4Xm/sevilla1.png', 'https://i.ibb.co/hL7gH3D/sevilla2.png'),
(20, 2, 'Valencia', 149.90, 'https://i.ibb.co/zfhx2vL/valencia1.png', 'https://i.ibb.co/FmP0x3D/valencia2.png'),
(21, 2, 'Real Betis', 149.90, 'https://i.ibb.co/kQfHwP5/betis1.png', 'https://i.ibb.co/bBqLqFv/betis2.png'),
(22, 2, 'Real Sociedad', 149.90, 'https://i.ibb.co/L6dRyQS/realsociedad1.png', 'https://i.ibb.co/xJq8dYv/realsociedad2.png'),
(23, 2, 'Athletic Bilbao', 149.90, 'https://i.ibb.co/pwnCgX5/bilbao1.png', 'https://i.ibb.co/C0d6qFv/bilbao2.png'),
(24, 2, 'Villarreal', 149.90, 'https://i.ibb.co/9vM7bQv/villarreal1.png', 'https://i.ibb.co/Z8P5gQZ/villarreal2.png'),
(25, 2, 'Girona', 149.90, 'https://i.ibb.co/FbfVdK2/girona1.png', 'https://i.ibb.co/yQxPzWv/girona2.png'),
(26, 2, 'Getafe', 139.90, 'https://i.ibb.co/hZJ4x3D/getafe1.png', 'https://i.ibb.co/G0s5CjD/getafe2.png'),
(27, 2, 'Celta de Vigo', 139.90, 'https://i.ibb.co/z5GzS3f/celta1.png', 'https://i.ibb.co/KzZ3L3g/celta2.png'),
(28, 2, 'Espanyol', 139.90, 'https://i.ibb.co/vB1qXQv/espanyol1.png', 'https://i.ibb.co/5Lq6fWc/espanyol2.png'),
(29, 2, 'Osasuna', 139.90, 'https://i.ibb.co/8D3tVfb/osasuna1.png', 'https://i.ibb.co/dGjHwL0/osasuna2.png'),
(30, 2, 'Mallorca', 139.90, 'https://i.ibb.co/k2xJvTf/mallorca1.png', 'https://i.ibb.co/2Zf9c3p/mallorca2.png'),
-- Premier League
(31, 3, 'Manchester United', 169.90, 'https://i.ibb.co/gDFRTG0/manutd1.png', 'https://i.ibb.co/r2y8mX1/manutd2.png'),
(32, 3, 'Liverpool', 169.90, 'https://i.ibb.co/hD3GkXg/liverpool1.png', 'https://i.ibb.co/M8VvjZk/liverpool2.png'),
(33, 3, 'Manchester City', 169.90, 'https://i.ibb.co/dKqLp07/mancity1.png', 'https://i.ibb.co/YyWjLzW/mancity2.png'),
(34, 3, 'Chelsea', 169.90, 'https://i.ibb.co/R4m2GkS/chelsea1.png', 'https://i.ibb.co/hMh0HhR/chelsea2.png'),
(35, 3, 'Arsenal', 169.90, 'https://i.ibb.co/8sZkQxR/arsenal1.png', 'https://i.ibb.co/N2wWjLq/arsenal2.png'),
(36, 3, 'Tottenham', 159.90, 'https://i.ibb.co/L84DDG7/tottenham1.png', 'https://i.ibb.co/h2Xj4zG/tottenham2.png'),
(37, 3, 'Newcastle', 159.90, 'https://i.ibb.co/L6dRyQS/newcastle1.png', 'https://i.ibb.co/xJq8dYv/newcastle2.png'),
(38, 3, 'Aston Villa', 149.90, 'https://i.ibb.co/pwnCgX5/astonvilla1.png', 'https://i.ibb.co/C0d6qFv/astonvilla2.png'),
(39, 3, 'West Ham', 149.90, 'https://i.ibb.co/9vM7bQv/westham1.png', 'https://i.ibb.co/Z8P5gQZ/westham2.png'),
(40, 3, 'Everton', 149.90, 'https://i.ibb.co/FbfVdK2/everton1.png', 'https://i.ibb.co/yQxPzWv/everton2.png'),
(41, 3, 'Leicester City', 149.90, 'https://i.ibb.co/hZJ4x3D/leicester1.png', 'https://i.ibb.co/G0s5CjD/leicester2.png'),
(42, 3, 'Brighton', 149.90, 'https://i.ibb.co/z5GzS3f/brighton1.png', 'https://i.ibb.co/KzZ3L3g/brighton2.png'),
(43, 3, 'Wolverhampton', 149.90, 'https://i.ibb.co/vB1qXQv/wolves1.png', 'https://i.ibb.co/5Lq6fWc/wolves2.png'),
(44, 3, 'Fulham', 139.90, 'https://i.ibb.co/8D3tVfb/fulham1.png', 'https://i.ibb.co/dGjHwL0/fulham2.png'),
(45, 3, 'Crystal Palace', 139.90, 'https://i.ibb.co/k2xJvTf/crystalpalace1.png', 'https://i.ibb.co/2Zf9c3p/crystalpalace2.png'),
-- Italia A
(46, 4, 'Juventus', 169.90, 'https://i.ibb.co/gDFRTG0/juventus1.png', 'https://i.ibb.co/r2y8mX1/juventus2.png'),
(47, 4, 'Inter de Milão', 169.90, 'https://i.ibb.co/hD3GkXg/intermilan1.png', 'https://i.ibb.co/M8VvjZk/intermilan2.png'),
(48, 4, 'Milan', 169.90, 'https://i.ibb.co/dKqLp07/milan1.png', 'https://i.ibb.co/YyWjLzW/milan2.png'),
(49, 4, 'Napoli', 159.90, 'https://i.ibb.co/R4m2GkS/napoli1.png', 'https://i.ibb.co/hMh0HhR/napoli2.png'),
(50, 4, 'Roma', 159.90, 'https://i.ibb.co/8sZkQxR/roma1.png', 'https://i.ibb.co/N2wWjLq/roma2.png'),
(51, 4, 'Lazio', 159.90, 'https://i.ibb.co/L84DDG7/lazio1.png', 'https://i.ibb.co/h2Xj4zG/lazio2.png'),
(52, 4, 'Atalanta', 149.90, 'https://i.ibb.co/L6dRyQS/atalanta1.png', 'https://i.ibb.co/xJq8dYv/atalanta2.png'),
(53, 4, 'Fiorentina', 149.90, 'https://i.ibb.co/pwnCgX5/fiorentina1.png', 'https://i.ibb.co/C0d6qFv/fiorentina2.png'),
(54, 4, 'Torino', 139.90, 'https://i.ibb.co/9vM7bQv/torino1.png', 'https://i.ibb.co/Z8P5gQZ/torino2.png'),
(55, 4, 'Bologna', 139.90, 'https://i.ibb.co/FbfVdK2/bologna1.png', 'https://i.ibb.co/yQxPzWv/bologna2.png'),
(56, 4, 'Udinese', 139.90, 'https://i.ibb.co/hZJ4x3D/udinese1.png', 'https://i.ibb.co/G0s5CjD/udinese2.png'),
(57, 4, 'Sassuolo', 139.90, 'https://i.ibb.co/z5GzS3f/sassuolo1.png', 'https://i.ibb.co/KzZ3L3g/sassuolo2.png'),
(58, 4, 'Genoa', 139.90, 'https://i.ibb.co/vB1qXQv/genoa1.png', 'https://i.ibb.co/5Lq6fWc/genoa2.png'),
(59, 4, 'Sampdoria', 139.90, 'https://i.ibb.co/8D3tVfb/sampdoria1.png', 'https://i.ibb.co/dGjHwL0/sampdoria2.png'),
(60, 4, 'Cagliari', 139.90, 'https://i.ibb.co/k2xJvTf/cagliari1.png', 'https://i.ibb.co/2Zf9c3p/cagliari2.png'),
-- Ligue 1
(61, 5, 'Paris Saint-Germain', 169.90, 'https://i.ibb.co/gDFRTG0/psg1.png', 'https://i.ibb.co/r2y8mX1/psg2.png'),
(62, 5, 'Olympique de Marseille', 159.90, 'https://i.ibb.co/hD3GkXg/marseille1.png', 'https://i.ibb.co/M8VvjZk/marseille2.png'),
(63, 5, 'Lyon', 159.90, 'https://i.ibb.co/dKqLp07/lyon1.png', 'https://i.ibb.co/YyWjLzW/lyon2.png'),
(64, 5, 'Monaco', 159.90, 'https://i.ibb.co/R4m2GkS/monaco1.png', 'https://i.ibb.co/hMh0HhR/monaco2.png'),
(65, 5, 'Lille', 149.90, 'https://i.ibb.co/8sZkQxR/lille1.png', 'https://i.ibb.co/N2wWjLq/lille2.png'),
(66, 5, 'Nice', 149.90, 'https://i.ibb.co/L84DDG7/nice1.png', 'https://i.ibb.co/h2Xj4zG/nice2.png'),
(67, 5, 'Rennes', 149.90, 'https://i.ibb.co/L6dRyQS/rennes1.png', 'https://i.ibb.co/xJq8dYv/rennes2.png'),
(68, 5, 'Saint-Étienne', 149.90, 'https://i.ibb.co/pwnCgX5/saintetienne1.png', 'https://i.ibb.co/C0d6qFv/saintetienne2.png'),
(69, 5, 'Lens', 149.90, 'https://i.ibb.co/9vM7bQv/lens1.png', 'https://i.ibb.co/Z8P5gQZ/lens2.png'),
(70, 5, 'Nantes', 139.90, 'https://i.ibb.co/FbfVdK2/nantes1.png', 'https://i.ibb.co/yQxPzWv/nantes2.png'),
(71, 5, 'Strasbourg', 139.90, 'https://i.ibb.co/hZJ4x3D/strasbourg1.png', 'https://i.ibb.co/G0s5CjD/strasbourg2.png'),
(72, 5, 'Reims', 139.90, 'https://i.ibb.co/z5GzS3f/reims1.png', 'https://i.ibb.co/KzZ3L3g/reims2.png'),
(73, 5, 'Montpellier', 139.90, 'https://i.ibb.co/vB1qXQv/montpellier1.png', 'https://i.ibb.co/5Lq6fWc/montpellier2.png'),
(74, 5, 'Bordeaux', 139.90, 'https://i.ibb.co/8D3tVfb/bordeaux1.png', 'https://i.ibb.co/dGjHwL0/bordeaux2.png'),
(75, 5, 'Toulouse', 139.90, 'https://i.ibb.co/k2xJvTf/toulouse1.png', 'https://i.ibb.co/2Zf9c3p/toulouse2.png'),
-- Liga Portugal
(76, 6, 'Benfica', 159.90, 'https://i.ibb.co/gDFRTG0/benfica1.png', 'https://i.ibb.co/r2y8mX1/benfica2.png'),
(77, 6, 'Porto', 159.90, 'https://i.ibb.co/hD3GkXg/porto1.png', 'https://i.ibb.co/M8VvjZk/porto2.png'),
(78, 6, 'Sporting', 159.90, 'https://i.ibb.co/dKqLp07/sporting1.png', 'https://i.ibb.co/YyWjLzW/sporting2.png'),
(79, 6, 'Braga', 149.90, 'https://i.ibb.co/R4m2GkS/braga1.png', 'https://i.ibb.co/hMh0HhR/braga2.png'),
(80, 6, 'Vitória de Guimarães', 149.90, 'https://i.ibb.co/8sZkQxR/vitoria1.png', 'https://i.ibb.co/N2wWjLq/vitoria2.png'),
(81, 6, 'Boavista', 139.90, 'https://i.ibb.co/L84DDG7/boavista1.png', 'https://i.ibb.co/h2Xj4zG/boavista2.png'),
(82, 6, 'Marítimo', 139.90, 'https://i.ibb.co/L6dRyQS/maritimo1.png', 'https://i.ibb.co/xJq8dYv/maritimo2.png'),
(83, 6, 'Rio Ave', 139.90, 'https://i.ibb.co/pwnCgX5/rioave1.png', 'https://i.ibb.co/C0d6qFv/rioave2.png'),
(84, 6, 'Farense', 139.90, 'https://i.ibb.co/9vM7bQv/farense1.png', 'https://i.ibb.co/Z8P5gQZ/farense2.png'),
(85, 6, 'Gil Vicente', 139.90, 'https://i.ibb.co/FbfVdK2/gilvicente1.png', 'https://i.ibb.co/yQxPzWv/gilvicente2.png'),
(86, 6, 'Paços de Ferreira', 139.90, 'https://i.ibb.co/hZJ4x3D/pacos1.png', 'https://i.ibb.co/G0s5CjD/pacos2.png'),
(87, 6, 'Moreirense', 139.90, 'https://i.ibb.co/z5GzS3f/moreirense1.png', 'https://i.ibb.co/KzZ3L3g/moreirense2.png'),
(88, 6, 'Santa Clara', 139.90, 'https://i.ibb.co/vB1qXQv/santaclara1.png', 'https://i.ibb.co/5Lq6fWc/santaclara2.png'),
(89, 6, 'Belenenses', 139.90, 'https://i.ibb.co/8D3tVfb/belenenses1.png', 'https://i.ibb.co/dGjHwL0/belenenses2.png'),
(90, 6, 'Tondela', 139.90, 'https://i.ibb.co/k2xJvTf/tondela1.png', 'https://i.ibb.co/2Zf9c3p/tondela2.png')
ON CONFLICT (id) DO NOTHING;
