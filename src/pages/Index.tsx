import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { BLExtractedData, CRTFormData, CRTGenerationResponse } from '@/types/crt';
import { CRTHeader } from '@/components/crt/CRTHeader';
import { StepIndicator } from '@/components/crt/StepIndicator';
import { FileUploadZone } from '@/components/crt/FileUploadZone';
import { ProcessingIndicator } from '@/components/crt/ProcessingIndicator';
import { CRTForm } from '@/components/crt/CRTForm';
import { SuccessModal } from '@/components/crt/SuccessModal';
import { Button } from '@/components/ui/button';

const N8N_WEBHOOK_URL = 'https://n8n-n8n.qenbep.easypanel.host/webhook/extract-bl-crt';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const CRT_PROXY_URL = `${SUPABASE_URL}/functions/v1/crt-proxy`;

// Timeout for BL extraction (30 seconds)
const EXTRACTION_TIMEOUT = 30000;

export default function Index() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'uploading' | 'extracting' | 'processing'>('uploading');
  const [extractedData, setExtractedData] = useState<BLExtractedData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    filename: string;
    numeroCrt: string;
  }>({ isOpen: false, filename: '', numeroCrt: '' });

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setProcessingStage('uploading');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, EXTRACTION_TIMEOUT);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProcessingStage('extracting');

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setProcessingStage('processing');

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setExtractedData(data.data);
        setStep(2);
        toast.success('BL procesado correctamente', {
          description: 'Los datos han sido extraídos. Completa los campos manuales.',
        });
      } else {
        throw new Error(data.message || 'Error al procesar el BL');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error processing BL:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Tiempo de espera agotado', {
          description: 'La extracción tardó más de 30 segundos. Intenta con un archivo más pequeño.',
        });
      } else {
        toast.error('Error al procesar el BL', {
          description: error instanceof Error ? error.message : 'Verifica que sea un documento válido.',
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = async (formData: CRTFormData) => {
    setIsSubmitting(true);

    try {
      // Build payload with all fields including new optional ones
      const payload = {
        casilla_1_remitente: formData.casilla_1_remitente,
        casilla_2_numero_bl: formData.casilla_2_numero_bl,
        casilla_4_destinatario: formData.casilla_4_destinatario,
        casilla_11_descripcion: formData.casilla_11_descripcion,
        casilla_12_peso_bruto: formData.casilla_12_peso_bruto,
        casilla_3_transportador: formData.casilla_3_transportador,
        casilla_3_nombre_empresa: formData.casilla_3_nombre_empresa,
        casilla_5_fecha: formData.casilla_5_fecha,
        casilla_8_aduana_entrega: formData.casilla_8_aduana_entrega,
        casilla_10_transportadores_sucesivos: formData.casilla_10_transportadores_sucesivos,
        
        // FOB value with separate currency and amount
        casilla_14_moneda: formData.casilla_14_moneda || 'USD',
        casilla_14_monto_fob: formData.casilla_14_monto_fob || 0,
        
        // Freight sections (up to 4)
        casilla_15_tramos: formData.casilla_15_tramos.map(t => ({
          origen: t.origen,
          destino: t.destino,
          monto: t.monto,
        })),
        casilla_15_moneda: 'US$',
        puerto_carga: formData.puerto_carga,
        
        // Optional fields
        casilla_13_volumen: formData.casilla_13_volumen || 0,
        casilla_16_declaracion_valor: formData.casilla_16_declaracion_valor || '',
        casilla_18_instrucciones: formData.casilla_18_instrucciones || '',
        casilla_19_flete_externo: formData.casilla_19_flete_externo || 0,
        casilla_20_reembolso: formData.casilla_20_reembolso || 0,
      };

      const response = await fetch(CRT_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }

      const result: CRTGenerationResponse = await response.json();

      // Download the Excel file
      downloadExcel(result.excel_base64, result.filename);

      setSuccessModal({
        isOpen: true,
        filename: result.filename,
        numeroCrt: result.numero_crt,
      });

    } catch (error) {
      console.error('Error generating CRT:', error);
      toast.error('Error al generar el CRT', {
        description: error instanceof Error ? error.message : 'Intenta nuevamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadExcel = (base64: string, filename: string) => {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      toast.error('Error al descargar el archivo');
    }
  };

  const handleGenerateAnother = () => {
    setSuccessModal({ isOpen: false, filename: '', numeroCrt: '' });
    // Keep extracted data, just reset to step 2
    setStep(2);
  };

  const handleNewBL = () => {
    setSuccessModal({ isOpen: false, filename: '', numeroCrt: '' });
    setExtractedData(null);
    setStep(1);
  };

  const handleBack = () => {
    setStep(1);
    setExtractedData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
        <CRTHeader />
        <StepIndicator currentStep={step} />

        {step === 1 && (
          <div className="card-elevated p-6 md:p-10 animate-fade-in">
            {isProcessing ? (
              <ProcessingIndicator stage={processingStage} />
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Sube tu Bill of Lading
                  </h2>
                  <p className="text-muted-foreground">
                    El sistema extraerá automáticamente los datos del documento
                  </p>
                </div>
                <FileUploadZone
                  onFileSelect={handleFileSelect}
                  isProcessing={isProcessing}
                />
              </>
            )}
          </div>
        )}

        {step === 2 && extractedData && (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a subir BL
            </Button>

            <CRTForm
              extractedData={extractedData}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        <SuccessModal
          isOpen={successModal.isOpen}
          filename={successModal.filename}
          numeroCrt={successModal.numeroCrt}
          onGenerateAnother={handleGenerateAnother}
          onNewBL={handleNewBL}
        />
      </div>
    </div>
  );
}
