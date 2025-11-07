const booksGrid = document.getElementById('books-grid');

// Get condition label
function getConditionLabel(condition) {
  const labels = {
    'novo': 'Novo',
    'otimo': 'Ótimo Estado',
    'bom': 'Bom Estado',
    'regular': 'Estado Regular'
  };
  return labels[condition] || condition;
}

// Add to cart
function addToCart(bookId) {
  const currentUser = localStorage.getItem('currentUser');
  const basePath = window.location.hostname.includes('github.io')
      ? '/Sebo-Livro-Livro'
      : '';
  
  if (!currentUser) {
    alert('Você precisa estar logado para adicionar livros ao carrinho.');
    window.location.href = `${basePath}/auth/login.html`;
    return;
  }
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Check if book is already in cart
  if (cart.includes(bookId)) {
    alert('Este livro já está no seu carrinho!');
    return;
  }
  
  cart.push(bookId);
  localStorage.setItem('cart', JSON.stringify(cart));
  
  alert('Livro adicionado ao carrinho!');
}

// Render book card
function renderBookCard(book) {
    return `
    <div class="card book-card">
      <img src="${book.preSignedURL}" alt="Capa de ${book.title}" class="book-card-image" loading="lazy">
      <div class="book-card-content">
        <h3 class="book-card-title">${book.title}</h3>
        <p class="book-card-author">${book.author}</p>
        <span class="book-card-condition">${getConditionLabel(book.condition)}</span>
        <div class="book-card-actions">
          <button class="btn btn-primary btn-block" data-book-id="${book.id}">
            Gostaria de Ler
          </button>
        </div>
      </div>
    </div>
  `;
}

async function getBooks() {
  const url = `https://6tq0bqkysh.execute-api.sa-east-1.amazonaws.com/dev/books/list/4`;

  // Faz a chamada na API
  const resposta = await fetch(url);
  const dados = await resposta.json();

  return dados.books;
}

// Render books
async function renderBooks() {
    const allBooks = await getBooks();
    booksGrid.innerHTML = allBooks.map(book => renderBookCard(book)).join('');

    // Add event listeners to "Gostaria de Ler" buttons
    booksGrid.querySelectorAll('button[data-book-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookId = e.target.dataset.bookId;
            addToCart(bookId);
        });
    });
}

renderBooks();