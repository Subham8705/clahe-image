import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="glass-panel border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              CLAHE <span className="gradient-text">Studio</span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Contrast Limited Adaptive Histogram Equalization
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-mono bg-secondary/50 px-3 py-1 rounded-full">
            v1.0.0
          </span>
        </div>
      </div>
    </header>
  );
}
