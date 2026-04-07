import { useState, useEffect } from 'react';
import { Loader2, Brain, FileSearch } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProcessingIndicatorProps {
  stage: 'uploading' | 'extracting' | 'processing';
}

export function ProcessingIndicator({ stage }: ProcessingIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const stages = {
    uploading: {
      icon: Loader2,
      text: 'Subiendo archivo...',
      targetProgress: 25,
    },
    extracting: {
      icon: Brain,
      text: 'Extrayendo datos del BL con IA...',
      targetProgress: 75,
    },
    processing: {
      icon: FileSearch,
      text: 'Procesando información...',
      targetProgress: 95,
    },
  };

  useEffect(() => {
    // Reset progress when stage changes
    const target = stages[stage].targetProgress;
    const increment = (target - progress) / 20;
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= target) {
          clearInterval(progressInterval);
          return target;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [stage]);

  useEffect(() => {
    // Track elapsed time
    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const current = stages[stage];
  const Icon = current.icon;

  return (
    <div className="w-full max-w-md mx-auto py-12 animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-12 h-12 text-primary animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">{current.text}</p>
          <p className="text-sm text-muted-foreground">
            Por favor espera mientras procesamos tu documento
          </p>
          {elapsed >= 5 && (
            <p className="text-xs text-muted-foreground">
              Tiempo: {elapsed}s (máximo 60s)
            </p>
          )}
        </div>

        <div className="w-full space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
        </div>

        {elapsed >= 15 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 animate-pulse">
            La extracción está tomando más tiempo de lo usual...
          </p>
        )}
      </div>
    </div>
  );
}
