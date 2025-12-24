import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FreightSection } from '@/types/crt';

interface FreightSectionRowProps {
  section: FreightSection;
  canDelete: boolean;
  onChange: (section: FreightSection) => void;
  onDelete: () => void;
  errors?: {
    origen?: string;
    destino?: string;
    monto?: string;
  };
}

export function FreightSectionRow({ section, canDelete, onChange, onDelete, errors = {} }: FreightSectionRowProps) {
  const getInputClass = (hasError: boolean) => {
    return `input-field ${hasError ? 'border-destructive ring-2 ring-destructive/20' : ''}`;
  };

  const renderFieldStatus = (hasError: boolean, hasValue: boolean) => {
    if (hasError) {
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
    if (hasValue) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex-1">
        <label className="label-field flex items-center gap-2">
          Origen *
          {renderFieldStatus(!!errors.origen, !!section.origen.trim())}
        </label>
        <input
          type="text"
          value={section.origen}
          onChange={(e) => onChange({ ...section, origen: e.target.value.toUpperCase() })}
          placeholder="Ej: IQUIQUE"
          className={getInputClass(!!errors.origen)}
          data-error={!!errors.origen}
        />
        {errors.origen && (
          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errors.origen}
          </p>
        )}
      </div>
      
      <div className="flex-1">
        <label className="label-field flex items-center gap-2">
          Destino *
          {renderFieldStatus(!!errors.destino, !!section.destino.trim())}
        </label>
        <input
          type="text"
          value={section.destino}
          onChange={(e) => onChange({ ...section, destino: e.target.value.toUpperCase() })}
          placeholder="Ej: PISIGA"
          className={getInputClass(!!errors.destino)}
          data-error={!!errors.destino}
        />
        {errors.destino && (
          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errors.destino}
          </p>
        )}
      </div>
      
      <div className="w-full sm:w-32">
        <label className="label-field flex items-center gap-2">
          Monto (US$) *
          {renderFieldStatus(!!errors.monto, section.monto > 0)}
        </label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={section.monto || ''}
          onChange={(e) => onChange({ ...section, monto: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          className={getInputClass(!!errors.monto)}
          data-error={!!errors.monto}
        />
        {errors.monto && (
          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errors.monto}
          </p>
        )}
      </div>

      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="self-end p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          title="Eliminar tramo"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
