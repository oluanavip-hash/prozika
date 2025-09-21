/*
# [SCHEMA CORRECTION] Add UNIQUE constraints and insert Bundesliga data
This migration script corrects the database schema by adding UNIQUE constraints to the 'name' columns of the 'leagues' and 'teams' tables. This is necessary to prevent duplicate entries and fix the 'ON CONFLICT' error from the previous migration attempt. After correcting the schema, it safely inserts the Bundesliga league and its teams.

## Query Description: This operation is safe and structural. It first alters the table structure to enforce uniqueness on names and then adds new data. It will not affect existing data.

## Metadata:
- Schema-Category: ["Structural", "Data"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table 'leagues': Adds a UNIQUE constraint on the 'name' column.
- Table 'teams': Adds a UNIQUE constraint on the 'name' column.
*/

-- Add UNIQUE constraint to leagues.name if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_constraint
        WHERE  conrelid = 'public.leagues'::regclass
        AND    conname = 'leagues_name_key'
    ) THEN
        ALTER TABLE public.leagues ADD CONSTRAINT leagues_name_key UNIQUE (name);
    END IF;
END;
$$;

-- Add UNIQUE constraint to teams.name if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_constraint
        WHERE  conrelid = 'public.teams'::regclass
        AND    conname = 'teams_name_key'
    ) THEN
        ALTER TABLE public.teams ADD CONSTRAINT teams_name_key UNIQUE (name);
    END IF;
END;
$$;


/*
# [DATA INSERTION] Add Bundesliga League and Teams
Inserts the Bundesliga league and its top 15 teams into the database. Uses 'ON CONFLICT' to prevent errors if the data already exists.
*/

-- Insert Bundesliga league, do nothing if it already exists
INSERT INTO public.leagues (name)
VALUES ('Bundesliga')
ON CONFLICT (name) DO NOTHING;

-- Insert Bundesliga teams, do nothing on conflict
INSERT INTO public.teams (name, league_id, image1, image2, price)
VALUES
    ('Bayern de Munique', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/L8yXgS1/bayern1.png', 'https://i.ibb.co/GvTzTjV/bayern2.png', 159.99),
    ('Borussia Dortmund', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/YyW8s7D/dortmund1.png', 'https://i.ibb.co/h1g4hXv/dortmund2.png', 159.99),
    ('RB Leipzig', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/2ZfW5t9/leipzig1.png', 'https://i.ibb.co/hXj0f3f/leipzig2.png', 159.99),
    ('Bayer Leverkusen', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/d2xZ3vC/leverkusen1.png', 'https://i.ibb.co/Yp3N9Qk/leverkusen2.png', 159.99),
    ('Eintracht Frankfurt', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/2n9Vj7c/frankfurt1.png', 'https://i.ibb.co/4Z5f8gN/frankfurt2.png', 159.99),
    ('VfL Wolfsburg', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/xS2k0qC/wolfsburg1.png', 'https://i.ibb.co/S0wZz2v/wolfsburg2.png', 159.99),
    ('Borussia Mönchengladbach', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/Zc1vW8k/monchengladbach1.png', 'https://i.ibb.co/gZ7k2tW/monchengladbach2.png', 159.99),
    ('VfB Stuttgart', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/Qj7C1cK/stuttgart1.png', 'https://i.ibb.co/G9f6M0p/stuttgart2.png', 159.99),
    ('SC Freiburg', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/wJv0q7v/freiburg1.png', 'https://i.ibb.co/3s8p8rR/freiburg2.png', 159.99),
    ('1. FC Union Berlin', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/9hJ7f7y/unionberlin1.png', 'https://i.ibb.co/yQJ4t5v/unionberlin2.png', 159.99),
    ('TSG Hoffenheim', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/L9HwV9w/hoffenheim1.png', 'https://i.ibb.co/dK9vP9h/hoffenheim2.png', 159.99),
    ('Hertha BSC', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/Dk6wF7p/hertha1.png', 'https://i.ibb.co/N1p5q2x/hertha2.png', 159.99),
    ('FC Schalke 04', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/wYnKjXb/schalke1.png', 'https://i.ibb.co/yq4n7yN/schalke2.png', 159.99),
    ('Werder Bremen', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/k2B8K6c/werderbremen1.png', 'https://i.ibb.co/RzMv7wN/werderbremen2.png', 159.99),
    ('Hamburger SV', (SELECT id FROM public.leagues WHERE name = 'Bundesliga'), 'https://i.ibb.co/j3ZkL3g/hamburgersv1.png', 'https://i.ibb.co/qj5D1Q0/hamburgersv2.png', 159.99)
ON CONFLICT (name) DO NOTHING;
