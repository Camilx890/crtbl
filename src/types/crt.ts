export interface BLExtractedData {
  casilla_1_remitente: string; // Nombre + dirección combinados con \n
  casilla_2_numero_bl: string;
  casilla_4_destinatario: string; // Nombre + dirección combinados con \n
  casilla_11_descripcion: string;
  casilla_12_peso_bruto: number;
  _metadata?: {
    shipper_name?: string;
    shipper_address?: string;
    consignee_name?: string;
    consignee_address?: string;
    container_number?: string;
    container_type?: string;
    seal_number?: string;
  };
}

export interface FreightSection {
  id: string;
  origen: string;
  destino: string;
  monto: number;
}

export interface CRTFormData {
  // Auto-filled from BL (editable)
  casilla_1_remitente: string;
  casilla_2_numero_bl: string;
  casilla_4_destinatario: string;
  casilla_11_descripcion: string;
  casilla_12_peso_bruto: number;
  
  // Manual fields
  casilla_3_transportador: string;
  casilla_3_nombre_empresa: string; // Solo nombre para casilla 23
  casilla_5_fecha: string;
  puerto_carga: string;
  casilla_8_aduana_entrega: string;
  casilla_10_transportadores_sucesivos: string;
  
  // FOB value (split into currency and amount)
  casilla_14_moneda: string;
  casilla_14_monto_fob: number;
  
  // Freight sections (up to 4)
  casilla_15_tramos: FreightSection[];
  casilla_15_moneda: string;
  
  // Optional fields
  casilla_13_volumen?: number;
  casilla_16_declaracion_valor?: string;
  casilla_18_instrucciones?: string;
  casilla_19_flete_externo?: number;
  casilla_20_reembolso?: number;
}

export interface TransportCompany {
  id: string;
  nombre: string;
  direccion: string;
  nombreCompleto: string;
}

export interface CRTGenerationResponse {
  numero_crt: string;
  excel_base64: string;
  filename: string;
}

export const DEFAULT_COMPANIES: TransportCompany[] = [
  {
    id: 'tobymar',
    nombre: 'TOBYMAR TRANSPORT S.R.L.',
    direccion: 'Av. Ilimani Nro. 73, Zona Nuevos Horizontes, La Paz, Bolivia',
    nombreCompleto: 'TOBYMAR TRANSPORT S.R.L.\nAv. Ilimani Nro. 73, Zona Nuevos Horizontes, La Paz, Bolivia',
  },
];

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'CNY', label: 'CNY' },
  { value: 'CLP', label: 'CLP' },
];
