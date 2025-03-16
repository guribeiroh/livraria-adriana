import { NextRequest, NextResponse } from 'next/server';
import { getBooksByCategory } from '@/app/lib/database';

export const runtime = 'edge';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const books = await getBooksByCategory(slug, limit, offset);
    
    if (books.length === 0 && offset === 0) {
      return NextResponse.json(
        { success: false, error: 'Categoria não encontrada ou sem livros' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: books,
      meta: {
        limit,
        offset,
        category_slug: slug
      }
    });
  } catch (error) {
    console.error(`Erro ao buscar livros da categoria ${params.slug}:`, error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar livros da categoria' },
      { status: 500 }
    );
  }
} 