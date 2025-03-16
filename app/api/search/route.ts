import { NextResponse } from 'next/server';
import { searchBooks } from '@/app/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'O parâmetro de busca q é obrigatório' },
        { status: 400 }
      );
    }
    
    const books = await searchBooks(query, limit);
    
    return NextResponse.json({ 
      success: true, 
      data: books,
      meta: {
        query,
        resultsCount: books.length
      }
    });
  } catch (error) {
    console.error(`Erro na busca por "${request.url}":`, error);
    return NextResponse.json(
      { success: false, error: 'Erro ao realizar a busca' },
      { status: 500 }
    );
  }
} 