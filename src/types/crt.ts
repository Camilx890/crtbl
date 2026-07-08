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

export interface TransportCompanyWithPriority extends TransportCompany {
  priority?: boolean;
}

export const DEFAULT_COMPANIES: TransportCompanyWithPriority[] = [
  // ⭐ EMPRESAS PRIORITARIAS (6 primeras)
  {
    id: 'transporte-coveiztruck',
    nombre: 'TRANSPORTE COVEIZTRUCK S.R.L',
    direccion: 'CALLE COLOMBIA, NRO. S/N ZONA CATACHILLA N-351354 C-51028002100, ELALTO - LA PAZ, BOLIVIA',
    nombreCompleto: 'TRANSPORTE COVEIZTRUCK S.R.L\nCALLE COLOMBIA, NRO. S/N ZONA CATACHILLA N-351354 C-51028002100, ELALTO - LA PAZ, BOLIVIA',
    priority: true,
  },
  {
    id: 'cbm',
    nombre: 'CBM SERVICIOS INTEGRALES SPA',
    direccion: 'AV. LAS AMERICAS #3951, IQUIQUE, CHILE.',
    nombreCompleto: 'CBM SERVICIOS INTEGRALES SPA\nAV. LAS AMERICAS #3951, IQUIQUE, CHILE.',
    priority: true,
  },
  {
    id: 'unicargo',
    nombre: 'UNICARGO SRL',
    direccion: 'OTRO CAMINO A CHARINCO, NRO: S/N ZONA MACHAJMARCA, A-NORTE. DEL PUENTE KORRA II AL NORTE POR CAMINO A MACHAJMARCA HASTA EL CAMINO CHARINCO DE AHI A 500 METRS AL OESTE, CASA PB FACHADA LADRILLO VISTO CON PORTON CAFE NUS 444993, VINTO',
    nombreCompleto: 'UNICARGO SRL\nOTRO CAMINO A CHARINCO, NRO: S/N ZONA MACHAJMARCA, A-NORTE. DEL PUENTE KORRA II AL NORTE POR CAMINO A MACHAJMARCA HASTA EL CAMINO CHARINCO DE AHI A 500 METRS AL OESTE, CASA PB FACHADA LADRILLO VISTO CON PORTON CAFE NUS 444993, VINTO',
    priority: true,
  },
  {
    id: 'acien',
    nombre: 'A-CIEN S.R.L.',
    direccion: 'CALLE RENE CRESPO N°115, ZONA VILLA MODERNA, COCHABAMBA, BOLIVIA.',
    nombreCompleto: 'A-CIEN S.R.L.\nCALLE RENE CRESPO N°115, ZONA VILLA MODERNA, COCHABAMBA, BOLIVIA.',
    priority: true,
  },
  {
    id: 'transpagador',
    nombre: 'TRANSPAGADOR LTDA',
    direccion: 'AV HASIN-Z/V PAGADOR, DEPTO DE COCHABAMBA, BOLIVIA.',
    nombreCompleto: 'TRANSPAGADOR LTDA\nAV HASIN-Z/V PAGADOR, DEPTO DE COCHABAMBA, BOLIVIA.',
    priority: true,
  },
  {
    id: 'tobymar',
    nombre: 'TOBYMAR TRANSPORT S.R.L.',
    direccion: 'Av. Iilimani Nro. 73, Zona Nuevos Horizontes 111, El Alto, La Paz, Bolivia',
    nombreCompleto: 'TOBYMAR TRANSPORT S.R.L.\nAv. Iilimani Nro. 73, Zona Nuevos Horizontes 111, El Alto, La Paz, Bolivia',
    priority: true,
  },
  // RESTO DE EMPRESAS (orden alfabético)
  {
    id: 'alianza-paco',
    nombre: 'ALIANZA PACO HERMANOS SRL',
    direccion: 'CASA MATRIZ, AV.BOLIVIA N°31, ZONA NUEVOS HORIZONTES. LA PAZ – BOLIVIA',
    nombreCompleto: 'ALIANZA PACO HERMANOS SRL\nCASA MATRIZ, AV.BOLIVIA N°31, ZONA NUEVOS HORIZONTES. LA PAZ – BOLIVIA',
  },
  {
    id: 'coop-kachi',
    nombre: 'COOP. DE TRANSPORTES FRONTERIZO KACHI LAGUNA R.L.',
    direccion: 'CALLE COBIJA S/N SAN PEDRO DE QUEMES, POTOSI',
    nombreCompleto: 'COOP. DE TRANSPORTES FRONTERIZO KACHI LAGUNA R.L.\nCALLE COBIJA S/N SAN PEDRO DE QUEMES, POTOSI',
  },
  {
    id: 'leader-logistic',
    nombre: 'EMPRESA DE TRANSPORTE LEADER LOGISTIC S.R.L.',
    direccion: 'CALLE LIBERTAD N.128 ZONA ALTO SAN JUAN, LA PAZ, BOLIVIA.',
    nombreCompleto: 'EMPRESA DE TRANSPORTE LEADER LOGISTIC S.R.L.\nCALLE LIBERTAD N.128 ZONA ALTO SAN JUAN, LA PAZ, BOLIVIA.',
  },
  {
    id: 'unidos-10-nov',
    nombre: 'EMPRESA DE TRANSPORTE NACIONAL E INTERNACIONAL POR CARRETERA UNIDOS 10 DE NOVIEMBRE LTDA.',
    direccion: 'CALLE MURILLO EDIF. CENTRO COMERCIAL PEATONAL, PISO 3, OF. 316, N°1028, ZONA CENTRAL.',
    nombreCompleto: 'EMPRESA DE TRANSPORTE NACIONAL E INTERNACIONAL POR CARRETERA UNIDOS 10 DE NOVIEMBRE LTDA.\nCALLE MURILLO EDIF. CENTRO COMERCIAL PEATONAL, PISO 3, OF. 316, N°1028, ZONA CENTRAL.',
  },
  {
    id: 'eti-vaco',
    nombre: 'ETI VACO SRL',
    direccion: 'Calle 4 Nro. 440, zona SANTIAGO SEGUNDO, LA PAZ BOLIVIA',
    nombreCompleto: 'ETI VACO SRL\nCalle 4 Nro. 440, zona SANTIAGO SEGUNDO, LA PAZ BOLIVIA',
  },
  {
    id: 'inpackto',
    nombre: 'INPACKTO SRL',
    direccion: 'BARRIO PARAISO, CALLE LOS JARDINES N° 9060, SANTA CRUZ, BOLIVIA.',
    nombreCompleto: 'INPACKTO SRL\nBARRIO PARAISO, CALLE LOS JARDINES N° 9060, SANTA CRUZ, BOLIVIA.',
  },
  {
    id: 'jimbertrans',
    nombre: 'JIMBERTRANS SRL',
    direccion: 'CALLE VICENTI Nº 508, LA PAZ, BOLIVIA',
    nombreCompleto: 'JIMBERTRANS SRL\nCALLE VICENTI Nº 508, LA PAZ, BOLIVIA',
  },
  {
    id: 'kori-kota',
    nombre: 'KORI-KOTA R Y H TRANSPORTES SRL',
    direccion: 'CALLE CHOCOPIÑA N°31 ZONA PURGATORIO, ENTRE AV. ALVINA KM 15 Y CALLE INNOMINADA CAERA OESTE, BOLIVIA.',
    nombreCompleto: 'KORI-KOTA R Y H TRANSPORTES SRL\nCALLE CHOCOPIÑA N°31 ZONA PURGATORIO, ENTRE AV. ALVINA KM 15 Y CALLE INNOMINADA CAERA OESTE, BOLIVIA.',
  },
  {
    id: 'manuel-corpus',
    nombre: 'MANUEL CORPUS CHALLAPA GARCIA',
    direccion: 'JUANITA FERNANDEZ N°3115, ALTO HOSPICIO, IQUIQUE',
    nombreCompleto: 'MANUEL CORPUS CHALLAPA GARCIA\nJUANITA FERNANDEZ N°3115, ALTO HOSPICIO, IQUIQUE',
  },
  {
    id: 'terralog',
    nombre: 'TERRALOG S.R.L',
    direccion: 'CALLE RAFAEL BUSTILLOS, EDIFICIO: LIRA, PISO: 2, DEPARTAMENTO/LOCAUOFICINA: 2-C, NRO: 1022 ZONA SOPOCACHI, ENTRE CALLES ADOLFO GONZALES Y JAIME ZUDAÑEZ, LA PAZ',
    nombreCompleto: 'TERRALOG S.R.L\nCALLE RAFAEL BUSTILLOS, EDIFICIO: LIRA, PISO: 2, DEPARTAMENTO/LOCAUOFICINA: 2-C, NRO: 1022 ZONA SOPOCACHI, ENTRE CALLES ADOLFO GONZALES Y JAIME ZUDAÑEZ, LA PAZ',
  },
  {
    id: 'trans-capsaya',
    nombre: 'TRANS CAPSAYA S.R.L',
    direccion: 'CALLE CANADA N° 307, ZONA VALLE HERMOSO D14 M477',
    nombreCompleto: 'TRANS CAPSAYA S.R.L\nCALLE CANADA N° 307, ZONA VALLE HERMOSO D14 M477',
  },
  {
    id: 'trans-formani',
    nombre: 'TRANS FORMANI SRL',
    direccion: 'Calle 6 Nro. 24, zona Santa Rosa, El Alto, La Paz, BOLIVIA',
    nombreCompleto: 'TRANS FORMANI SRL\nCalle 6 Nro. 24, zona Santa Rosa, El Alto, La Paz, BOLIVIA',
  },
  {
    id: 'trans-gedeon',
    nombre: 'TRANS GEDEON S.R.L.',
    direccion: 'CALLE N.4 N.4022 BARRIO GUARACHI UV.0140 MZA -006 AV.VIRGEN DE COTOCA C/4.',
    nombreCompleto: 'TRANS GEDEON S.R.L.\nCALLE N.4 N.4022 BARRIO GUARACHI UV.0140 MZA -006 AV.VIRGEN DE COTOCA C/4.',
  },
  {
    id: 'trans-raybemic',
    nombre: 'TRANS RAYBEMIC S.R.L.',
    direccion: 'CALLE ECUADOR N° 100, ZONA SUDOESTE, ORURO, BOLIVIA',
    nombreCompleto: 'TRANS RAYBEMIC S.R.L.\nCALLE ECUADOR N° 100, ZONA SUDOESTE, ORURO, BOLIVIA',
  },
  {
    id: 'transkatalina',
    nombre: 'TRANSKATALINA S.R.L.',
    direccion: 'AV.MELCHOR PEREZ DE OLGUIN, NRO.262 ZONA HIPODROMO D12 M151, ENTRE CALLE LA MERCED Y AV.PEDRO SARMIENTO, COCHABAMBA.',
    nombreCompleto: 'TRANSKATALINA S.R.L.\nAV.MELCHOR PEREZ DE OLGUIN, NRO.262 ZONA HIPODROMO D12 M151, ENTRE CALLE LA MERCED Y AV.PEDRO SARMIENTO, COCHABAMBA.',
  },
  {
    id: 'transportadora-roart',
    nombre: 'TRANSPORTADORA ROART SRL',
    direccion: 'CALLE URINZAYA S/N, ZONA EL PASO, COCHABAMBA, BOLIVIA.',
    nombreCompleto: 'TRANSPORTADORA ROART SRL\nCALLE URINZAYA S/N, ZONA EL PASO, COCHABAMBA, BOLIVIA.',
  },
  {
    id: 'tamarugal',
    nombre: 'TRANSPORTE INTERNACIONAL TAMARUGAL SRL',
    direccion: 'AV. CONFITAL S/N ZONA VINTO CHICO, COCHABAMBA BOLIVIA.',
    nombreCompleto: 'TRANSPORTE INTERNACIONAL TAMARUGAL SRL\nAV. CONFITAL S/N ZONA VINTO CHICO, COCHABAMBA BOLIVIA.',
  },
  {
    id: 'ag-srl',
    nombre: 'TRANSPORTE NACIONAL E INTERNACIONAL A&G SRL',
    direccion: 'AV. COCHABAMBA N°2552, ZONA JULIANA, EL ALTO, LA PAZ, BOLIVIA.',
    nombreCompleto: 'TRANSPORTE NACIONAL E INTERNACIONAL A&G SRL\nAV. COCHABAMBA N°2552, ZONA JULIANA, EL ALTO, LA PAZ, BOLIVIA.',
  },
  {
    id: 'gsl-srl',
    nombre: 'TRANSPORTE NACIONAL E INTERNACIONAL GSL SRL',
    direccion: 'CALLE H1 N°274, ZONA NUEVOS HORIZONTES, LA PAZ, BOLIVIA.',
    nombreCompleto: 'TRANSPORTE NACIONAL E INTERNACIONAL GSL SRL\nCALLE H1 N°274, ZONA NUEVOS HORIZONTES, LA PAZ, BOLIVIA.',
  },
  {
    id: 'soriano',
    nombre: 'TRANSPORTE NACIONAL E INTERNACIONAL "SORIANO LTDA"',
    direccion: 'CALLE 24 DE JUNIO, ENTRE CALLE S/N Y CALLE S/N Nro. 003 URBANIZACION SANTA ROSA. LA PAZ-BOLIVIA.',
    nombreCompleto: 'TRANSPORTE NACIONAL E INTERNACIONAL "SORIANO LTDA"\nCALLE 24 DE JUNIO, ENTRE CALLE S/N Y CALLE S/N Nro. 003 URBANIZACION SANTA ROSA. LA PAZ-BOLIVIA.',
  },
  {
    id: '2-septiembre',
    nombre: 'TRANSPORTE NACIONAL E INTERNACIONAL 2 DE SEPTIEMBRE SRL',
    direccion: 'AV GUADALQUIVIR N°210 ZONA NUEVOS HORIZONTES, EL ALTO, LA PAZ, BOLIVIA.',
    nombreCompleto: 'TRANSPORTE NACIONAL E INTERNACIONAL 2 DE SEPTIEMBRE SRL\nAV GUADALQUIVIR N°210 ZONA NUEVOS HORIZONTES, EL ALTO, LA PAZ, BOLIVIA.',
  },
  {
    id: 'cuestas',
    nombre: 'TRANSPORTES CUESTAS SRL',
    direccion: 'CALLE N° 3, 1052, ZONA VILLA SANTIAGO II LA PAZ – BOLIVIA',
    nombreCompleto: 'TRANSPORTES CUESTAS SRL\nCALLE N° 3, 1052, ZONA VILLA SANTIAGO II LA PAZ – BOLIVIA',
  },
  {
    id: '4-abril',
    nombre: 'TRANSPORTES 4 DE ABRIL SRL',
    direccion: 'CALLE LARECAJA N° 2325, ZONA SANTISIMA TRINIDAD, EL ALTO, BOLIVIA.',
    nombreCompleto: 'TRANSPORTES 4 DE ABRIL SRL\nCALLE LARECAJA N° 2325, ZONA SANTISIMA TRINIDAD, EL ALTO, BOLIVIA.',
  },
  {
    id: 'yanet-challapa',
    nombre: 'YANET CHALLAPA LOZANO',
    direccion: 'AVDA LAS AMERICAS 951 AA',
    nombreCompleto: 'YANET CHALLAPA LOZANO\nAVDA LAS AMERICAS 951 AA',
  },
  {
    id: 'arrivare',
    nombre: 'ARRIVARE S.R.L',
    direccion: 'CALLE SIN NOMBRE, N° S/N, ZONA CAMBODROMO, UV: OPI MZA 054, ZONA CAMBODROMO ENTRE 6TO Y 7MO ANILLO, AL LADO DE LA CERVECERIA POTOSINA, SANTA CRUZ',
    nombreCompleto: 'ARRIVARE S.R.L\\nCALLE SIN NOMBRE, N° S/N, ZONA CAMBODROMO, UV: OPI MZA 054, ZONA CAMBODROMO ENTRE 6TO Y 7MO ANILLO, AL LADO DE LA CERVECERIA POTOSINA, SANTA CRUZ',
    priority: false,
  },
  {
    id: 'veloci-carga',
    nombre: 'TRANSPORTE & LOGISTICA \"VELOCI CARGA S.R.L\"',
    direccion: 'URBANIZACIÓN TUSEQUIAL, CALLE S/N, WARNES, SANTA CRUZ, BOLIVIA',
    nombreCompleto: 'TRANSPORTE & LOGISTICA \"VELOCI CARGA S.R.L\"\\nURBANIZACIÓN TUSEQUIAL, CALLE S/N, WARNES, SANTA CRUZ, BOLIVIA',
    priority: false,
  },
  {
    id: 'siltransport',
    nombre: 'SILTRANSPORT SRL',
    direccion: 'AV.AVENIDA ALAMEDA JUNIN, NRO. 427 BARRIO PALERMO UV.012 MZA 007, ENTRE PRIMER Y SEGUNDO ANILLO DE LA AVENIDA 26 DE FEBRERO ENTRANDO UNA CUADRA Y MEDIA',
    nombreCompleto: 'SILTRANSPORT SRL\nAV.AVENIDA ALAMEDA JUNIN, NRO. 427 BARRIO PALERMO UV.012 MZA 007, ENTRE PRIMER Y SEGUNDO ANILLO DE LA AVENIDA 26 DE FEBRERO ENTRANDO UNA CUADRA Y MEDIA',
    priority: false,
  },
];

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'CNY', label: 'CNY' },
  { value: 'CLP', label: 'CLP' },
];
