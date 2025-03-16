'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Book, Category } from '../../../lib/supabase';
import { getBookById, getCategories, updateBook, createBook } from '../../../lib/database';
import { slugify } from '../../../lib/utils';

export default function EditarLivroPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNewBook = params.id === 'novo';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!isNewBook);
  
  // Estado para categoria personalizada
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  
  // Lista de categorias existentes
  const [categorias, setCategorias] = useState<Category[]>([]);
  
  // Estado para mensagens de erro
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estado do formulário
  const [formData, setFormData] = useState<Partial<Book>>({
    id: '',
    title: '',
    author: '',
    description: '',
    price: 0,
    original_price: null,
    cover_image: '',
    pages: 0,
    category_id: '',
    isbn: '',
    publication_year: new Date().getFullYear(),
    is_active: true,
    is_featured: false,
    is_bestseller: false,
    is_new: true,
    stock: 0,
    slug: ''
  });

  // Carregar dados do livro e categorias
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar categorias em todos os casos
        const categoriasData = await getCategories();
        setCategorias(categoriasData);
        
        // Se não for um novo livro, carregar dados do livro existente
        if (!isNewBook) {
          const livro = await getBookById(params.id);
          
          if (livro) {
            setFormData({
              ...livro,
              category_id: livro.category_id || ''
            });
            setImagePreview(livro.cover_image || null);
          } else {
            alert('Livro não encontrado!');
            router.push('/admin/livros');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isNewBook, params.id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar tamanho do arquivo (limitar a 1MB)
      if (file.size > 1024 * 1024) {
        alert('Arquivo muito grande. O tamanho máximo permitido é 1MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        // Armazenar apenas uma versão reduzida da imagem em base64 se for muito longa
        if (result.length > 500000) {
          setFormData(prev => ({
            ...prev,
            cover_image: "data:image/jpeg;base64,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"
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            cover_image: result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Limpar erro do campo quando o usuário editar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Tratar diferentes tipos de campos
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else if (name === 'category_id' && value === 'custom') {
      setShowCustomCategory(true);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Gerar slug automaticamente a partir do título
        ...(name === 'title' ? { slug: slugify(value) } : {})
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validar campos realmente obrigatórios
    if (!formData.title?.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    
    if (!formData.author?.trim()) {
      newErrors.author = 'O autor é obrigatório';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'O preço deve ser maior que zero';
    }
    
    // Validar estoque
    if (formData.stock === undefined || formData.stock < 0) {
      newErrors.stock = 'A quantidade em estoque deve ser um número não negativo';
    }
    
    // Descrição e categoria são consideradas opcionais
    
    // ISBN é opcional
    
    // Imagem de capa é opcional
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Criar um objeto com apenas os campos essenciais
      const essentialFields = {
        title: formData.title,
        author: formData.author,
        price: formData.price ? Number(formData.price) : 0,
        // Campos opcionais - apenas incluídos se tiverem valor
        ...(formData.description ? { description: formData.description } : {}),
        ...(formData.category_id ? { category_id: formData.category_id } : {}),
        ...(formData.isbn ? { isbn: formData.isbn } : {}),
        ...(formData.original_price ? { original_price: Number(formData.original_price) } : {}),
        ...(formData.pages ? { pages: Number(formData.pages) } : {}),
        ...(formData.publication_year ? { publication_year: Number(formData.publication_year) } : {}),
        ...(formData.stock ? { stock: Number(formData.stock) } : {}),
        ...(formData.is_active !== undefined ? { is_active: formData.is_active } : {}),
        ...(formData.is_bestseller !== undefined ? { is_bestseller: formData.is_bestseller } : {}),
        ...(formData.is_featured !== undefined ? { is_featured: formData.is_featured } : {}),
        ...(formData.is_new !== undefined ? { is_new: formData.is_new } : {}),
        ...(formData.cover_image ? { cover_image: formData.cover_image } : {}),
        // Sempre incluir um slug, se disponível ou gerar a partir do título
        slug: formData.slug || slugify(formData.title || '')
      };
      
      console.log('Dados do livro a serem salvos:', essentialFields);
      
      let resultado;
      
      if (isNewBook) {
        resultado = await createBook(essentialFields);
      } else {
        resultado = await updateBook(formData.id as string, essentialFields);
      }
      
      if (resultado) {
        alert(`Livro ${isNewBook ? 'adicionado' : 'atualizado'} com sucesso!`);
        router.push('/admin/livros');
      } else {
        throw new Error('Falha ao salvar o livro.');
      }
    } catch (error) {
      console.error('Erro detalhado ao salvar livro:', error);
      alert(`Erro ao ${isNewBook ? 'criar' : 'atualizar'} o livro. Verifique o console para mais detalhes.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-800">
          {isNewBook ? 'Adicionar Novo Livro' : `Editar Livro: ${formData.title}`}
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full border ${
                  errors.title ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error-600">{errors.title}</p>
              )}
            </div>

            {/* Autor */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Autor *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`block w-full border ${
                  errors.author ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.author && (
                <p className="mt-1 text-sm text-error-600">{errors.author}</p>
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
                value={formData.isbn || ''}
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
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              {!showCustomCategory ? (
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id || ''}
                  onChange={handleChange}
                  className={`block w-full border ${
                    errors.category_id ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm py-2 px-3`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  <option value="custom">Outra (personalizada)</option>
                </select>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Digite a nova categoria"
                    name="category_id"
                    value={formData.category_id || ''}
                    onChange={handleChange}
                    className={`flex-1 block w-full border ${
                      errors.category_id ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    } rounded-md shadow-sm py-2 px-3`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomCategory(false);
                      setFormData(prev => ({ ...prev, category_id: '' }));
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Cancelar
                  </button>
                </div>
              )}
              {errors.category_id && (
                <p className="mt-1 text-sm text-error-600">{errors.category_id}</p>
              )}
            </div>

            {/* Ano de Publicação */}
            <div>
              <label htmlFor="publication_year" className="block text-sm font-medium text-gray-700 mb-1">
                Ano de Publicação *
              </label>
              <input
                type="number"
                id="publication_year"
                name="publication_year"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.publication_year || ''}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3"
              />
            </div>

            {/* Páginas */}
            <div>
              <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Páginas *
              </label>
              <input
                type="number"
                id="pages"
                name="pages"
                min="1"
                value={formData.pages || ''}
                onChange={handleChange}
                className={`block w-full border ${
                  errors.pages ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.pages && (
                <p className="mt-1 text-sm text-error-600">{errors.pages}</p>
              )}
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="space-y-6">
            {/* Preço */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.price ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm`}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-error-600">{errors.price}</p>
              )}
            </div>

            {/* Preço Original */}
            <div>
              <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-1">
                Preço Original (R$)
                <span className="text-gray-500 text-xs ml-1">(opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  id="original_price"
                  name="original_price"
                  min="0"
                  step="0.01"
                  value={formData.original_price || ''}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.original_price ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-md shadow-sm`}
                />
              </div>
              {errors.original_price && (
                <p className="mt-1 text-sm text-error-600">{errors.original_price}</p>
              )}
            </div>

            {/* Estoque */}
            <div className="mt-4">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Estoque
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={formData.stock || 0}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.stock ? 'border-red-500' : ''
                  }`}
                />
                {errors.stock && (
                  <p className="mt-2 text-sm text-red-600">{errors.stock}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Quantidade de livros disponíveis em estoque
                </p>
              </div>
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
                    id="cover_image"
                    name="cover_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG ou GIF. Tamanho máximo 2MB.
                  </p>
                  {errors.cover_image && (
                    <p className="mt-1 text-sm text-error-600">{errors.cover_image}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Disponibilidade */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            value={formData.description || ''}
            onChange={handleChange}
            className={`block w-full border ${
              errors.description ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            } rounded-md shadow-sm py-2 px-3`}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-error-600">{errors.description}</p>
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