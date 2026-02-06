
import { Car } from '../types';

/**
 * Safely retrieves the main image for a car.
 * Handles:
 * 1. Firebase Storage URLs (Optimized)
 * 2. Legacy Base64 strings (Fallback)
 * 3. Missing images (Placeholder)
 */
export const getCarMainImage = (car: Car): string => {
  if (!car.images || car.images.length === 0) {
    return "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop";
  }

  const image = car.images[0];

  // If it's already a URL (http/https), return it directly
  if (image.startsWith('http')) {
    return image;
  }

  // If it's a Base64 string, return it (ensure data prefix exists if missing)
  if (image.length > 100 && !image.startsWith('http')) {
    if (image.startsWith('data:image')) {
      return image;
    }
    // Fix broken base64 without prefix
    return `data:image/jpeg;base64,${image}`;
  }

  return "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop";
};
