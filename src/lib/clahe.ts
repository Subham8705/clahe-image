/**
 * CLAHE (Contrast Limited Adaptive Histogram Equalization) Implementation
 * 
 * This is a pure JavaScript implementation of CLAHE for browser-based image processing.
 * CLAHE enhances local contrast while limiting noise amplification.
 * 
 * Parameters:
 * - clipLimit: Controls the amount of contrast enhancement (1.0 - 10.0)
 *   Higher values = more contrast, but may amplify noise
 * - tileGridSize: Number of tiles in each dimension (4 - 16)
 *   Smaller tiles = more local enhancement, larger tiles = more global
 */

export interface CLAHEParams {
  clipLimit: number;
  tileGridSize: number;
}

export const DEFAULT_CLAHE_PARAMS: CLAHEParams = {
  clipLimit: 2.0,
  tileGridSize: 8,
};

/**
 * Convert RGB to grayscale using luminosity method
 */
export function rgbToGrayscale(imageData: ImageData): Uint8ClampedArray {
  const { data, width, height } = imageData;
  const grayscale = new Uint8ClampedArray(width * height);
  
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    // Luminosity method: 0.299*R + 0.587*G + 0.114*B
    grayscale[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  
  return grayscale;
}

/**
 * Calculate histogram for a region
 */
function calculateHistogram(
  data: Uint8ClampedArray,
  width: number,
  startX: number,
  startY: number,
  tileWidth: number,
  tileHeight: number,
  totalHeight: number
): number[] {
  const histogram = new Array(256).fill(0);
  
  for (let y = startY; y < Math.min(startY + tileHeight, totalHeight); y++) {
    for (let x = startX; x < Math.min(startX + tileWidth, width); x++) {
      const idx = y * width + x;
      histogram[data[idx]]++;
    }
  }
  
  return histogram;
}

/**
 * Clip histogram and redistribute excess
 */
function clipHistogram(histogram: number[], clipLimit: number, numPixels: number): number[] {
  const clippedHistogram = [...histogram];
  const clipThreshold = Math.floor((clipLimit * numPixels) / 256);
  
  let totalExcess = 0;
  
  // Calculate excess
  for (let i = 0; i < 256; i++) {
    if (clippedHistogram[i] > clipThreshold) {
      totalExcess += clippedHistogram[i] - clipThreshold;
      clippedHistogram[i] = clipThreshold;
    }
  }
  
  // Redistribute excess evenly
  const avgIncrease = Math.floor(totalExcess / 256);
  const remainder = totalExcess - avgIncrease * 256;
  
  for (let i = 0; i < 256; i++) {
    clippedHistogram[i] += avgIncrease;
  }
  
  // Distribute remainder
  const step = Math.max(1, Math.floor(256 / (remainder + 1)));
  for (let i = 0; i < remainder; i++) {
    clippedHistogram[(i * step) % 256]++;
  }
  
  return clippedHistogram;
}

/**
 * Calculate CDF (Cumulative Distribution Function) for histogram equalization
 */
function calculateCDF(histogram: number[]): number[] {
  const cdf = new Array(256);
  let sum = 0;
  
  for (let i = 0; i < 256; i++) {
    sum += histogram[i];
    cdf[i] = sum;
  }
  
  return cdf;
}

/**
 * Bilinear interpolation between four lookup tables
 */
function bilinearInterpolate(
  tl: number,
  tr: number,
  bl: number,
  br: number,
  tx: number,
  ty: number
): number {
  const top = tl + tx * (tr - tl);
  const bottom = bl + tx * (br - bl);
  return Math.round(top + ty * (bottom - top));
}

/**
 * Apply CLAHE to grayscale image
 */
export function applyCLAHE(
  grayscaleData: Uint8ClampedArray,
  width: number,
  height: number,
  params: CLAHEParams
): Uint8ClampedArray {
  const { clipLimit, tileGridSize } = params;
  
  const tileWidth = Math.ceil(width / tileGridSize);
  const tileHeight = Math.ceil(height / tileGridSize);
  
  // Calculate lookup tables for each tile
  const lookupTables: number[][] = [];
  
  for (let ty = 0; ty < tileGridSize; ty++) {
    for (let tx = 0; tx < tileGridSize; tx++) {
      const startX = tx * tileWidth;
      const startY = ty * tileHeight;
      const actualWidth = Math.min(tileWidth, width - startX);
      const actualHeight = Math.min(tileHeight, height - startY);
      const numPixels = actualWidth * actualHeight;
      
      // Calculate and clip histogram
      const histogram = calculateHistogram(
        grayscaleData,
        width,
        startX,
        startY,
        actualWidth,
        actualHeight,
        height
      );
      
      const clippedHistogram = clipHistogram(histogram, clipLimit, numPixels);
      
      // Calculate CDF and create lookup table
      const cdf = calculateCDF(clippedHistogram);
      const cdfMin = cdf.find(v => v > 0) || 0;
      
      const lut = new Array(256);
      for (let i = 0; i < 256; i++) {
        if (numPixels > 1) {
          lut[i] = Math.round(((cdf[i] - cdfMin) / (numPixels - cdfMin)) * 255);
        } else {
          lut[i] = i;
        }
        lut[i] = Math.max(0, Math.min(255, lut[i]));
      }
      
      lookupTables.push(lut);
    }
  }
  
  // Apply CLAHE with bilinear interpolation
  const result = new Uint8ClampedArray(width * height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pixelValue = grayscaleData[idx];
      
      // Find tile coordinates
      const tileX = x / tileWidth;
      const tileY = y / tileHeight;
      
      // Get tile indices (clamped)
      const tx1 = Math.min(Math.floor(tileX - 0.5), tileGridSize - 1);
      const tx2 = Math.min(tx1 + 1, tileGridSize - 1);
      const ty1 = Math.min(Math.floor(tileY - 0.5), tileGridSize - 1);
      const ty2 = Math.min(ty1 + 1, tileGridSize - 1);
      
      const tx1Clamped = Math.max(0, tx1);
      const ty1Clamped = Math.max(0, ty1);
      
      // Calculate interpolation factors
      const fx = Math.max(0, Math.min(1, tileX - tx1Clamped - 0.5));
      const fy = Math.max(0, Math.min(1, tileY - ty1Clamped - 0.5));
      
      // Get lookup table values
      const lutTL = lookupTables[ty1Clamped * tileGridSize + tx1Clamped];
      const lutTR = lookupTables[ty1Clamped * tileGridSize + tx2];
      const lutBL = lookupTables[ty2 * tileGridSize + tx1Clamped];
      const lutBR = lookupTables[ty2 * tileGridSize + tx2];
      
      // Bilinear interpolation
      result[idx] = bilinearInterpolate(
        lutTL[pixelValue],
        lutTR[pixelValue],
        lutBL[pixelValue],
        lutBR[pixelValue],
        fx,
        fy
      );
    }
  }
  
  return result;
}

/**
 * Process an image with CLAHE
 * Returns grayscale result that can be colorized with a colormap
 */
export async function processImageWithCLAHE(
  imageData: ImageData,
  params: CLAHEParams
): Promise<Uint8ClampedArray> {
  // Convert to grayscale
  const grayscale = rgbToGrayscale(imageData);
  
  // Apply CLAHE
  const result = applyCLAHE(grayscale, imageData.width, imageData.height, params);
  
  return result;
}
