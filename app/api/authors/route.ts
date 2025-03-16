import { NextRequest, NextResponse } from 'next/server';
import { getAuthors } from '@/app/lib/database';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const authors = await getAuthors();
    
    return NextResponse.json({ 
      success: true, 
      data: authors
    });
  } catch (error) {
    console.error('Erro ao buscar autores:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar autores' },
      { status: 500 }
    );
  }
} 