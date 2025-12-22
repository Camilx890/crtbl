import { Building2, Star } from 'lucide-react';
import { TransportCompany, DEFAULT_COMPANIES, TransportCompanyWithPriority } from '@/types/crt';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select';

interface CompanySelectorProps {
  selectedCompany: TransportCompany | null;
  onCompanyChange: (company: TransportCompany) => void;
}

export function CompanySelector({ selectedCompany, onCompanyChange }: CompanySelectorProps) {
  const priorityCompanies = DEFAULT_COMPANIES.filter(c => c.priority);
  const otherCompanies = DEFAULT_COMPANIES.filter(c => !c.priority);

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
        <SelectContent className="bg-popover border border-border z-50 max-h-80">
          {/* Empresas prioritarias */}
          {priorityCompanies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                <span className="font-medium truncate">{company.nombre}</span>
              </div>
            </SelectItem>
          ))}
          
          {/* Separador visual */}
          <SelectSeparator className="my-2" />
          
          {/* Resto de empresas */}
          {otherCompanies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              <div className="flex flex-col items-start">
                <span className="font-medium truncate">{company.nombre}</span>
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
