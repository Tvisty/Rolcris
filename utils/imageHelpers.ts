
import { Car } from '../types';

/**
 * Optimizes a Supabase storage URL by switching to the image rendering API.
 * This allows reducing image size for better loading performance.
 */
export const getOptimizedImageUrl = (url: string, width: number = 400, height?: number): string => {
  if (!url) return '';

  if (url.startsWith('data:image')) {
    return url;
  }

  // Optimise Unsplash URLs
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', width.toString());
      if (height) urlObj.searchParams.set('h', height.toString());
      urlObj.searchParams.set('q', '70'); // Good balance for mobile
      urlObj.searchParams.set('fm', 'webp'); // Modern format
      urlObj.searchParams.set('auto', 'format,compress'); 
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  // Optimise Supabase Storage URLs using a free CDN (wsrv.nl) for automatic resizing and webp conversion
  if (url.includes('/storage/v1/object/public/')) {
     const encodedUrl = encodeURIComponent(url);
     return `https://wsrv.nl/?url=${encodedUrl}&w=${width}&q=70&output=webp`;
  }

  return url;
};

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
