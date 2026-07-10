export interface EvidenciaNominaDTO {
  id: string;
  nominaEncabezadoId: string;
  tiempoExtraId: string | null;
  tipoEvidencia: number;
  tipoEvidenciaDisplay: string;
  filePath: string;
  fileName: string;
  contentType: string;
  descripcion: string;
  createdAt: string;
  createdBy: string;
}

export interface EvidenciaNominaCreateDTO {
  tipoEvidencia: number;
  descripcion?: string;
  file: File;
}

export const TIPO_EVIDENCIA_OPTIONS = [
  { label: "Nomina Firmada",        value: 0 },
  { label: "Tiempo Extra Firmado",  value: 1 },
  { label: "Evidencia Asistencia",  value: 2 },
  { label: "Documento Incapacidad", value: 3 },
  { label: "Otro Documento",        value: 4 },
];

export const TIPO_EVIDENCIA_COLORS: Record<number, string> = {
  0: "#dcfce7",
  1: "#dbeafe",
  2: "#fef9c3",
  3: "#fff7ed",
  4: "#f8fafc",
};
