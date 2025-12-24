import { useState, useEffect, useRef } from 'react';
import { Info, Plus, Calculator, Truck, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { BLExtractedData, CRTFormData, FreightSection, TransportCompany, DEFAULT_COMPANIES, CURRENCY_OPTIONS } from '@/types/crt';
import { formatDateToCRT, generateUniqueId } from '@/utils/dateFormatter';
import { CompanySelector } from './CompanySelector';
import { FreightSectionRow } from './FreightSectionRow';
import { OptionalFieldsSection } from './OptionalFieldsSection';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CRTFormProps {
  extractedData: BLExtractedData;
  onSubmit: (data: CRTFormData) => void;
  isSubmitting: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  label: string;
}

export function CRTForm({ extractedData, onSubmit, isSubmitting }: CRTFormProps) {
  const [selectedCompany, setSelectedCompany] = useState<TransportCompany>(DEFAULT_COMPANIES[0]);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState<CRTFormData>({
    casilla_1_remitente: extractedData.casilla_1_remitente || '',
    casilla_2_numero_bl: extractedData.casilla_2_numero_bl || '',
    casilla_4_destinatario: extractedData.casilla_4_destinatario || '',
    casilla_11_descripcion: extractedData.casilla_11_descripcion || '',
    casilla_12_peso_bruto: extractedData.casilla_12_peso_bruto || 0,
    casilla_3_transportador: DEFAULT_COMPANIES[0].nombreCompleto,
    casilla_3_nombre_empresa: DEFAULT_COMPANIES[0].nombre,
    casilla_5_fecha: formatDateToCRT(),
    puerto_carga: 'IQUIQUE',
    casilla_8_aduana_entrega: '',
    casilla_10_transportadores_sucesivos: '',
    casilla_14_moneda: 'USD',
    casilla_14_monto_fob: 0.1,
    casilla_15_tramos: [{ id: generateUniqueId(), origen: 'IQUIQUE', destino: '', monto: 0 }],
    casilla_15_moneda: 'US$',
    // Optional fields
    casilla_13_volumen: undefined,
    casilla_16_declaracion_valor: undefined,
    casilla_18_instrucciones: undefined,
    casilla_19_flete_externo: undefined,
    casilla_20_reembolso: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      casilla_3_transportador: selectedCompany.nombreCompleto,
      casilla_3_nombre_empresa: selectedCompany.nombre,
    }));
  }, [selectedCompany]);

  const updateField = <K extends keyof CRTFormData>(field: K, value: CRTFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Hide validation alert when user corrects fields
    if (showValidationAlert) {
      setShowValidationAlert(false);
    }
  };

  const handleOptionalFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFreightSection = () => {
    if (formData.casilla_15_tramos.length < 4) {
      setFormData(prev => ({
        ...prev,
        casilla_15_tramos: [...prev.casilla_15_tramos, { id: generateUniqueId(), origen: '', destino: '', monto: 0 }],
      }));
    }
  };

  const updateFreightSection = (index: number, section: FreightSection) => {
    const newTramos = [...formData.casilla_15_tramos];
    newTramos[index] = section;
    updateField('casilla_15_tramos', newTramos);
    
    // Clear freight-specific errors
    const keysToRemove = [`tramo_${index}_origen`, `tramo_${index}_destino`, `tramo_${index}_monto`];
    setErrors(prev => {
      const newErrors = { ...prev };
      keysToRemove.forEach(key => delete newErrors[key]);
      return newErrors;
    });
  };

  const deleteFreightSection = (index: number) => {
    if (formData.casilla_15_tramos.length > 1) {
      const newTramos = formData.casilla_15_tramos.filter((_, i) => i !== index);
      updateField('casilla_15_tramos', newTramos);
    }
  };

  const totalFlete = formData.casilla_15_tramos.reduce((sum, t) => sum + (t.monto || 0), 0);

  // Count missing required fields
  const getMissingFieldsCount = (): number => {
    let count = 0;
    if (!formData.casilla_1_remitente.trim()) count++;
    if (!formData.casilla_2_numero_bl.trim()) count++;
    if (!formData.casilla_4_destinatario.trim()) count++;
    if (!formData.casilla_11_descripcion.trim()) count++;
    if (!formData.casilla_12_peso_bruto || formData.casilla_12_peso_bruto <= 0) count++;
    if (!formData.casilla_3_transportador.trim()) count++;
    if (!formData.casilla_5_fecha.trim()) count++;
    if (!formData.puerto_carga.trim()) count++;
    if (!formData.casilla_8_aduana_entrega.trim()) count++;
    if (!formData.casilla_10_transportadores_sucesivos.trim()) count++;
    
    formData.casilla_15_tramos.forEach((tramo) => {
      if (!tramo.origen.trim()) count++;
      if (!tramo.destino.trim()) count++;
    });
    
    return count;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const errorList: ValidationError[] = [];

    // Required field validations
    if (!formData.casilla_1_remitente.trim()) {
      newErrors.casilla_1_remitente = 'Campo obligatorio';
      errorList.push({ field: 'casilla_1_remitente', message: 'Campo obligatorio', label: 'Remitente/Shipper (campo 1)' });
    }
    if (!formData.casilla_2_numero_bl.trim()) {
      newErrors.casilla_2_numero_bl = 'Campo obligatorio';
      errorList.push({ field: 'casilla_2_numero_bl', message: 'Campo obligatorio', label: 'Número de BL (campo 2)' });
    }
    if (!formData.casilla_4_destinatario.trim()) {
      newErrors.casilla_4_destinatario = 'Campo obligatorio';
      errorList.push({ field: 'casilla_4_destinatario', message: 'Campo obligatorio', label: 'Destinatario (campo 4)' });
    }
    if (!formData.casilla_11_descripcion.trim()) {
      newErrors.casilla_11_descripcion = 'Campo obligatorio';
      errorList.push({ field: 'casilla_11_descripcion', message: 'Campo obligatorio', label: 'Descripción de Mercancías (campo 11)' });
    }
    if (!formData.casilla_12_peso_bruto || formData.casilla_12_peso_bruto <= 0) {
      newErrors.casilla_12_peso_bruto = 'Debe ser mayor a 0';
      errorList.push({ field: 'casilla_12_peso_bruto', message: 'Debe ser mayor a 0', label: 'Peso Bruto (campo 12)' });
    }
    if (!formData.casilla_3_transportador.trim()) {
      newErrors.casilla_3_transportador = 'Campo obligatorio';
      errorList.push({ field: 'casilla_3_transportador', message: 'Campo obligatorio', label: 'Nombre y Domicilio del Portador (campo 3)' });
    }
    if (!formData.casilla_5_fecha.trim()) {
      newErrors.casilla_5_fecha = 'Campo obligatorio';
      errorList.push({ field: 'casilla_5_fecha', message: 'Campo obligatorio', label: 'Fecha de Emisión (campo 5)' });
    }
    if (!formData.puerto_carga.trim()) {
      newErrors.puerto_carga = 'Campo obligatorio';
      errorList.push({ field: 'puerto_carga', message: 'Campo obligatorio', label: 'Puerto de Carga' });
    }
    if (!formData.casilla_8_aduana_entrega.trim()) {
      newErrors.casilla_8_aduana_entrega = 'Campo obligatorio';
      errorList.push({ field: 'casilla_8_aduana_entrega', message: 'Campo obligatorio', label: 'Aduana de Entrega (campo 8)' });
    }
    if (!formData.casilla_10_transportadores_sucesivos.trim()) {
      newErrors.casilla_10_transportadores_sucesivos = 'Campo obligatorio';
      errorList.push({ field: 'casilla_10_transportadores_sucesivos', message: 'Campo obligatorio', label: 'Transportadores Sucesivos (campo 10)' });
    }

    // Freight section validations - monto can be 0
    formData.casilla_15_tramos.forEach((tramo, index) => {
      if (!tramo.origen.trim()) {
        newErrors[`tramo_${index}_origen`] = 'Origen requerido';
        errorList.push({ field: `tramo_${index}_origen`, message: 'Origen requerido', label: `Tramo ${index + 1}: Origen` });
      }
      if (!tramo.destino.trim()) {
        newErrors[`tramo_${index}_destino`] = 'Destino requerido';
        errorList.push({ field: `tramo_${index}_destino`, message: 'Destino requerido', label: `Tramo ${index + 1}: Destino` });
      }
      // Note: monto can be 0, so we don't validate it as required
    });

    setErrors(newErrors);
    setValidationErrors(errorList);
    
    if (Object.keys(newErrors).length > 0) {
      setShowValidationAlert(true);
      
      // Scroll to first error
      setTimeout(() => {
        const firstErrorElement = document.querySelector('[data-error="true"]');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (firstErrorElement as HTMLElement).focus?.();
        }
      }, 100);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowValidationAlert(false);
      onSubmit(formData);
    }
  };

  const missingCount = getMissingFieldsCount();
  const isFormComplete = missingCount === 0;

  // Helper to get input class with error styling
  const getInputClass = (fieldName: string, baseClass: string = 'input-field') => {
    const hasError = errors[fieldName];
    return `${baseClass} ${hasError ? 'border-destructive ring-2 ring-destructive/20' : ''}`;
  };

  // Helper to render error message
  const renderError = (fieldName: string) => {
    if (!errors[fieldName]) return null;
    return (
      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        {errors[fieldName]}
      </p>
    );
  };

  // Helper to render field status indicator
  const renderFieldStatus = (fieldName: string, value: string | number | undefined) => {
    const hasError = errors[fieldName];
    const hasValue = typeof value === 'number' ? value > 0 : value && String(value).trim();
    
    if (hasError) {
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
    if (hasValue) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    return null;
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
      {/* Validation Alert */}
      {showValidationAlert && validationErrors.length > 0 && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Faltan {validationErrors.length} campos obligatorios</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Por favor completa los siguientes campos:</p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {validationErrors.slice(0, 5).map((err, idx) => (
                <li key={idx}>{err.label}</li>
              ))}
              {validationErrors.length > 5 && (
                <li className="text-muted-foreground">...y {validationErrors.length - 5} más</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Missing fields counter */}
      {missingCount > 0 && !showValidationAlert && (
        <div className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{missingCount} campo{missingCount !== 1 ? 's' : ''} pendiente{missingCount !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Form complete indicator */}
      {isFormComplete && (
        <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">Todos los campos obligatorios completados</span>
        </div>
      )}

      <CompanySelector
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Auto Data */}
        <div className="section-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent-foreground/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Datos del BL (Automáticos)</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                Extraído del BL - Puedes editar si es necesario
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="label-field flex items-center gap-2">
                1. Remitente / Shipper *
                {renderFieldStatus('casilla_1_remitente', formData.casilla_1_remitente)}
              </label>
              <textarea
                value={formData.casilla_1_remitente}
                onChange={(e) => updateField('casilla_1_remitente', e.target.value)}
                rows={4}
                className={getInputClass('casilla_1_remitente', 'input-field resize-none')}
                data-error={!!errors.casilla_1_remitente}
              />
              <p className="helper-text">Auto-extraído del BL</p>
              {renderError('casilla_1_remitente')}
            </div>

            <div>
              <label className="label-field flex items-center gap-2">
                2. Número de BL *
                {renderFieldStatus('casilla_2_numero_bl', formData.casilla_2_numero_bl)}
              </label>
              <input
                type="text"
                value={formData.casilla_2_numero_bl}
                onChange={(e) => updateField('casilla_2_numero_bl', e.target.value.toUpperCase())}
                className={`${getInputClass('casilla_2_numero_bl')} font-mono`}
                data-error={!!errors.casilla_2_numero_bl}
              />
              <p className="helper-text">Auto-extraído del BL</p>
              {renderError('casilla_2_numero_bl')}
            </div>

            <div>
              <label className="label-field flex items-center gap-2">
                4. Destinatario / Consignee *
                {renderFieldStatus('casilla_4_destinatario', formData.casilla_4_destinatario)}
              </label>
              <textarea
                value={formData.casilla_4_destinatario}
                onChange={(e) => updateField('casilla_4_destinatario', e.target.value)}
                rows={5}
                className={getInputClass('casilla_4_destinatario', 'input-field resize-none')}
                data-error={!!errors.casilla_4_destinatario}
              />
              <p className="helper-text">Auto-extraído del BL - Se replica en casillas 6 y 9</p>
              {renderError('casilla_4_destinatario')}
            </div>

            <div>
              <label className="label-field flex items-center gap-2">
                11. Descripción de Mercancías *
                {renderFieldStatus('casilla_11_descripcion', formData.casilla_11_descripcion)}
              </label>
              <textarea
                value={formData.casilla_11_descripcion}
                onChange={(e) => updateField('casilla_11_descripcion', e.target.value)}
                rows={6}
                className={getInputClass('casilla_11_descripcion', 'input-field resize-none')}
                data-error={!!errors.casilla_11_descripcion}
              />
              <p className="helper-text">Auto-extraído del BL</p>
              {renderError('casilla_11_descripcion')}
            </div>

            <div>
              <label className="label-field flex items-center gap-2">
                12. Peso Bruto (kg) *
                {renderFieldStatus('casilla_12_peso_bruto', formData.casilla_12_peso_bruto)}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.casilla_12_peso_bruto || ''}
                onChange={(e) => updateField('casilla_12_peso_bruto', parseFloat(e.target.value) || 0)}
                className={getInputClass('casilla_12_peso_bruto')}
                data-error={!!errors.casilla_12_peso_bruto}
              />
              <p className="helper-text">Auto-extraído del BL</p>
              {renderError('casilla_12_peso_bruto')}
            </div>
          </div>
        </div>

        {/* Right Column - Manual Data */}
        <div className="section-manual">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Datos Manuales (Completar)</h3>
              <p className="text-sm text-muted-foreground">Campos requeridos para el CRT</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="label-field flex items-center gap-2">
                3. Nombre y Domicilio del Portador *
                {renderFieldStatus('casilla_3_transportador', formData.casilla_3_transportador)}
              </label>
              <textarea
                value={formData.casilla_3_transportador}
                onChange={(e) => updateField('casilla_3_transportador', e.target.value)}
                rows={5}
                className={getInputClass('casilla_3_transportador', 'input-field resize-none')}
                data-error={!!errors.casilla_3_transportador}
              />
              <p className="helper-text">Auto-llenado según empresa - Casilla 23 solo usa el nombre</p>
              {renderError('casilla_3_transportador')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field flex items-center gap-2">
                  5. Fecha de Emisión *
                  {renderFieldStatus('casilla_5_fecha', formData.casilla_5_fecha)}
                </label>
                <input
                  type="text"
                  value={formData.casilla_5_fecha}
                  onChange={(e) => updateField('casilla_5_fecha', e.target.value.toUpperCase())}
                  placeholder="DD DE MES AAAA"
                  className={getInputClass('casilla_5_fecha')}
                  data-error={!!errors.casilla_5_fecha}
                />
                <p className="helper-text">Se replica en casillas 7 y 23</p>
                {renderError('casilla_5_fecha')}
              </div>

              <div>
                <label className="label-field flex items-center gap-2">
                  Puerto de Carga *
                  {renderFieldStatus('puerto_carga', formData.puerto_carga)}
                </label>
                <input
                  type="text"
                  value={formData.puerto_carga}
                  onChange={(e) => updateField('puerto_carga', e.target.value.toUpperCase())}
                  placeholder="Ej: IQUIQUE"
                  className={getInputClass('puerto_carga')}
                  data-error={!!errors.puerto_carga}
                />
                <p className="helper-text">Se combina con fecha en casilla 7</p>
                {renderError('puerto_carga')}
              </div>
            </div>

            <div>
              <label className="label-field flex items-center gap-2">
                8. Aduana de Entrega *
                {renderFieldStatus('casilla_8_aduana_entrega', formData.casilla_8_aduana_entrega)}
              </label>
              <input
                type="text"
                value={formData.casilla_8_aduana_entrega}
                onChange={(e) => updateField('casilla_8_aduana_entrega', e.target.value.toUpperCase())}
                placeholder="Ej: ADUANA INTERIOR LA PAZ 201"
                className={getInputClass('casilla_8_aduana_entrega')}
                data-error={!!errors.casilla_8_aduana_entrega}
              />
              {renderError('casilla_8_aduana_entrega')}
            </div>

            <div>
              <label className="label-field flex items-center gap-2">
                10. Transportadores Sucesivos *
                {renderFieldStatus('casilla_10_transportadores_sucesivos', formData.casilla_10_transportadores_sucesivos)}
              </label>
              <input
                type="text"
                value={formData.casilla_10_transportadores_sucesivos}
                onChange={(e) => updateField('casilla_10_transportadores_sucesivos', e.target.value.toUpperCase())}
                placeholder="Ej: PPTX47/JA3881"
                className={getInputClass('casilla_10_transportadores_sucesivos')}
                data-error={!!errors.casilla_10_transportadores_sucesivos}
              />
              {renderError('casilla_10_transportadores_sucesivos')}
            </div>

            <div>
              <label className="label-field flex items-center gap-2">
                14. Valor FOB
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </label>
              <div className="flex gap-3">
                <div className="w-28">
                  <Select
                    value={formData.casilla_14_moneda}
                    onValueChange={(value) => updateField('casilla_14_moneda', value)}
                  >
                    <SelectTrigger className="h-12 bg-background">
                      <SelectValue placeholder="Moneda" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      {CURRENCY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.casilla_14_monto_fob || ''}
                    onChange={(e) => updateField('casilla_14_monto_fob', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="input-field"
                  />
                </div>
              </div>
              <p className="helper-text">Moneda y monto del valor FOB (puede ser 0.1)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Fields Section */}
      <div className="card-elevated p-6">
        <OptionalFieldsSection
          volumen={formData.casilla_13_volumen}
          declaracionValor={formData.casilla_16_declaracion_valor}
          instrucciones={formData.casilla_18_instrucciones}
          fleteExterno={formData.casilla_19_flete_externo}
          reembolso={formData.casilla_20_reembolso}
          onFieldChange={handleOptionalFieldChange}
        />
      </div>

      {/* Freight Sections */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">15. Gastos de Flete *</h3>
              <p className="text-sm text-muted-foreground">Define los tramos del transporte (máximo 4)</p>
            </div>
          </div>
          
          {formData.casilla_15_tramos.length < 4 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFreightSection}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Tramo
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {formData.casilla_15_tramos.map((section, index) => (
            <FreightSectionRow
              key={section.id}
              section={section}
              canDelete={formData.casilla_15_tramos.length > 1}
              onChange={(updated) => updateFreightSection(index, updated)}
              onDelete={() => deleteFreightSection(index)}
              errors={{
                origen: errors[`tramo_${index}_origen`],
                destino: errors[`tramo_${index}_destino`],
                monto: errors[`tramo_${index}_monto`],
              }}
            />
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Total Flete:</span>
            <span className="text-xl font-bold text-primary">
              US$ {totalFlete.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="space-y-3">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className={`w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
            !isFormComplete ? 'opacity-90' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generando CRT...
            </>
          ) : (
            <>
              {!isFormComplete && <AlertCircle className="w-5 h-5 mr-2" />}
              {isFormComplete && <CheckCircle2 className="w-5 h-5 mr-2" />}
              Generar CRT
            </>
          )}
        </Button>
        
        {!isFormComplete && (
          <p className="text-center text-sm text-muted-foreground">
            Completa los campos marcados con * para generar el CRT
          </p>
        )}
      </div>
    </form>
  );
}
