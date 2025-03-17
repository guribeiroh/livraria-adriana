import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Verificar se estamos em um loop de redirecionamento
  const redirectCount = req.headers.get('x-redirect-count');
  const count = redirectCount ? parseInt(redirectCount, 10) : 0;
  
  // Se já redirecionou 3 vezes, interromper o loop
  if (count > 2) {
    console.log('[Middleware] Detectado loop de redirecionamento - interrompendo');
    return NextResponse.next();
  }
  
  const res = NextResponse.next();
  
  try {
    // Obter o caminho atual
    const path = req.nextUrl.pathname;
    console.log(`[Middleware] Verificando rota: ${path}`);
    
    // Rotas a ignorar completamente (login, registro e rotas públicas)
    if (path === '/login' || path === '/registro' || path === '/' || 
        path.startsWith('/api/') || path.startsWith('/_next/')) {
      console.log('[Middleware] Rota pública - ignorando verificação');
      return res;
    }
    
    // Verificar se a URL de redirecionamento está em um cookie para evitar loops
    const loopCookie = req.cookies.get('prevent_redirect_loop');
    if (loopCookie && loopCookie.value === path) {
      console.log('[Middleware] Rota já foi redirecionada antes - evitando loop');
      // Limpar o cookie e continuar com a solicitação
      const response = NextResponse.next();
      response.cookies.delete('prevent_redirect_loop');
      return response;
    }
    
    // Checkout tem verificação própria, não vamos redirecionar aqui
    if (path.startsWith('/checkout')) {
      console.log('[Middleware] Rota de checkout - pulando verificação de middleware');
      return res;
    }
    
    // Criar cliente do Supabase usando cookies
    const supabase = createMiddlewareClient({ req, res });
    
    // Obter a sessão atual e atualizar os cookies de resposta
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Verificar se o usuário está autenticado e imprimir para debug
    console.log('[Middleware] Estado de autenticação:', session ? 'Autenticado' : 'Não autenticado');
    if (session?.user) {
      console.log('[Middleware] Usuário autenticado:', session.user.email);
    }
    
    // Lista de rotas que requerem autenticação
    const protectedRoutes = [
      '/admin',
      '/carrinho/checkout',
    ]; // Removido /perfil e /cliente para evitar o loop
    
    // Verificar se a rota atual está protegida
    const currentPath = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => 
      currentPath.startsWith(route)
    );
    
    console.log('[Middleware] Rota atual:', currentPath, 'Protegida:', isProtectedRoute);
    
    // Se a rota for protegida e o usuário não estiver autenticado, redirecionar para login
    if (isProtectedRoute && !session?.user) {
      console.log('[Middleware] Redirecionando para login');
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('next', currentPath);
      
      // Adicionar contador de redirecionamento ao cabeçalho
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set('x-redirect-count', (count + 1).toString());
      
      // Definir um cookie para evitar loops de redirecionamento
      response.cookies.set('prevent_redirect_loop', currentPath, { 
        maxAge: 60, // 1 minuto
        path: '/' 
      });
      
      return response;
    }

    return res;
  } catch (error) {
    console.error('[Middleware] Erro inesperado:', error);
    return res;
  }
}

// Configurar quais caminhos o middleware deve ser executado
export const config = {
  // Aplicar a rotas específicas que requerem verificação
  matcher: [
    '/admin/:path*',
    '/carrinho/checkout',
    '/checkout',
    '/checkout/:path*'
    // Removido '/perfil/:path*' para evitar o loop
  ],
}; 