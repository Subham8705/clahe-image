import { useCallback, useState } from 'react';
import { Upload as UploadIcon, ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize, isValidImageFile } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';

interface UploadProps {
  onFileSelect: (file: File) => void;
  currentFile: File | null;
  onClear: () => void;
  isProcessing: boolean;
}

export function Upload({ onFileSelect, currentFile, onClear, isProcessing }: UploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && isValidImageFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidImageFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  if (currentFile) {
    return (
      <div className="glass-panel rounded-xl p-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate max-w-[200px]">
                {currentFile.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {formatFileSize(currentFile.size)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            disabled={isProcessing}
            className="shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'upload-zone cursor-pointer transition-all duration-300',
        isDragOver && 'active'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        aria-label="Upload image file"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300',
          isDragOver 
            ? 'bg-primary/20 scale-110' 
            : 'bg-secondary'
        )}>
          <UploadIcon className={cn(
            'w-7 h-7 transition-colors duration-300',
            isDragOver ? 'text-primary' : 'text-muted-foreground'
          )} />
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium mb-1">
            {isDragOver ? 'Drop to upload' : 'Drag & drop an image'}
          </p>
          <p className="text-xs text-muted-foreground">
            or click to browse • PNG, JPG, GIF, WebP
          </p>
        </div>
      </div>
    </div>
  );
}
