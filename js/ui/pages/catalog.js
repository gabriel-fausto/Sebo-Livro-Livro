/**
 * CATALOG.JS - Catalog page logic
 * Livro&Livro - Book Exchange Platform
 */

async function getBase64Image(imgURL) {
    const img = await loadImage(imgURL);
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

async function loadImage(imgURL) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };

    img.onerror = (error) => {
      reject(new Error('Falha ao carregar imagem'));
    };

    img.src = imgURL;
  });
}

// Initialize books in localStorage if empty
async function initializeBooks() {
  const url = `https://6tq0bqkysh.execute-api.sa-east-1.amazonaws.com/dev/books`;
    
    // Faz a chamada na API
    const resposta = await fetch(url);
    const dados = await resposta.json();
  if (dados) {
    localStorage.setItem('books', JSON.stringify(dados));
  }
}

// Get all books from localStorage
function getBooks() {
  return JSON.parse(localStorage.getItem('books') || '[]');
}

// State
let currentFilters = {
  category: 'todos',
  conditions: [],
  types: [],
  search: ''
};

let currentSort = 'recent';

// DOM elements
const booksGrid = document.getElementById('books-grid');
const emptyState = document.getElementById('empty-state');
const loadingState = document.getElementById('loading-state');
const resultCount = document.getElementById('result-count');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const categoryChips = document.querySelectorAll('.category-chip');
const conditionCheckboxes = document.querySelectorAll('input[name="condition"]');
const typeCheckboxes = document.querySelectorAll('input[name="type"]');
const clearFiltersBtn = document.getElementById('clear-filters');

// Get category from URL
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('categoria') || 'todos';
}

// Update URL when category changes
function updateURL(category) {
  const url = new URL(window.location);
  if (category === 'todos') {
    url.searchParams.delete('categoria');
  } else {
    url.searchParams.set('categoria', category);
  }
  window.history.replaceState({}, '', url);
}

// Filter books
function filterBooks(books) {
  return books.filter(book => {
    // Category filter
    if (currentFilters.category !== 'todos' && book.category !== currentFilters.category) {
      return false;
    }
    
    // Condition filter
    if (currentFilters.conditions.length > 0 && !currentFilters.conditions.includes(book.condition)) {
      return false;
    }
    
    // Type filter
    if (currentFilters.types.length > 0 && !currentFilters.types.includes(book.type)) {
      return false;
    }
    
    // Search filter
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      return (
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.isbn.includes(searchLower)
      );
    }
    
    return true;
  });
}

// Sort books
function sortBooks(books) {
  const sorted = [...books];
  
  switch (currentSort) {
    case 'recent':
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'title-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'title-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'author-asc':
      sorted.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case 'author-desc':
      sorted.sort((a, b) => b.author.localeCompare(a.author));
      break;
  }
  
  return sorted;
}

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

// Render books
function renderBooks() {
  loadingState.style.display = 'none';
  
  const allBooks = getBooks();
  const filtered = filterBooks(allBooks);
  const sorted = sortBooks(filtered);
  
  resultCount.textContent = `Mostrando ${sorted.length} ${sorted.length === 1 ? 'livro' : 'livros'}`;
  
  if (sorted.length === 0) {
    booksGrid.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    booksGrid.innerHTML = sorted.map(book => renderBookCard(book)).join('');
    
    // Add event listeners to "Gostaria de Ler" buttons
    booksGrid.querySelectorAll('button[data-book-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bookId = e.target.dataset.bookId;
        addToCart(bookId);
      });
    });
  }
}

// Add to cart
function addToCart(bookId) {
  const currentUser = localStorage.getItem('currentUser');
  
  if (!currentUser) {
    alert('Você precisa estar logado para adicionar livros ao carrinho.');
    window.location.href = '/Sebo-Livro-Livro/auth/login.html';
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

// Event listeners
categoryChips.forEach(chip => {
  chip.addEventListener('click', (e) => {
    categoryChips.forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    currentFilters.category = e.target.dataset.category;
    updateURL(currentFilters.category);
    renderBooks();
  });
});

searchInput.addEventListener('input', (e) => {
  currentFilters.search = e.target.value.trim();
  renderBooks();
});

sortSelect.addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderBooks();
});

conditionCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    currentFilters.conditions = Array.from(conditionCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    renderBooks();
  });
});

typeCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    currentFilters.types = Array.from(typeCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    renderBooks();
  });
});

clearFiltersBtn.addEventListener('click', () => {
  // Clear all filters
  conditionCheckboxes.forEach(cb => cb.checked = false);
  typeCheckboxes.forEach(cb => cb.checked = false);
  searchInput.value = '';
  currentFilters = {
    category: 'todos',
    conditions: [],
    types: [],
    search: ''
  };
  
  // Reset category chips
  categoryChips.forEach(c => c.classList.remove('active'));
  categoryChips[0].classList.add('active');
  
  updateURL('todos');
  renderBooks();
});

// Initialize
await initializeBooks();

// Set initial category from URL
const initialCategory = getCategoryFromURL();
currentFilters.category = initialCategory;

// Set active category chip
categoryChips.forEach(chip => {
  if (chip.dataset.category === initialCategory) {
    chip.classList.add('active');
  } else {
    chip.classList.remove('active');
  }
});

// Update page title
if (initialCategory !== 'todos') {
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
  const categoryLabel = categoryLabels[initialCategory] || initialCategory;
  document.getElementById('catalog-title').textContent = `Catálogo - ${categoryLabel}`;
}

// Initial render
renderBooks();
