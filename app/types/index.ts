export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  paginas: number;
  categoria: string;
  isbn: string;
  anoPublicacao: number;
  disponivel: boolean;
}

export interface ItemCarrinho {
  livro: Livro;
  quantidade: number;
}

export interface Carrinho {
  itens: ItemCarrinho[];
  total: number;
} 