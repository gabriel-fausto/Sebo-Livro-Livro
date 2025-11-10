/**
 * EDITAR-LIVRO.JS - Book editing logic
 * Livro&Livro - Book Exchange Platform
 */

import { updateBook, getBookById, uploadImageToS3 } from '../../services/books-service.js';

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

// Get book ID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

if (!bookId) {
  alert('ID do livro não encontrado.');
  window.location.href = 'meus-livros.html';
}

// Image preview handling
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const currentImage = document.getElementById('current-image');
const currentImg = document.getElementById('current-img');

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) {
    imagePreview.style.display = 'none';
    return;
  }

  // Validate file size (250KB max)
  const maxSize = 250 * 1024; // 250KB in bytes
  if (file.size > maxSize) {
    alert('A imagem deve ter no máximo 250KB. Por favor, selecione uma imagem menor.');
    imageInput.value = '';
    imagePreview.style.display = 'none';
    return;
  }

  // Show preview
  const reader = new FileReader();
  reader.onload = (event) => {
    previewImg.src = event.target.result;
    imagePreview.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// Load book data
async function loadBookData() {
  try {
    const book = await getBookById(bookId);
    
    // Populate form fields
    document.getElementById('title').value = book.title || '';
    document.getElementById('author').value = book.author || '';
    document.getElementById('category').value = book.category || '';
    document.getElementById('condition').value = book.condition || '';
    document.getElementById('type').value = book.type || '';
    document.getElementById('description').value = book.description || '';
    
    // Show current image
    if (book.preSignedURL) {
      currentImg.src = book.preSignedURL;
      currentImage.style.display = 'block';
    }
  } catch (error) {
    console.error('Erro ao carregar dados do livro:', error);
    alert('Erro ao carregar dados do livro. Redirecionando...');
    window.location.href = 'meus-livros.html';
  }
}

// Book edit form
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

  // Get image file if user selected a new one
  const imageFile = imageInput.files[0];

  // Validate required fields
  if (!bookData.title || !bookData.author || !bookData.category || !bookData.condition || !bookData.type) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Validate image size if a new image was selected
  if (imageFile) {
    const maxSize = 250 * 1024; // 250KB in bytes
    if (imageFile.size > maxSize) {
      alert('A imagem deve ter no máximo 250KB. Por favor, selecione uma imagem menor.');
      return;
    }

    // Add imageFileName to bookData if image was changed
    bookData.imageFileName = imageFile.name;
  }

  try {
    // Update book via API
    const updatedBook = await updateBook(bookId, bookData);

    // Upload new image to S3 if user selected a new image
    if (imageFile && updatedBook.preSignedURL) {
      await uploadImageToS3(updatedBook.preSignedURL, imageFile);
    }

    // Update books list in localStorage
    let books = JSON.parse(localStorage.getItem('books') || '[]');
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      books[bookIndex] = updatedBook;
      localStorage.setItem('books', JSON.stringify(books));
    }

    alert('Livro atualizado com sucesso!');
    
    // Redirect to "Meus Livros" page
    window.location.href = 'meus-livros.html';
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    alert('Erro ao atualizar livro. Por favor, tente novamente.');
  }
});

// Initialize
loadBookData();
