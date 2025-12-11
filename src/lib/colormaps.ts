// colormaps.ts

/**
 * Colormap definitions for CLAHE visualization
 * Each colormap is an array of 256 RGB values representing the mapping from grayscale (0-255) to a specific color palette.
 */

export type ColormapName = 
  | 'grayscale' 
  | 'viridis' 
  | 'plasma' 
  | 'inferno' 
  | 'magma' 
  | 'copper' 
  | 'jet' 
  | 'hot' 
  | 'cool'
  | 'neon';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

// --- Utility Functions ---

/** Helper to interpolate linearly between two colors */
function interpolateColor(c1: RGB, c2: RGB, t: number): RGB {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
  };
}

/** Generate a colormap array from control points (key colors at specific positions) */
function generateColormap(controlPoints: { pos: number; color: RGB }[]): RGB[] {
  const colormap: RGB[] = [];
  
  for (let i = 0; i < 256; i++) {
    const pos = i / 255;
    
    // Find surrounding control points
    let lower = controlPoints[0];
    let upper = controlPoints[controlPoints.length - 1];
    
    for (let j = 0; j < controlPoints.length - 1; j++) {
      if (pos >= controlPoints[j].pos && pos <= controlPoints[j + 1].pos) {
        lower = controlPoints[j];
        upper = controlPoints[j + 1];
        break;
      }
    }
    
    // Calculate interpolation factor t
    const range = upper.pos - lower.pos;
    const t = range === 0 ? 0 : (pos - lower.pos) / range;
    colormap.push(interpolateColor(lower.color, upper.color, t));
  }
  
  return colormap;
}

// --- Colormap Definitions (Standard Palettes) ---

const grayscale: RGB[] = Array.from({ length: 256 }, (_, i) => ({ r: i, g: i, b: i }));

// Viridis (Perceptually Uniform, Colorblind-Friendly)
const viridis = generateColormap([
  { pos: 0, color: { r: 68, g: 1, b: 84 } },
  { pos: 0.25, color: { r: 59, g: 82, b: 139 } },
  { pos: 0.5, color: { r: 33, g: 145, b: 140 } },
  { pos: 0.75, color: { r: 94, g: 201, b: 98 } },
  { pos: 1, color: { r: 253, g: 231, b: 37 } },
]);

// Plasma (Perceptually Uniform)
const plasma = generateColormap([
  { pos: 0, color: { r: 13, g: 8, b: 135 } },
  { pos: 0.25, color: { r: 126, g: 3, b: 168 } },
  { pos: 0.5, color: { r: 204, g: 71, b: 120 } },
  { pos: 0.75, color: { r: 248, g: 149, b: 64 } },
  { pos: 1, color: { r: 240, g: 249, b: 33 } },
]);

// Inferno (Perceptually Uniform)
const inferno = generateColormap([
  { pos: 0, color: { r: 0, g: 0, b: 4 } },
  { pos: 0.25, color: { r: 87, g: 16, b: 110 } },
  { pos: 0.5, color: { r: 188, g: 55, b: 84 } },
  { pos: 0.75, color: { r: 249, g: 142, b: 9 } },
  { pos: 1, color: { r: 252, g: 255, b: 164 } },
]);

// Magma (Perceptually Uniform)
const magma = generateColormap([
  { pos: 0, color: { r: 0, g: 0, b: 4 } },
  { pos: 0.25, color: { r: 81, g: 18, b: 124 } },
  { pos: 0.5, color: { r: 183, g: 55, b: 121 } },
  { pos: 0.75, color: { r: 254, g: 136, b: 111 } },
  { pos: 1, color: { r: 252, g: 253, b: 191 } },
]);

// Copper
const copper = generateColormap([
  { pos: 0, color: { r: 0, g: 0, b: 0 } },
  { pos: 0.5, color: { r: 159, g: 99, b: 63 } },
  { pos: 0.8, color: { r: 255, g: 159, b: 101 } },
  { pos: 1, color: { r: 255, g: 199, b: 127 } },
]);

// Jet (Classic Rainbow - NOT perceptually uniform)
const jet = generateColormap([
  { pos: 0, color: { r: 0, g: 0, b: 127 } },
  { pos: 0.1, color: { r: 0, g: 0, b: 255 } },
  { pos: 0.35, color: { r: 0, g: 255, b: 255 } },
  { pos: 0.5, color: { r: 0, g: 255, b: 0 } },
  { pos: 0.65, color: { r: 255, g: 255, b: 0 } },
  { pos: 0.9, color: { r: 255, g: 0, b: 0 } },
  { pos: 1, color: { r: 127, g: 0, b: 0 } },
]);

// Hot
const hot = generateColormap([
  { pos: 0, color: { r: 11, g: 0, b: 0 } },
  { pos: 0.35, color: { r: 255, g: 0, b: 0 } },
  { pos: 0.65, color: { r: 255, g: 255, b: 0 } },
  { pos: 1, color: { r: 255, g: 255, b: 255 } },
]);

// Cool
const cool = generateColormap([
  { pos: 0, color: { r: 0, g: 255, b: 255 } },
  { pos: 1, color: { r: 255, g: 0, b: 255 } },
]);

// Neon colormap (stylized bright gradient)
const neon = generateColormap([
  { pos: 0, color: { r: 0, g: 0, b: 0 } },
  { pos: 0.15, color: { r: 128, g: 0, b: 255 } },
  { pos: 0.35, color: { r: 0, g: 200, b: 255 } },
  { pos: 0.55, color: { r: 0, g: 255, b: 200 } },
  { pos: 0.75, color: { r: 255, g: 0, b: 255 } },
  { pos: 1, color: { r: 255, g: 255, b: 0 } },
]);


export const COLORMAPS: Record<ColormapName, RGB[]> = {
  grayscale,
  viridis,
  plasma,
  inferno,
  magma,
  copper,
  jet,
  hot,
  cool,
  neon,
};

export const COLORMAP_OPTIONS: { value: ColormapName; label: string; description: string }[] = [
  { value: 'grayscale', label: 'Grayscale', description: 'Standard black to white' },
  { value: 'viridis', label: 'Viridis', description: 'Perceptually uniform, colorblind-friendly' },
  { value: 'plasma', label: 'Plasma', description: 'High contrast, scientific visualization' },
  { value: 'inferno', label: 'Inferno', description: 'Dark to bright, heat-like' },
  { value: 'magma', label: 'Magma', description: 'Similar to inferno, more purple' },
  { value: 'copper', label: 'Copper', description: 'Warm metallic tones' },
  { value: 'jet', label: 'Jet', description: 'Classic rainbow (not perceptually uniform)' },
  { value: 'hot', label: 'Hot', description: 'Black-red-yellow-white thermal' },
  { value: 'cool', label: 'Cool', description: 'Cyan to magenta gradient' },
  { value: 'neon', label: 'Neon', description: 'High-contrast neon gradient (stylized)' },
];
/**
 * Apply colormap to grayscale image data, converting it to an RGBA ImageData object.
 */
export function applyColormap(
  grayscaleData: Uint8ClampedArray,
  width: number,
  height: number,
  colormap: RGB[]
): ImageData {
  const outputData = new Uint8ClampedArray(width * height * 4);
  
  for (let i = 0; i < width * height; i++) {
    const grayValue = grayscaleData[i];
    const color = colormap[grayValue];
    
    outputData[i * 4] = color.r;
    outputData[i * 4 + 1] = color.g;
    outputData[i * 4 + 2] = color.b;
    outputData[i * 4 + 3] = 255; // Alpha channel is always opaque
  }
  
  return new ImageData(outputData, width, height);
}