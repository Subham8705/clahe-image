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
      clipLimit: 2.8,
      tileGridSize: 16,
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
    {
    id: 'hdr',
    name: 'HDR Boost',
    description: 'Brings out details in high dynamic range scenes',
    icon: '🌄',
    params: {
      clipLimit: 3.0,
      tileGridSize: 6,
    },
    colormap: 'copper',
  },
  {
    id: 'document',
    name: 'Document Scan',
    description: 'Improves clarity of scanned text and documents',
    icon: '📄',
    params: {
      clipLimit: 2.2,
      tileGridSize: 8,
    },
    colormap: 'grayscale',
  },
  {
    id: 'forensics',
    name: 'Forensic Detail',
    description: 'Reveals hidden patterns and subtle textures',
    icon: '🕵️‍♂️',
    params: {
      clipLimit: 4.5,
      tileGridSize: 4,
    },
    colormap: 'jet',
  },
  {
    id: 'underwater',
    name: 'Underwater',
    description: 'Enhances low-contrast underwater photography',
    icon: '🐠',
    params: {
      clipLimit: 3.0,
      tileGridSize: 8,
    },
    colormap: 'cool',
  },
  {
    id: 'thermal',
    name: 'Thermal Imaging',
    description: 'Simulates thermal camera visualization',
    icon: '🔥',
    params: {
      clipLimit: 3.5,
      tileGridSize: 8,
    },
    colormap: 'inferno',
  },
  {
    id: 'ctscan',
    name: 'CT Scan',
    description: 'Enhanced grayscale contrast for radiology scans',
    icon: '🩻',
    params: {
      clipLimit: 2.8,
      tileGridSize: 8,
    },
    colormap: 'grayscale',
  },
  {
    id: 'microscopy',
    name: 'Microscopy',
    description: 'Highlights tiny structures in microscope images',
    icon: '🧫',
    params: {
      clipLimit: 3.8,
      tileGridSize: 16,
    },
    colormap: 'plasma',
  },
  {
    id: 'vintage',
    name: 'Vintage Film',
    description: 'Soft contrast with warm tones',
    icon: '🎞️',
    params: {
      clipLimit: 1.2,
      tileGridSize: 8,
    },
    colormap: 'copper',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'High contrast neon-tinted effect',
    icon: '💜',
    params: {
      clipLimit: 4.5,
      tileGridSize: 6,
    },
    colormap: 'neon',
  },
  {
    id: 'ocr',
    name: 'OCR Enhance',
    description: 'Optimized contrast for text recognition',
    icon: '🔠',
    params: {
      clipLimit: 1.8,
      tileGridSize: 8,
    },
    colormap: 'grayscale',
  },

];
