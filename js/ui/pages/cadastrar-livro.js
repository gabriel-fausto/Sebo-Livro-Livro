/**
 * CADASTRAR-LIVRO.JS - Book registration logic
 * Livro&Livro - Book Exchange Platform
 */

import { createBook, uploadImageToS3 } from '../../services/books-service.js';

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

// Image preview handling
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');

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

  // Get image file
  const imageFile = imageInput.files[0];

  // Validate required fields
  if (!bookData.title || !bookData.author || !bookData.category || !bookData.condition || !bookData.type) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Validate image
  if (!imageFile) {
    alert('Por favor, selecione uma imagem para o livro.');
    return;
  }

  // Validate image size again (in case validation was bypassed)
  const maxSize = 250 * 1024; // 250KB in bytes
  if (imageFile.size > maxSize) {
    alert('A imagem deve ter no máximo 250KB. Por favor, selecione uma imagem menor.');
    return;
  }

  try {
    // Add imageFileName to bookData
    bookData.imageFileName = imageFile.name;

    // Create book via API
    const newBook = await createBook(user.email, bookData);

    // Upload image to S3 using PreSignedURL
    if (newBook.preSignedURL) {
      await uploadImageToS3(newBook.preSignedURL, imageFile);
    }

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
