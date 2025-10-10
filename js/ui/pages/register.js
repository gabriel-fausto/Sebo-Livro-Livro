/**
 * REGISTER.JS - Registration page logic
 * Livro&Livro - Book Exchange Platform
 */

import { 
  validateCPF, 
  formatCPF, 
  validateEmail, 
  validatePhone, 
  formatPhone,
  validateCEP,
  formatCEP,
  validateAge,
  validatePassword,
  validateRequired 
} from '../../utils/validators.js';

const form = document.getElementById('register-form');
const passwordInput = document.getElementById('password');
const passwordStrengthBar = document.getElementById('password-strength-bar');

// Form field references
const fields = {
  name: document.getElementById('name'),
  cpf: document.getElementById('cpf'),
  birthDate: document.getElementById('birthDate'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  cep: document.getElementById('cep'),
  state: document.getElementById('state'),
  city: document.getElementById('city'),
  street: document.getElementById('street'),
  number: document.getElementById('number'),
  complement: document.getElementById('complement'),
  neighborhood: document.getElementById('neighborhood'),
  password: passwordInput,
  confirmPassword: document.getElementById('confirmPassword'),
  terms: document.getElementById('terms')
};

// Error span references
const errors = {
  name: document.getElementById('name-error'),
  cpf: document.getElementById('cpf-error'),
  birthDate: document.getElementById('birthDate-error'),
  email: document.getElementById('email-error'),
  phone: document.getElementById('phone-error'),
  cep: document.getElementById('cep-error'),
  state: document.getElementById('state-error'),
  city: document.getElementById('city-error'),
  street: document.getElementById('street-error'),
  number: document.getElementById('number-error'),
  neighborhood: document.getElementById('neighborhood-error'),
  genres: document.getElementById('genres-error'),
  password: document.getElementById('password-error'),
  confirmPassword: document.getElementById('confirmPassword-error'),
  terms: document.getElementById('terms-error')
};

// Format CPF as user types
fields.cpf.addEventListener('input', (e) => {
  let value = e.target.value.replace(/[^\d]/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length >= 3) {
    e.target.value = formatCPF(value);
  } else {
    e.target.value = value;
  }
});

// Format phone as user types
fields.phone.addEventListener('input', (e) => {
  let value = e.target.value.replace(/[^\d]/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  e.target.value = formatPhone(value);
});

// Format CEP as user types
fields.cep.addEventListener('input', (e) => {
  let value = e.target.value.replace(/[^\d]/g, '');
  if (value.length > 8) value = value.slice(0, 8);
  e.target.value = formatCEP(value);
});

// Password strength indicator
passwordInput.addEventListener('input', (e) => {
  const result = validatePassword(e.target.value);
  passwordStrengthBar.className = `password-strength-bar ${result.strength}`;
});

// Clear error when user starts typing
Object.keys(fields).forEach(key => {
  if (fields[key]) {
    fields[key].addEventListener('input', () => {
      if (errors[key]) {
        errors[key].textContent = '';
        fields[key].classList.remove('form-input-error', 'form-select-error');
      }
    });
  }
});

function showError(field, message) {
  if (errors[field]) {
    errors[field].textContent = message;
    if (fields[field]) {
      const errorClass = fields[field].tagName === 'SELECT' ? 'form-select-error' : 'form-input-error';
      fields[field].classList.add(errorClass);
    }
  }
}

function clearErrors() {
  Object.values(errors).forEach(error => {
    if (error) error.textContent = '';
  });
  Object.values(fields).forEach(field => {
    if (field) {
      field.classList.remove('form-input-error', 'form-select-error');
    }
  });
}

function validateForm() {
  clearErrors();
  let isValid = true;
  
  // Validate name
  if (!validateRequired(fields.name.value)) {
    showError('name', 'Nome é obrigatório');
    isValid = false;
  } else if (fields.name.value.trim().length < 3) {
    showError('name', 'Nome deve ter pelo menos 3 caracteres');
    isValid = false;
  }
  
  // Validate CPF
  if (!validateRequired(fields.cpf.value)) {
    showError('cpf', 'CPF é obrigatório');
    isValid = false;
  } else if (!validateCPF(fields.cpf.value)) {
    showError('cpf', 'CPF inválido');
    isValid = false;
  }
  
  // Validate birth date and age
  if (!validateRequired(fields.birthDate.value)) {
    showError('birthDate', 'Data de nascimento é obrigatória');
    isValid = false;
  } else if (!validateAge(fields.birthDate.value)) {
    showError('birthDate', 'Você deve ter 18 anos ou mais');
    isValid = false;
  }
  
  // Validate email
  if (!validateRequired(fields.email.value)) {
    showError('email', 'E-mail é obrigatório');
    isValid = false;
  } else if (!validateEmail(fields.email.value)) {
    showError('email', 'E-mail inválido');
    isValid = false;
  } else {
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === fields.email.value)) {
      showError('email', 'Este e-mail já está cadastrado');
      isValid = false;
    }
  }
  
  // Validate phone
  if (!validateRequired(fields.phone.value)) {
    showError('phone', 'Telefone é obrigatório');
    isValid = false;
  } else if (!validatePhone(fields.phone.value)) {
    showError('phone', 'Telefone inválido');
    isValid = false;
  }
  
  // Validate CEP
  if (!validateRequired(fields.cep.value)) {
    showError('cep', 'CEP é obrigatório');
    isValid = false;
  } else if (!validateCEP(fields.cep.value)) {
    showError('cep', 'CEP inválido');
    isValid = false;
  }
  
  // Validate state
  if (!validateRequired(fields.state.value)) {
    showError('state', 'Estado é obrigatório');
    isValid = false;
  }
  
  // Validate city
  if (!validateRequired(fields.city.value)) {
    showError('city', 'Cidade é obrigatória');
    isValid = false;
  }
  
  // Validate street
  if (!validateRequired(fields.street.value)) {
    showError('street', 'Rua/Avenida é obrigatória');
    isValid = false;
  }
  
  // Validate number
  if (!validateRequired(fields.number.value)) {
    showError('number', 'Número é obrigatório');
    isValid = false;
  }
  
  // Validate neighborhood
  if (!validateRequired(fields.neighborhood.value)) {
    showError('neighborhood', 'Bairro é obrigatório');
    isValid = false;
  }
  
  // Validate genres (at least one selected)
  const genreCheckboxes = document.querySelectorAll('input[name="genres"]:checked');
  if (genreCheckboxes.length === 0) {
    showError('genres', 'Selecione pelo menos um gênero de interesse');
    isValid = false;
  }
  
  // Validate password
  if (!validateRequired(fields.password.value)) {
    showError('password', 'Senha é obrigatória');
    isValid = false;
  } else {
    const passwordResult = validatePassword(fields.password.value);
    if (!passwordResult.isValid) {
      showError('password', 'Senha deve ter no mínimo 8 caracteres');
      isValid = false;
    }
  }
  
  // Validate confirm password
  if (!validateRequired(fields.confirmPassword.value)) {
    showError('confirmPassword', 'Confirmação de senha é obrigatória');
    isValid = false;
  } else if (fields.password.value !== fields.confirmPassword.value) {
    showError('confirmPassword', 'As senhas não coincidem');
    isValid = false;
  }
  
  // Validate terms
  if (!fields.terms.checked) {
    showError('terms', 'Você deve aceitar os Termos de Uso e Política de Privacidade');
    isValid = false;
  }
  
  return isValid;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    // Scroll to first error
    const firstError = document.querySelector('.form-input-error, .form-select-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Collect form data
  const genreCheckboxes = document.querySelectorAll('input[name="genres"]:checked');
  const genres = Array.from(genreCheckboxes).map(cb => cb.value);
  
  const userData = {
    id: Date.now().toString(),
    name: fields.name.value.trim(),
    cpf: fields.cpf.value,
    birthDate: fields.birthDate.value,
    email: fields.email.value.trim(),
    phone: fields.phone.value,
    address: {
      cep: fields.cep.value,
      state: fields.state.value,
      city: fields.city.value.trim(),
      street: fields.street.value.trim(),
      number: fields.number.value.trim(),
      complement: fields.complement.value.trim(),
      neighborhood: fields.neighborhood.value.trim()
    },
    preferences: {
      genres: genres
    },
    password: fields.password.value,
    createdAt: new Date().toISOString(),
    isAdmin: false
  };
  
  // Save to localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Auto login - store current user (without password)
  const { password, ...userWithoutPassword } = userData;
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  
  // Show success message
  alert('Cadastro realizado com sucesso! Você será redirecionado para o painel.');
  
  // Redirect to dashboard
  window.location.href = '../usuario/painel.html';
});
