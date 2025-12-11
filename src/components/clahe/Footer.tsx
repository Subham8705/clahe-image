import { Github, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-screen-2xl mx-auto">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Built with OpenCV.js CLAHE implementation
        </p>
          <p className="text-xs text-muted-foreground text-center sm:text-left">Made by <span className="font-medium">Subham</span></p>
        
        <div className="flex items-center gap-4">
          <a
            href="https://en.wikipedia.org/wiki/Adaptive_histogram_equalization"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Learn more
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
