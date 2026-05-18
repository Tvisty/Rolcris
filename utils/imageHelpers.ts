
import { Car } from '../types';

/**
 * Optimizes a Supabase storage URL by switching to the image rendering API.
 * This allows reducing image size for better loading performance.
 */
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
  if (!url || !url.startsWith('http')) return url;
  
  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    let optimizedUrl = url.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    
    const params = new URLSearchParams();
    // Only optimize format and quality to avoid any cropping/zooming
    params.append('quality', '70');
    params.append('format', 'webp');
    
    return `${optimizedUrl}?${params.toString()}`;
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
  const isMoto = car.vehicleType === 'Motocicletă';
  const placeholder = isMoto 
    ? "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop";

  if (!car.images || car.images.length === 0) {
    return placeholder;
  }

  const image = car.images[0];

  // Fix case where car placeholder is saved in database for a motorcycle
  if (isMoto && image === "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop") {
    return placeholder;
  }

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

  return placeholder;
};
