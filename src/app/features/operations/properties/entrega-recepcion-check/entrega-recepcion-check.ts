import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

// PrimeNG Modules
import { AccordionModule } from "primeng/accordion";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";

@Component({
  selector: "app-entrega-recepcion-check",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccordionModule,
    TableModule,
    TagModule,
    SelectButtonModule,
    CustomButton,
  ],
  templateUrl: "./entrega-recepcion-check.html",
})
export class EntregaRecepcionCheckComponent implements OnInit {
  statusOptions: any[];

  auditModules: any[];

  constructor() {}

  ngOnInit() {
    this.statusOptions = [
      { label: "Completo", value: "completo", icon: "mdi:check-circle" },
      {
        label: "Parcial",
        value: "parcial",
        icon: "mdi:alert",
      },
      {
        label: "No Entregado",
        value: "no-entregado",
        icon: "mdi:close-circle",
      },
    ];

    this.auditModules = [
      {
        name: "Legal y Régimen Condominal",
        icon: "mdi:book",
        items: [
          {
            control:
              "Escritura Constitutiva del Régimen de Propiedad en Condominio y Reglamento Interno.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Acta Constitutiva de la A.C. con folio mercantil (si aplica).",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Poderes notariales del representante legal vigentes.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Libro de Actas de Asamblea (físico).",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "[SUGERENCIA] Constancia de registro de Administrador ante PROSOC (o autoridad local).",
            type: "Obligatorio",
            status: null,
            observations:
              "Acredita al administrador como representante legalmente reconocido.",
          },
          {
            control:
              "[SUGERENCIA] Registro del Libro de Actas ante PROSOC (o autoridad local).",
            type: "Obligatorio",
            status: null,
            observations: "Sin el registro, las actas pueden ser invalidadas.",
          },
          {
            control:
              "[SUGERENCIA] Archivo de Actas de Asamblea Protocolizadas e inscritas en RPP.",
            type: "Recomendable",
            status: null,
            observations:
              "Máxima validez legal frente a terceros (bancos, juicios).",
          },
        ],
      },
      {
        name: "Fiscal y Contable",
        icon: "mdi:chart-bar",
        items: [
          {
            control: "Constancia de Situación Fiscal (RFC) de la A.C.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Opinión de cumplimiento del SAT actualizada.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "e.firma y Sello Digital (CSD) de la A.C. y del Representante Legal.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Declaraciones anuales y mensuales (últimos 5 años) con papeles de trabajo.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Respaldo del sistema contable utilizado.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Estados financieros al mes de la entrega.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Balanzas de comprobación y auxiliares del año en curso.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Estados de cuenta bancarios y conciliaciones del año en curso.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Integración de Cuentas por Cobrar (CxC) y Cuentas por Pagar (CxP).",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Tokens bancarios y contraseñas de acceso a portales.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "[SUGERENCIA] Evidencia de aprobación del presupuesto anual en Acta de Asamblea.",
            type: "Obligatorio",
            status: null,
            observations:
              "Valida la legitimidad de las cuotas y el plan de gastos.",
          },
          {
            control:
              "[SUGERENCIA] Política de Inversión y manejo del fondo de reserva.",
            type: "Recomendable",
            status: null,
            observations:
              "Protege y transparenta el uso de los fondos a largo plazo.",
          },
        ],
      },
      {
        name: "Recursos Humanos y Seguridad Social",
        icon: "mdi:account-group",
        items: [
          {
            control: "Listado de personal activo.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Expedientes individuales con contratos de trabajo.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Altas ante el IMSS de todo el personal.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Opinión de cumplimiento del IMSS e INFONAVIT actualizada.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Accesos a portales IDSE, SIPARE, SUA e ISN.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Declaraciones de riesgo de trabajo y de sueldos y salarios (últimos 5 años).",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "[SUGERENCIA] Expediente de Cumplimiento de la NOM-035 (Riesgo Psicosocial).",
            type: "Obligatorio",
            status: null,
            observations:
              "Obligación de la STPS para prevenir multas y mejorar el ambiente laboral.",
          },
          {
            control:
              "[SUGERENCIA] Proceso documentado de Onboarding y Offboarding de personal.",
            type: "Recomendable",
            status: null,
            observations:
              "Asegura la correcta entrega y devolución de activos y accesos.",
          },
        ],
      },
      {
        name: "Operación y Servicios",
        icon: "mdi:cog",
        items: [
          {
            control: "Directorio de residentes actualizado.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Directorio de proveedores y contratistas.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Contratos vigentes de todos los proveedores (Seguridad, Limpieza, Mantenimiento, etc.).",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Inventario de mobiliario y equipo de oficina y áreas comunes.",
            type: "Recomendable",
            status: null,
            observations: "",
          },
          {
            control:
              "[SUGERENCIA] Fichas de Evaluación de Proveedores Críticos (SLAs).",
            type: "Recomendable",
            status: null,
            observations:
              "Permite auditar el cumplimiento y la calidad de los servicios contratados.",
          },
          {
            control:
              "[SUGERENCIA] Sistema de Gestión de Tickets o Bitácora de Solicitudes/Quejas.",
            type: "Recomendable",
            status: null,
            observations:
              "Profesionaliza la atención y permite medir la eficiencia operativa.",
          },
        ],
      },
      {
        name: "Mantenimiento y Activos",
        icon: "mdi:wrench",
        items: [
          {
            control:
              "Inventario de equipos electromecánicos, CCTV y amenidades.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Planos actualizados (arquitectónico, eléctrico, hidrosanitario, etc.).",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Bitácoras de servicios a equipos.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "[SUGERENCIA] Programa Anual de Mantenimiento Preventivo (Calendarizado).",
            type: "Obligatorio",
            status: null,
            observations:
              "Esencial para prevenir fallas catastróficas y reducir costos a largo plazo.",
          },
          {
            control:
              "[SUGERENCIA] Carpeta de Activos con garantías, manuales y fichas técnicas.",
            type: "Recomendable",
            status: null,
            observations:
              "Centraliza la información técnica para agilizar reparaciones.",
          },
        ],
      },
      {
        name: "Protección Civil y Riesgos",
        icon: "mdi:shield",
        items: [
          {
            control:
              "Programa Interno de Protección Civil actualizado y registrado.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Póliza de Seguro de Responsabilidad Civil y Daños al Inmueble (vigente y pagada).",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Inventario y estado de vigencia de extintores.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "[SUGERENCIA] Dictamen de Seguridad Estructural (si aplica).",
            type: "Obligatorio",
            status: null,
            observations: "Crítico en zonas sísmicas o edificios antiguos.",
          },
          {
            control: "[SUGERENCIA] Dictamen Técnico de Instalación de Gas.",
            type: "Obligatorio",
            status: null,
            observations: "Previene riesgos de explosión o intoxicación.",
          },
          {
            control:
              "[SUGERENCIA] Constancias de capacitación de brigadas internas.",
            type: "Recomendable",
            status: null,
            observations:
              "El personal debe saber cómo actuar en una emergencia.",
          },
          {
            control:
              "[SUGERENCIA] Evidencia de simulacros realizados (mínimo 2 por año).",
            type: "Obligatorio",
            status: null,
            observations: "Requisito legal en muchas localidades.",
          },
        ],
      },
      {
        name: "Tecnología, Accesos y Contraseñas",
        icon: "mdi:key",
        items: [
          {
            control:
              "Inventario de contraseñas (equipos, WiFi, apps, plataformas).",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "[SUGERENCIA] Política de Respaldo de Información Crítica (Contable, Legal, etc.).",
            type: "Obligatorio",
            status: null,
            observations:
              "Define dónde, cada cuánto y quién realiza los respaldos.",
          },
          {
            control:
              "[SUGERENCIA] Documento de Política de Privacidad de Datos (LFPDPPP).",
            type: "Recomendable",
            status: null,
            observations:
              "Demuestra el manejo responsable de la información de los residentes.",
          },
        ],
      },
      {
        name: "Relación con Comité y Gobierno Interno",
        icon: "mdi:sitemap",
        items: [
          {
            control:
              "[SUGERENCIA] Directorio de Miembros del Comité de Vigilancia.",
            type: "Recomendable",
            status: null,
            observations: "",
          },
          {
            control:
              "[SUGERENCIA] Minutas o acuerdos de las sesiones de trabajo con el Comité.",
            type: "Recomendable",
            status: null,
            observations: "Aporta trazabilidad a las decisiones conjuntas.",
          },
          {
            control:
              "[SUGERENCIA] Canales y frecuencia de comunicación definidos con el Comité.",
            type: "Recomendable",
            status: null,
            observations:
              "Evita malos entendidos y establece expectativas claras.",
          },
        ],
      },
      {
        name: "Juicios, Cobranza y Morosidad",
        icon: "mdi:briefcase",
        items: [
          {
            control: "Reporte de cartera vencida detallado.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "Expedientes de juicios (judiciales y extrajudiciales) en curso.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control: "Convenios de pago vigentes.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "[SUGERENCIA] Política de Cobranza Preventiva y Correctiva documentada.",
            type: "Recomendable",
            status: null,
            observations:
              "Define los pasos a seguir antes de iniciar un proceso legal.",
          },
        ],
      },
      {
        name: "Proyectos y Pendientes Heredados",
        icon: "mdi:inbox",
        items: [
          {
            control: "Listado de proyectos en curso y pendientes importantes.",
            type: "Obligatorio",
            status: null,
            observations: "",
          },
          {
            control:
              "[SUGERENCIA] Ficha de control por cada proyecto (objetivo, presupuesto, cronograma).",
            type: "Recomendable",
            status: null,
            observations:
              "Permite un seguimiento profesional y evita desviaciones.",
          },
        ],
      },
    ];

    // Add controls dynamically
    this.auditModules = this.auditModules.map((module) => ({
      ...module,
      items: module.items.map((item: any) => ({
        ...item,
        statusControl: new FormControl(item.status),
        observationsControl: new FormControl(item.observations),
      })),
    }));
  }
}

