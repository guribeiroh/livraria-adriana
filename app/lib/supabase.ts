import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro crítico: Supabase URL ou Anon Key ausente. Verifique suas variáveis de ambiente.');
  if (typeof window !== 'undefined') {
    console.error('Ambiente de cliente detectado. Verifique se as variáveis NEXT_PUBLIC_* estão configuradas corretamente.');
  } else {
    console.error('Ambiente de servidor detectado. Verifique as variáveis de ambiente na configuração de hospedagem.');
  }
}

// Opções para o cliente Supabase
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
};

// Criar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Para debugging em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('Inicializando Supabase client com URL:', supabaseUrl);
}

// Função para pegar o usuário atual
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
}

// Funções de autenticação
export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, userData: object) {
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: { data: userData }
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  });
}

export async function updatePassword(newPassword: string) {
  return await supabase.auth.updateUser({ password: newPassword });
}

// Função para verificar se o usuário tem permissão de administrador
export async function isUserAdmin(userId: string) {
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
    
  if (error || !data) return false;
  
  return data.role === 'admin';
}

// Tipos para as entidades do banco de dados
export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string | null;
  image_url: string | null;
  category_id: string | null;
  category_name?: string;
  category?: Category;
  slug: string;
  pages?: number | null;
  isbn?: string | null;
  publisher?: string | null;
  publication_year?: number | null;
  language?: string | null;
  format?: string | null;
  stock?: number | null;
  featured?: boolean;
  discount_percentage?: number | null;
  original_price?: number | null;
  cover_image?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export type Review = {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: User;
};

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address?: string;
  payment_method?: string;
  payment_status?: 'pending' | 'paid' | 'failed';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string;
  quantity: number;
  unit_price: number;
  book?: Book;
  created_at?: string;
  updated_at?: string;
}

export type Wishlist = {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
  book?: Book;
};

export type Coupon = {
  id: string;
  code: string;
  discount_percent: number | null;
  discount_value: number | null;
  min_purchase_value: number | null;
  start_date: string | null;
  expiry_date: string | null;
  is_active: boolean;
  usage_limit: number | null;
  usage_count: number;
  created_at: string;
}; 