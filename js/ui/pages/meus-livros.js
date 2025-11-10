/**
 * MEUS-LIVROS.JS - My books listing logic
 * Livro&Livro - Book Exchange Platform
 */

import { getAllBooks, deleteBook } from '../../services/books-service.js';

// Check if user is logged in
function checkAuth() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = '/auth/login.html';
    return null;
  }
  return JSON.parse(currentUser);
}

const user = checkAuth();
if (!user) {
  // Will redirect, but stop execution
  throw new Error('Not authenticated');
}

// Update header with user name
document.getElementById('user-name-header').textContent = user.name.split(' ')[0];

// Logout functionality
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = '../';
}

document.getElementById('logout-btn').addEventListener('click', logout);

const logoutBtnMobile = document.getElementById('logout-btn-mobile');
if (logoutBtnMobile) {
  logoutBtnMobile.addEventListener('click', logout);
}

// Timeout em minutos
const BOOKS_TIMEOUT_MINUTES = 60;

// Load books
async function loadBooks() {
  const loadingMessage = document.getElementById('loading-message');
  const emptyMessage = document.getElementById('empty-message');
  const booksGrid = document.getElementById('books-grid');

  try {
    // Check if books are already in localStorage
    let books = localStorage.getItem('books');
    const booksTimeout = localStorage.getItem('booksTimeout');
    const now = Date.now();

    if (
      !books ||
      books === '[]' ||
      !booksTimeout ||
      now - Number(booksTimeout) > BOOKS_TIMEOUT_MINUTES * 60 * 1000
    ) {
      const freshBooks = await consultaLivros();
      if (freshBooks) {
        localStorage.setItem('books', JSON.stringify(freshBooks));
        localStorage.setItem('booksTimeout', String(now));
      } else {
        // Limpa caso não consiga carregar
        localStorage.removeItem('books');
        localStorage.removeItem('booksTimeout');
      }
    }

    const allBooks = JSON.parse(books);

    // Filter books by user's bookIDs
    const userBookIDs = user.bookIDs || [];
    const userBooks = allBooks.filter(book => userBookIDs.includes(book.id));

    loadingMessage.style.display = 'none';

    if (userBooks.length === 0) {
      emptyMessage.style.display = 'block';
    } else {
      booksGrid.style.display = 'grid';
      displayBooks(userBooks);
    }
  } catch (error) {
    console.error('Erro ao carregar livros:', error);
    loadingMessage.innerHTML = '<p style="color: var(--color-danger);">Erro ao carregar seus livros. Por favor, tente novamente.</p>';
  }
}

// Display books in grid
function displayBooks(books) {
  const booksGrid = document.getElementById('books-grid');

  const categoryLabels = {
    'ficcao': 'Ficção',
    'nao-ficcao': 'Não-Ficção',
    'tecnico': 'Técnico',
    'autoajuda': 'Autoajuda',
    'infantil': 'Infantil',
    'academico': 'Acadêmico',
    'biografia': 'Biografia',
    'outros': 'Outros'
  };

  booksGrid.innerHTML = books.map(book => `
    <div class="card">
      <div class="card-body">
        <h3 class="book-card-title">${book.title}</h3>
        <p class="book-card-author">Por ${book.author}</p>
        
        <div style="margin: var(--space-4) 0;">
          <span class="badge badge-primary">${categoryLabels[book.category] || book.category}</span>
          <span class="badge badge-secondary">${book.condition}</span>
          <span class="badge ${book.type === 'doacao' ? 'badge-success' : 'badge-info'}">${book.type}</span>
        </div>

        ${book.description ? `<p class="book-card-description" style="font-size: var(--font-size-sm); color: var(--color-text-light); margin: var(--space-3) 0;">${book.description}</p>` : ''}

        <div class="flex gap-2" style="margin-top: var(--space-4);">
          <button class="btn btn-outline btn-sm" onclick="window.editBook('${book.id}')" style="flex: 1;">
            Editar
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.deleteBookConfirm('${book.id}')" style="flex: 1; color: var(--color-danger); border-color: var(--color-danger);">
            Excluir
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Delete book function
window.deleteBookConfirm = async function (bookId) {
  if (!confirm('Tem certeza que deseja excluir este livro?')) {
    return;
  }

  try {
    await deleteBook(bookId);

    // Remove from user's bookIDs
    user.bookIDs = user.bookIDs.filter(id => id !== bookId);
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Remove from localStorage books
    let books = JSON.parse(localStorage.getItem('books') || '[]');
    books = books.filter(book => book.id !== bookId);
    localStorage.setItem('books', JSON.stringify(books));

    alert('Livro excluído com sucesso!');

    // Reload the page
    window.location.reload();
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    alert('Erro ao excluir livro. Por favor, tente novamente.');
  }
};

// Edit book function (placeholder for now)
window.editBook = function (bookId) {
  alert('Funcionalidade de edição em desenvolvimento. ID do livro: ' + bookId);
};

// Initialize
loadBooks();
