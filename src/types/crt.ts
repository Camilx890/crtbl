export interface BLExtractedData {
  casilla_1_remitente: string;
  casilla_2_numero_bl: string;
  casilla_4_destinatario: string;
  casilla_11_descripcion: string;
  casilla_12_peso_bruto: number;
  _metadata?: {
    shipper_address?: string;
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
  casilla_5_fecha: string;
  puerto_carga: string;
  casilla_8_aduana_entrega: string;
  casilla_10_transportadores_sucesivos: string;
  casilla_14_valor_fob: string;
  casilla_15_tramos: FreightSection[];
  casilla_15_moneda: string;
}

export interface TransportCompany {
  id: string;
  name: string;
  address: string;
}

export interface CRTGenerationResponse {
  numero_crt: string;
  excel_base64: string;
  filename: string;
}

export const DEFAULT_COMPANIES: TransportCompany[] = [
  {
    id: 'tobymar',
    name: 'TOBYMAR TRANSPORT S.R.L.',
    address: 'Av. Ilimani Nro. 73, Zona Nuevos Horizontes, La Paz, Bolivia',
  },
];
