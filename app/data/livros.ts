import { Livro } from '../types';

export const livros: Livro[] = [
  {
    id: '1',
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    descricao: 'Um dos romances mais famosos da literatura brasileira, que conta a história de Bentinho e seu ciúme por Capitu.',
    preco: 39.90,
    imagemUrl: '/images/livros/dom-casmurro.jpg',
    paginas: 256,
    categoria: 'Literatura Brasileira',
    isbn: '9788535911465',
    anoPublicacao: 1899,
    disponivel: true
  },
  {
    id: '2',
    titulo: 'O Senhor dos Anéis: A Sociedade do Anel',
    autor: 'J.R.R. Tolkien',
    descricao: 'Primeira parte da épica jornada de Frodo Bolseiro para destruir o Um Anel.',
    preco: 59.90,
    imagemUrl: '/images/livros/senhor-dos-aneis.jpg',
    paginas: 576,
    categoria: 'Fantasia',
    isbn: '9788533603149',
    anoPublicacao: 1954,
    disponivel: true
  },
  {
    id: '3',
    titulo: 'Harry Potter e a Pedra Filosofal',
    autor: 'J.K. Rowling',
    descricao: 'O primeiro livro da saga do jovem bruxo Harry Potter, que descobre seu verdadeiro passado.',
    preco: 45.90,
    imagemUrl: '/images/livros/harry-potter.jpg',
    paginas: 368,
    categoria: 'Fantasia',
    isbn: '9788532511010',
    anoPublicacao: 1997,
    disponivel: true
  },
  {
    id: '4',
    titulo: 'Orgulho e Preconceito',
    autor: 'Jane Austen',
    descricao: 'Um romance clássico que retrata a sociedade inglesa do século XIX através da história de Elizabeth Bennet.',
    preco: 34.90,
    imagemUrl: '/images/livros/orgulho-preconceito.jpg',
    paginas: 424,
    categoria: 'Romance',
    isbn: '9788525056962',
    anoPublicacao: 1813,
    disponivel: true
  },
  {
    id: '5',
    titulo: 'A Revolução dos Bichos',
    autor: 'George Orwell',
    descricao: 'Uma fábula política sobre um grupo de animais que expulsa os humanos da fazenda para criar uma sociedade igualitária.',
    preco: 29.90,
    imagemUrl: '/images/livros/revolucao-bichos.jpg',
    paginas: 152,
    categoria: 'Ficção Política',
    isbn: '9788535909555',
    anoPublicacao: 1945,
    disponivel: true
  },
  {
    id: '6',
    titulo: 'Memórias Póstumas de Brás Cubas',
    autor: 'Machado de Assis',
    descricao: 'Romance narrado por um defunto-autor que relata sua vida e reflexões após a morte.',
    preco: 32.90,
    imagemUrl: '/images/livros/memorias-postumas.jpg',
    paginas: 208,
    categoria: 'Literatura Brasileira',
    isbn: '9788535910663',
    anoPublicacao: 1881,
    disponivel: true
  },
  {
    id: '7',
    titulo: 'Cem Anos de Solidão',
    autor: 'Gabriel García Márquez',
    descricao: 'A história da família Buendía através de várias gerações na fictícia cidade de Macondo.',
    preco: 49.90,
    imagemUrl: '/images/livros/cem-anos-solidao.jpg',
    paginas: 448,
    categoria: 'Realismo Mágico',
    isbn: '9788535914849',
    anoPublicacao: 1967,
    disponivel: true
  },
  {
    id: '8',
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    descricao: 'Uma fábula poética que explora temas como o sentido da vida e as relações humanas.',
    preco: 25.90,
    imagemUrl: '/images/livros/pequeno-principe.jpg',
    paginas: 96,
    categoria: 'Infantil',
    isbn: '9788574068930',
    anoPublicacao: 1943,
    disponivel: true
  }
]; 