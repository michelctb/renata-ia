-- 1) Roles infra: enum, user_roles table, has_role function
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','consultor','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
-- No public policies yet; service_role can seed roles

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- 2) Lock down Clientes: enable RLS + owner/admin policies
ALTER TABLE public."Clientes" ENABLE ROW LEVEL SECURITY;
-- Add user_id column for secure ownership mapping (no FK as recommended)
ALTER TABLE public."Clientes" ADD COLUMN IF NOT EXISTS user_id uuid;

-- Drop legacy or conflicting policies if any
DROP POLICY IF EXISTS clientes_select_owner_admin ON public."Clientes";
DROP POLICY IF EXISTS clientes_insert_self_or_admin ON public."Clientes";
DROP POLICY IF EXISTS clientes_update_owner_admin ON public."Clientes";
DROP POLICY IF EXISTS clientes_delete_owner_admin ON public."Clientes";

-- Allow owners and admins
CREATE POLICY clientes_select_owner_admin
ON public."Clientes"
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY clientes_insert_self_or_admin
ON public."Clientes"
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY clientes_update_owner_admin
ON public."Clientes"
FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY clientes_delete_owner_admin
ON public."Clientes"
FOR DELETE TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 3) Replace insecure policies on core tables to use auth.uid() and admin override
-- 3.a) Categorias
DROP POLICY IF EXISTS "Usuários podem ver categorias padrão" ON public."Categorias";
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias categorias" ON public."Categorias";
DROP POLICY IF EXISTS "Usuários podem atualizar apenas suas próprias categorias" ON public."Categorias";
DROP POLICY IF EXISTS "Usuários podem excluir apenas suas próprias categorias" ON public."Categorias";
DROP POLICY IF EXISTS "lovable" ON public."Categorias";

CREATE POLICY categorias_select_owner_or_padrao_or_admin
ON public."Categorias"
FOR SELECT TO authenticated
USING (padrao = true OR cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY categorias_insert_owner_or_admin
ON public."Categorias"
FOR INSERT TO authenticated
WITH CHECK ((cliente = auth.uid()::text AND padrao = false) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY categorias_update_owner_or_admin
ON public."Categorias"
FOR UPDATE TO authenticated
USING ((cliente = auth.uid()::text AND padrao = false) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK ((cliente = auth.uid()::text AND padrao = false) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY categorias_delete_owner_or_admin
ON public."Categorias"
FOR DELETE TO authenticated
USING ((cliente = auth.uid()::text AND padrao = false) OR public.has_role(auth.uid(), 'admin'));

-- 3.b) Sistema Financeiro
DROP POLICY IF EXISTS "Users can create their own transactions" ON public."Sistema Financeiro";
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public."Sistema Financeiro";
DROP POLICY IF EXISTS "Users can update their own transactions" ON public."Sistema Financeiro";
DROP POLICY IF EXISTS "Users can view their own transactions" ON public."Sistema Financeiro";
DROP POLICY IF EXISTS n8n ON public."Sistema Financeiro";

CREATE POLICY sf_select_owner_or_admin
ON public."Sistema Financeiro"
FOR SELECT TO authenticated
USING (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY sf_insert_owner_or_admin
ON public."Sistema Financeiro"
FOR INSERT TO authenticated
WITH CHECK (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY sf_update_owner_or_admin
ON public."Sistema Financeiro"
FOR UPDATE TO authenticated
USING (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY sf_delete_owner_or_admin
ON public."Sistema Financeiro"
FOR DELETE TO authenticated
USING (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

-- 3.c) metas_categorias
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias metas" ON public.metas_categorias;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias metas de categorias" ON public.metas_categorias;
DROP POLICY IF EXISTS "Usuários podem criar suas próprias metas" ON public.metas_categorias;
DROP POLICY IF EXISTS "Usuários podem excluir suas próprias metas" ON public.metas_categorias;
DROP POLICY IF EXISTS "Usuários podem excluir suas próprias metas de categorias" ON public.metas_categorias;
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias metas de categorias" ON public.metas_categorias;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias metas" ON public.metas_categorias;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias metas de categorias" ON public.metas_categorias;

CREATE POLICY metas_select_owner_or_admin
ON public.metas_categorias
FOR SELECT TO authenticated
USING (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY metas_insert_owner_or_admin
ON public.metas_categorias
FOR INSERT TO authenticated
WITH CHECK (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY metas_update_owner_or_admin
ON public.metas_categorias
FOR UPDATE TO authenticated
USING (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY metas_delete_owner_or_admin
ON public.metas_categorias
FOR DELETE TO authenticated
USING (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

-- 3.d) Lembretes
DROP POLICY IF EXISTS "Users can delete their own lembretes" ON public."Lembretes";
DROP POLICY IF EXISTS "Users can insert their own lembretes" ON public."Lembretes";
DROP POLICY IF EXISTS "Users can update their own lembretes" ON public."Lembretes";
DROP POLICY IF EXISTS "Users can view their own lembretes" ON public."Lembretes";
DROP POLICY IF EXISTS n8n ON public."Lembretes";

CREATE POLICY lembretes_select_owner_or_admin
ON public."Lembretes"
FOR SELECT TO authenticated
USING (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY lembretes_insert_owner_or_admin
ON public."Lembretes"
FOR INSERT TO authenticated
WITH CHECK (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY lembretes_update_owner_or_admin
ON public."Lembretes"
FOR UPDATE TO authenticated
USING (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY lembretes_delete_owner_or_admin
ON public."Lembretes"
FOR DELETE TO authenticated
USING (id_cliente = auth.uid()::text OR public.has_role(auth.uid(), 'admin'));

-- 4) Remove permissive ALL policies on less-used tables (safer defaults)
DROP POLICY IF EXISTS n8n ON public."Aviso manutenção";
DROP POLICY IF EXISTS n8n ON public."Informações Clientes";

-- 5) Storage: make sensitive buckets private and add object policies
UPDATE storage.buckets SET public = false WHERE id IN ('clientes','consultores');

-- Recreate tight policies on storage.objects for these buckets
DROP POLICY IF EXISTS private_buckets_read_own_or_admin ON storage.objects;
DROP POLICY IF EXISTS private_buckets_write_own_or_admin ON storage.objects;
DROP POLICY IF EXISTS private_buckets_update_own_or_admin ON storage.objects;
DROP POLICY IF EXISTS private_buckets_delete_own_or_admin ON storage.objects;

CREATE POLICY private_buckets_read_own_or_admin
ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id IN ('clientes','consultores') AND (
    auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY private_buckets_write_own_or_admin
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('clientes','consultores') AND (
    auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY private_buckets_update_own_or_admin
ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id IN ('clientes','consultores') AND (
    auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')
  )
)
WITH CHECK (
  bucket_id IN ('clientes','consultores') AND (
    auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY private_buckets_delete_own_or_admin
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id IN ('clientes','consultores') AND (
    auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')
  )
);
