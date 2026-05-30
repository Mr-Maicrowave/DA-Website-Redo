/**
 * Configuration for newsletter image handling
 * 
 * Since the SVG files are very large (1GB total), we implement several strategies:
 * 1. Use placeholders in grid views
 * 2. Only load full SVGs when viewing individual newsletters
 * 3. Implement progressive loading
 */

export const NEWSLETTER_CONFIG = {
  // Use placeholders for newsletters in grid views
  USE_PLACEHOLDERS_IN_GRID: true,
  
  // Maximum file size (in bytes) before using placeholder
  MAX_THUMBNAIL_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Image optimization settings
  IMAGE_QUALITY: 85,
  THUMBNAIL_WIDTH: 400,
  THUMBNAIL_HEIGHT: 600,
  
  // Loading strategy
  LAZY_LOAD: true,
  PROGRESSIVE_LOAD: true,
};

// Newsletter thumbnail mappings (if you create optimized versions)
export const NEWSLETTER_THUMBNAILS: Record<number, string> = {
  // Map newsletter IDs to thumbnail paths if available
  // Example: 1: '/newsletter-images/thumbnails/1.jpg',
};

// For production, you might want to use a CDN or image optimization service
export const getNewsletterImageUrl = (id: number, fullSize: boolean = false): string => {
  if (!fullSize && NEWSLETTER_CONFIG.USE_PLACEHOLDERS_IN_GRID) {
    // Return a lightweight placeholder for grid views
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'%3E%3Crect fill='%23f3f4f6' width='400' height='600'/%3E%3Ctext x='200' y='300' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='20'%3ENewsletter %23${id}%3C/text%3E%3C/svg%3E`;
  }
  
  // Check if we have a thumbnail version
  if (!fullSize && NEWSLETTER_THUMBNAILS[id]) {
    return NEWSLETTER_THUMBNAILS[id];
  }
  
  // Return the full SVG path
  return `/NewsletterSvg/${id}.svg`;
};