import { NextRequest, NextResponse } from 'next/server';
import { getBooks, getFeaturedBooks, getBestsellerBooks } from '@/app/lib/database';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const bestseller = searchParams.get('bestseller');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let books;
    
    if (featured === 'true') {
      books = await getFeaturedBooks(limit);
    } else if (bestseller === 'true') {
      books = await getBestsellerBooks(limit);
    } else {
      books = await getBooks(limit, offset);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: books,
      meta: {
        limit,
        offset,
        total: books.length // Idealmente, deveria vir do banco com um count total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar livros' },
      { status: 500 }
    );
  }
} 