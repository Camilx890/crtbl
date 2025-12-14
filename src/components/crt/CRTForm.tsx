import { useState, useEffect } from 'react';
import { Info, Plus, Calculator, Truck, FileText } from 'lucide-react';
import { BLExtractedData, CRTFormData, FreightSection, TransportCompany, DEFAULT_COMPANIES } from '@/types/crt';
import { formatDateToCRT, generateUniqueId } from '@/utils/dateFormatter';
import { CompanySelector } from './CompanySelector';
import { FreightSectionRow } from './FreightSectionRow';
import { Button } from '@/components/ui/button';

interface CRTFormProps {
  extractedData: BLExtractedData;
  onSubmit: (data: CRTFormData) => void;
  isSubmitting: boolean;
}

export function CRTForm({ extractedData, onSubmit, isSubmitting }: CRTFormProps) {
  const [selectedCompany, setSelectedCompany] = useState<TransportCompany>(DEFAULT_COMPANIES[0]);
  
  const [formData, setFormData] = useState<CRTFormData>({
    casilla_1_remitente: extractedData.casilla_1_remitente || '',
    casilla_2_numero_bl: extractedData.casilla_2_numero_bl || '',
    casilla_4_destinatario: extractedData.casilla_4_destinatario || '',
    casilla_11_descripcion: extractedData.casilla_11_descripcion || '',
    casilla_12_peso_bruto: extractedData.casilla_12_peso_bruto || 0,
    casilla_3_transportador: `${DEFAULT_COMPANIES[0].name}\n${DEFAULT_COMPANIES[0].address}`,
    casilla_5_fecha: formatDateToCRT(),
    puerto_carga: 'IQUIQUE',
    casilla_8_aduana_entrega: '',
    casilla_10_transportadores_sucesivos: '',
    casilla_14_valor_fob: '0,1',
    casilla_15_tramos: [{ id: generateUniqueId(), origen: 'IQUIQUE', destino: '', monto: 0 }],
    casilla_15_moneda: 'US$',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      casilla_3_transportador: `${selectedCompany.name}\n${selectedCompany.address}`,
    }));
  }, [selectedCompany]);

  const updateField = <K extends keyof CRTFormData>(field: K, value: CRTFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addFreightSection = () => {
    if (formData.casilla_15_tramos.length < 3) {
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
  };

  const deleteFreightSection = (index: number) => {
    if (formData.casilla_15_tramos.length > 1) {
      const newTramos = formData.casilla_15_tramos.filter((_, i) => i !== index);
      updateField('casilla_15_tramos', newTramos);
    }
  };

  const totalFlete = formData.casilla_15_tramos.reduce((sum, t) => sum + (t.monto || 0), 0);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.casilla_1_remitente.trim()) newErrors.casilla_1_remitente = 'Campo requerido';
    if (!formData.casilla_2_numero_bl.trim()) newErrors.casilla_2_numero_bl = 'Campo requerido';
    if (!formData.casilla_4_destinatario.trim()) newErrors.casilla_4_destinatario = 'Campo requerido';
    if (!formData.casilla_11_descripcion.trim()) newErrors.casilla_11_descripcion = 'Campo requerido';
    if (!formData.casilla_12_peso_bruto || formData.casilla_12_peso_bruto <= 0) newErrors.casilla_12_peso_bruto = 'Debe ser mayor a 0';
    if (!formData.casilla_3_transportador.trim()) newErrors.casilla_3_transportador = 'Campo requerido';
    if (!formData.casilla_5_fecha.trim()) newErrors.casilla_5_fecha = 'Campo requerido';
    if (!formData.puerto_carga.trim()) newErrors.puerto_carga = 'Campo requerido';
    if (!formData.casilla_8_aduana_entrega.trim()) newErrors.casilla_8_aduana_entrega = 'Campo requerido';
    if (!formData.casilla_10_transportadores_sucesivos.trim()) newErrors.casilla_10_transportadores_sucesivos = 'Campo requerido';

    formData.casilla_15_tramos.forEach((tramo, index) => {
      if (!tramo.origen.trim()) newErrors[`tramo_${index}_origen`] = 'Origen requerido';
      if (!tramo.destino.trim()) newErrors[`tramo_${index}_destino`] = 'Destino requerido';
      if (!tramo.monto || tramo.monto <= 0) newErrors[`tramo_${index}_monto`] = 'Monto debe ser mayor a 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
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
              <label className="label-field">1. Remitente / Shipper *</label>
              <textarea
                value={formData.casilla_1_remitente}
                onChange={(e) => updateField('casilla_1_remitente', e.target.value)}
                rows={2}
                className={`input-field resize-none ${errors.casilla_1_remitente ? 'border-destructive' : ''}`}
              />
              <p className="helper-text">Auto-extraído del BL</p>
              {errors.casilla_1_remitente && <p className="text-xs text-destructive mt-1">{errors.casilla_1_remitente}</p>}
            </div>

            <div>
              <label className="label-field">2. Número de BL *</label>
              <input
                type="text"
                value={formData.casilla_2_numero_bl}
                onChange={(e) => updateField('casilla_2_numero_bl', e.target.value.toUpperCase())}
                className={`input-field font-mono ${errors.casilla_2_numero_bl ? 'border-destructive' : ''}`}
              />
              <p className="helper-text">Auto-extraído del BL</p>
              {errors.casilla_2_numero_bl && <p className="text-xs text-destructive mt-1">{errors.casilla_2_numero_bl}</p>}
            </div>

            <div>
              <label className="label-field">4. Destinatario / Consignee *</label>
              <textarea
                value={formData.casilla_4_destinatario}
                onChange={(e) => updateField('casilla_4_destinatario', e.target.value)}
                rows={2}
                className={`input-field resize-none ${errors.casilla_4_destinatario ? 'border-destructive' : ''}`}
              />
              <p className="helper-text">Auto-extraído del BL - Se replica en casillas 6 y 9</p>
              {errors.casilla_4_destinatario && <p className="text-xs text-destructive mt-1">{errors.casilla_4_destinatario}</p>}
            </div>

            <div>
              <label className="label-field">11. Descripción de Mercancías *</label>
              <textarea
                value={formData.casilla_11_descripcion}
                onChange={(e) => updateField('casilla_11_descripcion', e.target.value)}
                rows={3}
                className={`input-field resize-none ${errors.casilla_11_descripcion ? 'border-destructive' : ''}`}
              />
              <p className="helper-text">Auto-extraído del BL</p>
              {errors.casilla_11_descripcion && <p className="text-xs text-destructive mt-1">{errors.casilla_11_descripcion}</p>}
            </div>

            <div>
              <label className="label-field">12. Peso Bruto (kg) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.casilla_12_peso_bruto || ''}
                onChange={(e) => updateField('casilla_12_peso_bruto', parseFloat(e.target.value) || 0)}
                className={`input-field ${errors.casilla_12_peso_bruto ? 'border-destructive' : ''}`}
              />
              <p className="helper-text">Auto-extraído del BL</p>
              {errors.casilla_12_peso_bruto && <p className="text-xs text-destructive mt-1">{errors.casilla_12_peso_bruto}</p>}
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
              <label className="label-field">3. Nombre y Domicilio del Portador *</label>
              <textarea
                value={formData.casilla_3_transportador}
                onChange={(e) => updateField('casilla_3_transportador', e.target.value)}
                rows={2}
                className={`input-field resize-none ${errors.casilla_3_transportador ? 'border-destructive' : ''}`}
              />
              <p className="helper-text">Auto-llenado según empresa - Se replica en casilla 23</p>
              {errors.casilla_3_transportador && <p className="text-xs text-destructive mt-1">{errors.casilla_3_transportador}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">5. Fecha de Emisión *</label>
                <input
                  type="text"
                  value={formData.casilla_5_fecha}
                  onChange={(e) => updateField('casilla_5_fecha', e.target.value.toUpperCase())}
                  placeholder="DD DE MES AAAA"
                  className={`input-field ${errors.casilla_5_fecha ? 'border-destructive' : ''}`}
                />
                <p className="helper-text">Se replica en casillas 7 y 23</p>
                {errors.casilla_5_fecha && <p className="text-xs text-destructive mt-1">{errors.casilla_5_fecha}</p>}
              </div>

              <div>
                <label className="label-field">Puerto de Carga *</label>
                <input
                  type="text"
                  value={formData.puerto_carga}
                  onChange={(e) => updateField('puerto_carga', e.target.value.toUpperCase())}
                  placeholder="Ej: IQUIQUE"
                  className={`input-field ${errors.puerto_carga ? 'border-destructive' : ''}`}
                />
                <p className="helper-text">Se combina con fecha en casilla 7</p>
                {errors.puerto_carga && <p className="text-xs text-destructive mt-1">{errors.puerto_carga}</p>}
              </div>
            </div>

            <div>
              <label className="label-field">8. Aduana de Entrega *</label>
              <input
                type="text"
                value={formData.casilla_8_aduana_entrega}
                onChange={(e) => updateField('casilla_8_aduana_entrega', e.target.value.toUpperCase())}
                placeholder="Ej: ADUANA INTERIOR LA PAZ 201"
                className={`input-field ${errors.casilla_8_aduana_entrega ? 'border-destructive' : ''}`}
              />
              {errors.casilla_8_aduana_entrega && <p className="text-xs text-destructive mt-1">{errors.casilla_8_aduana_entrega}</p>}
            </div>

            <div>
              <label className="label-field">10. Transportadores Sucesivos *</label>
              <input
                type="text"
                value={formData.casilla_10_transportadores_sucesivos}
                onChange={(e) => updateField('casilla_10_transportadores_sucesivos', e.target.value.toUpperCase())}
                placeholder="Ej: PPTX47/JA3881"
                className={`input-field ${errors.casilla_10_transportadores_sucesivos ? 'border-destructive' : ''}`}
              />
              {errors.casilla_10_transportadores_sucesivos && <p className="text-xs text-destructive mt-1">{errors.casilla_10_transportadores_sucesivos}</p>}
            </div>

            <div>
              <label className="label-field">14. Valor FOB</label>
              <input
                type="text"
                value={formData.casilla_14_valor_fob}
                onChange={(e) => updateField('casilla_14_valor_fob', e.target.value)}
                placeholder="Ej: 0,1"
                className="input-field"
              />
              <p className="helper-text">Formato: 0,1 (con coma)</p>
            </div>
          </div>
        </div>
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
              <p className="text-sm text-muted-foreground">Define los tramos del transporte</p>
            </div>
          </div>
          
          {formData.casilla_15_tramos.length < 3 && (
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
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
            Generando CRT...
          </>
        ) : (
          'Generar CRT'
        )}
      </Button>
    </form>
  );
}
