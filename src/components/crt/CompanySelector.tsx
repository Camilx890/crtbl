import { Building2 } from 'lucide-react';
import { TransportCompany, DEFAULT_COMPANIES } from '@/types/crt';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CompanySelectorProps {
  selectedCompany: TransportCompany | null;
  onCompanyChange: (company: TransportCompany) => void;
}

export function CompanySelector({ selectedCompany, onCompanyChange }: CompanySelectorProps) {
  return (
    <div className="card-elevated p-6 mb-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Empresa Transportadora</h3>
          <p className="text-sm text-muted-foreground">Selecciona la empresa para el CRT</p>
        </div>
      </div>

      <Select
        value={selectedCompany?.id || ''}
        onValueChange={(value) => {
          const company = DEFAULT_COMPANIES.find(c => c.id === value);
          if (company) onCompanyChange(company);
        }}
      >
        <SelectTrigger className="w-full h-12 bg-background">
          <SelectValue placeholder="Selecciona una empresa" />
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border z-50">
          {DEFAULT_COMPANIES.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              <div className="flex flex-col items-start">
                <span className="font-medium">{company.nombre}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCompany && (
        <div className="mt-4 p-3 bg-accent/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Dirección:</p>
          <p className="text-sm font-medium text-foreground">{selectedCompany.direccion}</p>
        </div>
      )}
    </div>
  );
}
