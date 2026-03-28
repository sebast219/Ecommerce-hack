// 🏗️ SHARED VALIDATION - Validación Compartida entre Servidores
// PROPÓSITO: Funciones de validación compartidas para NestJS y Railway

// Validación de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de contraseña
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validación de nombre
export const validateName = (name: string, fieldName: string = 'Name'): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!name) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }

  if (name.length < 2) {
    errors.push(`${fieldName} must be at least 2 characters`);
  }

  if (name.length > 200) {
    errors.push(`${fieldName} cannot exceed 200 characters`);
  }

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push(`${fieldName} can only contain letters and spaces`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validación de teléfono
export const validatePhone = (phone?: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
    errors.push('Please provide a valid phone number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validación de precio
export const validatePrice = (price: number): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (typeof price !== 'number' || isNaN(price)) {
    errors.push('Price must be a valid number');
    return { isValid: false, errors };
  }

  if (price < 0.01) {
    errors.push('Price must be greater than 0');
  }

  if (price > 999999.99) {
    errors.push('Price cannot exceed 999999.99');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validación de SKU
export const validateSku = (sku: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!sku) {
    errors.push('SKU is required');
    return { isValid: false, errors };
  }

  if (sku.length < 3) {
    errors.push('SKU must be at least 3 characters');
  }

  if (sku.length > 50) {
    errors.push('SKU cannot exceed 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validación de slug
export const validateSlug = (slug: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!slug) {
    errors.push('Slug is required');
    return { isValid: false, errors };
  }

  if (slug.length < 3) {
    errors.push('Slug must be at least 3 characters');
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validación de URL
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validación de imágenes (array de URLs)
export const validateImages = (images: string[]): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!Array.isArray(images)) {
    errors.push('Images must be an array');
    return { isValid: false, errors };
  }

  if (images.length === 0) {
    errors.push('At least one image is required');
    return { isValid: false, errors };
  }

  for (let i = 0; i < images.length; i++) {
    if (!validateUrl(images[i])) {
      errors.push(`Image ${i + 1} must be a valid URL`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validación de tags
export const validateTags = (tags: string[]): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!Array.isArray(tags)) {
    errors.push('Tags must be an array');
    return { isValid: false, errors };
  }

  for (let i = 0; i < tags.length; i++) {
    if (typeof tags[i] !== 'string') {
      errors.push(`Tag ${i + 1} must be a string`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validación de paginación
export const validatePagination = (page?: number, limit?: number): {
  isValid: boolean;
  errors: string[];
  normalizedPage: number;
  normalizedLimit: number;
} => {
  const errors: string[] = [];
  let normalizedPage = page || 1;
  let normalizedLimit = limit || 20;

  if (page && (isNaN(page) || page < 1)) {
    errors.push('Page must be a positive number');
    normalizedPage = 1;
  }

  if (limit && (isNaN(limit) || limit < 1)) {
    errors.push('Limit must be a positive number');
    normalizedLimit = 20;
  }

  if (normalizedLimit > 100) {
    errors.push('Limit cannot exceed 100');
    normalizedLimit = 100;
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedPage,
    normalizedLimit
  };
};

// Validación de registro de usuario
export const validateRegister = (data: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
}): {
  isValid: boolean;
  errors: string[];
} => {
  const allErrors: string[] = [];

  // Validar email
  if (!validateEmail(data.email)) {
    allErrors.push('Please provide a valid email address');
  }

  // Validar nombre
  const firstNameValidation = validateName(data.firstName, 'First name');
  allErrors.push(...firstNameValidation.errors);

  // Validar apellido
  const lastNameValidation = validateName(data.lastName, 'Last name');
  allErrors.push(...lastNameValidation.errors);

  // Validar contraseña
  const passwordValidation = validatePassword(data.password);
  allErrors.push(...passwordValidation.errors);

  // Validar teléfono (opcional)
  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    allErrors.push(...phoneValidation.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

// Validación de login
export const validateLogin = (data: {
  email: string;
  password: string;
}): {
  isValid: boolean;
  errors: string[];
} => {
  const allErrors: string[] = [];

  if (!validateEmail(data.email)) {
    allErrors.push('Please provide a valid email address');
  }

  if (!data.password) {
    allErrors.push('Password is required');
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

// Validación de creación de producto
export const validateCreateProduct = (data: {
  name: string;
  slug: string;
  price: number;
  sku: string;
  images: string[];
  tags: string[];
}): {
  isValid: boolean;
  errors: string[];
} => {
  const allErrors: string[] = [];

  // Validar nombre
  const nameValidation = validateName(data.name, 'Product name');
  allErrors.push(...nameValidation.errors);

  // Validar slug
  const slugValidation = validateSlug(data.slug);
  allErrors.push(...slugValidation.errors);

  // Validar precio
  const priceValidation = validatePrice(data.price);
  allErrors.push(...priceValidation.errors);

  // Validar SKU
  const skuValidation = validateSku(data.sku);
  allErrors.push(...skuValidation.errors);

  // Validar imágenes
  const imagesValidation = validateImages(data.images);
  allErrors.push(...imagesValidation.errors);

  // Validar tags
  const tagsValidation = validateTags(data.tags);
  allErrors.push(...tagsValidation.errors);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

// Exportar todo para Railway-server.js
export default {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validatePrice,
  validateSku,
  validateSlug,
  validateUrl,
  validateImages,
  validateTags,
  validatePagination,
  validateRegister,
  validateLogin,
  validateCreateProduct,
};
