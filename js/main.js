/**
 * MAIN.JS - Main application entry point
 * Livro&Livro - Book Exchange Platform
 */

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

if (mobileMenuToggle && mobileNav) {
  mobileMenuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('active');
  });
}

// Cookie consent banner
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const rejectCookiesBtn = document.getElementById('reject-cookies');

function checkCookieConsent() {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent && cookieBanner) {
    cookieBanner.style.display = 'block';
  }
}

if (acceptCookiesBtn) {
  acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    if (cookieBanner) {
      cookieBanner.style.display = 'none';
    }
  });
}

if (rejectCookiesBtn) {
  rejectCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    if (cookieBanner) {
      cookieBanner.style.display = 'none';
    }
  });
}

// Check cookie consent on page load
document.addEventListener('DOMContentLoaded', () => {
  checkCookieConsent();
});

// Helper function to show alerts
export function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  alertDiv.setAttribute('role', 'alert');

  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.insertBefore(alertDiv, mainContent.firstChild);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
}

// Helper function to check if user is logged in
export function isUserLoggedIn() {
  return localStorage.getItem('currentUser') !== null;
}

// Helper function to get current user
export function getCurrentUser() {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
}

// Helper function to logout
export function logout() {
  localStorage.removeItem('currentUser');
  const basePath = window.location.hostname.includes('github.io')
      ? '/Sebo-Livro-Livro'
      : '';
  window.location.href = `${basePath}/`;
}

// Update header based on login status
function updateHeaderForAuth() {
  const headerActions = document.querySelector('.header-actions');
  const login = document.getElementById('mobile-nav-item-login');
  const cadastro = document.getElementById('mobile-nav-item-cadastro');
  if (login) login.style.display = isUserLoggedIn() ? 'none' : 'block';
  if (cadastro) cadastro.style.display = isUserLoggedIn() ? 'none' : 'block';
  if (!headerActions) return;

  if (isUserLoggedIn()) {
    const user = getCurrentUser();
    const basePath = window.location.hostname.includes('github.io')
      ? '/Sebo-Livro-Livro'
      : '';
    headerActions.innerHTML = `
      <a href="${basePath}/usuario/painel.html" class="btn btn-accent">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
        ${user.name || 'Minha Conta'}
      </a>
      <button id="logout-btn" class="btn btn-secondary">Sair</button>
    `;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderForAuth();
});
