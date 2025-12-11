import { useState } from 'react';
import { Settings2, Sliders, Palette, Zap, Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { COLORMAP_OPTIONS, type ColormapName } from '@/lib/colormaps';
import { PRESETS, type Preset } from '@/lib/presets';
import type { CLAHEParams } from '@/lib/clahe';
import { cn } from '@/lib/utils';

interface ControlsProps {
  params: CLAHEParams;
  colormap: ColormapName;
  previewQuality: number;
  onParamsChange: (params: CLAHEParams) => void;
  onColormapChange: (colormap: ColormapName) => void;
  onPreviewQualityChange: (quality: number) => void;
  onApply: () => void;
  onDownload: () => void;
  isProcessing: boolean;
  hasImage: boolean;
  hasProcessedImage: boolean;
}

export function Controls({
  params,
  colormap,
  previewQuality,
  onParamsChange,
  onColormapChange,
  onPreviewQualityChange,
  onApply,
  onDownload,
  isProcessing,
  hasImage,
  hasProcessedImage,
}: ControlsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('default');
  const [isPresetsOpen, setIsPresetsOpen] = useState(true);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset.id);
    onParamsChange(preset.params);
    onColormapChange(preset.colormap);
  };

  return (
    <div className="space-y-4">
      {/* Presets Section */}
      <Collapsible open={isPresetsOpen} onOpenChange={setIsPresetsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 glass-panel rounded-xl hover:bg-secondary/30 transition-colors">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Presets</span>
          </div>
          <ChevronDown className={cn(
            'w-4 h-4 text-muted-foreground transition-transform duration-200',
            isPresetsOpen && 'rotate-180'
          )} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          {/* Show 8 presets per visible frame: 2 columns × 4 rows. Scroll vertically to access the rest. */}
          <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={cn(
                  'p-3 rounded-lg text-left transition-all duration-200',
                  'border border-border hover:border-primary/50',
                  selectedPreset === preset.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-secondary/30 hover:bg-secondary/50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{preset.icon}</span>
                  <span className="text-xs font-medium">{preset.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Advanced Settings */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 glass-panel rounded-xl hover:bg-secondary/30 transition-colors">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Parameters</span>
          </div>
          <ChevronDown className={cn(
            'w-4 h-4 text-muted-foreground transition-transform duration-200',
            isAdvancedOpen && 'rotate-180'
          )} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-4 p-4 glass-panel rounded-xl">
          {/* Clip Limit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="control-label">Clip Limit</Label>
              <span className="text-xs font-mono text-primary">
                {params.clipLimit.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[params.clipLimit]}
              onValueChange={([value]) => onParamsChange({ ...params, clipLimit: value })}
              min={1}
              max={10}
              step={0.1}
              className="w-full"
            />
            <p className="text-[10px] text-muted-foreground">
              Higher values = more contrast, may amplify noise
            </p>
          </div>

          {/* Tile Grid Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="control-label">Tile Grid Size</Label>
              <span className="text-xs font-mono text-primary">
                {params.tileGridSize}×{params.tileGridSize}
              </span>
            </div>
            <Slider
              value={[params.tileGridSize]}
              onValueChange={([value]) => onParamsChange({ ...params, tileGridSize: value })}
              min={2}
              max={16}
              step={1}
              className="w-full"
            />
            <p className="text-[10px] text-muted-foreground">
              Smaller = more local enhancement, larger = more global
            </p>
          </div>

          {/* Preview Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="control-label">Preview Quality</Label>
              <span className="text-xs font-mono text-primary">
                {previewQuality}px
              </span>
            </div>
            <Slider
              value={[previewQuality]}
              onValueChange={([value]) => onPreviewQualityChange(value)}
              min={256}
              max={2048}
              step={128}
              className="w-full"
            />
            <p className="text-[10px] text-muted-foreground">
              Lower = faster preview, higher = better quality
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Colormap Selection */}
      <div className="p-4 glass-panel rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <Label className="control-label mb-0">Colormap</Label>
        </div>
        <Select value={colormap} onValueChange={(v) => onColormapChange(v as ColormapName)}>
          <SelectTrigger className="w-full bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLORMAP_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={onApply}
          disabled={!hasImage || isProcessing}
          variant="glow"
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Settings2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Apply CLAHE
            </>
          )}
        </Button>

        <Button
          onClick={onDownload}
          disabled={!hasProcessedImage || isProcessing}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </Button>
      </div>
    </div>
  );
}
