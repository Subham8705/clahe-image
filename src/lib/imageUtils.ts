/**
 * Image utility functions for loading, processing, and exporting images
 */

/**
 * Load an image file and return ImageData
 */
export async function loadImageFromFile(file: File): Promise<{
  imageData: ImageData;
  originalUrl: string;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        
        resolve({
          imageData,
          originalUrl: e.target?.result as string,
          width: img.width,
          height: img.height,
        });
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Create a downsampled version of ImageData for preview
 */
export function downsampleImageData(
  imageData: ImageData,
  maxDimension: number
): ImageData {
  const { width, height } = imageData;
  
  if (width <= maxDimension && height <= maxDimension) {
    return imageData;
  }
  
  const scale = Math.min(maxDimension / width, maxDimension / height);
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  ctx.putImageData(imageData, 0, 0);
  
  const previewCanvas = document.createElement('canvas');
  previewCanvas.width = newWidth;
  previewCanvas.height = newHeight;
  
  const previewCtx = previewCanvas.getContext('2d');
  if (!previewCtx) throw new Error('Could not get canvas context');
  
  previewCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
  
  return previewCtx.getImageData(0, 0, newWidth, newHeight);
}

/**
 * Convert ImageData to a data URL
 */
export function imageDataToDataUrl(imageData: ImageData): string {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Download image from data URL
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if file is a valid image
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
  return validTypes.includes(file.type);
}
