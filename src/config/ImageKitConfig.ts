// ImageKit Configuration for high-quality image generation

export const IMAGEKIT_CONFIG = {
  urlEndpoint: 'https://ik.imagekit.io/ikmedia',
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
  authenticationEndpoint: import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT || '',
};

/**
 * Generate ImageKit URL for AI-generated images
 * @param prompt - Image generation prompt
 * @param imageName - Unique image name
 * @param transformations - Optional ImageKit transformations
 */
export function generateImageKitUrl(
  prompt: string,
  imageName: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp';
  }
): string {
  const baseUrl = IMAGEKIT_CONFIG.urlEndpoint;
  const encodedPrompt = encodeURIComponent(prompt);
  const cleanImageName = imageName.replace(/[^a-zA-Z0-9]/g, '_');
  
  // Build transformation string
  let transformStr = '';
  if (transformations) {
    const parts: string[] = [];
    if (transformations.width) parts.push(`w-${transformations.width}`);
    if (transformations.height) parts.push(`h-${transformations.height}`);
    if (transformations.quality) parts.push(`q-${transformations.quality}`);
    if (transformations.format) parts.push(`f-${transformations.format}`);
    
    if (parts.length > 0) {
      transformStr = `/tr:${parts.join(',')}`;
    }
  }
  
  return `${baseUrl}${transformStr}/ik-genimg-prompt-${encodedPrompt}/${cleanImageName}.jpg`;
}

/**
 * Generate multiple image URLs for a slide based on content
 */
export function generateSlideImages(
  slideContent: string,
  slideTitle: string,
  themeStyle: string
): string[] {
  const images: string[] = [];
  
  // Extract key concepts from slide content
  const concepts = extractImageConcepts(slideContent, slideTitle, themeStyle);
  
  concepts.forEach((concept, index) => {
    const imageName = `slide_${slideTitle.replace(/\s+/g, '_')}_${index}`;
    images.push(
      generateImageKitUrl(concept, imageName, {
        width: 800,
        height: 450,
        quality: 90,
        format: 'webp',
      })
    );
  });
  
  return images;
}

/**
 * Extract image concepts from slide content
 */
function extractImageConcepts(
  content: string,
  title: string,
  themeStyle: string
): string[] {
  const concepts: string[] = [];
  
  // Create a primary concept from title and theme
  const primaryConcept = `${title} ${themeStyle} professional high quality`;
  concepts.push(primaryConcept);
  
  // Extract key phrases from content (simple extraction)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length > 0) {
    const keyPhrase = sentences[0].trim().substring(0, 100);
    concepts.push(`${keyPhrase} ${themeStyle} illustration`);
  }
  
  return concepts;
}

/**
 * Optimize image URL for specific use case
 */
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    blur?: number;
    grayscale?: boolean;
  }
): string {
  if (!url.includes('imagekit.io')) return url;
  
  const transformations: string[] = [];
  if (options.width) transformations.push(`w-${options.width}`);
  if (options.height) transformations.push(`h-${options.height}`);
  if (options.quality) transformations.push(`q-${options.quality}`);
  if (options.blur) transformations.push(`bl-${options.blur}`);
  if (options.grayscale) transformations.push('e-grayscale');
  
  if (transformations.length === 0) return url;
  
  const transformStr = `/tr:${transformations.join(',')}`;
  
  // Insert transformation before the path
  return url.replace(/\/ik-genimg-prompt-/, `${transformStr}/ik-genimg-prompt-`);
}
