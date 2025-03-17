'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { useRouter, useParams } from 'next/navigation';

export default function EditarEnderecoPage() {
  const { usuario } = useAuth();
  const router = useRouter();
  const params = useParams();
  const enderecoId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enderecoEncontrado, setEnderecoEncontrado] = useState(false);
  
  const [formData, setFormData] = useState({
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

  // Buscar dados do endereço ao carregar
  useEffect(() => {
    const fetchEndereco = async () => {
      if (!usuario || !enderecoId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('id', enderecoId)
          .eq('user_id', usuario.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            nome: data.nome || '',
            sobrenome: data.sobrenome || '',
            telefone: data.telefone || '',
            rua: data.rua || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
            cep: data.cep || '',
            padrao: data.padrao || false
          });
          setEnderecoEncontrado(true);
        } else {
          setError('Endereço não encontrado');
          setEnderecoEncontrado(false);
        }
      } catch (error: any) {
        console.error('Erro ao buscar endereço:', error);
        setError(`Erro ao buscar endereço: ${error.message}`);
        setEnderecoEncontrado(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEndereco();
  }, [usuario, enderecoId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario || !enderecoId) {
      setError('Informações incompletas para atualizar o endereço');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Se estiver definindo como padrão, remova o padrão dos outros endereços
      if (formData.padrao) {
        await supabase
          .from('user_addresses')
          .update({ padrao: false })
          .eq('user_id', usuario.id)
          .neq('id', enderecoId);
      }
      
      // Atualizar endereço
      const { error } = await supabase
        .from('user_addresses')
        .update({
          nome: formData.nome,
          sobrenome: formData.sobrenome,
          telefone: formData.telefone,
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento || null,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep,
          padrao: formData.padrao,
          updated_at: new Date().toISOString()
        })
        .eq('id', enderecoId)
        .eq('user_id', usuario.id);
        
      if (error) throw error;
      
      // Redirecionar para a página de perfil
      router.push('/cliente/perfil');
      
    } catch (error: any) {
      console.error('Erro ao atualizar endereço:', error);
      setError(`Erro ao atualizar endereço: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleExcluir = async () => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) {
      return;
    }
    
    if (!usuario || !enderecoId) {
      setError('Informações incompletas para excluir o endereço');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Verificar se é o único endereço
      const { data: addresses, error: countError } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_id', usuario.id);
        
      if (countError) throw countError;
      
      // Se for o único endereço com padrão=true, avise o usuário
      if (addresses.length === 1 && formData.padrao) {
        if (!confirm('Este é seu único endereço. Se excluí-lo, você precisará cadastrar um novo endereço para futuras compras. Deseja continuar?')) {
          setSaving(false);
          return;
        }
      }
      
      // Excluir endereço
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', enderecoId)
        .eq('user_id', usuario.id);
        
      if (error) throw error;
      
      // Redirecionar para a página de perfil
      router.push('/cliente/perfil');
      
    } catch (error: any) {
      console.error('Erro ao excluir endereço:', error);
      setError(`Erro ao excluir endereço: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!enderecoEncontrado && !loading) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-md">
        <h1 className="text-xl font-bold mb-2">Endereço não encontrado</h1>
        <p className="mb-4">O endereço que você está tentando editar não existe ou não pertence à sua conta.</p>
        <button
          onClick={() => router.push('/cliente/perfil')}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Voltar para Meu Perfil
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editar Endereço</h1>
        <button
          onClick={() => router.back()}
          className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-700 mb-1">
                Sobrenome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="sobrenome"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                CEP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleInputChange}
                placeholder="00000-000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">
                Rua <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="rua"
                name="rua"
                value={formData.rua}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                Número <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">
                Complemento
              </label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
                placeholder="Apartamento, bloco, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
                Bairro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="padrao"
                name="padrao"
                checked={formData.padrao}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="padrao" className="text-sm text-gray-700">
                Definir como endereço principal
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Este endereço será usado como padrão para entregas.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleExcluir}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Excluir Endereço
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 