-- Adicionar coluna mercado_pago_payment_id na tabela payments
-- Execute este script se a tabela já existe mas está faltando a coluna

-- Verificar e adicionar coluna 'mercado_pago_payment_id' se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'mercado_pago_payment_id'
    ) THEN
        -- Adicionar a coluna
        ALTER TABLE payments ADD COLUMN mercado_pago_payment_id TEXT;
        
        -- Criar índice único se não existir
        CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_mercadopago_id ON payments(mercado_pago_payment_id);
        
        RAISE NOTICE 'Coluna "mercado_pago_payment_id" adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna "mercado_pago_payment_id" já existe';
    END IF;
END $$;

-- Remover coluna antiga do Stripe se existir (opcional)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'stripe_payment_intent_id'
    ) THEN
        -- Remover índice se existir
        DROP INDEX IF EXISTS idx_payments_stripe_id;
        -- Remover coluna
        ALTER TABLE payments DROP COLUMN stripe_payment_intent_id;
        RAISE NOTICE 'Coluna antiga "stripe_payment_intent_id" removida';
    END IF;
END $$;

-- Verificar outras colunas que possam estar faltando
DO $$ 
BEGIN
    -- Verificar 'plan_type'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'plan_type'
    ) THEN
        ALTER TABLE payments ADD COLUMN plan_type TEXT;
        ALTER TABLE payments ADD CONSTRAINT payments_plan_type_check CHECK (plan_type IN ('essential', 'complete'));
        RAISE NOTICE 'Coluna "plan_type" adicionada com sucesso';
    END IF;

    -- Verificar 'amount'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'amount'
    ) THEN
        ALTER TABLE payments ADD COLUMN amount INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Coluna "amount" adicionada com sucesso';
    END IF;

    -- Verificar 'status'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'status'
    ) THEN
        ALTER TABLE payments ADD COLUMN status TEXT DEFAULT 'pending';
        ALTER TABLE payments ADD CONSTRAINT payments_status_check CHECK (status IN ('pending', 'succeeded', 'failed'));
        RAISE NOTICE 'Coluna "status" adicionada com sucesso';
    END IF;

    -- Verificar 'timeline_id'
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'timeline_id'
    ) THEN
        ALTER TABLE payments ADD COLUMN timeline_id UUID;
        -- Adicionar foreign key se a tabela timelines existir
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'timelines') THEN
            ALTER TABLE payments ADD CONSTRAINT payments_timeline_id_fkey FOREIGN KEY (timeline_id) REFERENCES timelines(id) ON DELETE CASCADE;
        END IF;
        RAISE NOTICE 'Coluna "timeline_id" adicionada com sucesso';
    END IF;
END $$;

