export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0066cc' }}>Livraria Adriana</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Sua livraria online</p>
      </header>

      <main>
        <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>Bem-vindo!</h2>
          <p style={{ lineHeight: '1.6' }}>
            Este é um site de teste para a Livraria Adriana. Estamos em processo de construção
            do nosso site completo com todos os recursos que você merece.
          </p>
        </section>

        <section style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>Em breve mais novidades</h2>
          <p style={{ fontStyle: 'italic' }}>
            Nossa equipe está trabalhando para trazer o melhor da literatura para você.
          </p>
        </section>
      </main>

      <footer style={{ marginTop: '3rem', textAlign: 'center', padding: '1rem 0', borderTop: '1px solid #eaeaea' }}>
        <p>© 2024 Livraria Adriana. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
