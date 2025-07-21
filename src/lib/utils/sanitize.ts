import { Pet } from '@/types/pet';

/**
 * Sanitize text to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Remove all HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');
  
  // Remove dangerous characters and scripts
  sanitized = sanitized
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .replace(/script/gi, '') // Remove the word script
    .trim();
  
  return sanitized;
}

/**
 * Sanitize and truncate text for display
 */
export function sanitizeAndTruncate(text: string, maxLength: number): string {
  const sanitized = sanitizeText(text);
  if (sanitized.length <= maxLength) return sanitized;
  return sanitized.substring(0, maxLength) + '...';
}

/**
 * Check if text contains potentially malicious content
 */
export function containsMaliciousContent(text: string): boolean {
  if (!text) return false;
  
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /<style[^>]*>.*?<\/style>/gi,
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(text));
}

/**
 * Validate pet data for security
 */
export function validatePetData(pet: Pet): boolean {
  // Check name
  if (pet.name && containsMaliciousContent(pet.name)) {
    console.warn('Pet name contains potentially malicious content:', pet.name);
    return false;
  }
  
  // Check category
  if (pet.category?.name && containsMaliciousContent(pet.category.name)) {
    console.warn('Pet category contains potentially malicious content:', pet.category.name);
    return false;
  }
  
  // Check tags
  if (pet.tags && Array.isArray(pet.tags)) {
    for (const tag of pet.tags) {
      if (tag.name && containsMaliciousContent(tag.name)) {
        console.warn('Pet tag contains potentially malicious content:', tag.name);
        return false;
      }
    }
  }
  
  return true;
}
