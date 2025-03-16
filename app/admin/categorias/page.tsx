'use client';

import { useState, useEffect } from 'react';
import { Category } from '../../lib/supabase';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../lib/database';

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newCategoria, setNewCategoria] = useState({ 
    name: '', 
    description: '', 
    slug: '' 
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState({ 
    name: '', 
    description: '', 
    slug: '' 
  });

  // Carregar categorias do banco de dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const categoriasData = await getCategories();
        setCategorias(categoriasData);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Falha ao carregar os dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrar categorias com base na pesquisa
  const categoriasFiltradas = categorias.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Adicionar nova categoria
  const handleAddCategoria = async () => {
    if (!newCategoria.name.trim()) {
      alert('O nome da categoria é obrigatório!');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Gerar slug a partir do nome se não fornecido
      const categoriaData = {
        ...newCategoria,
        name: newCategoria.name.trim(),
        description: newCategoria.description.trim() || null
      };
      
      const result = await createCategory(categoriaData);
      
      if (result) {
        // Adicionar a nova categoria à lista local
        setCategorias(prev => [...prev, result]);
        setNewCategoria({ name: '', description: '', slug: '' });
        setIsAdding(false);
        alert('Categoria adicionada com sucesso!');
      } else {
        alert('Erro ao adicionar categoria. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      alert('Erro ao adicionar categoria. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar edição de categoria
  const handleStartEdit = (categoria: Category) => {
    setEditingId(categoria.id);
    setEditingValues({
      name: categoria.name,
      description: categoria.description || '',
      slug: categoria.slug
    });
  };

  // Salvar edição de categoria
  const handleSaveEdit = async (id: string) => {
    if (!editingValues.name.trim()) {
      alert('O nome da categoria é obrigatório!');
      return;
    }

    try {
      setIsLoading(true);
      
      const categoriaData = {
        ...editingValues,
        name: editingValues.name.trim(),
        description: editingValues.description.trim() || null
      };
      
      const result = await updateCategory(id, categoriaData);
      
      if (result) {
        // Atualizar categoria na lista local
        setCategorias(prev => prev.map(cat => cat.id === id ? result : cat));
        setEditingId(null);
        alert('Categoria atualizada com sucesso!');
      } else {
        alert('Erro ao atualizar categoria. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err);
      alert('Erro ao atualizar categoria. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Excluir categoria
  const handleDeleteCategoria = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir a categoria "${nome}"?`)) {
      try {
        setIsLoading(true);
        
        const success = await deleteCategory(id);
        
        if (success) {
          // Remover categoria da lista local
          setCategorias(prev => prev.filter(cat => cat.id !== id));
          alert('Categoria excluída com sucesso!');
        } else {
          alert('Não foi possível excluir esta categoria. Ela pode estar sendo usada por livros ou outro erro ocorreu.');
        }
      } catch (err) {
        console.error('Erro ao excluir categoria:', err);
        alert('Erro ao excluir categoria. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-primary-800">Gerenciar Categorias</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
          disabled={isAdding || isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Adicionar Nova Categoria
        </button>
      </div>

      {/* Pesquisa */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Estado de carregamento */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Formulário para adicionar categoria */}
      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500">
          <h3 className="text-lg font-medium text-primary-800 mb-4">Adicionar Nova Categoria</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="novaCatNome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Categoria *
              </label>
              <input
                type="text"
                id="novaCatNome"
                value={newCategoria.name}
                onChange={(e) => setNewCategoria(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3"
              />
            </div>
            <div>
              <label htmlFor="novaCatDesc" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="novaCatDesc"
                rows={3}
                value={newCategoria.description}
                onChange={(e) => setNewCategoria(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategoria({ name: '', description: '', slug: '' });
                }}
                className="text-gray-700 bg-white border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddCategoria}
                className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de categorias */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {categoriasFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'Nenhuma categoria encontrada com os termos da busca.' : 'Não há categorias cadastradas.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoriasFiltradas.map((categoria) => (
                    <tr key={categoria.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === categoria.id ? (
                          <input
                            type="text"
                            value={editingValues.name}
                            onChange={(e) => setEditingValues(prev => ({ ...prev, name: e.target.value }))}
                            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-1 px-2 text-sm"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{categoria.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === categoria.id ? (
                          <textarea
                            rows={2}
                            value={editingValues.description}
                            onChange={(e) => setEditingValues(prev => ({ ...prev, description: e.target.value }))}
                            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-1 px-2 text-sm"
                          ></textarea>
                        ) : (
                          <div className="text-sm text-gray-500">{categoria.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {categoria.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {editingId === categoria.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(categoria.id)}
                              className="text-success-600 hover:text-success-900"
                              disabled={isLoading}
                            >
                              Salvar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                              disabled={isLoading}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(categoria)}
                              className="text-primary-600 hover:text-primary-900"
                              disabled={isLoading}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteCategoria(categoria.id, categoria.name)}
                              className="text-error-600 hover:text-error-900"
                              disabled={isLoading}
                            >
                              Excluir
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 