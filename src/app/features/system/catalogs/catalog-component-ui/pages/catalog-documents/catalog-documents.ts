import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { DocTypes } from "./components/doc-types/doc-types";
import { DocNomenclature } from "./components/doc-nomenclature/doc-nomenclature";
import { DocAccessMatrix } from "./components/doc-access-matrix/doc-access-matrix";

type TagSeverity =
  | "success"
  | "info"
  | "warn"
  | "danger"
  | "secondary"
  | "contrast";

interface TipoDocumento {
  tipo: string;
  codigo: string;
  destinatario: string;
  confidencialidad: string;
  colorToken: string;
  textColorToken: string;
  severity: TagSeverity;
}

interface AccesoRol {
  documento: string;
  superUsuario: string;
  direccion: string;
  staff: string;
  condomino: string;
  proveedor: string;
}

interface NomenclaturaCampo {
  campo: string;
  valores: string;
}

@Component({
  selector: "app-catalog-documents",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    TagModule,
    DocTypes,
    DocNomenclature,
    DocAccessMatrix,
  ],
  templateUrl: "./catalog-documents.html",
  styleUrls: ["./catalog-documents.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CatalogDocuments {
  readonly tiposDocumento: TipoDocumento[] = [
    {
      tipo: "Procedimiento Operativo",
      codigo: "PROC",
      destinatario: "Staff / Contractor",
      confidencialidad: "Interno",
      colorToken: "var(--ds-primary)",
      textColorToken: "var(--ds-on-primary)",
      severity: "info",
    },
    {
      tipo: "Manual Tecnico",
      codigo: "MANT",
      destinatario: "Staff especializado",
      confidencialidad: "Restringido",
      colorToken: "var(--ds-secondary)",
      textColorToken: "var(--ds-on-secondary)",
      severity: "danger",
    },
    {
      tipo: "Instructivo Residentes",
      codigo: "INST",
      destinatario: "Condomino",
      confidencialidad: "Publico",
      colorToken: "var(--ds-surface-variant)",
      textColorToken: "var(--ds-on-surface-variant)",
      severity: "success",
    },
    {
      tipo: "Protocolo de Emergencia",
      codigo: "PROT",
      destinatario: "Todos",
      confidencialidad: "Critico",
      colorToken: "var(--ds-error)",
      textColorToken: "var(--ds-on-error)",
      severity: "warn",
    },
    {
      tipo: "Politica Corporativa",
      codigo: "POLI",
      destinatario: "Executive / Corporate",
      confidencialidad: "Confidencial",
      colorToken: "var(--ds-tertiary)",
      textColorToken: "var(--ds-on-tertiary)",
      severity: "danger",
    },
    {
      tipo: "Comunicado a Residentes",
      codigo: "COMU",
      destinatario: "Condomino",
      confidencialidad: "Publico",
      colorToken: "var(--ds-luxury-gold)",
      textColorToken: "#ffffff",
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
      proveedor: "Leer parcial",
    },
    {
      documento: "Manual Tecnico",
      superUsuario: "Editar",
      direccion: "Consultar",
      staff: "Leer",
      condomino: "Sin acceso",
      proveedor: "Si aplica",
    },
    {
      documento: "Instructivo Residentes",
      superUsuario: "Publicar",
      direccion: "Aprobar",
      staff: "Consultar",
      condomino: "Leer",
      proveedor: "Sin acceso",
    },
    {
      documento: "Protocolo Emergencia",
      superUsuario: "Editar",
      direccion: "Aprobar",
      staff: "Leer",
      condomino: "Version simplificada",
      proveedor: "Leer",
    },
    {
      documento: "Politica Corporativa",
      superUsuario: "Editar",
      direccion: "Aprobar",
      staff: "Sin acceso",
      condomino: "Sin acceso",
      proveedor: "Sin acceso",
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
}
