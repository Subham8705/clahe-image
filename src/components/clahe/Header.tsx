
export function Header() {
  return (
    <header className="glass-panel border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center overflow-hidden">
              {/* Replace icon with provided image. Place the image at public/subham.png */}
              <img src="https://res.cloudinary.com/dpa0sb1tm/image/upload/v1750759481/logobg_hu36yx.webp" alt="Subham" className="w-10 h-10 object-cover rounded-xl" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              CLAHE <span className="gradient-text">Studio</span>
            </h1>
            <div className="flex items-baseline gap-2">
              <p className="text-xs text-muted-foreground font-mono">Contrast Limited Adaptive Histogram Equalization</p>
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted-foreground">by <span className="font-medium">subham</span></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
