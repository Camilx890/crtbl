import { X } from 'lucide-react';
import { FreightSection } from '@/types/crt';

interface FreightSectionRowProps {
  section: FreightSection;
  canDelete: boolean;
  onChange: (section: FreightSection) => void;
  onDelete: () => void;
}

export function FreightSectionRow({ section, canDelete, onChange, onDelete }: FreightSectionRowProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex-1">
        <label className="label-field">Origen</label>
        <input
          type="text"
          value={section.origen}
          onChange={(e) => onChange({ ...section, origen: e.target.value.toUpperCase() })}
          placeholder="Ej: IQUIQUE"
          className="input-field"
        />
      </div>
      
      <div className="flex-1">
        <label className="label-field">Destino</label>
        <input
          type="text"
          value={section.destino}
          onChange={(e) => onChange({ ...section, destino: e.target.value.toUpperCase() })}
          placeholder="Ej: PISIGA"
          className="input-field"
        />
      </div>
      
      <div className="w-full sm:w-32">
        <label className="label-field">Monto (US$)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={section.monto || ''}
          onChange={(e) => onChange({ ...section, monto: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          className="input-field"
        />
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
