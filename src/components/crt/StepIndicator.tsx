import { Upload, FileEdit, Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Subir BL', icon: Upload },
    { number: 2, label: 'Completar CRT', icon: FileEdit },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        const Icon = isCompleted ? Check : step.icon;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isCompleted 
                    ? 'bg-success text-success-foreground' 
                    : isActive 
                      ? 'bg-primary text-primary-foreground shadow-glow' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`
                  font-medium transition-colors hidden sm:block
                  ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                `}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-12 md:w-24 h-0.5 mx-3
                  ${isCompleted ? 'bg-success' : 'bg-border'}
                `} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
