import { Info, BookOpen } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function InfoPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 glass-panel rounded-xl hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">About CLAHE</span>
        </div>
        <Info className={cn(
          'w-4 h-4 text-muted-foreground transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 p-4 glass-panel rounded-xl space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2">
            What is CLAHE?
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            CLAHE (Contrast Limited Adaptive Histogram Equalization) is an advanced
            image enhancement technique that improves local contrast while limiting
            noise amplification.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2">
            Parameter Effects
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-mono">clipLimit</span>
              <span>Controls contrast enhancement intensity. Higher values increase contrast but may amplify noise.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-mono">tileGridSize</span>
              <span>Determines the size of tiles for local processing. Smaller tiles provide more localized enhancement.</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2">
            Why Use Colormaps?
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Colormaps help visualize intensity variations that may not be visible
            in grayscale. Scientific colormaps like Viridis are perceptually uniform
            and colorblind-friendly.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
