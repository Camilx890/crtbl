import { FileText } from 'lucide-react';

export function CRTHeader() {
  return (
    <header className="text-center mb-8 md:mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
        <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground font-bold text-xl">CRT</span>
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
        Generador de CRT
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-md mx-auto">
        Conocimiento de Transporte Rodoviario
      </p>
    </header>
  );
}
