import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/clahe/Header';
import { Footer } from '@/components/clahe/Footer';
import { Upload } from '@/components/clahe/Upload';
import { Controls } from '@/components/clahe/Controls';
import { Preview } from '@/components/clahe/Preview';
import { InfoPanel } from '@/components/clahe/InfoPanel';
import { loadImageFromFile, downsampleImageData, imageDataToDataUrl, downloadImage } from '@/lib/imageUtils';
import { processImageWithCLAHE, DEFAULT_CLAHE_PARAMS, type CLAHEParams } from '@/lib/clahe';
import { COLORMAPS, applyColormap, type ColormapName } from '@/lib/colormaps';

/**
 * CLAHE Studio - Main Application Page
 * 
 * A professional image processing tool for applying Contrast Limited
 * Adaptive Histogram Equalization with customizable colormaps.
 */
const Index = () => {
  // Image state
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [params, setParams] = useState<CLAHEParams>(DEFAULT_CLAHE_PARAMS);
  const [colormap, setColormap] = useState<ColormapName>('grayscale');
  const [previewQuality, setPreviewQuality] = useState(1024);

  // Store full-resolution processed data for download
  const [fullResProcessed, setFullResProcessed] = useState<{
    grayscale: Uint8ClampedArray;
    width: number;
    height: number;
  } | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setIsProcessing(true);
      setCurrentFile(file);
      setProcessedUrl(null);
      setFullResProcessed(null);

      const { imageData, originalUrl, width, height } = await loadImageFromFile(file);
      
      setOriginalImageData(imageData);
      setOriginalUrl(originalUrl);
      setImageInfo({ width, height });

      toast.success('Image loaded successfully', {
        description: `${width}×${height} pixels`,
      });
    } catch (error) {
      toast.error('Failed to load image', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      setCurrentFile(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setCurrentFile(null);
    setOriginalImageData(null);
    setOriginalUrl(null);
    setProcessedUrl(null);
    setFullResProcessed(null);
    setImageInfo(null);
  }, []);

  const handleApply = useCallback(async () => {
    if (!originalImageData) {
      toast.error('No image loaded');
      return;
    }

    try {
      setIsProcessing(true);

      // Process at preview quality for display
      const previewData = downsampleImageData(originalImageData, previewQuality);
      
      // Apply CLAHE
      const claheResult = await processImageWithCLAHE(previewData, params);
      
      // Apply colormap
      const coloredResult = applyColormap(
        claheResult,
        previewData.width,
        previewData.height,
        COLORMAPS[colormap]
      );

      // Convert to data URL for preview
      const resultUrl = imageDataToDataUrl(coloredResult);
      setProcessedUrl(resultUrl);

      // Process full resolution for download (in background)
      const fullClaheResult = await processImageWithCLAHE(originalImageData, params);
      setFullResProcessed({
        grayscale: fullClaheResult,
        width: originalImageData.width,
        height: originalImageData.height,
      });

      toast.success('CLAHE applied successfully');
    } catch (error) {
      toast.error('Processing failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [originalImageData, params, colormap, previewQuality]);

  const handleDownload = useCallback(() => {
    if (!fullResProcessed) {
      toast.error('No processed image available');
      return;
    }

    try {
      // Apply colormap to full resolution
      const coloredResult = applyColormap(
        fullResProcessed.grayscale,
        fullResProcessed.width,
        fullResProcessed.height,
        COLORMAPS[colormap]
      );

      const dataUrl = imageDataToDataUrl(coloredResult);
      const filename = currentFile
        ? `clahe_${currentFile.name.replace(/\.[^.]+$/, '')}.png`
        : 'clahe_processed.png';

      downloadImage(dataUrl, filename);
      toast.success('Image downloaded');
    } catch (error) {
      toast.error('Download failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [fullResProcessed, colormap, currentFile]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Controls Panel */}
        <aside className="w-full lg:w-80 xl:w-96 border-r border-border/50 p-4 space-y-4 overflow-y-auto">
          <Upload
            onFileSelect={handleFileSelect}
            currentFile={currentFile}
            onClear={handleClear}
            isProcessing={isProcessing}
          />

          <Controls
            params={params}
            colormap={colormap}
            previewQuality={previewQuality}
            onParamsChange={setParams}
            onColormapChange={setColormap}
            onPreviewQualityChange={setPreviewQuality}
            onApply={handleApply}
            onDownload={handleDownload}
            isProcessing={isProcessing}
            hasImage={!!originalImageData}
            hasProcessedImage={!!fullResProcessed}
          />

          <InfoPanel />
        </aside>

        {/* Preview Area */}
        <section className="flex-1 min-h-[400px] lg:min-h-0">
          <Preview
            originalUrl={originalUrl}
            processedUrl={processedUrl}
            isProcessing={isProcessing}
            imageInfo={imageInfo ?? undefined}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
