-- Inserir livros de exemplo na categoria Romance
INSERT INTO public.books (title, author, description, price, original_price, isbn, publication_year, pages, stock, cover_image, category_id, is_featured, is_bestseller, slug)
SELECT 
  'Amor em Paris', 
  'Sofia Mendes', 
  'Uma história de amor que se passa nas ruas românticas de Paris, onde dois estranhos se encontram por acaso e descobrem uma conexão inesperada.',
  39.90,
  59.90,
  '9781234567897',
  2022,
  320,
  50,
  'https://example.com/images/amor-em-paris.jpg',
  id,
  true,
  true,
  'amor-em-paris'
FROM public.categories WHERE slug = 'romance';

INSERT INTO public.books (title, author, description, price, original_price, isbn, publication_year, pages, stock, cover_image, category_id, is_featured, slug)
SELECT 
  'Encontros e Desencontros', 
  'Carlos Oliveira', 
  'Um romance sobre as coincidências da vida que levam um casal a se encontrar e se separar diversas vezes ao longo de anos, até que o destino finalmente os une.',
  45.90,
  45.90,
  '9781234567898',
  2021,
  280,
  35,
  'https://example.com/images/encontros-e-desencontros.jpg',
  id,
  false,
  'encontros-e-desencontros'
FROM public.categories WHERE slug = 'romance';

-- Inserir livros de exemplo na categoria Ficção Científica
INSERT INTO public.books (title, author, description, price, original_price, isbn, publication_year, pages, stock, cover_image, category_id, is_featured, is_bestseller, slug)
SELECT 
  'Além do Horizonte Estelar', 
  'Ricardo Asimov', 
  'Uma épica aventura espacial que acompanha a tripulação da nave Esperança em sua missão para encontrar um novo planeta habitável para a humanidade.',
  55.90,
  65.90,
  '9781234567899',
  2023,
  450,
  40,
  'https://example.com/images/alem-do-horizonte-estelar.jpg',
  id,
  true,
  true,
  'alem-do-horizonte-estelar'
FROM public.categories WHERE slug = 'ficcao-cientifica';

INSERT INTO public.books (title, author, description, price, original_price, isbn, publication_year, pages, stock, cover_image, category_id, is_bestseller, slug)
SELECT 
  'Androides do Amanhã', 
  'Ana Blade', 
  'Em um futuro distante, androides avançados começam a desenvolver consciência própria, levantando questões sobre o que realmente define a humanidade.',
  49.90,
  59.90,
  '9781234567900',
  2022,
  380,
  25,
  'https://example.com/images/androides-do-amanha.jpg',
  id,
  true,
  'androides-do-amanha'
FROM public.categories WHERE slug = 'ficcao-cientifica';

-- Inserir livros de exemplo na categoria Fantasia
INSERT INTO public.books (title, author, description, price, original_price, isbn, publication_year, pages, stock, cover_image, category_id, is_featured, slug)
SELECT 
  'O Reino de Eldoria', 
  'Gabriel Martin', 
  'Primeiro livro da trilogia que narra a jornada de um jovem fazendeiro que descobre ser o herdeiro perdido do reino mágico de Eldoria.',
  65.90,
  75.90,
  '9781234567901',
  2020,
  520,
  60,
  'https://example.com/images/o-reino-de-eldoria.jpg',
  id,
  true,
  'o-reino-de-eldoria'
FROM public.categories WHERE slug = 'fantasia';

INSERT INTO public.books (title, author, description, price, original_price, isbn, publication_year, pages, stock, cover_image, category_id, is_bestseller, slug)
SELECT 
  'Feiticeiros da Montanha Negra', 
  'Luísa Tolkien', 
  'Uma aventura épica sobre uma academia de magia escondida nas Montanhas Negras, onde jovens aprendizes enfrentam desafios mágicos e políticos.',
  59.90,
  69.90,
  '9781234567902',
  2021,
  480,
  45,
  'https://example.com/images/feiticeiros-da-montanha-negra.jpg',
  id,
  true,
  'feiticeiros-da-montanha-negra'
FROM public.categories WHERE slug = 'fantasia';

-- Inserir livros de exemplo na categoria Autoajuda
INSERT INTO public.books (title, author, description, price, original_price, isbn, publication_year, pages, stock, cover_image, category_id, is_featured, is_bestseller, slug)
SELECT 
  'Desperte Seu Potencial', 
  'Dra. Márcia Santos', 
  'Um guia prático para identificar e desenvolver suas forças interiores, superar obstáculos e alcançar sucesso em todas as áreas da vida.',
  39.90,
  49.90,
  '9781234567903',
  2022,
  240,
  80,
  'https://example.com/images/desperte-seu-potencial.jpg',
  id,
  true,
  true,
  'desperte-seu-potencial'
FROM public.categories WHERE slug = 'autoajuda';

INSERT INTO public.books (title, author, description, price, original_price, isbn, publication_year, pages, stock, cover_image, category_id, slug)
SELECT 
  'Hábitos Atômicos', 
  'Thiago Clear', 
  'Descubra como pequenas mudanças na rotina podem gerar resultados extraordinários a longo prazo através do poder dos micro-hábitos.',
  45.90,
  55.90,
  '9781234567904',
  2021,
  290,
  65,
  'https://example.com/images/habitos-atomicos.jpg',
  id,
  'habitos-atomicos'
FROM public.categories WHERE slug = 'autoajuda';

-- Inserir livros de exemplo na categoria Biografia
INSERT INTO public.books (title, author, description, price, original_price, isbn, publication_year, pages, stock, cover_image, category_id, is_bestseller, slug)
SELECT 
  'Vida e Obra de Santos Dumont', 
  'Roberto Alves', 
  'A biografia definitiva do pai da aviação, revelando detalhes desconhecidos sobre sua vida, seus inventos e sua contribuição para a história mundial.',
  69.90,
  79.90,
  '9781234567905',
  2020,
  420,
  30,
  'https://example.com/images/santos-dumont.jpg',
  id,
  true,
  'vida-e-obra-de-santos-dumont'
FROM public.categories WHERE slug = 'biografia';

INSERT INTO public.books (title, author, description, price, original_price, isbn, publication_year, pages, stock, cover_image, category_id, slug)
SELECT 
  'Frida: Cores e Dores', 
  'Isabela Kahlo', 
  'Uma jornada pela vida da pintora mexicana Frida Kahlo, explorando sua arte revolucionária e sua extraordinária resiliência diante dos desafios.',
  59.90,
  69.90,
  '9781234567906',
  2021,
  350,
  25,
  'https://example.com/images/frida-cores-e-dores.jpg',
  id,
  'frida-cores-e-dores'
FROM public.categories WHERE slug = 'biografia';

-- Inserir avaliações de livros
INSERT INTO public.reviews (book_id, user_id, rating, comment)
SELECT 
  b.id,
  u.id,
  5,
  'Livro maravilhoso! Não consegui parar de ler até terminar.'
FROM 
  public.books b
  CROSS JOIN public.users u
WHERE 
  b.title = 'Amor em Paris'
LIMIT 1;

INSERT INTO public.reviews (book_id, user_id, rating, comment)
SELECT 
  b.id,
  u.id,
  4,
  'Uma narrativa envolvente com personagens cativantes.'
FROM 
  public.books b
  CROSS JOIN public.users u
WHERE 
  b.title = 'O Reino de Eldoria'
LIMIT 1;

-- Inserir cupons de desconto
INSERT INTO public.coupons (code, discount_percent, min_purchase_value, start_date, expiry_date, is_active)
VALUES
('BEMVINDO10', 10, 50.00, NOW(), NOW() + INTERVAL '30 days', true),
('LIVROS20', 20, 100.00, NOW(), NOW() + INTERVAL '15 days', true),
('FRETEGRATIS', 0, 200.00, NOW(), NOW() + INTERVAL '7 days', true); 