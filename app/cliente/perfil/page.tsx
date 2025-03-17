'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';

interface ProfileData {
  name: string;
  email: string;
  // Removido campos de endereço e telefone que não existem na tabela profiles
}

interface Address {
  id: string;
  user_id: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  padrao: boolean;
}

export default function ClientePerfilPage() {
  const { usuario } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Buscar dados do perfil
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!usuario) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', usuario.id)
          .single();

        if (error) throw error;

        // Agora estamos pegando apenas os campos que existem na tabela
        setProfileData({
          name: data.name || '',
          email: data.email || '',
        });
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [usuario]);

  // Buscar endereços do usuário
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!usuario) return;

      try {
        setLoadingAddresses(true);
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', usuario.id)
          .order('padrao', { ascending: false });

        if (error) throw error;

        setAddresses(data || []);
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [usuario]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario) return;
    
    try {
      setSaving(true);
      setMessage(null);
      
      // Agora estamos atualizando apenas campos que existem na tabela profiles
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', usuario.id);
      
      if (error) throw error;
      
      setMessage({
        type: 'success',
        text: 'Perfil atualizado com sucesso!'
      });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({
        type: 'error',
        text: `Erro ao atualizar perfil: ${error.message}`
      });
    } finally {
      setSaving(false);
      
      // Limpar a mensagem após 5 segundos
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}
      
      {/* Perfil Básico */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Informações Básicas</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                O email não pode ser alterado
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Endereços */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-semibold">Meus Endereços</h2>
          <a 
            href="/cliente/enderecos/novo" 
            className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Adicionar Endereço
          </a>
        </div>
        
        {loadingAddresses ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-gray-50 p-6 text-center rounded-md">
            <p className="text-gray-600 mb-4">Você ainda não possui endereços cadastrados.</p>
            <a 
              href="/cliente/enderecos/novo" 
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors inline-block"
            >
              Cadastrar Endereço
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map(address => (
              <div key={address.id} className={`border rounded-md p-4 relative ${address.padrao ? 'border-primary-400 bg-primary-50' : 'border-gray-200'}`}>
                {address.padrao && (
                  <span className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                    Endereço Principal
                  </span>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm text-gray-500">Nome:</span>
                    <p className="text-gray-800 font-medium">{`${address.nome} ${address.sobrenome}`}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Telefone:</span>
                    <p className="text-gray-800">{address.telefone || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Endereço:</span>
                  <p className="text-gray-800">
                    {`${address.rua}, ${address.numero} ${address.complemento ? `- ${address.complemento}` : ''}`}
                  </p>
                  <p className="text-gray-800">
                    {`${address.bairro} - ${address.cidade}/${address.estado} - CEP: ${address.cep}`}
                  </p>
                </div>
                
                <div className="mt-3 flex justify-end space-x-2">
                  <a 
                    href={`/cliente/enderecos/editar/${address.id}`}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    Editar
                  </a>
                  {!address.padrao && (
                    <button
                      onClick={async () => {
                        try {
                          // Atualizar endereço como padrão
                          await supabase.from('user_addresses')
                            .update({ padrao: false })
                            .eq('user_id', usuario?.id);
                            
                          const { error } = await supabase.from('user_addresses')
                            .update({ padrao: true })
                            .eq('id', address.id);
                            
                          if (error) throw error;
                          
                          // Recarregar endereços
                          const { data } = await supabase
                            .from('user_addresses')
                            .select('*')
                            .eq('user_id', usuario?.id)
                            .order('padrao', { ascending: false });
                            
                          setAddresses(data || []);
                          setMessage({
                            type: 'success',
                            text: 'Endereço definido como principal!'
                          });
                        } catch (error: any) {
                          console.error('Erro ao definir endereço como padrão:', error);
                          setMessage({
                            type: 'error',
                            text: `Erro: ${error.message}`
                          });
                        }
                      }}
                      className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                    >
                      Definir como Principal
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 