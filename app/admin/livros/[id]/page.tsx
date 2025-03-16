'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { livros } from '../../../data/livros';
import { Livro } from '../../../types';

export default function EditarLivroPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNewBook = params.id === 'novo';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Estado para categoria personalizada
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  
  // Lista de categorias existentes
  const categorias = Array.from(new Set(livros.map(livro => livro.categoria)));
  
  // Estado para mensagens de erro
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estado do formulário
  const [formData, setFormData] = useState<Partial<Livro>>({
    id: '',
    titulo: '',
    autor: '',
    descricao: '',
    preco: 0,
    precoOriginal: undefined,
    imagemUrl: '',
    paginas: 0,
    categoria: '',
    isbn: '',
    anoPublicacao: new Date().getFullYear(),
    disponivel: true
  });

  // Carregar dados do livro se for edição
  useEffect(() => {
    if (!isNewBook) {
      const livroEncontrado = livros.find(l => l.id === params.id);
      if (livroEncontrado) {
        setFormData(livroEncontrado);
        setImagePreview(livroEncontrado.imagemUrl);
      } else {
        alert('Livro não encontrado!');
        router.push('/admin/livros');
      }
    }
  }, [params.id, isNewBook, router]);

  // Simulação de upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Em uma aplicação real, você enviaria o arquivo para um servidor e obteria o URL
      const tempUrl = URL.createObjectURL(file);
      setImagePreview(tempUrl);
      setFormData(prev => ({ ...prev, imagemUrl: tempUrl }));
    }
  };

  // Atualizar dados do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'categoria' && value === 'other') {
      setShowCustomCategory(true);
      return;
    }

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro para o campo que acabou de ser modificado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar o formulário antes de submeter
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.titulo?.trim()) {
      newErrors.titulo = 'O título é obrigatório';
    }
    
    if (!formData.autor?.trim()) {
      newErrors.autor = 'O autor é obrigatório';
    }
    
    if (!formData.descricao?.trim()) {
      newErrors.descricao = 'A descrição é obrigatória';
    }
    
    if (!formData.isbn?.trim()) {
      newErrors.isbn = 'O ISBN é obrigatório';
    } else if (!/^[\d-]+$/.test(formData.isbn)) {
      newErrors.isbn = 'Formato de ISBN inválido';
    }
    
    if (!formData.imagemUrl) {
      newErrors.imagemUrl = 'A imagem é obrigatória';
    }
    
    if (!formData.categoria) {
      newErrors.categoria = 'A categoria é obrigatória';
    }
    
    if (formData.paginas <= 0) {
      newErrors.paginas = 'O número de páginas deve ser maior que zero';
    }
    
    if (formData.preco <= 0) {
      newErrors.preco = 'O preço deve ser maior que zero';
    }
    
    if (formData.precoOriginal && formData.precoOriginal <= formData.preco) {
      newErrors.precoOriginal = 'O preço original deve ser maior que o preço atual';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulação de API - em uma aplicação real, você enviaria os dados para o backend
    setTimeout(() => {
      if (isNewBook) {
        // Gerar ID fake para novo livro
        const newId = Date.now().toString();
        alert(`Livro ${formData.titulo} cadastrado com sucesso! ID: ${newId}`);
      } else {
        alert(`Livro ${formData.titulo} atualizado com sucesso!`);
      }
      
      setIsSubmitting(false);
      router.push('/admin/livros');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-800">
          {isNewBook ? 'Adicionar Novo Livro' : `Editar Livro: ${formData.titulo}`}
        </h2>
        <Link 
          href="/admin/livros" 
          className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar para a lista
        </Link>
      </div>

      {/* Mensagens de erro */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-error-50 text-error-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Corrija os seguintes erros:</span>
          </div>
          <ul className="list-disc list-inside pl-2 space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-primary-800">Informações do Livro</h3>
          <p className="text-sm text-gray-500">Preencha todos os campos obrigatórios (*)</p>
        </div>

        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna 1 */}
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className={`block w-full border ${
                  errors.titulo ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.titulo && (
                <p className="mt-1 text-sm text-error-600">{errors.titulo}</p>
              )}
            </div>

            {/* Autor */}
            <div>
              <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-1">
                Autor *
              </label>
              <input
                type="text"
                id="autor"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                className={`block w-full border ${
                  errors.autor ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.autor && (
                <p className="mt-1 text-sm text-error-600">{errors.autor}</p>
              )}
            </div>

            {/* ISBN */}
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN *
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Ex: 978-3-16-148410-0"
                className={`block w-full border ${
                  errors.isbn ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.isbn && (
                <p className="mt-1 text-sm text-error-600">{errors.isbn}</p>
              )}
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              {!showCustomCategory ? (
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={`block w-full border ${
                    errors.categoria ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm py-2 px-3`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="other">Outra (personalizada)</option>
                </select>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Digite a nova categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className={`flex-1 block w-full border ${
                      errors.categoria ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    } rounded-md shadow-sm py-2 px-3`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomCategory(false);
                      setFormData(prev => ({ ...prev, categoria: '' }));
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Cancelar
                  </button>
                </div>
              )}
              {errors.categoria && (
                <p className="mt-1 text-sm text-error-600">{errors.categoria}</p>
              )}
            </div>

            {/* Ano de Publicação */}
            <div>
              <label htmlFor="anoPublicacao" className="block text-sm font-medium text-gray-700 mb-1">
                Ano de Publicação *
              </label>
              <input
                type="number"
                id="anoPublicacao"
                name="anoPublicacao"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.anoPublicacao}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3"
              />
            </div>

            {/* Páginas */}
            <div>
              <label htmlFor="paginas" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Páginas *
              </label>
              <input
                type="number"
                id="paginas"
                name="paginas"
                min="1"
                value={formData.paginas}
                onChange={handleChange}
                className={`block w-full border ${
                  errors.paginas ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.paginas && (
                <p className="mt-1 text-sm text-error-600">{errors.paginas}</p>
              )}
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="space-y-6">
            {/* Preço */}
            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  id="preco"
                  name="preco"
                  min="0"
                  step="0.01"
                  value={formData.preco}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.preco ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm`}
                />
              </div>
              {errors.preco && (
                <p className="mt-1 text-sm text-error-600">{errors.preco}</p>
              )}
            </div>

            {/* Preço Original */}
            <div>
              <label htmlFor="precoOriginal" className="block text-sm font-medium text-gray-700 mb-1">
                Preço Original (R$)
                <span className="text-gray-500 text-xs ml-1">(opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  id="precoOriginal"
                  name="precoOriginal"
                  min="0"
                  step="0.01"
                  value={formData.precoOriginal || ''}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.precoOriginal ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm`}
                />
              </div>
              {errors.precoOriginal && (
                <p className="mt-1 text-sm text-error-600">{errors.precoOriginal}</p>
              )}
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem da Capa *
              </label>
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative w-40 h-60 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {imagePreview ? 'Alterar imagem' : 'Selecionar imagem'}
                  </label>
                  <input
                    type="file"
                    id="imagemUrl"
                    name="imagemUrl"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG ou GIF. Tamanho máximo 2MB.
                  </p>
                  {errors.imagemUrl && (
                    <p className="mt-1 text-sm text-error-600">{errors.imagemUrl}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Disponibilidade */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="disponivel"
                  name="disponivel"
                  checked={formData.disponivel}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="disponivel" className="ml-2 block text-sm text-gray-700">
                  Disponível em estoque
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Desmarque esta opção se o livro estiver indisponível
              </p>
            </div>
          </div>
        </div>

        {/* Descrição - Full width */}
        <div className="px-6 py-4">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={6}
            value={formData.descricao}
            onChange={handleChange}
            className={`block w-full border ${
              errors.descricao ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            } rounded-md shadow-sm py-2 px-3`}
          ></textarea>
          {errors.descricao && (
            <p className="mt-1 text-sm text-error-600">{errors.descricao}</p>
          )}
        </div>

        {/* Botões */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row-reverse sm:items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              'Salvar Livro'
            )}
          </button>
          <Link
            href="/admin/livros"
            className="w-full sm:w-auto text-center border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
} 