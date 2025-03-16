import { NextResponse } from 'next/server';
import { getCategories } from '@/app/lib/database';

export async function GET() {
  try {
    const categories = await getCategories();
    
    return NextResponse.json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar categorias' },
      { status: 500 }
    );
  }
} 