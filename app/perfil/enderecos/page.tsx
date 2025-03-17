'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import Breadcrumb from '@/app/components/common/Breadcrumb';

// Interface para endereços de usuário
interface UserAddress {
  id: string;
  user_id: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  padrao: boolean;
  created_at: string;
  updated_at: string;
}

export default function GerenciarEnderecos() {
  const router = useRouter();
  const { usuario, carregandoAuth } = useAuth();
  
  const [enderecos, setEnderecos] = useState<UserAddress[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState<string | null>(null);
  const [novoEndereco, setNovoEndereco] = useState(false);
  
  // Estado para formulário de endereço
  const [formEndereco, setFormEndereco] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    padrao: false
  });
  
  // Carregar endereços do usuário
  useEffect(() => {
    const carregarEnderecos = async () => {
      try {
        if (!usuario || !usuario.id) {
          router.push('/login?next=/perfil/enderecos');
          return;
        }
        
        setCarregando(true);
        
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', usuario.id)
          .order('padrao', { ascending: false })
          .order('created_at', { ascending: false });
          
        if (error) {
          throw new Error(`Erro ao carregar endereços: ${error.message}`);
        }
        
        setEnderecos(data || []);
      } catch (error: any) {
        console.error('Erro ao carregar endereços:', error);
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarEnderecos();
  }, [usuario, router]);
  
  // Lidar com a exclusão de um endereço
  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) {
      return;
    }
    
    try {
      setCarregando(true);
      
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw new Error(`Erro ao excluir endereço: ${error.message}`);
      }
      
      // Atualizar lista de endereços
      setEnderecos(enderecos.filter(end => end.id !== id));
    } catch (error: any) {
      console.error('Erro ao excluir endereço:', error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };
  
  // Lidar com a edição de um endereço
  const handleEditar = (endereco: UserAddress) => {
    setModoEdicao(endereco.id);
    setFormEndereco({
      nome: endereco.nome,
      sobrenome: endereco.sobrenome,
      telefone: endereco.telefone || '',
      rua: endereco.rua,
      numero: endereco.numero,
      complemento: endereco.complemento || '',
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      cep: endereco.cep,
      padrao: endereco.padrao
    });
  };
  
  // Lidar com a criação de um novo endereço
  const handleNovoEndereco = () => {
    setNovoEndereco(true);
    setModoEdicao(null);
    
    // Inicializar com o nome do usuário, se disponível
    const profileName = usuario?.user_metadata?.name || '';
    const nameParts = profileName.split(' ');
    
    setFormEndereco({
      nome: nameParts[0] || '',
      sobrenome: nameParts.slice(1).join(' ') || '',
      telefone: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      padrao: enderecos.length === 0 // Definir como padrão se for o primeiro endereço
    });
  };
  
  // Lidar com a mudança de campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormEndereco(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  // Definir um endereço como padrão
  const handleDefinirPadrao = async (id: string) => {
    try {
      setCarregando(true);
      
      // Primeiro, remover o status de padrão de todos os endereços
      await supabase
        .from('user_addresses')
        .update({ padrao: false })
        .eq('user_id', usuario?.id);
      
      // Depois, definir o endereço selecionado como padrão
      const { error } = await supabase
        .from('user_addresses')
        .update({ padrao: true })
        .eq('id', id);
        
      if (error) {
        throw new Error(`Erro ao definir endereço como padrão: ${error.message}`);
      }
      
      // Atualizar lista de endereços
      setEnderecos(enderecos.map(end => ({
        ...end,
        padrao: end.id === id
      })));
    } catch (error: any) {
      console.error('Erro ao definir endereço como padrão:', error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };
  
  // Salvar endereço (novo ou editado)
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    const camposObrigatorios = [
      'nome', 'sobrenome', 'rua', 'numero', 
      'bairro', 'cidade', 'estado', 'cep'
    ];
    
    for (const campo of camposObrigatorios) {
      if (!formEndereco[campo as keyof typeof formEndereco]) {
        alert(`O campo ${campo} é obrigatório`);
        return;
      }
    }
    
    try {
      setCarregando(true);
      
      // Se for definir como padrão, remover o status de padrão dos outros endereços
      if (formEndereco.padrao) {
        await supabase
          .from('user_addresses')
          .update({ padrao: false })
          .eq('user_id', usuario?.id);
      }
      
      const dadosEndereco = {
        user_id: usuario?.id,
        nome: formEndereco.nome,
        sobrenome: formEndereco.sobrenome,
        telefone: formEndereco.telefone || null,
        rua: formEndereco.rua,
        numero: formEndereco.numero,
        complemento: formEndereco.complemento || null,
        bairro: formEndereco.bairro,
        cidade: formEndereco.cidade,
        estado: formEndereco.estado,
        cep: formEndereco.cep,
        padrao: formEndereco.padrao,
        updated_at: new Date().toISOString()
      };
      
      if (modoEdicao) {
        // Atualizar endereço existente
        const { data, error } = await supabase
          .from('user_addresses')
          .update(dadosEndereco)
          .eq('id', modoEdicao)
          .select()
          .single();
          
        if (error) {
          throw new Error(`Erro ao atualizar endereço: ${error.message}`);
        }
        
        // Atualizar lista de endereços
        setEnderecos(enderecos.map(end => 
          end.id === modoEdicao ? data : end
        ));
      } else {
        // Inserir novo endereço
        const { data, error } = await supabase
          .from('user_addresses')
          .insert(dadosEndereco)
          .select()
          .single();
          
        if (error) {
          throw new Error(`Erro ao adicionar endereço: ${error.message}`);
        }
        
        // Adicionar à lista de endereços
        setEnderecos([data, ...enderecos]);
      }
      
      // Limpar formulário e sair do modo edição
      setModoEdicao(null);
      setNovoEndereco(false);
    } catch (error: any) {
      console.error('Erro ao salvar endereço:', error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };
  
  // Cancelar edição ou criação
  const handleCancelar = () => {
    setModoEdicao(null);
    setNovoEndereco(false);
  };
  
  if (carregandoAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!usuario) {
    router.push('/login?next=/perfil/enderecos');
    return null;
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: 'Meu Perfil', href: '/perfil' },
          { label: 'Endereços', href: '/perfil/enderecos' }
        ]}
      />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Meus Endereços</h1>
      
      {erro && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Botão para adicionar novo endereço */}
      {!novoEndereco && !modoEdicao && (
        <button 
          onClick={handleNovoEndereco}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition flex items-center"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar Novo Endereço
        </button>
      )}
      
      {/* Formulário para edição ou criação de endereço */}
      {(modoEdicao || novoEndereco) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {modoEdicao ? 'Editar Endereço' : 'Novo Endereço'}
          </h2>
          
          <form onSubmit={handleSalvar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block mb-1 font-medium">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formEndereco.nome}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Sobrenome */}
              <div>
                <label htmlFor="sobrenome" className="block mb-1 font-medium">
                  Sobrenome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sobrenome"
                  name="sobrenome"
                  value={formEndereco.sobrenome}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="block mb-1 font-medium">
                Telefone
              </label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formEndereco.telefone}
                onChange={handleChange}
                placeholder="(99) 99999-9999"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rua */}
              <div>
                <label htmlFor="rua" className="block mb-1 font-medium">
                  Rua <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="rua"
                  name="rua"
                  value={formEndereco.rua}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Número */}
              <div>
                <label htmlFor="numero" className="block mb-1 font-medium">
                  Número <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formEndereco.numero}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {/* Complemento */}
            <div>
              <label htmlFor="complemento" className="block mb-1 font-medium">
                Complemento
              </label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                value={formEndereco.complemento}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bairro */}
              <div>
                <label htmlFor="bairro" className="block mb-1 font-medium">
                  Bairro <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={formEndereco.bairro}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Cidade */}
              <div>
                <label htmlFor="cidade" className="block mb-1 font-medium">
                  Cidade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={formEndereco.cidade}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estado */}
              <div>
                <label htmlFor="estado" className="block mb-1 font-medium">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formEndereco.estado}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
              
              {/* CEP */}
              <div>
                <label htmlFor="cep" className="block mb-1 font-medium">
                  CEP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={formEndereco.cep}
                  onChange={handleChange}
                  placeholder="99999-999"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {/* Endereço padrão */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="padrao"
                name="padrao"
                checked={formEndereco.padrao}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="padrao" className="ml-2 text-sm text-gray-700">
                Definir como endereço padrão
              </label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={handleCancelar}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={carregando}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
              >
                {carregando ? 'Salvando...' : 'Salvar Endereço'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Lista de endereços */}
      {!carregando && !modoEdicao && !novoEndereco && (
        <div className="space-y-4">
          {enderecos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 mb-4">Você ainda não possui endereços cadastrados.</p>
              <button
                onClick={handleNovoEndereco}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Primeiro Endereço
              </button>
            </div>
          ) : (
            enderecos.map(endereco => (
              <div key={endereco.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium text-lg">{endereco.nome} {endereco.sobrenome}</h3>
                      {endereco.padrao && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Endereço padrão
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      {endereco.rua}, {endereco.numero}{endereco.complemento ? ` - ${endereco.complemento}` : ''}
                    </p>
                    <p className="text-gray-600">
                      {endereco.bairro}, {endereco.cidade} - {endereco.estado}
                    </p>
                    <p className="text-gray-600">CEP: {endereco.cep}</p>
                    {endereco.telefone && (
                      <p className="text-gray-600">Telefone: {endereco.telefone}</p>
                    )}
                  </div>
                  
                  <div className="flex mt-4 md:mt-0 space-x-2">
                    {!endereco.padrao && (
                      <button
                        onClick={() => handleDefinirPadrao(endereco.id)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        Definir como padrão
                      </button>
                    )}
                    <button
                      onClick={() => handleEditar(endereco)}
                      className="px-3 py-1 border border-blue-500 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(endereco.id)}
                      className="px-3 py-1 border border-red-300 rounded-md text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 