-- Adicionar colunas faltantes na tabela timelines
-- Execute este script se a tabela já existe mas está faltando colunas

-- Adicionar coluna 'layout' se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'timelines' AND column_name = 'layout'
    ) THEN
        ALTER TABLE timelines ADD COLUMN layout TEXT DEFAULT 'vertical';
        -- Adicionar constraint CHECK separadamente
        ALTER TABLE timelines ADD CONSTRAINT timelines_layout_check CHECK (layout IN ('vertical', 'horizontal'));
        RAISE NOTICE 'Coluna "layout" adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna "layout" já existe';
    END IF;
END $$;

-- Verificar e adicionar outras colunas que possam estar faltando
DO $$ 
BEGIN
    -- Verificar 'theme'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'timelines' AND column_name = 'theme'
    ) THEN
        ALTER TABLE timelines ADD COLUMN theme TEXT DEFAULT 'default';
        RAISE NOTICE 'Coluna "theme" adicionada com sucesso';
    END IF;

    -- Verificar 'plan_type'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'timelines' AND column_name = 'plan_type'
    ) THEN
        ALTER TABLE timelines ADD COLUMN plan_type TEXT DEFAULT 'essential';
        ALTER TABLE timelines ADD CONSTRAINT timelines_plan_type_check CHECK (plan_type IN ('essential', 'complete'));
        RAISE NOTICE 'Coluna "plan_type" adicionada com sucesso';
    END IF;

    -- Verificar 'is_published'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'timelines' AND column_name = 'is_published'
    ) THEN
        ALTER TABLE timelines ADD COLUMN is_published BOOLEAN DEFAULT false;
        RAISE NOTICE 'Coluna "is_published" adicionada com sucesso';
    END IF;

    -- Verificar 'is_private'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'timelines' AND column_name = 'is_private'
    ) THEN
        ALTER TABLE timelines ADD COLUMN is_private BOOLEAN DEFAULT false;
        RAISE NOTICE 'Coluna "is_private" adicionada com sucesso';
    END IF;

    -- Verificar 'password_hash'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'timelines' AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE timelines ADD COLUMN password_hash TEXT;
        RAISE NOTICE 'Coluna "password_hash" adicionada com sucesso';
    END IF;

    -- Verificar 'edit_token'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'timelines' AND column_name = 'edit_token'
    ) THEN
        ALTER TABLE timelines ADD COLUMN edit_token TEXT;
        -- Adicionar constraint UNIQUE separadamente
        CREATE UNIQUE INDEX IF NOT EXISTS timelines_edit_token_key ON timelines(edit_token);
        RAISE NOTICE 'Coluna "edit_token" adicionada com sucesso';
    END IF;

    -- Verificar 'final_message'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'timelines' AND column_name = 'final_message'
    ) THEN
        ALTER TABLE timelines ADD COLUMN final_message TEXT;
        RAISE NOTICE 'Coluna "final_message" adicionada com sucesso';
    END IF;

    -- Verificar 'subtitle'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'timelines' AND column_name = 'subtitle'
    ) THEN
        ALTER TABLE timelines ADD COLUMN subtitle TEXT;
        RAISE NOTICE 'Coluna "subtitle" adicionada com sucesso';
    END IF;
END $$;

