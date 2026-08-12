import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

type FlowNode = {
  title: string;
  subtitle: string;
  icon: AppIconName;
  tone: "sky" | "teal" | "amber" | "rose" | "violet";
  bullets: string[];
};

@Component({
  selector: "app-system-flow-map",
  imports: [LxCard, LxTag, AppIcon],
  templateUrl: "./system-flow-map.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./system-flow-map.scss"],
})
export default class SystemFlowMap {
  readonly sourceNodes: FlowNode[] = [
    {
      title: "Propiedades",
      subtitle: "La unidad financiera base del condominio",
      icon: "material-symbols-light:location-city",
      tone: "sky",
      bullets: [
        "Cada propiedad concentra deuda, pagos y estado de cuenta",
        "Puede tener indiviso, torre, departamento y estatus operativo",
      ],
    },
    {
      title: "Miembros y responsable",
      subtitle: "Quien recibe cargos y notificaciones",
      icon: "material-symbols-light:group-outline",
      tone: "sky",
      bullets: [
        "Se identifica un responsable financiero activo",
        "El modulo usa esa relacion para cobranza y salida documental",
      ],
    },
    {
      title: "Configuracion",
      subtitle: "Modo de facturacion y canales del modulo",
      icon: "material-symbols-light:tune",
      tone: "sky",
      bullets: [
        "BillingConfig define el modo nativo",
        "NotificationSettings activa email y push",
      ],
    },
  ];

  readonly generationNodes: FlowNode[] = [
    {
      title: "Plantillas de cargos",
      subtitle: "Reglas para mantenimiento, extraordinarias y otros conceptos",
      icon: "material-symbols-light:edit-note",
      tone: "teal",
      bullets: [
        "Monto fijo o por indiviso",
        "Base para generacion manual y automatica",
      ],
    },
    {
      title: "Cargos emitidos",
      subtitle: "La deuda nace aqui",
      icon: "material-symbols-light:add-card",
      tone: "teal",
      bullets: [
        "Cargo manual, recurrente, recargo, multa o ajuste",
        "Cada cargo afecta saldo y vencimiento",
      ],
    },
    {
      title: "Eventos especiales",
      subtitle: "Movimientos que ajustan la posicion financiera",
      icon: "material-symbols-light:flash-on",
      tone: "teal",
      bullets: [
        "Notas de credito, condonaciones, multas y ajustes",
        "No borran historia, generan nuevos eventos",
      ],
    },
  ];

  readonly engineNodes: FlowNode[] = [
    {
      title: "Pagos y abonos",
      subtitle: "Entrada de dinero y aplicacion operativa",
      icon: "material-symbols-light:credit-card",
      tone: "amber",
      bullets: [
        "Aplicacion FIFO a cargos pendientes",
        "Excedente queda para conciliacion o aplicacion posterior",
      ],
    },
    {
      title: "Automatizaciones",
      subtitle: "Jobs y eventos que disparan acciones",
      icon: "material-symbols-light:smart-toy-outline",
      tone: "amber",
      bullets: [
        "Generacion de cargos, calculo de mora, avisos y escalamiento",
        "La vision futura incluye reaccion por socket/signal ante cargos y abonos",
      ],
    },
    {
      title: "Aprobaciones y cierres",
      subtitle: "Controles para cambios sensibles",
      icon: "material-symbols-light:verified-outline",
      tone: "amber",
      bullets: [
        "Maker-checker para operaciones sensibles",
        "Cierre de periodo bloquea movimientos fuera de regla",
      ],
    },
  ];

  readonly outputNodes: FlowNode[] = [
    {
      title: "Ledger financiero",
      subtitle: "Fuente confiable e inmutable",
      icon: "material-symbols-light:menu-book",
      tone: "violet",
      bullets: [
        "Cada cargo, pago, reverso o ajuste genera entradas append-only",
        "Desde aqui se proyecta el saldo real",
      ],
    },
    {
      title: "Estado de cuenta y PDF",
      subtitle: "Salida operativa para residentes y equipo",
      icon: "material-symbols-light:picture-as-pdf",
      tone: "violet",
      bullets: [
        "Consulta por fecha de corte",
        "Preview, descarga y envio por email",
      ],
    },
    {
      title: "Notificaciones y casos",
      subtitle: "Seguimiento y cobranza preventiva/legal",
      icon: "material-symbols-light:notifications-outline",
      tone: "violet",
      bullets: [
        "Avisos de cobro, push, correo y escalamiento",
        "Casos de cobranza cuando la mora madura",
      ],
    },
  ];

  readonly eventStream = [
    "Propiedad activa",
    "Se emite cargo",
    "Se registra evento en ledger",
    "Se notifica o programa seguimiento",
    "Se recibe pago",
    "Se aplica a cargos",
    "Se recalcula saldo y aging",
    "Se genera estado de cuenta",
  ];

  toneClass(tone: FlowNode["tone"]): string {
    return `tone-${tone}`;
  }
}
