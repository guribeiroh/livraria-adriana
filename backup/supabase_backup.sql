-- Script de Backup do Supabase para Livraria Online
-- Criado em: 16/03/2025

-- Habilitar a extensão uuid-ossp para gerar IDs UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criação de Tabelas
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    role text NOT NULL DEFAULT 'customer',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.books (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    author text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    price numeric(10,2) NOT NULL,
    original_price numeric(10,2),
    cover_image text,
    stock integer NOT NULL DEFAULT 0,
    category_id uuid REFERENCES public.categories(id),
    isbn text UNIQUE,
    publication_year integer,
    pages integer,
    is_featured boolean DEFAULT false,
    is_bestseller boolean DEFAULT false,
    is_new boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.users(id),
    status text NOT NULL DEFAULT 'pending',
    total numeric(10,2) NOT NULL,
    shipping_address text,
    shipping_city text,
    shipping_state text,
    shipping_zipcode text,
    payment_method text,
    tracking_number text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid NOT NULL REFERENCES public.orders(id),
    book_id uuid NOT NULL REFERENCES public.books(id),
    quantity integer NOT NULL,
    price_at_purchase numeric(10,2) NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.users(id),
    book_id uuid NOT NULL REFERENCES public.books(id),
    rating integer NOT NULL,
    comment text,
    created_at timestamptz DEFAULT now(),
    UNIQUE(book_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.wishlist (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.users(id),
    book_id uuid NOT NULL REFERENCES public.books(id),
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, book_id)
);

CREATE TABLE IF NOT EXISTS public.coupons (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code text NOT NULL UNIQUE,
    discount_percent integer,
    discount_value numeric(10,2),
    min_purchase_value numeric(10,2),
    start_date timestamptz,
    expiry_date timestamptz,
    usage_limit integer,
    usage_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key text NOT NULL UNIQUE,
    setting_value text,
    updated_at timestamptz DEFAULT now()
);

-- Configuração de Row Level Security (RLS)
-- Habilitar RLS para todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para Usuários
CREATE POLICY "Permitir visualização dos próprios dados" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Permitir atualização dos próprios dados" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Permitir admins verem todos os usuários" ON public.users
    FOR SELECT USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Permitir gerenciamento de usuários para admins" ON public.users
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Políticas para Categorias
CREATE POLICY "Permitir leitura pública para categorias" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Permitir gerenciamento de categorias para admins" ON public.categories
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Políticas para Livros
CREATE POLICY "Permitir leitura pública para livros" ON public.books
    FOR SELECT USING (true);

CREATE POLICY "Permitir gerenciamento de livros para admins" ON public.books
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Políticas para Pedidos
CREATE POLICY "Permitir visualização dos próprios pedidos" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Permitir criação de pedidos" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir admins verem todos os pedidos" ON public.orders
    FOR SELECT USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Permitir gerenciamento de pedidos para admins" ON public.orders
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Políticas para Itens de Pedido
CREATE POLICY "Permitir visualização dos próprios itens de pedido" ON public.order_items
    FOR SELECT USING (order_id IN (
        SELECT id FROM public.orders WHERE user_id = auth.uid()
    ));

CREATE POLICY "Permitir criação de itens de pedido" ON public.order_items
    FOR INSERT WITH CHECK (order_id IN (
        SELECT id FROM public.orders WHERE user_id = auth.uid()
    ));

CREATE POLICY "Permitir admins verem todos os itens de pedido" ON public.order_items
    FOR SELECT USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Permitir gerenciamento de itens de pedido para admins" ON public.order_items
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Políticas para Avaliações
CREATE POLICY "Permitir leitura pública para avaliações" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de avaliações para usuários" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir atualização de avaliações pelo autor" ON public.reviews
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Permitir exclusão de avaliações pelo autor" ON public.reviews
    FOR DELETE USING (
        auth.uid() = user_id OR 
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Políticas para Lista de Desejos
CREATE POLICY "Permitir visualização da própria lista de desejos" ON public.wishlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Permitir gerenciamento da própria lista de desejos" ON public.wishlist
    USING (auth.uid() = user_id);

CREATE POLICY "Permitir gerenciamento de listas de desejos para admins" ON public.wishlist
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Políticas para Cupons
CREATE POLICY "Permitir leitura pública para cupons" ON public.coupons
    FOR SELECT USING (is_active = true);

CREATE POLICY "Permitir gerenciamento de cupons para admins" ON public.coupons
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Políticas para Configurações do Site
CREATE POLICY "Permitir leitura pública para configurações do site" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Permitir gerenciamento de configurações para admins" ON public.site_settings
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Configuração de Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('book_images', 'book_images', true);

-- Configuração de políticas para o bucket de imagens
CREATE POLICY "Imagens de livros acessíveis publicamente" ON storage.objects
    FOR SELECT USING (bucket_id = 'book_images');

CREATE POLICY "Apenas admins podem carregar imagens" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'book_images' AND
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Apenas admins podem atualizar imagens" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'book_images' AND
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Apenas admins podem excluir imagens" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'book_images' AND
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Fim do script 