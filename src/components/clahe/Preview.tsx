import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompareSlider } from './CompareSlider';
import { cn } from '@/lib/utils';

interface PreviewProps {
  originalUrl: string | null;
  processedUrl: string | null;
  isProcessing: boolean;
  imageInfo?: {
    width: number;
    height: number;
  };
}

type ViewMode = 'compare' | 'original' | 'processed';

export function Preview({ originalUrl, processedUrl, isProcessing, imageInfo }: PreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('compare');
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleFit = () => setZoom(100);

  if (!originalUrl) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
        <div className="w-24 h-24 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
          <Layers className="w-10 h-10" />
        </div>
        <p className="text-center text-sm">
          Upload an image to see the preview
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      'h-full flex flex-col',
      isFullscreen && 'fixed inset-0 z-50 bg-background'
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border/50">
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'compare' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('compare')}
            disabled={!processedUrl}
          >
            Compare
          </Button>
          <Button
            variant={viewMode === 'original' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('original')}
          >
            Original
          </Button>
          <Button
            variant={viewMode === 'processed' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('processed')}
            disabled={!processedUrl}
          >
            Processed
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {imageInfo && (
            <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
              {imageInfo.width}×{imageInfo.height}
            </span>
          )}
          <div className="flex items-center gap-1 border-l border-border/50 pl-2 ml-2">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <button
              onClick={handleFit}
              className="text-xs font-mono text-muted-foreground hover:text-foreground px-2 min-w-[50px]"
            >
              {zoom}%
            </button>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto preview-container relative">
        {isProcessing && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <span className="text-sm font-medium">Processing CLAHE...</span>
            </div>
          </div>
        )}

        <div
          className="min-h-full flex items-center justify-center p-4"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
        >
          {viewMode === 'compare' && processedUrl ? (
            <CompareSlider
              originalUrl={originalUrl}
              processedUrl={processedUrl}
              className="max-w-full max-h-full"
            />
          ) : viewMode === 'processed' && processedUrl ? (
            <img
              src={processedUrl}
              alt="Processed"
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          ) : (
            <img
              src={originalUrl}
              alt="Original"
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}
