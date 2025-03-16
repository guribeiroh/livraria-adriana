import { Livro } from '../types';

export const livros: Livro[] = [
  {
    id: '1',
    titulo: 'Dom Quixote',
    autor: 'Miguel de Cervantes',
    descricao: 'Um dos maiores clássicos da literatura mundial, Dom Quixote narra as aventuras de um cavaleiro que enlouqueceu após ler muitos romances de cavalaria.',
    preco: 49.90,
    imagemUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop',
    paginas: 863,
    categoria: 'Clássico',
    isbn: '9788573264739',
    anoPublicacao: 1605,
    disponivel: true
  },
  {
    id: '2',
    titulo: 'Cem Anos de Solidão',
    autor: 'Gabriel García Márquez',
    descricao: 'Um dos expoentes do realismo mágico latino-americano, esta obra narra a história da família Buendía ao longo de várias gerações em Macondo.',
    preco: 54.90,
    imagemUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1988&auto=format&fit=crop',
    paginas: 448,
    categoria: 'Realismo Mágico',
    isbn: '9788501022899',
    anoPublicacao: 1967,
    disponivel: true
  },
  {
    id: '3',
    titulo: '1984',
    autor: 'George Orwell',
    descricao: 'Um clássico da distopia que retrata um futuro totalitário onde a população é vigiada constantemente pelo Grande Irmão.',
    preco: 39.90,
    imagemUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop',
    paginas: 336,
    categoria: 'Ficção Distópica',
    isbn: '9788535914849',
    anoPublicacao: 1949,
    disponivel: true
  },
  {
    id: '4',
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    descricao: 'Uma fábula encantadora sobre um príncipe que viaja de planeta em planeta, aprendendo sobre a vida, o amor e as relações humanas.',
    preco: 29.90,
    imagemUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1776&auto=format&fit=crop',
    paginas: 96,
    categoria: 'Fábula',
    isbn: '9788574064550',
    anoPublicacao: 1943,
    disponivel: true
  },
  {
    id: '5',
    titulo: 'Crime e Castigo',
    autor: 'Fiódor Dostoiévski',
    descricao: 'Um dos grandes romances psicológicos, explora a mente atormentada de Raskólnikov após cometer um assassinato.',
    preco: 59.90,
    imagemUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=2029&auto=format&fit=crop',
    paginas: 592,
    categoria: 'Romance Psicológico',
    isbn: '9788573265934',
    anoPublicacao: 1866,
    disponivel: true
  },
  {
    id: '6',
    titulo: 'A Metamorfose',
    autor: 'Franz Kafka',
    descricao: 'Nesta novela, Gregor Samsa acorda transformado em um inseto gigante, explorando temas de alienação e absurdo.',
    preco: 34.90,
    imagemUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop',
    paginas: 112,
    categoria: 'Ficção Absurda',
    isbn: '9788573261141',
    anoPublicacao: 1915,
    disponivel: true
  }
]; 