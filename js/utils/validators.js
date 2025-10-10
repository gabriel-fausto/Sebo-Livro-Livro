/**
 * VALIDATORS.JS - Validation utilities
 * Livro&Livro - Book Exchange Platform
 */

/**
 * Validates CPF (Brazilian ID number)
 * @param {string} cpf - CPF to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateCPF(cpf) {
  // Remove non-numeric characters
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Check if CPF has 11 digits
  if (cpf.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cpf.charAt(9))) return false;
  
  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

/**
 * Formats CPF with mask (XXX.XXX.XXX-XX)
 * @param {string} cpf - CPF to format
 * @returns {string} - Formatted CPF
 */
export function formatCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

/**
 * Validates phone number (Brazilian format)
 * @param {string} phone - Phone to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validatePhone(phone) {
  phone = phone.replace(/[^\d]/g, '');
  // Should have 10 or 11 digits (with area code)
  return phone.length === 10 || phone.length === 11;
}

/**
 * Formats phone with mask
 * @param {string} phone - Phone to format
 * @returns {string} - Formatted phone
 */
export function formatPhone(phone) {
  phone = phone.replace(/[^\d]/g, '');
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (phone.length === 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

/**
 * Validates CEP (Brazilian postal code)
 * @param {string} cep - CEP to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateCEP(cep) {
  cep = cep.replace(/[^\d]/g, '');
  return cep.length === 8;
}

/**
 * Formats CEP with mask (XXXXX-XXX)
 * @param {string} cep - CEP to format
 * @returns {string} - Formatted CEP
 */
export function formatCEP(cep) {
  cep = cep.replace(/[^\d]/g, '');
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Validates age (must be 18 or older)
 * @param {string} birthDate - Birth date in format YYYY-MM-DD
 * @returns {boolean} - True if 18 or older, false otherwise
 */
export function validateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= 18;
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Object with isValid and strength properties
 */
export function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  let strength = 0;
  if (password.length >= minLength) strength++;
  if (hasUpperCase) strength++;
  if (hasLowerCase) strength++;
  if (hasNumbers) strength++;
  if (hasSpecialChar) strength++;
  
  let strengthLabel = 'weak';
  if (strength >= 4) strengthLabel = 'strong';
  else if (strength >= 3) strengthLabel = 'medium';
  
  return {
    isValid: password.length >= minLength,
    strength: strengthLabel,
    score: strength
  };
}

/**
 * Validates if a string is not empty
 * @param {string} value - Value to validate
 * @returns {boolean} - True if not empty, false otherwise
 */
export function validateRequired(value) {
  return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Validates minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateMinLength(value, minLength) {
  return value.length >= minLength;
}

/**
 * Validates maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateMaxLength(value, maxLength) {
  return value.length <= maxLength;
}

/**
 * Validates if value is a number
 * @param {string} value - Value to validate
 * @returns {boolean} - True if valid number, false otherwise
 */
export function validateNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
export function sanitizeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
