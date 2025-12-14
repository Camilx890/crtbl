import { CheckCircle, FileSpreadsheet, RefreshCw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SuccessModalProps {
  isOpen: boolean;
  filename: string;
  numeroCrt: string;
  onGenerateAnother: () => void;
  onNewBL: () => void;
}

export function SuccessModal({ isOpen, filename, numeroCrt, onGenerateAnother, onNewBL }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onGenerateAnother(); }}>
      <DialogContent className="sm:max-w-md bg-card border-border" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <DialogTitle className="text-xl font-semibold text-foreground">
            ¡CRT generado exitosamente!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Tu documento ha sido creado y descargado
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 my-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{filename}</p>
              <p className="text-sm text-muted-foreground">CRT #{numeroCrt}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onGenerateAnother}
            variant="outline"
            className="w-full h-12 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generar otro CRT con el mismo BL
          </Button>
          
          <Button
            onClick={onNewBL}
            className="w-full h-12 gap-2"
          >
            <Upload className="w-4 h-4" />
            Nuevo BL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
