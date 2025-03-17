import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Criar cliente do Supabase usando cookies
  const res = NextResponse.next();
  
  try {
    // Obter o caminho atual
    const path = req.nextUrl.pathname;
    console.log(`[Middleware] Verificando rota: ${path}`);
    
    // Rotas públicas que não precisam de verificação
    const publicRoutes = [
      '/',
      '/login',
      '/registro',
      '/sobre',
      '/contato',
      '/busca',
      '/produto',
      '/duvidas',
    ];
    
    // Verificar se a rota atual é pública
    const isPublicRoute = publicRoutes.some(route => 
      path === route || path.startsWith(route + '/') ||
      path.startsWith('/api/') || 
      path.startsWith('/_next/') ||
      path.includes('.') // Recursos estáticos (js, css, imagens, etc.)
    );
    
    // Se for uma rota pública, não precisamos verificar autenticação
    if (isPublicRoute) {
      console.log('[Middleware] Rota pública - ignorando verificação');
      return res;
    }
    
    // Verificar se há um cookie de prevenção de loop
    const redirectLockCookie = req.cookies.get('auth_redirect_lock');
    if (redirectLockCookie) {
      // Extrair o timestamp do cookie
      const lockExpiry = parseInt(redirectLockCookie.value, 10);
      if (Date.now() < lockExpiry) {
        console.log('[Middleware] Bloqueio de redirecionamento ativo - permitindo acesso');
        const unlockedResponse = NextResponse.next();
        // O cookie será removido automaticamente quando expirar
        return unlockedResponse;
      }
    }
    
    // Criar cliente do Supabase usando cookies
    const supabase = createMiddlewareClient({ req, res });
    
    // Obter a sessão atual
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Verificar se o usuário está autenticado
    const isAuthenticated = !!session?.user;
    console.log('[Middleware] Estado de autenticação:', isAuthenticated ? 'Autenticado' : 'Não autenticado');
    
    // Verificar se a rota requer privilégios de administrador
    const adminRoutes = ['/admin', '/admin/'];
    const requiresAdmin = adminRoutes.some(route => 
      path === route || path.startsWith('/admin/')
    );
    
    // Para rotas de admin, verificar se o usuário é um administrador
    if (requiresAdmin) {
      // Se não estiver autenticado, redirecionar para o login
      if (!isAuthenticated) {
        console.log('[Middleware] Redirecionando para login (admin)');
        return redirectToLogin(req, path);
      }
      
      // Verificar se o usuário tem privilégios de administrador
      const isAdmin = session.user.user_metadata?.admin === true || 
                     session.user.user_metadata?.role === 'admin';
      
      if (!isAdmin) {
        console.log('[Middleware] Usuário não é admin - acesso negado');
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    // Para rotas protegidas comuns, verificar apenas autenticação
    const protectedRoutes = [
      '/cliente',
      '/perfil',
      '/carrinho/checkout',
      '/checkout',
    ];
    
    const requiresAuth = protectedRoutes.some(route => 
      path === route || path.startsWith(route + '/')
    );
    
    if (requiresAuth && !isAuthenticated) {
      console.log('[Middleware] Redirecionando para login (rota protegida)');
      return redirectToLogin(req, path);
    }

    return res;
  } catch (error) {
    console.error('[Middleware] Erro inesperado:', error);
    return res;
  }
}

function redirectToLogin(req: NextRequest, currentPath: string) {
  const redirectUrl = new URL('/login', req.url);
  redirectUrl.searchParams.set('next', currentPath);
  
  const response = NextResponse.redirect(redirectUrl);
  
  // Definir um cookie para evitar loops de redirecionamento
  // Este cookie tem um tempo de vida curto para evitar problemas
  const lockExpiry = Date.now() + 10000; // 10 segundos
  response.cookies.set('auth_redirect_lock', lockExpiry.toString(), { 
    maxAge: 10, // 10 segundos
    path: '/',
    httpOnly: true,
    sameSite: 'lax'
  });
  
  return response;
}

// Configurar quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    // Rotas para verificação de autenticação
    '/admin/:path*',
    '/cliente/:path*',
    '/perfil/:path*',
    '/carrinho/checkout',
    '/checkout/:path*',
    
    // Exclui recursos estáticos e API routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 