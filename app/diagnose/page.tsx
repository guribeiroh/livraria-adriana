'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface StorageInfo {
  key: string;
  exists: boolean;
  value?: string;
}

export default function DiagnosticPage() {
  const { usuario, carregando } = useAuth();
  const [storageData, setStorageData] = useState<StorageInfo[]>([]);
  const [sessionData, setSessionData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshed, setRefreshed] = useState(false);

  // Verificar informações de autenticação
  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        // Verificar valores no localStorage
        const storageKeys = [
          'supabase.auth.token',
          'sb-refresh-token',
          'sb-access-token',
        ];
        
        const storageInfo = storageKeys.map(key => {
          const value = localStorage.getItem(key);
          return {
            key,
            exists: !!value,
            value: value ? `${value.substring(0, 20)}...` : undefined
          };
        });
        
        setStorageData(storageInfo);

        // Verificar sessão atual
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
        } else {
          setSessionData(data.session);
          
          if (data.session?.user) {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .single();
              
            if (userError) {
              setError(userError.message);
            } else {
              setUserInfo(userData);
            }
          }
        }
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      }
    };

    verificarAutenticacao();
  }, [refreshed]);

  // Função para atualizar a sessão
  const refreshSession = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        setError(error.message);
      } else {
        setRefreshed(!refreshed);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar sessão');
    }
  };

  // Função para limpar o localStorage
  const limparStorage = () => {
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-refresh-token');
    localStorage.removeItem('sb-access-token');
    setRefreshed(!refreshed);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Autenticação</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Status da Autenticação</h2>
        
        <div className="mb-4">
          <p className="mb-2"><strong>Contexto de Auth:</strong></p>
          <div className="bg-gray-100 p-3 rounded">
            <pre>{carregando ? 'Carregando...' : usuario ? 'Autenticado' : 'Não autenticado'}</pre>
            {usuario && (
              <pre className="mt-2">{JSON.stringify(usuario, null, 2)}</pre>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="mb-2"><strong>Sessão Atual do Supabase:</strong></p>
          <div className="bg-gray-100 p-3 rounded">
            <pre>{sessionData ? 'Sessão ativa' : 'Sem sessão'}</pre>
            {sessionData && (
              <pre className="mt-2">{JSON.stringify({
                userId: sessionData.user?.id,
                email: sessionData.user?.email,
                aud: sessionData.user?.aud,
                expires_at: sessionData.expires_at,
              }, null, 2)}</pre>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="mb-2"><strong>Perfil do Usuário:</strong></p>
          <div className="bg-gray-100 p-3 rounded">
            <pre>{userInfo ? 'Perfil encontrado' : 'Sem perfil'}</pre>
            {userInfo && (
              <pre className="mt-2">{JSON.stringify(userInfo, null, 2)}</pre>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="mb-2"><strong>Dados de Armazenamento:</strong></p>
          <div className="bg-gray-100 p-3 rounded">
            <pre>{JSON.stringify(storageData, null, 2)}</pre>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            <p><strong>Erro:</strong> {error}</p>
          </div>
        )}
        
        <div className="flex space-x-4 mt-6">
          <button
            onClick={refreshSession}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Atualizar Sessão
          </button>
          
          <button
            onClick={limparStorage}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Limpar Storage
          </button>
          
          <button
            onClick={() => setRefreshed(!refreshed)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Atualizar Informações
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Diagnóstico de Problemas</h2>
        
        <div className="space-y-2">
          <p className={`${sessionData && usuario ? 'text-green-600' : 'text-red-600'}`}>
            {sessionData && usuario ? '✓' : '✗'} Sessão e usuário sincronizados
          </p>
          
          <p className={`${storageData.some(item => item.exists) ? 'text-green-600' : 'text-red-600'}`}>
            {storageData.some(item => item.exists) ? '✓' : '✗'} Dados de autenticação no localStorage
          </p>
          
          <p className={`${userInfo ? 'text-green-600' : 'text-red-600'}`}>
            {userInfo ? '✓' : '✗'} Perfil do usuário encontrado no banco de dados
          </p>
          
          {sessionData && !userInfo && (
            <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4">
              <p className="font-bold">Problema detectado:</p>
              <p>Sessão válida, mas perfil do usuário não encontrado no banco de dados.</p>
              <p className="mt-2">Solução: Recrie o perfil do usuário ou faça logout e login novamente.</p>
            </div>
          )}
          
          {!sessionData && storageData.some(item => item.exists) && (
            <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4">
              <p className="font-bold">Problema detectado:</p>
              <p>Dados de autenticação no localStorage, mas sem sessão ativa.</p>
              <p className="mt-2">Solução: Limpe o localStorage e faça login novamente.</p>
            </div>
          )}
          
          {usuario && !sessionData && (
            <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4">
              <p className="font-bold">Problema detectado:</p>
              <p>Usuário presente no contexto, mas sem sessão ativa no Supabase.</p>
              <p className="mt-2">Solução: Faça logout e login novamente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 