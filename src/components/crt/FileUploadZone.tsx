import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function FileUploadZone({ onFileSelect, isProcessing }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    if (file.type !== 'application/pdf') {
      setError('Solo se aceptan archivos PDF');
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no debe superar los 10MB');
      return false;
    }
    
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center
          transition-all duration-300 cursor-pointer
          ${dragActive 
            ? 'border-primary bg-accent scale-[1.02]' 
            : 'border-border hover:border-primary/50 hover:bg-accent/30'
          }
          ${isProcessing ? 'pointer-events-none opacity-60' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
          disabled={isProcessing}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{selectedFile.name}</span>
              {!isProcessing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center
              transition-all duration-300
              ${dragActive ? 'bg-primary text-primary-foreground scale-110' : 'bg-primary/10 text-primary'}
            `}>
              <Upload className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                Arrastra aquí tu BL (PDF)
              </p>
              <p className="text-muted-foreground">
                o haz click para seleccionar
              </p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Solo PDF</span>
              <span>•</span>
              <span>Máximo 10MB</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
