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
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro não tratado ao buscar livros:', err);
    return [];
  }
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
  try {
    console.log(`Atualizando livro ${id} com dados:`, updates);
    
    // Extrair somente os campos permitidos para atualização
    const { 
      title,
      author,
      description,
      price,
      original_price,
      isbn,
      publication_year,
      pages,
      stock,
      cover_image,
      category_id,
      is_featured,
      is_bestseller,
      is_new,
      is_active,
      slug,
    } = updates as any;
    
    // Criar objeto com apenas os campos permitidos
    const bookData: any = {};
    if (title !== undefined) bookData.title = title;
    if (author !== undefined) bookData.author = author;
    if (description !== undefined) bookData.description = description;
    if (price !== undefined) bookData.price = Number(price);
    if (original_price !== undefined) bookData.original_price = original_price ? Number(original_price) : null;
    if (isbn !== undefined) bookData.isbn = isbn;
    if (publication_year !== undefined) bookData.publication_year = publication_year ? Number(publication_year) : null;
    if (pages !== undefined) bookData.pages = pages ? Number(pages) : null;
    if (stock !== undefined) bookData.stock = Number(stock || 0);
    if (category_id !== undefined) bookData.category_id = category_id;
    if (is_featured !== undefined) bookData.is_featured = is_featured;
    if (is_bestseller !== undefined) bookData.is_bestseller = is_bestseller;
    if (is_new !== undefined) bookData.is_new = is_new;
    if (is_active !== undefined) bookData.is_active = is_active;
    
    // Tratar o slug (se o título foi modificado e não há slug explícito)
    if (title && !slug) {
      // No update, não validamos o slug para evitar problemas
      bookData.slug = updates.slug || slugify(title);
    } else if (slug) {
      bookData.slug = slug;
    }
    
    // Tratar a imagem (remover se for muito grande)
    if (cover_image !== undefined) {
      if (cover_image && typeof cover_image === 'string' && cover_image.length > 300000) {
        console.log('Imagem de capa muito grande, usando null');
        bookData.cover_image = null;
      } else {
        bookData.cover_image = cover_image;
      }
    }
    
    console.log('Dados finais para atualização:', bookData);
    
    const { data, error } = await supabase
      .from('books')
      .update(bookData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar livro ${id}:`, error);
      console.error(`Detalhes do erro:`, JSON.stringify(error));
      return null;
    }

    return data;
  } catch (err) {
    console.error(`Erro não tratado ao atualizar livro ${id}:`, err);
    return null;
  }
}

export async function createBook(book: Partial<Book>): Promise<Book | null> {
  try {
    console.log('Criando novo livro com dados:', book);
    
    // Extrair somente os campos permitidos para criação
    const { 
      title,
      author,
      description,
      price,
      original_price,
      isbn,
      publication_year,
      pages,
      stock,
      cover_image,
      category_id,
      is_featured,
      is_bestseller,
      is_new,
      is_active,
      slug,
    } = book as any;
    
    // Criar objeto com apenas os campos permitidos
    const bookData: any = {};
    if (title !== undefined) bookData.title = title;
    if (author !== undefined) bookData.author = author;
    if (description !== undefined) bookData.description = description;
    if (price !== undefined) bookData.price = Number(price);
    if (original_price !== undefined) bookData.original_price = original_price ? Number(original_price) : null;
    if (isbn !== undefined) bookData.isbn = isbn;
    if (publication_year !== undefined) bookData.publication_year = publication_year ? Number(publication_year) : null;
    if (pages !== undefined) bookData.pages = pages ? Number(pages) : null;
    if (stock !== undefined) bookData.stock = Number(stock || 0);
    if (category_id !== undefined) bookData.category_id = category_id;
    if (is_featured !== undefined) bookData.is_featured = is_featured;
    if (is_bestseller !== undefined) bookData.is_bestseller = is_bestseller;
    if (is_new !== undefined) bookData.is_new = is_new;
    if (is_active !== undefined) bookData.is_active = is_active;
    
    // Tratar o slug
    if (title) {
      bookData.slug = slug || slugify(title);
    }
    
    // Tratar a imagem (remover se for muito grande)
    if (cover_image !== undefined) {
      if (cover_image && typeof cover_image === 'string' && cover_image.length > 300000) {
        console.log('Imagem de capa muito grande, usando null');
        bookData.cover_image = null;
      } else {
        bookData.cover_image = cover_image;
      }
    }
    
    console.log('Dados finais para criação:', bookData);
    
    const { data, error } = await supabase
      .from('books')
      .insert(bookData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar livro:', error);
      console.error('Detalhes do erro:', JSON.stringify(error));
      return null;
    }

    return data;
  } catch (err) {
    console.error('Erro não tratado ao criar livro:', err);
    return null;
  }
}

export async function deleteBook(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erro ao deletar livro ${id}:`, error);
      return false;
    }

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