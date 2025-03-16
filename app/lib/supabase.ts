import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL ou Anon Key ausente. Verifique suas variáveis de ambiente.');
}

// Criar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export type Category = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  description: string | null;
  price: number;
  original_price: number | null;
  isbn: string | null;
  publication_year: number | null;
  pages: number | null;
  stock: number;
  cover_image: string | null;
  category_id: string | null;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_active: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
  category?: Category;
};

export type Review = {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: User;
};

export type Order = {
  id: string;
  user_id: string | null;
  status: string;
  total: number;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zipcode: string | null;
  payment_method: string | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  user?: User;
};

export type OrderItem = {
  id: string;
  order_id: string;
  book_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  book?: Book;
};

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