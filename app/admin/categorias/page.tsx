'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { livros } from '../../data/livros';

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  totalLivros: number;
}

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoria, setNewCategoria] = useState({ nome: '', descricao: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState({ nome: '', descricao: '' });

  // Carregar categorias a partir dos livros
  useEffect(() => {
    // Obter todas as categorias únicas
    const categoriasUnicas = Array.from(new Set(livros.map(livro => livro.categoria)));
    
    // Contar o número de livros em cada categoria
    const contarLivrosPorCategoria = (categoria: string) => {
      return livros.filter(livro => livro.categoria === categoria).length;
    };
    
    // Criar objetos de categoria
    const categoriasData = categoriasUnicas.map((nome, index) => ({
      id: `cat_${index + 1}`,
      nome,
      descricao: `Categoria para livros de ${nome.toLowerCase()}.`,
      totalLivros: contarLivrosPorCategoria(nome)
    }));
    
    setCategorias(categoriasData);
  }, []);

  // Filtrar categorias com base na pesquisa
  const categoriasFiltradas = categorias.filter(cat => 
    cat.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adicionar nova categoria
  const handleAddCategoria = () => {
    if (!newCategoria.nome.trim()) {
      alert('O nome da categoria é obrigatório!');
      return;
    }

    const newId = `cat_${Date.now()}`;
    setCategorias(prev => [
      ...prev,
      {
        id: newId,
        nome: newCategoria.nome.trim(),
        descricao: newCategoria.descricao.trim(),
        totalLivros: 0
      }
    ]);

    setNewCategoria({ nome: '', descricao: '' });
    setIsAdding(false);
  };

  // Iniciar edição de categoria
  const handleStartEdit = (categoria: Categoria) => {
    setEditingId(categoria.id);
    setEditingValues({
      nome: categoria.nome,
      descricao: categoria.descricao
    });
  };

  // Salvar edição de categoria
  const handleSaveEdit = (id: string) => {
    if (!editingValues.nome.trim()) {
      alert('O nome da categoria é obrigatório!');
      return;
    }

    setCategorias(prev => prev.map(cat => 
      cat.id === id
        ? { ...cat, nome: editingValues.nome.trim(), descricao: editingValues.descricao.trim() }
        : cat
    ));

    setEditingId(null);
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Excluir categoria
  const handleDeleteCategoria = (id: string, nome: string) => {
    const categoria = categorias.find(c => c.id === id);
    
    if (categoria && categoria.totalLivros > 0) {
      alert(`Não é possível excluir a categoria "${nome}" pois existem ${categoria.totalLivros} livros associados a ela.`);
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir a categoria "${nome}"?`)) {
      setCategorias(prev => prev.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-primary-800">Gerenciar Categorias</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
          disabled={isAdding}
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
                value={newCategoria.nome}
                onChange={(e) => setNewCategoria(prev => ({ ...prev, nome: e.target.value }))}
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
                value={newCategoria.descricao}
                onChange={(e) => setNewCategoria(prev => ({ ...prev, descricao: e.target.value }))}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategoria({ nome: '', descricao: '' });
                }}
                className="text-gray-700 bg-white border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddCategoria}
                className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de categorias */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Total de Livros
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoriasFiltradas.length > 0 ? (
                categoriasFiltradas.map((categoria) => (
                  <tr key={categoria.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === categoria.id ? (
                        <input
                          type="text"
                          value={editingValues.nome}
                          onChange={(e) => setEditingValues(prev => ({ ...prev, nome: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-1 px-2 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{categoria.nome}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === categoria.id ? (
                        <textarea
                          rows={2}
                          value={editingValues.descricao}
                          onChange={(e) => setEditingValues(prev => ({ ...prev, descricao: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-1 px-2 text-sm"
                        ></textarea>
                      ) : (
                        <div className="text-sm text-gray-500">{categoria.descricao}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {categoria.totalLivros} {categoria.totalLivros === 1 ? 'livro' : 'livros'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {editingId === categoria.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(categoria.id)}
                            className="text-success-600 hover:text-success-900"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(categoria)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteCategoria(categoria.id, categoria.nome)}
                            className="text-error-600 hover:text-error-900"
                          >
                            Excluir
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'Nenhuma categoria encontrada.' : 'Nenhuma categoria cadastrada.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 