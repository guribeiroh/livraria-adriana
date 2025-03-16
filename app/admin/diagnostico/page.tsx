'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';

// Interface para resultados dos testes
interface TestResult {
  name: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  details?: string;
  timestamp: string;
}

export default function DiagnosticoPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [envVariables, setEnvVariables] = useState({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` 
      : ''
  });

  // Função para adicionar resultado de teste
  const addTestResult = (result: Omit<TestResult, 'timestamp'>) => {
    setResults(prev => [
      ...prev,
      {
        ...result,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Teste de conexão com o Supabase
  const testConnection = async () => {
    addTestResult({
      name: 'Conexão com o Supabase',
      status: 'loading',
      message: 'Testando conexão...'
    });

    try {
      const { data, error } = await supabase.from('books').select('count()', { count: 'exact' }).limit(1);
      
      if (error) throw error;

      addTestResult({
        name: 'Conexão com o Supabase',
        status: 'success',
        message: 'Conexão estabelecida com sucesso',
        details: `Total de livros: ${data?.[0]?.count || 0}`
      });
      return true;
    } catch (error: any) {
      addTestResult({
        name: 'Conexão com o Supabase',
        status: 'error',
        message: 'Falha na conexão',
        details: error.message || 'Erro desconhecido'
      });
      return false;
    }
  };

  // Teste de permissões de leitura
  const testReadPermissions = async () => {
    addTestResult({
      name: 'Permissões de Leitura',
      status: 'loading',
      message: 'Testando permissões de leitura...'
    });

    try {
      const { data, error } = await supabase.from('books').select('id, title').limit(1);
      
      if (error) throw error;

      addTestResult({
        name: 'Permissões de Leitura',
        status: 'success',
        message: 'Permissões de leitura OK',
        details: data?.length 
          ? `Exemplo de livro: ${data[0].title} (ID: ${data[0].id})` 
          : 'Nenhum livro encontrado, mas a consulta foi bem-sucedida'
      });
      return true;
    } catch (error: any) {
      addTestResult({
        name: 'Permissões de Leitura',
        status: 'error',
        message: 'Falha nas permissões de leitura',
        details: error.message || 'Erro desconhecido'
      });
      return false;
    }
  };

  // Teste de permissões de escrita
  const testWritePermissions = async () => {
    addTestResult({
      name: 'Permissões de Escrita',
      status: 'loading',
      message: 'Testando permissões de escrita...'
    });

    try {
      // Cria um registro temporário de teste
      const testBook = {
        title: `Livro de Teste ${Date.now()}`,
        author: 'Sistema de Diagnóstico',
        description: 'Livro criado para testar permissões de escrita',
        price: 0.01,
        is_active: false,
        slug: `teste-${Date.now()}`
      };

      const { data: insertData, error: insertError } = await supabase
        .from('books')
        .insert(testBook)
        .select()
        .single();
      
      if (insertError) throw insertError;

      // Se conseguiu inserir, tenta excluir o registro de teste
      const { error: deleteError } = await supabase
        .from('books')
        .delete()
        .eq('id', insertData.id);
      
      if (deleteError) {
        addTestResult({
          name: 'Permissões de Escrita',
          status: 'error',
          message: 'Inserção OK, mas falha na exclusão',
          details: deleteError.message
        });
        return false;
      }

      addTestResult({
        name: 'Permissões de Escrita',
        status: 'success',
        message: 'Permissões de escrita OK',
        details: 'Conseguiu inserir e excluir um registro de teste'
      });
      return true;
    } catch (error: any) {
      addTestResult({
        name: 'Permissões de Escrita',
        status: 'error',
        message: 'Falha nas permissões de escrita',
        details: error.message || 'Erro desconhecido'
      });
      return false;
    }
  };

  // Verifica a estrutura do banco
  const testDatabaseSchema = async () => {
    addTestResult({
      name: 'Estrutura do Banco',
      status: 'loading',
      message: 'Verificando estrutura do banco de dados...'
    });

    try {
      // Verifica se as tabelas necessárias existem
      const tablesNeeded = ['books', 'categories', 'users', 'orders'];
      const errors = [];

      for (const table of tablesNeeded) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          errors.push(`Tabela ${table}: ${error.message}`);
        }
      }

      if (errors.length > 0) {
        addTestResult({
          name: 'Estrutura do Banco',
          status: 'error',
          message: 'Algumas tabelas estão faltando ou com problemas de acesso',
          details: errors.join('\n')
        });
        return false;
      }

      addTestResult({
        name: 'Estrutura do Banco',
        status: 'success',
        message: 'Estrutura do banco OK',
        details: 'Todas as tabelas necessárias estão acessíveis'
      });
      return true;
    } catch (error: any) {
      addTestResult({
        name: 'Estrutura do Banco',
        status: 'error',
        message: 'Falha ao verificar estrutura do banco',
        details: error.message || 'Erro desconhecido'
      });
      return false;
    }
  };

  // Executa todos os testes
  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    // Teste de variáveis de ambiente
    const hasEnvVars = Boolean(envVariables.supabaseUrl && envVariables.supabaseAnonKey);
    addTestResult({
      name: 'Variáveis de Ambiente',
      status: hasEnvVars ? 'success' : 'error',
      message: hasEnvVars 
        ? 'Variáveis de ambiente configuradas' 
        : 'Variáveis de ambiente ausentes ou incompletas',
      details: `URL: ${envVariables.supabaseUrl ? 'Configurada' : 'Não configurada'}, Chave: ${envVariables.supabaseAnonKey ? 'Configurada' : 'Não configurada'}`
    });

    if (!hasEnvVars) {
      setIsRunning(false);
      return;
    }

    // Executa os testes em sequência
    const connected = await testConnection();
    if (!connected) {
      setIsRunning(false);
      return;
    }

    await testReadPermissions();
    await testWritePermissions();
    await testDatabaseSchema();

    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-800">Diagnóstico do Supabase</h2>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`px-4 py-2 rounded-lg text-white ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {isRunning ? 'Executando...' : 'Executar Diagnóstico'}
        </button>
      </div>

      {/* Informações de configuração */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Configuração do Supabase</h3>
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium w-40">URL:</span>
            <span className={`text-sm ${!envVariables.supabaseUrl ? 'text-red-500' : ''}`}>
              {envVariables.supabaseUrl || 'Não configurado'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium w-40">Chave Anônima:</span>
            <span className={`text-sm ${!envVariables.supabaseAnonKey ? 'text-red-500' : ''}`}>
              {envVariables.supabaseAnonKey || 'Não configurado'}
            </span>
          </div>
        </div>
      </div>

      {/* Resultados dos testes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Resultados do Diagnóstico</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {results.length === 0 ? (
            <div className="px-6 py-4 text-gray-500 text-center">
              Nenhum diagnóstico executado. Clique em "Executar Diagnóstico" para começar.
            </div>
          ) : (
            results.map((result, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {result.status === 'loading' && (
                      <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
                    )}
                    {result.status === 'success' && (
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {result.status === 'error' && (
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="font-medium">{result.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{result.timestamp}</span>
                </div>
                <p className={`mt-1 ml-7 text-sm ${
                  result.status === 'error' ? 'text-red-600' : 
                  result.status === 'success' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {result.message}
                </p>
                {result.details && (
                  <pre className="mt-2 ml-7 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                    {result.details}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dicas de solução de problemas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Dicas para Solução de Problemas</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Verifique se as variáveis de ambiente estão configuradas corretamente no arquivo <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code></li>
          <li>Certifique-se de que o projeto Supabase está ativo e funcionando normalmente</li>
          <li>Verifique se as tabelas necessárias foram criadas no banco de dados</li>
          <li>Verifique as políticas de segurança do Supabase para garantir as permissões adequadas</li>
          <li>Se estiver usando um domínio personalizado, verifique se o domínio está configurado corretamente</li>
        </ul>
      </div>
    </div>
  );
} 