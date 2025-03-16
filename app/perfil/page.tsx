'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function PerfilPage() {
  const router = useRouter();
  const { usuario, carregando } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: ''
  });
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!carregando && !usuario) {
      router.push('/login');
    } else if (usuario) {
      // Carregar dados do perfil do localStorage
      const perfilSalvo = localStorage.getItem(`perfil_${usuario.id}`);
      if (perfilSalvo) {
        try {
          const perfilData = JSON.parse(perfilSalvo);
          setFormData(prev => ({
            ...prev,
            ...perfilData,
            nome: usuario.nome,
            email: usuario.email
          }));
        } catch (error) {
          console.error('Erro ao carregar dados do perfil:', error);
        }
      } else {
        // Se não tiver perfil salvo, inicializar com os dados do usuário
        setFormData(prev => ({
          ...prev,
          nome: usuario.nome,
          email: usuario.email
        }));
      }
    }
  }, [usuario, carregando, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setSalvando(true);
    
    try {
      // Em uma aplicação real, isso seria uma chamada API
      setTimeout(() => {
        if (usuario) {
          localStorage.setItem(`perfil_${usuario.id}`, JSON.stringify(formData));
          setMensagem({ texto: 'Perfil atualizado com sucesso!', tipo: 'sucesso' });
          setEditando(false);
          setSalvando(false);
          
          // Limpar mensagem após 3 segundos
          setTimeout(() => {
            setMensagem(null);
          }, 3000);
        }
      }, 1000);
    } catch (error) {
      setMensagem({ texto: 'Erro ao atualizar perfil. Tente novamente.', tipo: 'erro' });
      setSalvando(false);
    }
  };

  if (carregando || !usuario) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Editar Perfil
            </button>
          ) : (
            <button
              onClick={() => setEditando(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          )}
        </div>
        
        {mensagem && (
          <div className={`p-4 mb-6 rounded ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensagem.texto}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                disabled={!editando}
                className={`w-full p-2 border rounded-md ${editando ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
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
                value={formData.email}
                disabled
                className="w-full p-2 border border-gray-200 rounded-md bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
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
                onChange={handleChange}
                disabled={!editando}
                className={`w-full p-2 border rounded-md ${editando ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
              />
            </div>
          </div>
          
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Endereço</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço Completo
              </label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                disabled={!editando}
                className={`w-full p-2 border rounded-md ${editando ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
              />
            </div>
            
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                disabled={!editando}
                className={`w-full p-2 border rounded-md ${editando ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  disabled={!editando}
                  className={`w-full p-2 border rounded-md ${editando ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
                />
              </div>
              
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  disabled={!editando}
                  className={`w-full p-2 border rounded-md ${editando ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
                />
              </div>
            </div>
          </div>
          
          {editando && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={salvando}
                className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
                  salvando ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 