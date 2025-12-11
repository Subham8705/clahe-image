/**
 * CLAHE Presets for common use cases
 * 
 * Each preset provides optimized settings for specific types of images:
 * - clipLimit: Controls contrast enhancement intensity
 * - tileGridSize: Controls the locality of the enhancement
 * - colormap: Suggested visualization colormap
 */

import type { ColormapName } from './colormaps';
import type { CLAHEParams } from './clahe';

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  params: CLAHEParams;
  colormap: ColormapName;
}

export const PRESETS: Preset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Balanced settings for general use',
    icon: '⚙️',
    params: {
      clipLimit: 2.0,
      tileGridSize: 8,
    },
    colormap: 'grayscale',
  },
  {
    id: 'portrait',
    name: 'Portrait',
    description: 'Gentle enhancement for faces, preserves skin tones',
    icon: '👤',
    params: {
      clipLimit: 1.5,
      tileGridSize: 8,
    },
    colormap: 'grayscale',
  },
  {
    id: 'landscape',
    name: 'Landscape',
    description: 'Enhanced detail for outdoor scenes',
    icon: '🏞️',
    params: {
      clipLimit: 2.5,
      tileGridSize: 8,
    },
    colormap: 'viridis',
  },
  {
    id: 'night',
    name: 'Night / Low Light',
    description: 'Maximum enhancement for dark images',
    icon: '🌙',
    params: {
      clipLimit: 4.0,
      tileGridSize: 4,
    },
    colormap: 'inferno',
  },
  {
    id: 'medical',
    name: 'Medical / X-Ray',
    description: 'Optimized for medical imaging',
    icon: '🏥',
    params: {
      clipLimit: 3.0,
      tileGridSize: 8,
    },
    colormap: 'hot',
  },
  {
    id: 'scientific',
    name: 'Scientific',
    description: 'High contrast for data visualization',
    icon: '🔬',
    params: {
      clipLimit: 3.5,
      tileGridSize: 16,
    },
    colormap: 'plasma',
  },
  {
    id: 'subtle',
    name: 'Subtle',
    description: 'Minimal enhancement, natural look',
    icon: '✨',
    params: {
      clipLimit: 1.0,
      tileGridSize: 8,
    },
    colormap: 'grayscale',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast, artistic effect',
    icon: '🎭',
    params: {
      clipLimit: 5.0,
      tileGridSize: 4,
    },
    colormap: 'magma',
  },
];
