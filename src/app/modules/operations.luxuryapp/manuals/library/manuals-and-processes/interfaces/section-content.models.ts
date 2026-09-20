import { EAlertType, ESectionType } from './manuals-and-processes.dto';

export { ESectionType, EAlertType };

export interface IHtmlContent { html: string; }

export interface IGlossaryContent {
  terms: Array<{ term: string; noUsar: string; definition: string }>;
}

export interface IRaciRow {
  activity: string;
  responsible: string;
  accountable: string;
  consulted: string;
  informed: string;
}
export interface IRaciContent { activities: IRaciRow[]; }

export interface IStepRow {
  order: number;
  actor: string;
  action: string;
  notes: string;
  isDecision: boolean;
  decisionYes: string;
  decisionNo: string;
}
export interface IStepContent { steps: IStepRow[]; }

export interface IAlertContent {
  alertType: EAlertType;
  text: string;
}

export interface IReferenceRow { norm: string; description: string; }
export interface IReferenceContent { items: IReferenceRow[]; }

export const SECTION_TYPE_LABELS: Record<ESectionType, string> = {
  [ESectionType.Objective]: 'Objetivo',
  [ESectionType.Scope]: 'Alcance',
  [ESectionType.Glossary]: 'Glosario',
  [ESectionType.Raci]: 'Matriz RACI',
  [ESectionType.Steps]: 'Pasos del procedimiento',
  [ESectionType.Alert]: 'Nota / Advertencia',
  [ESectionType.Flowchart]: 'Diagrama de flujo',
  [ESectionType.VersionHistory]: 'Historial de versiones',
  [ESectionType.References]: 'Marco legal y referencias',
  [ESectionType.Appendix]: 'Anexo'
};

export const DOC_TYPE_COLORS: Record<number, string> = {
  0: '#0B3164', // PROC - Procedimiento (Azul Luxury)
  1: '#6B7280', // INST - Instructivo (Gris)
  2: '#065F46', // POLI - Politica (Verde)
  3: '#C2410C', // REPO - Reporte (Naranja)
  4: '#92400E', // PROT - Protocolo (Advertencia)
  5: '#C9A84C'  // CIRC/COMU - Comunicado (Dorado Luxury)
};
