import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

interface OptionalFieldsProps {
  volumen: number | undefined;
  declaracionValor: string | undefined;
  instrucciones: string | undefined;
  fleteExterno: number | undefined;
  reembolso: number | undefined;
  onFieldChange: (field: string, value: string | number) => void;
}

export function OptionalFieldsSection({
  volumen,
  declaracionValor,
  instrucciones,
  fleteExterno,
  reembolso,
  onFieldChange,
}: OptionalFieldsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors">
        <div className="flex items-center gap-2">
          <ChevronDown 
            className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
          <span className="font-medium text-foreground">Campos Opcionales (Avanzado)</span>
        </div>
        <span className="text-xs text-muted-foreground">
          Casillas 13, 16, 18, 19, 20
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4 space-y-4 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">13. Volumen (m³)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={volumen || ''}
              onChange={(e) => onFieldChange('casilla_13_volumen', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="input-field"
            />
            <p className="helper-text">Opcional - Volumen en metros cúbicos</p>
          </div>

          <div>
            <label className="label-field">16. Declaración del Valor</label>
            <input
              type="text"
              value={declaracionValor || ''}
              onChange={(e) => onFieldChange('casilla_16_declaracion_valor', e.target.value)}
              placeholder="Ej: USD 1,000.00"
              className="input-field"
            />
            <p className="helper-text">Opcional - Declaración de valor de mercaderías</p>
          </div>
        </div>

        <div>
          <label className="label-field">18. Instrucciones de Aduana</label>
          <textarea
            value={instrucciones || ''}
            onChange={(e) => onFieldChange('casilla_18_instrucciones', e.target.value)}
            rows={2}
            placeholder="Instrucciones sobre formalidades de aduana..."
            className="input-field resize-none"
          />
          <p className="helper-text">Opcional - Instrucciones sobre formalidades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">19. Valor Flete Externo</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={fleteExterno || ''}
              onChange={(e) => onFieldChange('casilla_19_flete_externo', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="input-field"
            />
            <p className="helper-text">Opcional - Monto del flete externo</p>
          </div>

          <div>
            <label className="label-field">20. Valor de Reembolso</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={reembolso || ''}
              onChange={(e) => onFieldChange('casilla_20_reembolso', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="input-field"
            />
            <p className="helper-text">Opcional - Monto de reembolso contra entrega</p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
