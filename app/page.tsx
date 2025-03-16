import { livros } from './data/livros';
import LivroCard from './components/LivroCard';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-blue-100 rounded-lg p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
            Bem-vindo à Livraria Adriana
          </h1>
          <p className="text-lg text-blue-700 mb-6">
            Descubra novos mundos através dos nossos livros selecionados.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md text-lg hover:bg-blue-700 transition">
            Explorar Catálogo
          </button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Livros em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {livros.slice(0, 3).map((livro) => (
            <LivroCard key={livro.id} livro={livro} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Todos os Livros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {livros.map((livro) => (
            <LivroCard key={livro.id} livro={livro} />
          ))}
        </div>
      </section>

      <section className="bg-gray-100 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Inscreva-se para Novidades</h2>
        <p className="text-gray-600 mb-6">
          Fique por dentro dos lançamentos e promoções especiais.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="Seu e-mail"
            className="px-4 py-2 rounded-md border border-gray-300 flex-grow"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Inscrever-se
          </button>
        </div>
      </section>
    </div>
  );
}
