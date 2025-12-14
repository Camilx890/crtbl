import { Loader2, Brain, FileSearch } from 'lucide-react';

interface ProcessingIndicatorProps {
  stage: 'uploading' | 'extracting' | 'processing';
}

export function ProcessingIndicator({ stage }: ProcessingIndicatorProps) {
  const stages = {
    uploading: {
      icon: Loader2,
      text: 'Subiendo archivo...',
      progress: 30,
    },
    extracting: {
      icon: Brain,
      text: 'Extrayendo datos del BL con IA...',
      progress: 60,
    },
    processing: {
      icon: FileSearch,
      text: 'Procesando información...',
      progress: 90,
    },
  };

  const current = stages[stage];
  const Icon = current.icon;

  return (
    <div className="w-full max-w-md mx-auto py-12 animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-12 h-12 text-primary animate-spin-slow" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin-slow" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">{current.text}</p>
          <p className="text-sm text-muted-foreground">
            Por favor espera mientras procesamos tu documento
          </p>
        </div>

        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${current.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
