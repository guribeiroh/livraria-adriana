import { supabase } from './supabase';
import { Book, Category, Review, Order, OrderItem, User, Wishlist, Coupon } from './supabase';
import { slugify } from './utils';

// Funções para obter dados
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro não tratado ao buscar categorias:', err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Erro ao buscar categoria com slug ${slug}:`, error);
    return null;
  }

  return data;
}

export async function getBooks(limit: number = 20, offset: number = 0): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Erro ao buscar livros:', error);
    return [];
  }

  return data || [];
}

export async function getBooksByCategory(categorySlug: string, limit: number = 20, offset: number = 0): Promise<Book[]> {
  const category = await getCategoryBySlug(categorySlug);
  
  if (!category) return [];

  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(`Erro ao buscar livros da categoria ${categorySlug}:`, error);
    return [];
  }

  return data || [];
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`Erro ao buscar livro com slug ${slug}:`, error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`Erro não tratado ao buscar livro com slug ${slug}:`, err);
    return null;
  }
}

export async function searchBooks(query: string, limit: number = 20): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('is_active', true)
    .order('title')
    .limit(limit);

  if (error) {
    console.error(`Erro ao pesquisar livros com a consulta "${query}":`, error);
    return [];
  }

  return data || [];
}

export async function getFeaturedBooks(limit: number = 8): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar livros em destaque:', error);
    return [];
  }

  return data || [];
}

export async function getBestsellerBooks(limit: number = 8): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('is_bestseller', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar livros mais vendidos:', error);
    return [];
  }

  return data || [];
}

export async function getBookReviews(bookId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:users(id, name)
    `)
    .eq('book_id', bookId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Erro ao buscar avaliações do livro ${bookId}:`, error);
    return [];
  }

  return data || [];
}

// Funções para gerenciar usuários
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error(`Erro ao buscar usuário com ID ${userId}:`, error);
    return null;
  }

  return data;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error(`Erro ao buscar usuário com email ${email}:`, error);
    return null;
  }

  return data;
}

// Funções para gerenciar pedidos
export async function createOrder(order: Partial<Order>, items: Partial<OrderItem>[]): Promise<Order | null> {
  // Começar uma transação
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (orderError) {
    console.error('Erro ao criar pedido:', orderError);
    return null;
  }

  // Adicionar o ID do pedido aos itens
  const orderItems = items.map(item => ({
    ...item,
    order_id: newOrder.id
  }));

  // Inserir os itens do pedido
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Erro ao adicionar itens ao pedido:', itemsError);
    // Aqui poderíamos tentar reverter a criação do pedido, mas deixaremos assim por simplicidade
    return null;
  }

  return newOrder;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Erro ao buscar pedidos do usuário ${userId}:`, error);
    return [];
  }

  return data || [];
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderError) {
    console.error(`Erro ao buscar pedido ${orderId}:`, orderError);
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      *,
      book:books(id, title, author, price, cover_image, slug)
    `)
    .eq('order_id', orderId);

  if (itemsError) {
    console.error(`Erro ao buscar itens do pedido ${orderId}:`, itemsError);
    return order;
  }

  return {
    ...order,
    items: items || []
  };
}

// Funções para gerenciar lista de desejos
export async function addToWishlist(userId: string, bookId: string): Promise<boolean> {
  const { error } = await supabase
    .from('wishlist')
    .insert({ user_id: userId, book_id: bookId });

  if (error) {
    console.error(`Erro ao adicionar livro ${bookId} à lista de desejos do usuário ${userId}:`, error);
    return false;
  }

  return true;
}

export async function removeFromWishlist(userId: string, bookId: string): Promise<boolean> {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .match({ user_id: userId, book_id: bookId });

  if (error) {
    console.error(`Erro ao remover livro ${bookId} da lista de desejos do usuário ${userId}:`, error);
    return false;
  }

  return true;
}

export async function getUserWishlist(userId: string): Promise<Wishlist[]> {
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      book:books(*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error(`Erro ao buscar lista de desejos do usuário ${userId}:`, error);
    return [];
  }

  return data || [];
}

// Funções para gerenciar cupons
export async function validateCoupon(code: string, totalValue: number): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .gte('expiry_date', new Date().toISOString())
    .single();

  if (error) {
    console.error(`Erro ao validar cupom ${code}:`, error);
    return null;
  }

  // Verificar se o cupom tem valor mínimo de compra
  if (data.min_purchase_value && totalValue < data.min_purchase_value) {
    return null;
  }

  return data;
}

// Funções para o painel de administração
export async function getAllBooks(limit: number = 100, offset: number = 0): Promise<Book[]> {
  try {
    console.log(`Buscando todos os livros (limite: ${limit}, offset: ${offset})`);
    
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .order('title')
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Erro ao buscar todos os livros:', error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem do erro:', error.message);
      return [];
    }

    console.log(`Encontrados ${data?.length || 0} livros`);
    return data || [];
  } catch (err) {
    console.error('Erro não tratado ao buscar livros:', err);
    return [];
  }
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
  try {
    console.log(`Atualizando livro ${id} com dados brutos:`, updates);
    
    // Remover campos que não devem ser atualizados
    const { 
      id: bookId, 
      created_at, 
      updated_at, 
      category,
      ...safeUpdates 
    } = updates as any;
    
    // Certificar-se de que os campos numéricos sejam números
    if (safeUpdates.price !== undefined) safeUpdates.price = Number(safeUpdates.price);
    if (safeUpdates.stock !== undefined) safeUpdates.stock = Number(safeUpdates.stock);
    
    // Garantir que temos um slug válido se o título foi alterado
    if (safeUpdates.title && !safeUpdates.slug) {
      safeUpdates.slug = slugify(safeUpdates.title);
    }
    
    console.log('Dados simplificados para atualização:', safeUpdates);
    
    const { data, error } = await supabase
      .from('books')
      .update(safeUpdates)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Erro ao atualizar livro ${id}:`, error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem do erro:', error.message);
      console.error('Detalhes do erro:', error.details);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error(`Erro não tratado ao atualizar livro ${id}:`, err);
    return null;
  }
}

export async function createBook(book: Partial<Book>): Promise<Book | null> {
  try {
    console.log('Criando novo livro com dados brutos:', book);
    
    // Preparar dados básicos - abordagem minimalista
    const bookData = {
      title: book.title || 'Sem título',
      author: book.author || 'Desconhecido',
      price: Number(book.price || 0),
      slug: book.slug || slugify(book.title || 'sem-titulo'),
      // Outros campos opcionais
      ...(book.description ? { description: book.description } : {}),
      ...(book.isbn ? { isbn: book.isbn } : {}),
      ...(book.category_id ? { category_id: book.category_id } : {}),
      ...(book.cover_image ? { cover_image: book.cover_image } : {}),
      ...(book.stock !== undefined ? { stock: Number(book.stock) } : { stock: 0 }),
      // Campos booleanos com valores padrão
      is_active: book.is_active === undefined ? true : book.is_active,
      is_featured: book.is_featured || false,
      is_bestseller: book.is_bestseller || false,
      is_new: book.is_new === undefined ? true : book.is_new,
    };
    
    console.log('Dados simplificados para criação:', bookData);
    
    // Usar .select().maybeSingle() em vez de .select().single() para evitar erros
    const { data, error } = await supabase
      .from('books')
      .insert(bookData)
      .select();

    if (error) {
      console.error('Erro ao criar livro:', error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem do erro:', error.message);
      console.error('Detalhes do erro:', error.details);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error('Erro não tratado ao criar livro:', err);
    return null;
  }
}

export async function deleteBook(id: string): Promise<boolean> {
  try {
    console.log(`Tentando deletar livro com ID: ${id}`);
    
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erro ao deletar livro ${id}:`, error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem do erro:', error.message);
      console.error('Detalhes do erro:', error.details);
      return false;
    }

    console.log(`Livro com ID ${id} deletado com sucesso`);
    return true;
  } catch (err) {
    console.error(`Erro não tratado ao deletar livro ${id}:`, err);
    return false;
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erro ao buscar livro com ID ${id}:`, error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`Erro não tratado ao buscar livro com ID ${id}:`, err);
    return null;
  }
} 