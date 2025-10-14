/**
 * DASHBOARD.JS - User dashboard logic
 * Livro&Livro - Book Exchange Platform
 */

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

// Update welcome message
document.getElementById('dashboard-welcome').textContent = `Bem-vindo(a), ${user.name.split(' ')[0]}!`;
document.getElementById('user-name-header').textContent = user.name.split(' ')[0];

// Load user stats
function loadStats() {
  const books = JSON.parse(localStorage.getItem('books') || '[]');
  const userBooks = books.filter(book => book.ownerId === user.id);
  
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const userOrders = orders.filter(order => order.userId === user.id);
  const pendingOrders = userOrders.filter(order => 
    order.status !== 'concluido' && order.status !== 'cancelado'
  );
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  document.getElementById('stat-books-donated').textContent = userBooks.length;
  document.getElementById('stat-books-received').textContent = 
    userOrders.filter(o => o.status === 'concluido').length;
  document.getElementById('stat-pending-orders').textContent = pendingOrders.length;
  document.getElementById('stat-cart-items').textContent = cart.length;
}

// Load user profile data
function loadProfile() {
  document.getElementById('name').value = user.name;
  document.getElementById('email').value = user.email;
  document.getElementById('cpf').value = user.cpf;
  document.getElementById('phone').value = user.phone;
  document.getElementById('cep').value = user.address.cep;
  document.getElementById('state').value = user.address.state;
  document.getElementById('city').value = user.address.city;
  document.getElementById('street').value = user.address.street;
  document.getElementById('number').value = user.address.number;
  document.getElementById('complement').value = user.address.complement || '';
  document.getElementById('neighborhood').value = user.address.neighborhood;
  
  // Display genres as badges
  const genresDisplay = document.getElementById('genres-display');
  const genreLabels = {
    'ficcao': 'Ficção',
    'nao-ficcao': 'Não-Ficção',
    'tecnico': 'Técnico',
    'autoajuda': 'Autoajuda',
    'infantil': 'Infantil',
    'academico': 'Acadêmico',
    'biografia': 'Biografia',
    'outros': 'Outros'
  };
  
  genresDisplay.innerHTML = user.preferences.genres.map(genre => 
    `<span class="badge badge-primary">${genreLabels[genre] || genre}</span>`
  ).join('');
}

// Edit profile functionality
const editBtn = document.getElementById('edit-profile-btn');
const saveBtn = document.getElementById('save-profile-btn');
const cancelBtn = document.getElementById('cancel-edit-btn');
const form = document.getElementById('update-profile-form');
const formInputs = form.querySelectorAll('input');

let isEditing = false;
let originalValues = {};

editBtn.addEventListener('click', () => {
  isEditing = true;
  
  // Store original values
  formInputs.forEach(input => {
    originalValues[input.id] = input.value;
  });
  
  // Enable editable fields (except CPF and email which shouldn't change)
  formInputs.forEach(input => {
    if (input.id !== 'cpf' && input.id !== 'email') {
      input.disabled = false;
    }
  });
  
  // Toggle buttons
  editBtn.style.display = 'none';
  saveBtn.style.display = 'inline-flex';
  cancelBtn.style.display = 'inline-flex';
});

cancelBtn.addEventListener('click', () => {
  isEditing = false;
  
  // Restore original values
  formInputs.forEach(input => {
    input.value = originalValues[input.id];
    input.disabled = true;
  });
  
  // Toggle buttons
  editBtn.style.display = 'inline-flex';
  saveBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!isEditing) return;
  
  // Update user data
  const updatedUser = {
    ...user,
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value,
    address: {
      cep: document.getElementById('cep').value,
      state: document.getElementById('state').value,
      city: document.getElementById('city').value.trim(),
      street: document.getElementById('street').value.trim(),
      number: document.getElementById('number').value.trim(),
      complement: document.getElementById('complement').value.trim(),
      neighborhood: document.getElementById('neighborhood').value.trim()
    }
  };
  
  // Update in localStorage
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  
  // Update in users array
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  // Disable fields
  formInputs.forEach(input => {
    input.disabled = true;
  });
  
  // Toggle buttons
  editBtn.style.display = 'inline-flex';
  saveBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
  
  isEditing = false;
  
  alert('Perfil atualizado com sucesso!');
  
  // Reload the page to reflect changes
  window.location.reload();
});

// Logout functionality
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = './';
}

document.getElementById('logout-btn').addEventListener('click', logout);

const logoutBtnMobile = document.getElementById('logout-btn-mobile');
if (logoutBtnMobile) {
  logoutBtnMobile.addEventListener('click', logout);
}

// Initialize
loadStats();
loadProfile();
