import { NextResponse } from 'next/server';
import { getBookBySlug, getBookReviews } from '@/app/lib/database';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = params;
    const book = await getBookBySlug(slug);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 }
      );
    }
    
    // Buscar avaliações do livro
    const reviews = await getBookReviews(book.id);
    
    // Calcular classificação média
    const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? ratingSum / reviews.length : 0;
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...book,
        reviews,
        averageRating
      }
    });
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar livro' },
      { status: 500 }
    );
  }
} 