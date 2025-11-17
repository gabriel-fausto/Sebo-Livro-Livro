/**
 * CARRINHO.JS - Shopping cart page logic
 * Livro&Livro - Book Exchange Platform
 */

import { getCartItems, removeFromCart, calculateTotalShipping, getCartCount } from '../../services/cart-service.js';

// Check if user is logged in
function checkAuth() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = '../auth/login.html';
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
const userNameHeader = document.getElementById('user-name-header');
if (userNameHeader) {
  userNameHeader.textContent = user.name.split(' ')[0];
}

// Logout functionality
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = '../';
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

const logoutBtnMobile = document.getElementById('logout-btn-mobile');
if (logoutBtnMobile) {
  logoutBtnMobile.addEventListener('click', logout);
}

// Category labels for display
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

// Display cart items
function displayCartItems() {
  const cartItems = getCartItems();
  const cartBody = document.querySelector('.card-body');
  const orderSummary = document.querySelector('.card-body:last-of-type');
  const totalShipping = calculateTotalShipping();

  // Find or create the cart items container
  let cartItemsSection = document.querySelector('section.card:first-of-type');
  
  if (cartItems.length === 0) {
    // Show empty cart message
    cartItemsSection.querySelector('.card-body').innerHTML = `
      <div style="text-align: center; padding: var(--space-8);">
        <p style="margin-bottom: var(--space-4); color: var(--color-gray-medium);">Seu carrinho está vazio.</p>
        <a href="../index.html" class="btn btn-primary">Continuar Comprando</a>
      </div>
    `;
  } else {
    // Display cart items using the same card pattern as meus-livros.html
    cartItemsSection.querySelector('.card-body').innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2" style="gap: var(--space-4);">
        ${cartItems.map(book => `
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

              <div style="margin-top: var(--space-4);">
                <button class="btn btn-outline btn-sm btn-block" onclick="window.removeBookFromCart('${book.id}')" style="color: var(--color-danger); border-color: var(--color-danger);">
                  Remover do Carrinho
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Update order summary
  const summarySection = document.querySelector('section.card:last-of-type');
  summarySection.querySelector('.card-body').innerHTML = `
    <div style="margin-bottom: var(--space-4);">
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-3);">
        <span>Quantidade de Livros:</span>
        <span><strong>${getCartCount()}</strong></span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-3);">
        <span>Frete por Livro:</span>
        <span>R$ 50,00</span>
      </div>
      <hr style="margin: var(--space-4) 0; border: none; border-top: 1px solid var(--color-border);">
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-4); font-size: var(--font-size-lg); font-weight: 600;">
        <span>Frete Total:</span>
        <span>R$ ${totalShipping.toFixed(2).replace('.', ',')}</span>
      </div>
    </div>
    <button class="btn btn-accent btn-block" ${cartItems.length === 0 ? 'disabled' : ''} onclick="window.finalizarPedido()">
      ${cartItems.length === 0 ? 'Carrinho Vazio' : 'Finalizar Pedido'}
    </button>
  `;
}

// Remove book from cart
window.removeBookFromCart = function(bookId) {
  if (confirm('Tem certeza que deseja remover este livro do carrinho?')) {
    removeFromCart(bookId);
    displayCartItems();
  }
};

// Finalize order (placeholder function)
window.finalizarPedido = function() {
  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    return;
  }
  
  alert('Funcionalidade de finalização de pedido em desenvolvimento. Em breve você poderá concluir sua compra!');
  // TODO: Implement order finalization
};

// Initialize cart display
displayCartItems();
