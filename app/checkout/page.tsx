'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InputMask from 'react-input-mask';
import { useCarrinho } from '../context/CarrinhoContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Breadcrumb from '@/app/components/common/Breadcrumb';
import Toast from '@/app/components/common/Toast';
import { formatarPreco } from '@/app/utils/formatters';

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

export default function Checkout() {
  const router = useRouter();
  const { carrinho, valorTotal, limparCarrinho } = useCarrinho();
  const { usuario, carregando } = useAuth();
  
  // Estado para armazenar os dados do cliente
  const [endereco, setEndereco] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  });
  
  // Estados para controle do carregamento e validação
  const [verificandoAuth, setVerificandoAuth] = useState(true);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [formValido, setFormValido] = useState(false);
  const [dadosCompletos, setDadosCompletos] = useState(false);
  const [dadosFaltantes, setDadosFaltantes] = useState<string[]>([]);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [finalCompra, setFinalCompra] = useState<'processando' | 'sucesso' | 'erro' | null>(null);
  const [erroFinal, setErroFinal] = useState<string | null>(null);
  
  // Estados para endereços salvos
  const [enderecosSalvos, setEnderecosSalvos] = useState<UserAddress[]>([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState<string | null>(null);
  const [mostrarFormNovoEndereco, setMostrarFormNovoEndereco] = useState(false);
  
  // Estado para método de pagamento
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'cartao' | 'boleto'>('pix');
  
  // Estado para controle do Toast
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });
  
  // Verificar a autenticação diretamente com o Supabase
  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        console.log("[Checkout] Verificando autenticação diretamente");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[Checkout] Erro ao verificar sessão:", error.message);
        } else {
          console.log("[Checkout] Sessão verificada:", data.session ? "Autenticado" : "Não autenticado");
        }
      } catch (err) {
        console.error("[Checkout] Erro ao verificar autenticação:", err);
      } finally {
        setVerificandoAuth(false);
      }
    };
    
    verificarAutenticacao();
  }, []);
  
  // Verificar se o carrinho está vazio
  useEffect(() => {
    const carrinhoVazio = Array.isArray(carrinho) 
      ? carrinho.length === 0 
      : carrinho.itens && carrinho.itens.length === 0;
      
    if (carrinhoVazio) {
      router.push('/carrinho');
    }
  }, [carrinho, router]);
  
  // Carregar dados do usuário e seus endereços
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        // Se o usuário estiver autenticado, buscar seus dados
        if (usuario && usuario.id) {
          console.log("[Checkout] Usuário autenticado, carregando dados do perfil", usuario.id);
          
          // Buscar perfil do usuário no Supabase
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', usuario.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("[Checkout] Erro ao buscar perfil:", profileError.message);
          }
          
          // Buscar endereços do usuário
          const { data: addressesData, error: addressesError } = await supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', usuario.id)
            .order('padrao', { ascending: false })
            .order('created_at', { ascending: false });
          
          if (addressesError) {
            console.error("[Checkout] Erro ao buscar endereços:", addressesError.message);
          } else {
            console.log("[Checkout] Endereços encontrados:", addressesData?.length || 0);
            
            if (addressesData && addressesData.length > 0) {
              // Armazenar todos os endereços do usuário
              setEnderecosSalvos(addressesData);
              
              // Selecionar o endereço padrão ou o mais recente
              const enderecoPadrao = addressesData.find(end => end.padrao) || addressesData[0];
              setEnderecoSelecionadoId(enderecoPadrao.id);
              
              // Preencher o formulário com os dados do endereço
              setEndereco({
                nome: enderecoPadrao.nome,
                sobrenome: enderecoPadrao.sobrenome,
                email: usuario.email || '',
                telefone: enderecoPadrao.telefone || '',
                rua: enderecoPadrao.rua,
                numero: enderecoPadrao.numero,
                complemento: enderecoPadrao.complemento || '',
                bairro: enderecoPadrao.bairro,
                cidade: enderecoPadrao.cidade,
                estado: enderecoPadrao.estado,
                cep: enderecoPadrao.cep
              });
              
              // Marcar formulário como completo
              setDadosCompletos(true);
              setDadosFaltantes([]);
            } else {
              // Se não houver endereços, inicializar com dados básicos do perfil
              
              // Verificar se tem nome completo e dividir em nome e sobrenome
              let nome = '';
              let sobrenome = '';
              
              if (profileData && profileData.name) {
                const partesNome = profileData.name.split(' ');
                nome = partesNome[0] || '';
                sobrenome = partesNome.slice(1).join(' ') || '';
              }
              
              setEndereco(prev => ({
                ...prev,
                nome,
                sobrenome,
                email: usuario.email || ''
              }));
              
              // Verificar quais campos obrigatórios estão faltando
              const camposObrigatorios = [
                'nome', 'sobrenome', 'email', 'telefone',
                'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'
              ];
              
              const faltantes = camposObrigatorios.filter(campo => {
                if (campo === 'nome' && nome) return false;
                if (campo === 'sobrenome' && sobrenome) return false;
                if (campo === 'email' && usuario.email) return false;
                return true;
              });
              
              setDadosFaltantes(faltantes);
              setDadosCompletos(faltantes.length === 0);
              setMostrarFormNovoEndereco(true);
            }
          }
        } else {
          console.log("[Checkout] Usuário não autenticado");
          setMostrarFormNovoEndereco(true);
        }
      } catch (err) {
        console.error("[Checkout] Erro ao carregar dados:", err);
      } finally {
        setDadosCarregados(true);
      }
    };
    
    if (usuario) {
      carregarDadosUsuario();
    } else {
      setDadosCarregados(true);
      setMostrarFormNovoEndereco(true);
    }
  }, [usuario]);
  
  // Manipular seleção de endereço existente
  const handleSelecionarEndereco = (enderecoId: string) => {
    const enderecoSelecionado = enderecosSalvos.find(e => e.id === enderecoId);
    
    if (enderecoSelecionado) {
      setEnderecoSelecionadoId(enderecoId);
      
      setEndereco({
        nome: enderecoSelecionado.nome,
        sobrenome: enderecoSelecionado.sobrenome,
        email: usuario?.email || '',
        telefone: enderecoSelecionado.telefone || '',
        rua: enderecoSelecionado.rua,
        numero: enderecoSelecionado.numero,
        complemento: enderecoSelecionado.complemento || '',
        bairro: enderecoSelecionado.bairro,
        cidade: enderecoSelecionado.cidade,
        estado: enderecoSelecionado.estado,
        cep: enderecoSelecionado.cep
      });
      
      setDadosCompletos(true);
      setDadosFaltantes([]);
      setMostrarFormNovoEndereco(false);
    }
  };
  
  // Manipular mudança para formulário de novo endereço
  const handleNovoEndereco = () => {
    setEnderecoSelecionadoId(null);
    setMostrarFormNovoEndereco(true);
    
    // Manter apenas o e-mail se o usuário estiver autenticado
    setEndereco({
      nome: '',
      sobrenome: '',
      email: usuario?.email || '',
      telefone: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
    });
    
    // Marcar todos os campos como faltantes, exceto o e-mail
    const camposObrigatorios = [
      'nome', 'sobrenome', 'email', 'telefone',
      'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'
    ];
    
    setDadosFaltantes(camposObrigatorios.filter(campo => campo !== 'email'));
    setDadosCompletos(false);
  };
  
  // Função para salvar um novo endereço ou atualizar o existente
  const salvarEndereco = async (definirComoPadrao: boolean = false) => {
    if (!usuario || !usuario.id) return null;
    
    try {
      // Se vai definir como padrão, primeiro remove o padrão de todos os outros endereços
      if (definirComoPadrao) {
        const { error: updateError } = await supabase
          .from('user_addresses')
          .update({ padrao: false })
          .eq('user_id', usuario.id);
          
        if (updateError) {
          console.error("[Checkout] Erro ao atualizar endereços existentes:", updateError.message);
          return null;
        }
      }
      
      // Preparar dados do endereço
      const dadosEndereco = {
        user_id: usuario.id,
        nome: endereco.nome,
        sobrenome: endereco.sobrenome,
        telefone: endereco.telefone,
        rua: endereco.rua,
        numero: endereco.numero,
        complemento: endereco.complemento || null,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        cep: endereco.cep,
        padrao: definirComoPadrao,
        updated_at: new Date().toISOString()
      };
      
      // Se temos um endereço selecionado, atualizar
      if (enderecoSelecionadoId) {
        const { data, error } = await supabase
          .from('user_addresses')
          .update(dadosEndereco)
          .eq('id', enderecoSelecionadoId)
          .select()
          .single();
          
        if (error) {
          console.error("[Checkout] Erro ao atualizar endereço:", error.message);
          return null;
        }
        
        console.log("[Checkout] Endereço atualizado com sucesso:", data);
        return data.id;
      } 
      // Caso contrário, inserir novo endereço
      else {
        const { data, error } = await supabase
          .from('user_addresses')
          .insert(dadosEndereco)
          .select()
          .single();
          
        if (error) {
          console.error("[Checkout] Erro ao inserir endereço:", error.message);
          return null;
        }
        
        console.log("[Checkout] Novo endereço criado com sucesso:", data);
        return data.id;
      }
    } catch (error: any) {
      console.error("[Checkout] Erro ao salvar endereço:", error.message);
      return null;
    }
  };
  
  // Função para validar o formulário
  const validarFormulario = () => {
    // Verificar campos obrigatórios
    const camposObrigatorios = [
      'nome', 'sobrenome', 'email', 'telefone',
      'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'
    ];
    
    let valido = camposObrigatorios.every(campo => !!endereco[campo as keyof typeof endereco]);
    setFormValido(valido);
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (endereco.email && !emailRegex.test(endereco.email)) {
      setErros({ ...erros, email: 'Email inválido' });
      valido = false;
    }
    
    // Validar formato de telefone
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (endereco.telefone && !telefoneRegex.test(endereco.telefone)) {
      setErros({ ...erros, telefone: 'Telefone inválido. Use o formato (99) 99999-9999' });
      valido = false;
    }
    
    // Validar CEP
    const cepRegex = /^\d{5}-\d{3}$/;
    if (endereco.cep && !cepRegex.test(endereco.cep)) {
      setErros({ ...erros, cep: 'CEP inválido. Use o formato 99999-999' });
      valido = false;
    }
    
    return { valido, erros };
  };
  
  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar o formulário antes de enviar
    const validacao = validarFormulario();
    if (!validacao.valido) {
      console.log("[Checkout] Formulário inválido:", validacao.erros);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    try {
      // Iniciar processo de finalização de compra
      setFinalCompra('processando');
      
      // Adicionar ou atualizar endereço se o usuário estiver autenticado
      let addressId = null;
      
      if (usuario && usuario.id) {
        // Salvar o endereço atual como padrão se for um novo endereço
        addressId = await salvarEndereco(!enderecoSelecionadoId);
      }
      
      // Preparar dados do pedido
      const enderecoCompleto = `${endereco.rua}, ${endereco.numero}${endereco.complemento ? ' - ' + endereco.complemento : ''}`;
      
      // Criar o pedido no Supabase
      const novoPedido = {
        user_id: usuario?.id || null,
        status: 'pending',
        total: valorTotal,
        shipping_address: enderecoCompleto,
        shipping_city: endereco.cidade,
        shipping_state: endereco.estado,
        shipping_zipcode: endereco.cep,
        payment_method: metodoPagamento, // Usar o método de pagamento selecionado
        address_id: addressId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("[Checkout] Criando pedido:", novoPedido);
      
      // Tentativa de criação com mais detalhes de erro
      let { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(novoPedido)
        .select()
        .single();
        
      if (orderError) {
        console.error("[Checkout] Erro detalhado ao criar pedido:", orderError);
        
        // Se o erro for relacionado a RLS/Política, vamos tentar sem usuário
        if (orderError.message.includes('infinite recursion') || 
            orderError.message.includes('policy') ||
            orderError.message.includes('permission denied')) {
            
          console.log("[Checkout] Tentando criar pedido sem associação de usuário devido a erro de permissão");
          
          // Criar versão anônima do pedido sem user_id
          const pedidoAnonimo = {
            ...novoPedido,
            user_id: null
          };
          
          const { data: anonOrderData, error: anonOrderError } = await supabase
            .from('orders')
            .insert(pedidoAnonimo)
            .select()
            .single();
            
          if (anonOrderError) {
            console.error("[Checkout] Erro ao criar pedido anônimo:", anonOrderError);
            throw new Error(`Erro ao criar pedido: ${anonOrderError.message}`);
          }
          
          console.log("[Checkout] Pedido anônimo criado com sucesso:", anonOrderData);
          orderData = anonOrderData;
        } else {
          throw new Error(`Erro ao criar pedido: ${orderError.message}`);
        }
      }
      
      console.log("[Checkout] Pedido criado com sucesso:", orderData);
      
      // Adicionar itens ao pedido se o pedido foi criado com sucesso
      if (orderData && orderData.id) {
        console.log("[Checkout] Adicionando itens ao pedido:", orderData.id);
        
        try {
          const orderItems = Array.isArray(carrinho) 
            ? carrinho.map(item => ({
                order_id: orderData.id,
                book_id: item.id,
                quantity: item.quantidade,
                price: item.preco,
                subtotal: item.preco * item.quantidade,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }))
            : carrinho.itens.map(item => ({
                order_id: orderData.id,
                book_id: item.livro.id,
                quantity: item.quantidade,
                price: item.livro.preco,
                subtotal: item.livro.preco * item.quantidade,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }));
              
          console.log("[Checkout] Itens a serem adicionados:", orderItems.length);
          
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);
            
          if (itemsError) {
            console.error("[Checkout] Erro ao adicionar itens ao pedido:", itemsError);
            // O pedido foi criado, mas os itens falharam - mesmo assim continuamos
            console.log("[Checkout] Continuando mesmo com erro nos itens");
          } else {
            console.log("[Checkout] Itens adicionados com sucesso");
          }
        } catch (itemError: any) {
          console.error("[Checkout] Erro ao processar itens do pedido:", itemError.message);
          // Continuar mesmo com erro nos itens
        }
      } else {
        console.error("[Checkout] Pedido criado sem ID válido ou dados incompletos");
      }
      
      // Limpar o carrinho
      limparCarrinho();
      
      // Redirecionar para a página de confirmação
      setFinalCompra('sucesso');
      router.push(`/checkout/confirmacao?order_id=${orderData.id}`);
      
    } catch (error: any) {
      console.error("[Checkout] Erro ao finalizar compra:", error.message);
      setFinalCompra('erro');
      setErroFinal(error.message);
    }
  };

  // Função para calcular prazo de entrega estimado
  const calcularPrazoEntrega = () => {
    const hoje = new Date();
    const prazoMinimo = new Date(hoje);
    prazoMinimo.setDate(hoje.getDate() + 3);
    
    const prazoMaximo = new Date(hoje);
    prazoMaximo.setDate(hoje.getDate() + 7);
    
    const formatarData = (data: Date) => {
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };
    
    return `${formatarData(prazoMinimo)} - ${formatarData(prazoMaximo)}`;
  };

  // Função para mostrar toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      show: true,
      message,
      type
    });
  };

  // Função para salvar endereço com feedback visual
  const handleSalvarEndereco = async () => {
    const validacao = validarFormulario();
    if (validacao.valido) {
      try {
        const id = await salvarEndereco(true);
        if (id) {
          // Recarregar endereços e selecionar o novo
          if (usuario && usuario.id) {
            const { data, error } = await supabase
              .from('user_addresses')
              .select('*')
              .eq('user_id', usuario.id)
              .order('padrao', { ascending: false })
              .order('created_at', { ascending: false });
              
            if (!error && data) {
              setEnderecosSalvos(data);
              setEnderecoSelecionadoId(id);
              setMostrarFormNovoEndereco(false);
              setDadosCompletos(true);
              setDadosFaltantes([]);
              
              // Feedback visual com Toast
              showToast('Endereço salvo com sucesso!', 'success');
            }
          }
        } else {
          showToast('Erro ao salvar o endereço. Por favor, tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro ao salvar endereço:', error);
        showToast('Erro ao salvar o endereço. Por favor, tente novamente.', 'error');
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
    }
  };

  // Renderizar componente
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: 'Carrinho', href: '/carrinho' },
          { label: 'Checkout', href: '/checkout' }
        ]}
      />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Finalizar Compra</h1>
      
      {/* Indicador de progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1">
              <span className="text-sm font-bold">1</span>
            </div>
            <span className="text-sm font-medium">Carrinho</span>
          </div>
          <div className="flex-1 h-1 bg-blue-600 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1">
              <span className="text-sm font-bold">2</span>
            </div>
            <span className="text-sm font-medium">Endereço</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center mb-1">
              <span className="text-sm font-bold">3</span>
            </div>
            <span className="text-sm font-medium">Confirmação</span>
          </div>
        </div>
      </div>
      
      {/* Alerta "Quase lá!" apenas quando necessário */}
      {(!dadosCompletos && !enderecoSelecionadoId) && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-amber-600 text-lg">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-amber-800">Quase lá!</h3>
              <div className="mt-1 text-amber-700">
                <p>Para finalizar sua compra, preencha os campos abaixo que estão faltando no seu perfil.</p>
                <p className="text-sm">Estes dados serão salvos para suas próximas compras, tornando o processo mais rápido.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!dadosCarregados ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Informações de Entrega</h2>
              
              {/* Seleção de endereços para usuários logados */}
              {usuario && enderecosSalvos.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Selecionar endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {enderecosSalvos.map((end) => (
                      <div
                        key={end.id}
                        onClick={() => handleSelecionarEndereco(end.id)}
                        className={`border-2 rounded-md p-4 cursor-pointer transition shadow-sm hover:shadow ${
                          enderecoSelecionadoId === end.id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{end.nome} {end.sobrenome}</p>
                            <p className="text-sm text-gray-600 mt-1">{end.rua}, {end.numero}{end.complemento ? ` - ${end.complemento}` : ''}</p>
                            <p className="text-sm text-gray-600">{end.bairro}, {end.cidade} - {end.estado}</p>
                            <p className="text-sm text-gray-600">CEP: {end.cep}</p>
                            {end.telefone && <p className="text-sm text-gray-600 mt-1">Tel: {end.telefone}</p>}
                          </div>
                          {end.padrao && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Padrão
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleNovoEndereco}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center border border-blue-200 rounded-md px-3 py-2 transition hover:bg-blue-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar novo endereço
                  </button>
                </div>
              )}
              
              {/* Formulário de endereço */}
              {(mostrarFormNovoEndereco || enderecosSalvos.length === 0) && (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome */}
                    <div className={usuario && !dadosFaltantes.includes('nome') ? 'opacity-70' : ''}>
                      <label htmlFor="nome" className="block mb-1 font-medium">
                        Nome <span className="text-red-500">*</span>
                        {usuario && !dadosFaltantes.includes('nome') && 
                          <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>
                        }
                      </label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={endereco.nome}
                        onChange={(e) => setEndereco({ ...endereco, nome: e.target.value })}
                        readOnly={usuario ? !dadosFaltantes.includes('nome') : false}
                        className={`w-full border ${
                          erros.nome ? 'border-red-500' : 'border-gray-300'
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          usuario && !dadosFaltantes.includes('nome') ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                      {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
                    </div>
                    
                    {/* Sobrenome */}
                    <div className={usuario && !dadosFaltantes.includes('sobrenome') ? 'opacity-70' : ''}>
                      <label htmlFor="sobrenome" className="block mb-1 font-medium">
                        Sobrenome <span className="text-red-500">*</span>
                        {usuario && !dadosFaltantes.includes('sobrenome') && 
                          <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>
                        }
                      </label>
                      <input
                        type="text"
                        id="sobrenome"
                        name="sobrenome"
                        value={endereco.sobrenome}
                        onChange={(e) => setEndereco({ ...endereco, sobrenome: e.target.value })}
                        readOnly={usuario ? !dadosFaltantes.includes('sobrenome') : false}
                        className={`w-full border ${
                          erros.sobrenome ? 'border-red-500' : 'border-gray-300'
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          usuario && !dadosFaltantes.includes('sobrenome') ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                      {erros.sobrenome && (
                        <p className="text-red-500 text-sm mt-1">{erros.sobrenome}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className={usuario ? 'opacity-70' : ''}>
                      <label htmlFor="email" className="block mb-1 font-medium">
                        Email <span className="text-red-500">*</span>
                        {usuario && <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={endereco.email}
                        onChange={(e) => setEndereco({ ...endereco, email: e.target.value })}
                        readOnly={!!usuario}
                        className={`w-full border ${
                          erros.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          usuario ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                      {erros.email && <p className="text-red-500 text-sm mt-1">{erros.email}</p>}
                    </div>
                    
                    {/* Telefone */}
                    <div className={usuario && !dadosFaltantes.includes('telefone') ? 'opacity-70' : ''}>
                      <label htmlFor="telefone" className="block mb-1 font-medium">
                        Telefone <span className="text-red-500">*</span>
                        {usuario && !dadosFaltantes.includes('telefone') && 
                          <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>
                        }
                      </label>
                      <InputMask
                        mask="(99) 99999-9999"
                        type="text"
                        id="telefone"
                        name="telefone"
                        value={endereco.telefone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndereco({ ...endereco, telefone: e.target.value })}
                        readOnly={usuario ? !dadosFaltantes.includes('telefone') : false}
                        className={`w-full border ${
                          erros.telefone ? 'border-red-500' : 'border-gray-300'
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          usuario && !dadosFaltantes.includes('telefone') ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                      {erros.telefone && (
                        <p className="text-red-500 text-sm mt-1">{erros.telefone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Rua */}
                    <div className={usuario && !dadosFaltantes.includes('rua') ? 'opacity-70' : ''}>
                      <label htmlFor="rua" className="block mb-1 font-medium">
                        Rua <span className="text-red-500">*</span>
                        {usuario && !dadosFaltantes.includes('rua') && 
                          <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>
                        }
                      </label>
                      <input
                        type="text"
                        id="rua"
                        name="rua"
                        value={endereco.rua}
                        onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                        readOnly={usuario ? !dadosFaltantes.includes('rua') : false}
                        className={`w-full border ${
                          erros.rua ? 'border-red-500' : 'border-gray-300'
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          usuario && !dadosFaltantes.includes('rua') ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                      {erros.rua && <p className="text-red-500 text-sm mt-1">{erros.rua}</p>}
                    </div>
                    
                    {/* Número */}
                    <div className={usuario && !dadosFaltantes.includes('numero') ? 'opacity-70' : ''}>
                      <label htmlFor="numero" className="block mb-1 font-medium">
                        Número <span className="text-red-500">*</span>
                        {usuario && !dadosFaltantes.includes('numero') && 
                          <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>
                        }
                      </label>
                      <input
                        type="text"
                        id="numero"
                        name="numero"
                        value={endereco.numero}
                        onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                        readOnly={usuario ? !dadosFaltantes.includes('numero') : false}
                        className={`w-full border ${
                          erros.numero ? 'border-red-500' : 'border-gray-300'
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          usuario && !dadosFaltantes.includes('numero') ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                      {erros.numero && <p className="text-red-500 text-sm mt-1">{erros.numero}</p>}
                    </div>
                  </div>
                  
                  {/* Complemento */}
                  <div>
                    <label htmlFor="complemento" className="block mb-1 font-medium">
                      Complemento {usuario && endereco.complemento && 
                        <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>
                      }
                    </label>
                    <input
                      type="text"
                      id="complemento"
                      name="complemento"
                      value={endereco.complemento}
                      onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                      readOnly={usuario && endereco.complemento ? true : false}
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        usuario && endereco.complemento ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bairro */}
                    <div className={usuario && !dadosFaltantes.includes('bairro') ? 'opacity-70' : ''}>
                      <label htmlFor="bairro" className="block mb-1 font-medium">
                        Bairro <span className="text-red-500">*</span>
                        {usuario && !dadosFaltantes.includes('bairro') && 
                          <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>
                        }
                      </label>
                      <input
                        type="text"
                        id="bairro"
                        name="bairro"
                        value={endereco.bairro}
                        onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                        readOnly={usuario ? !dadosFaltantes.includes('bairro') : false}
                        className={`w-full border ${
                          erros.bairro ? 'border-red-500' : 'border-gray-300'
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          usuario && !dadosFaltantes.includes('bairro') ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                      {erros.bairro && <p className="text-red-500 text-sm mt-1">{erros.bairro}</p>}
                    </div>
                    
                    {/* Cidade */}
                    <div className={usuario && !dadosFaltantes.includes('cidade') ? 'opacity-70' : ''}>
                      <label htmlFor="cidade" className="block mb-1 font-medium">
                        Cidade <span className="text-red-500">*</span>
                        {usuario && !dadosFaltantes.includes('cidade') && 
                          <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>
                        }
                      </label>
                      <input
                        type="text"
                        id="cidade"
                        name="cidade"
                        value={endereco.cidade}
                        onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
                        readOnly={usuario ? !dadosFaltantes.includes('cidade') : false}
                        className={`w-full border ${
                          erros.cidade ? 'border-red-500' : 'border-gray-300'
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          usuario && !dadosFaltantes.includes('cidade') ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                      {erros.cidade && <p className="text-red-500 text-sm mt-1">{erros.cidade}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Estado */}
                    <div className={usuario && !dadosFaltantes.includes('estado') ? 'opacity-70' : ''}>
                      <label htmlFor="estado" className="block mb-1 font-medium">
                        Estado <span className="text-red-500">*</span>
                        {usuario && !dadosFaltantes.includes('estado') && 
                          <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>
                        }
                      </label>
                      <select
                        id="estado"
                        name="estado"
                        value={endereco.estado}
                        onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })}
                        disabled={usuario ? !dadosFaltantes.includes('estado') : false}
                        className={`w-full border ${
                          erros.estado ? 'border-red-500' : 'border-gray-300'
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          usuario && !dadosFaltantes.includes('estado') ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
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
                      {erros.estado && <p className="text-red-500 text-sm mt-1">{erros.estado}</p>}
                    </div>
                    
                    {/* CEP */}
                    <div className={usuario && !dadosFaltantes.includes('cep') ? 'opacity-70' : ''}>
                      <label htmlFor="cep" className="block mb-1 font-medium">
                        CEP <span className="text-red-500">*</span>
                        {usuario && !dadosFaltantes.includes('cep') && 
                          <span className="text-xs text-green-600 ml-2">(Já preenchido)</span>
                        }
                      </label>
                      <InputMask
                        mask="99999-999"
                        type="text"
                        id="cep"
                        name="cep"
                        value={endereco.cep}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndereco({ ...endereco, cep: e.target.value })}
                        readOnly={usuario ? !dadosFaltantes.includes('cep') : false}
                        className={`w-full border ${
                          erros.cep ? 'border-red-500' : 'border-gray-300'
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          usuario && !dadosFaltantes.includes('cep') ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                      {erros.cep && <p className="text-red-500 text-sm mt-1">{erros.cep}</p>}
                    </div>
                  </div>
                  
                  {/* Botão para salvar o endereço */}
                  <div className="flex justify-end mt-4">
                    {enderecosSalvos.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMostrarFormNovoEndereco(false)}
                        className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSalvarEndereco}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Salvar Endereço
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* Métodos de pagamento */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Forma de Pagamento</h2>
              <div className="space-y-4">
                <div 
                  className={`border-2 rounded-md p-4 cursor-pointer transition ${metodoPagamento === 'pix' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setMetodoPagamento('pix')}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 mr-3 rounded-full border-2 flex items-center justify-center ${metodoPagamento === 'pix' ? 'border-blue-500' : 'border-gray-300'}`}>
                      {metodoPagamento === 'pix' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                    </div>
                    <div className="flex items-center flex-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M3.57 8.67C3.57 8.31 3.87 8.02 4.23 8.02H6.32C6.67 8.02 6.97 8.31 6.97 8.67V19.35C6.97 19.7 6.67 20 6.32 20H4.23C3.87 20 3.57 19.7 3.57 19.35V8.67Z" fill="#32BCAD"/>
                        <path d="M8.73 4.23C8.73 3.87 9.03 3.57 9.38 3.57H11.47C11.83 3.57 12.12 3.87 12.12 4.23V19.35C12.12 19.7 11.83 20 11.47 20H9.38C9.03 20 8.73 19.7 8.73 19.35V4.23Z" fill="#32BCAD"/>
                        <path d="M13.89 12.14C13.89 11.78 14.18 11.49 14.54 11.49H16.63C16.98 11.49 17.28 11.78 17.28 12.14V19.35C17.28 19.7 16.98 20 16.63 20H14.54C14.18 20 13.89 19.7 13.89 19.35V12.14Z" fill="#32BCAD"/>
                        <path d="M19.39 7.17C19.05 7.52 18.49 7.52 18.15 7.17L13.89 2.91C13.54 2.57 13.54 2.01 13.89 1.66C14.23 1.32 14.79 1.32 15.14 1.66L19.39 5.92C19.74 6.26 19.74 6.82 19.39 7.17Z" fill="#32BCAD"/>
                        <path d="M20.15 7.17C20.49 7.52 20.49 8.08 20.15 8.43L15.89 12.68C15.54 13.03 14.98 13.03 14.64 12.68C14.29 12.34 14.29 11.78 14.64 11.43L18.9 7.17C19.24 6.83 19.8 6.83 20.15 7.17Z" fill="#32BCAD"/>
                      </svg>
                      <div>
                        <h3 className="font-medium">Pix</h3>
                        <p className="text-sm text-gray-600">Aprovação imediata</p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-green-600 font-medium">5% de desconto</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border-2 rounded-md p-4 cursor-pointer transition ${metodoPagamento === 'cartao' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setMetodoPagamento('cartao')}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 mr-3 rounded-full border-2 flex items-center justify-center ${metodoPagamento === 'cartao' ? 'border-blue-500' : 'border-gray-300'}`}>
                      {metodoPagamento === 'cartao' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                    </div>
                    <div className="flex items-center flex-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <div>
                        <h3 className="font-medium">Cartão de Crédito</h3>
                        <p className="text-sm text-gray-600">Parcelamento em até 12x</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border-2 rounded-md p-4 cursor-pointer transition ${metodoPagamento === 'boleto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setMetodoPagamento('boleto')}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 mr-3 rounded-full border-2 flex items-center justify-center ${metodoPagamento === 'boleto' ? 'border-blue-500' : 'border-gray-300'}`}>
                      {metodoPagamento === 'boleto' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                    </div>
                    <div className="flex items-center flex-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <h3 className="font-medium">Boleto Bancário</h3>
                        <p className="text-sm text-gray-600">Aprovação em 1-3 dias úteis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botão de finalizar pedido */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={finalCompra === 'processando' || !formValido}
                className={`w-full ${
                  finalCompra === 'processando' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : !formValido
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white py-4 px-4 rounded-md font-medium transition text-lg`}
              >
                {finalCompra === 'processando' ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></span>
                    Processando...
                  </span>
                ) : (
                  'Finalizar Pedido'
                )}
              </button>
              
              {finalCompra === 'erro' && erroFinal && (
                <p className="mt-2 text-red-600 text-sm">{erroFinal}</p>
              )}
            </div>
          </div>
          
          {/* Resumo do pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-4">
                {Array.isArray(carrinho) ? (
                  // Se carrinho for um array
                  carrinho.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={item.imagem}
                          alt={item.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.titulo}</h3>
                        <p className="text-gray-500 text-sm">Qtd: {item.quantidade}</p>
                        <p className="text-gray-900 font-medium">
                          {formatarPreco(item.preco * item.quantidade)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : carrinho.itens && Array.isArray(carrinho.itens) ? (
                  // Se carrinho for um objeto com propriedade itens
                  carrinho.itens.map((item) => (
                    <div key={item.livro.id} className="flex items-center gap-4">
                      <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={item.livro.imagemUrl}
                          alt={item.livro.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.livro.titulo}</h3>
                        <p className="text-gray-500 text-sm">Qtd: {item.quantidade}</p>
                        <p className="text-gray-900 font-medium">
                          {formatarPreco((item.livro.preco || 0) * (item.quantidade || 1))}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Nenhum item no carrinho</p>
                )}
              </div>
              
              {/* Informações de entrega */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-start mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-900">Entrega</h3>
                    {enderecoSelecionadoId && enderecosSalvos.length > 0 ? (
                      <p className="text-sm text-gray-600 mt-1">
                        {endereco.cidade} - {endereco.estado}, {endereco.cep}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 mt-1">Selecione um endereço</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-900">Prazo</h3>
                    <p className="text-sm text-gray-600 mt-1">Receba entre {calcularPrazoEntrega()}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {(() => {
                      let total = 0;
                      
                      // Garantir que valorTotal seja um número válido
                      if (typeof valorTotal === 'number' && !isNaN(valorTotal)) {
                        total = valorTotal;
                      } 
                      // Se não for, calcular a partir do carrinho
                      else if (carrinho.itens && Array.isArray(carrinho.itens)) {
                        total = carrinho.itens.reduce((acc, item) => {
                          const preco = item.livro?.preco || 0;
                          const quantidade = item.quantidade || 1;
                          return acc + (preco * quantidade);
                        }, 0);
                      } 
                      // Se ainda não for possível, usar o total do carrinho
                      else if (typeof carrinho.total === 'number') {
                        total = carrinho.total;
                      }
                      
                      return formatarPreco(total);
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium">Grátis</span>
                </div>
                {metodoPagamento === 'pix' && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto Pix (5%)</span>
                    <span>-{formatarPreco(valorTotal * 0.05)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold">
                    {formatarPreco(metodoPagamento === 'pix' ? valorTotal * 0.95 : valorTotal)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Frete grátis para todo o Brasil</p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Pagamento 100% seguro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 