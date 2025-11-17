/**
 * CART-SERVICE.JS - Shopping cart service
 * Livro&Livro - Book Exchange Platform
 */

const CART_KEY = 'cart';
const SHIPPING_COST_PER_BOOK = 50;

/**
 * Get cart from localStorage
 * @returns {string[]} Array of book IDs in the cart
 */
export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart to localStorage
 * @param {string[]} cart - Array of book IDs
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Get current logged-in user
 * @returns {object|null} Current user or null if not logged in
 */
function getCurrentUser() {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
}

/**
 * Get all books from localStorage
 * @returns {object[]} Array of books
 */
function getAllBooks() {
  const books = localStorage.getItem('books');
  return books ? JSON.parse(books) : [];
}

/**
 * Add book to cart
 * @param {string} bookId - ID of the book to add
 * @returns {object} Result object with success status and message
 */
export function addToCart(bookId) {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return {
      success: false,
      message: 'Você precisa estar logado para adicionar livros ao carrinho.',
      requiresLogin: true
    };
  }

  const cart = getCart();
  const allBooks = getAllBooks();
  
  // Find the book
  const book = allBooks.find(b => b.id === bookId);
  
  if (!book) {
    return {
      success: false,
      message: 'Livro não encontrado.'
    };
  }

  // Check if book belongs to current user
  const userBookIDs = currentUser.bookIDs || [];
  if (userBookIDs.includes(bookId)) {
    return {
      success: false,
      message: 'Você não pode adicionar seus próprios livros ao carrinho.'
    };
  }

  // Check if book is already in cart
  if (cart.includes(bookId)) {
    return {
      success: false,
      message: 'Este livro já está no seu carrinho!'
    };
  }

  // Add to cart
  cart.push(bookId);
  saveCart(cart);

  return {
    success: true,
    message: 'Livro adicionado ao carrinho!'
  };
}

/**
 * Remove book from cart
 * @param {string} bookId - ID of the book to remove
 */
export function removeFromCart(bookId) {
  const cart = getCart();
  const updatedCart = cart.filter(id => id !== bookId);
  saveCart(updatedCart);
}

/**
 * Clear entire cart
 */
export function clearCart() {
  saveCart([]);
}

/**
 * Get cart items with book details
 * @returns {object[]} Array of books in the cart with full details
 */
export function getCartItems() {
  const cart = getCart();
  const allBooks = getAllBooks();
  
  return cart
    .map(bookId => allBooks.find(book => book.id === bookId))
    .filter(book => book !== undefined); // Filter out books that no longer exist
}

/**
 * Calculate total shipping cost
 * @returns {number} Total shipping cost
 */
export function calculateTotalShipping() {
  const cart = getCart();
  return cart.length * SHIPPING_COST_PER_BOOK;
}

/**
 * Get cart count
 * @returns {number} Number of items in cart
 */
export function getCartCount() {
  return getCart().length;
}
