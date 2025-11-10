/**
 * CADASTRAR-LIVRO.JS - Book registration logic
 * Livro&Livro - Book Exchange Platform
 */

import { createBook, getAllBooks } from '../../services/books-service.js';

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

// Book registration form
const form = document.getElementById('book-registration-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form data
  const bookData = {
    title: document.getElementById('title').value.trim(),
    author: document.getElementById('author').value.trim(),
    category: document.getElementById('category').value,
    condition: document.getElementById('condition').value,
    type: document.getElementById('type').value,
    description: document.getElementById('description').value.trim()
  };

  // Validate required fields
  if (!bookData.title || !bookData.author || !bookData.category || !bookData.condition || !bookData.type) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  try {
    // Create book via API
    const newBook = await createBook(user.email, bookData);

    // Update user's bookIDs in currentUser
    if (!user.bookIDs) {
      user.bookIDs = [];
    }
    user.bookIDs.push(newBook.id);
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Update books list in localStorage
    let books = [];
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      books = JSON.parse(storedBooks);
    }
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));

    alert('Livro cadastrado com sucesso!');
    
    // Redirect to "Meus Livros" page
    window.location.href = 'meus-livros.html';
  } catch (error) {
    console.error('Erro ao cadastrar livro:', error);
    alert('Erro ao cadastrar livro. Por favor, tente novamente.');
  }
});
