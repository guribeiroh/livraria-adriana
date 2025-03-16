import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Esta rota é chamada pelo webhook de autenticação do Supabase
// quando eventos como inscrição, login e logout ocorrem
export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  // Verificar se o token JWT é válido
  const { data: { session } } = await supabase.auth.getSession();
  
  // Se o evento for um registro de um novo usuário, podemos criar um perfil automaticamente
  const body = await request.json();
  
  if (body.type === 'signup' && body.user) {
    const userId = body.user.id;
    const userEmail = body.user.email;
    const userName = body.user.user_metadata?.name || userEmail.split('@')[0];
    
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userEmail,
        name: userName,
        role: 'customer'
      });
      
    if (error) {
      console.error('Erro ao criar perfil:', error);
      return NextResponse.json({ error: 'Erro ao criar perfil' }, { status: 500 });
    }
  }
  
  return NextResponse.redirect(requestUrl.origin);
} 