import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";

type TagSeverity =
  | "success"
  | "info"
  | "warn"
  | "danger"
  | "secondary"
  | "contrast";

interface PaletaColor {
  nombre: string;
  rol: string;
  token: string;
  hex: string;
  uso: string;
}

interface TipoDocumento {
  tipo: string;
  codigo: string;
  destinatario: string;
  confidencialidad: string;
  colorToken: string;
  severity: TagSeverity;
}

interface AccesoRol {
  documento: string;
  superUsuario: string;
  direccion: string;
  staff: string;
  condomino: string;
  contractor: string;
}

interface ItemChecklist {
  numero: number;
  descripcion: string;
  aprobado: boolean;
}

interface NomenclaturaCampo {
  campo: string;
  valores: string;
}

interface BloqueVisual {
  titulo: string;
  icono: string;
  descripcion: string;
}

@Component({
  selector: "app-estandar-documental",
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    MessageModule,
    TableModule,
    TabsModule,
    TagModule,
  ],
  templateUrl: "./estandar-documental.html",
})
export class EstandarDocumental {
  pestanaActiva = signal<string>("paleta");

  readonly paleta: PaletaColor[] = [
    {
      nombre: "Azul ERP LuxuryApp",
      rol: "Primario de aplicacion",
      token: "--ds-primary",
      hex: "#0B3164",
      uso: "Accion principal, foco, navegacion activa y encabezados de sistema.",
    },
    {
      nombre: "Dorado Luxury",
      rol: "Acento premium documental",
      token: "--ds-luxury-gold",
      hex: "#C9A84C",
      uso: "Portadas, separadores, reportes formales y detalles institucionales.",
    },
    {
      nombre: "Gris documental",
      rol: "Texto secundario",
      token: "--ds-document-neutral",
      hex: "#6B7280",
      uso: "Metadatos, version, responsable, fecha y notas de soporte.",
    },
    {
      nombre: "Fondo documental",
      rol: "Superficie suave",
      token: "--ds-document-bg-muted",
      hex: "#F3F4F6",
      uso: "Bandas de portada, bloques de metadatos y fondo de muestras.",
    },
    {
      nombre: "Tinta documental",
      rol: "Texto formal",
      token: "--ds-document-ink",
      hex: "#1A1A1A",
      uso: "Contenido principal en documentos y muestras imprimibles.",
    },
    {
      nombre: "Blanco",
      rol: "Superficie",
      token: "--ds-document-surface",
      hex: "#FFFFFF",
      uso: "Cards, paginas simuladas, tablas y fondos de lectura.",
    },
  ];

  readonly tiposDocumento: TipoDocumento[] = [
    {
      tipo: "Procedimiento Operativo",
      codigo: "PROC",
      destinatario: "Staff / Contractor",
      confidencialidad: "Interno",
      colorToken: "var(--ds-primary)",
      severity: "info",
    },
    {
      tipo: "Manual Tecnico",
      codigo: "MANT",
      destinatario: "Staff especializado",
      confidencialidad: "Restringido",
      colorToken: "var(--help-700)",
      severity: "danger",
    },
    {
      tipo: "Instructivo Residentes",
      codigo: "INST",
      destinatario: "Condomino",
      confidencialidad: "Publico",
      colorToken: "var(--ds-document-neutral)",
      severity: "success",
    },
    {
      tipo: "Protocolo de Emergencia",
      codigo: "PROT",
      destinatario: "Todos",
      confidencialidad: "Critico",
      colorToken: "var(--ds-warning)",
      severity: "warn",
    },
    {
      tipo: "Politica Corporativa",
      codigo: "POLI",
      destinatario: "Executive / Corporate",
      confidencialidad: "Confidencial",
      colorToken: "var(--ds-success)",
      severity: "danger",
    },
    {
      tipo: "Comunicado a Residentes",
      codigo: "COMU",
      destinatario: "Condomino",
      confidencialidad: "Publico",
      colorToken: "var(--ds-luxury-gold)",
      severity: "success",
    },
  ];

  readonly matrizAcceso: AccesoRol[] = [
    {
      documento: "Procedimiento Operativo",
      superUsuario: "Editar",
      direccion: "Aprobar",
      staff: "Leer",
      condomino: "Sin acceso",
      contractor: "Leer parcial",
    },
    {
      documento: "Manual Tecnico",
      superUsuario: "Editar",
      direccion: "Consultar",
      staff: "Leer",
      condomino: "Sin acceso",
      contractor: "Si aplica",
    },
    {
      documento: "Instructivo Residentes",
      superUsuario: "Publicar",
      direccion: "Aprobar",
      staff: "Consultar",
      condomino: "Leer",
      contractor: "Sin acceso",
    },
    {
      documento: "Protocolo Emergencia",
      superUsuario: "Editar",
      direccion: "Aprobar",
      staff: "Leer",
      condomino: "Version simplificada",
      contractor: "Leer",
    },
    {
      documento: "Politica Corporativa",
      superUsuario: "Editar",
      direccion: "Aprobar",
      staff: "Sin acceso",
      condomino: "Sin acceso",
      contractor: "Sin acceso",
    },
  ];

  readonly checklist: ItemChecklist[] = [
    {
      numero: 1,
      descripcion: "El codigo sigue nomenclatura estandar TIPO-DEPTO-NNN.",
      aprobado: true,
    },
    {
      numero: 2,
      descripcion:
        "La portada incluye titulo, codigo, version, fecha, clasificacion y estado.",
      aprobado: true,
    },
    {
      numero: 3,
      descripcion: "Existe tabla de control de versiones con al menos una entrada.",
      aprobado: true,
    },
    {
      numero: 4,
      descripcion: "Todas las secciones obligatorias del tipo estan presentes.",
      aprobado: true,
    },
    {
      numero: 5,
      descripcion: "Los terminos del glosario base son usados consistentemente.",
      aprobado: false,
    },
    {
      numero: 6,
      descripcion: "No hay siglas sin definir en su primera aparicion.",
      aprobado: true,
    },
    {
      numero: 7,
      descripcion:
        "El nivel de confidencialidad esta marcado en encabezado o pie.",
      aprobado: true,
    },
    {
      numero: 8,
      descripcion:
        "La tipografia corresponde al estandar: IBM Plex Sans para UI, familia documental solo en PDF.",
      aprobado: false,
    },
    {
      numero: 9,
      descripcion:
        "Los colores pertenecen a tokens DS y no a hexadecimales locales.",
      aprobado: true,
    },
    {
      numero: 10,
      descripcion: "El flujograma, si existe, usa notacion BPMN simplificada.",
      aprobado: true,
    },
    {
      numero: 11,
      descripcion:
        "La matriz RACI identifica al menos un responsable y un aprobador.",
      aprobado: true,
    },
    {
      numero: 12,
      descripcion: "El tono es apropiado para la audiencia objetivo.",
      aprobado: true,
    },
    {
      numero: 13,
      descripcion:
        "El documento fue revisado por supervisor antes de aprobacion.",
      aprobado: false,
    },
    {
      numero: 14,
      descripcion: "Los metadatos para repositorio digital estan completos.",
      aprobado: true,
    },
    {
      numero: 15,
      descripcion: "El documento cumple contraste WCAG 2.1 AA en version digital.",
      aprobado: true,
    },
  ];

  readonly estilosTipografia = [
    {
      elemento: "UI ERP",
      familia: "IBM Plex Sans",
      tamano: "13-32px",
      uso: "Pantallas Angular, PrimeNG, Ionic y operaciones diarias.",
    },
    {
      elemento: "Titulo de documento",
      familia: "IBM Plex Sans / Montserrat",
      tamano: "24-28pt",
      uso: "Portadas y encabezados de documentos exportables.",
    },
    {
      elemento: "Cuerpo documental",
      familia: "IBM Plex Sans / Open Sans",
      tamano: "10-11pt",
      uso: "Contenido extenso imprimible o PDF corporativo.",
    },
    {
      elemento: "Codigo y nomenclatura",
      familia: "Roboto Mono / Consolas",
      tamano: "9-10pt",
      uso: "Folios, codigos, versiones y nombres de archivo.",
    },
  ];

  readonly camposNomenclatura: NomenclaturaCampo[] = [
    { campo: "TIPO", valores: "PROC, MANT, INST, PROT, POLI, COMU" },
    {
      campo: "DEPTO",
      valores: "ADMI, LEGA, MANT, SIST, RRHH, CONT, OPER, SECU, LIMP, JARD",
    },
    {
      campo: "CODIGO",
      valores: "Numero secuencial de 3 digitos: 001, 002, 003",
    },
    {
      campo: "Version",
      valores: "v1.0 para publicacion inicial; v1.1 para ajuste menor",
    },
    { campo: "Fecha", valores: "AAAA-MM de publicacion o vigencia" },
    {
      campo: "ESTADO",
      valores: "BORRADOR, REVISION, APROBADO, VIGENTE, OBSOLETO",
    },
  ];

  readonly ejemploNomenclaturas = [
    "PROC-MANT-012_v2.1_2026-04_APROBADO.pdf",
    "INST-ADMI-005_v1.0_2026-04_VIGENTE.pdf",
    "POLI-LEGA-001_v1.0_2026-04_CONFIDENCIAL.pdf",
    "PROT-OPER-003_v3.0_2026-04_VIGENTE.pdf",
  ];

  readonly bloquesVisuales: BloqueVisual[] = [
    {
      titulo: "Advertencia",
      icono: "pi pi-exclamation-triangle",
      descripcion:
        "Usar cuando el incumplimiento genera riesgo fisico, legal, economico u operativo.",
    },
    {
      titulo: "Nota",
      icono: "pi pi-info-circle",
      descripcion:
        "Informacion complementaria que aclara el procedimiento sin ser un paso obligatorio.",
    },
    {
      titulo: "Buena practica",
      icono: "pi pi-check-circle",
      descripcion:
        "Recomendacion validada por el equipo para elevar calidad y consistencia.",
    },
  ];

  get puntajeChecklist(): number {
    return this.checklist.filter((item) => item.aprobado).length;
  }

  get puntajeAprobatorio(): boolean {
    return this.puntajeChecklist >= 12;
  }

  getColorAcceso(valor: string): TagSeverity {
    if (valor === "Sin acceso") return "danger";
    if (valor === "Editar" || valor === "Publicar") return "success";
    if (valor === "Aprobar") return "info";
    if (valor === "Leer" || valor === "Consultar" || valor === "Leer parcial") {
      return "secondary";
    }
    return "warn";
  }

  getNomenclaturaEjemplo(doc: TipoDocumento): string {
    return `${doc.codigo}-DEPTO-001_v1.0_2026-04_VIGENTE.pdf`;
  }
}
