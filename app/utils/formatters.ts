/**
 * Utilitários para formatação de valores e textos
 */

/**
 * Formata um valor numérico como preço em Reais (R$)
 * @param valor Valor numérico a ser formatado
 * @returns String formatada (ex: R$ 99,90)
 */
export function formatarPreco(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param data Objeto Date ou string de data
 * @returns String formatada no padrão brasileiro
 */
export function formatarData(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR').format(dataObj);
}

/**
 * Formata uma data e hora para o formato brasileiro (DD/MM/YYYY HH:mm)
 * @param data Objeto Date ou string de data
 * @returns String formatada no padrão brasileiro
 */
export function formatarDataHora(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dataObj);
}

/**
 * Formata um número de telefone para o padrão brasileiro: (99) 99999-9999
 * @param telefone String com o número de telefone (pode conter apenas dígitos)
 * @returns String formatada no padrão brasileiro
 */
export function formatarTelefone(telefone: string): string {
  // Remove caracteres não numéricos
  const apenasNumeros = telefone.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos (com 9 na frente do celular)
  if (apenasNumeros.length === 11) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
  } 
  // Verifica se tem 10 dígitos (telefone fixo ou celular antigo)
  else if (apenasNumeros.length === 10) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
  }
  
  // Se não tiver o formato correto, retorna o original
  return telefone;
}

/**
 * Formata um CPF para o padrão brasileiro: 999.999.999-99
 * @param cpf String com o CPF (pode conter apenas dígitos)
 * @returns String formatada no padrão brasileiro
 */
export function formatarCPF(cpf: string): string {
  // Remove caracteres não numéricos
  const apenasNumeros = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (apenasNumeros.length === 11) {
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9)}`;
  }
  
  // Se não tiver o formato correto, retorna o original
  return cpf;
}

/**
 * Formata um CEP para o padrão brasileiro: 99999-999
 * @param cep String com o CEP (pode conter apenas dígitos)
 * @returns String formatada no padrão brasileiro
 */
export function formatarCEP(cep: string): string {
  // Remove caracteres não numéricos
  const apenasNumeros = cep.replace(/\D/g, '');
  
  // Verifica se tem 8 dígitos
  if (apenasNumeros.length === 8) {
    return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5)}`;
  }
  
  // Se não tiver o formato correto, retorna o original
  return cep;
}

/**
 * Formata um status de pedido para exibição
 * @param status String com o status do pedido
 * @returns String formatada para exibição
 */
export function formatarStatusPedido(status: string): string {
  const statusMap: { [key: string]: string } = {
    pendente: 'Pendente',
    em_processamento: 'Em Processamento',
    enviado: 'Enviado',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
  };

  return statusMap[status] || status;
}

/**
 * Formata um número para exibição com separador de milhares
 * @param numero Número a ser formatado
 * @returns String formatada com separador de milhares
 */
export function formatarNumero(numero: number): string {
  return new Intl.NumberFormat('pt-BR').format(numero);
} 