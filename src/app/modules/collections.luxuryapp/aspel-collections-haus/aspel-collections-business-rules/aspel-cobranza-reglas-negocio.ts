import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import type { AccordionItem } from "@ui/core/accordion.base";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { Accordion, AccordionPanel } from "@ui/web/accordion/accordion";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-aspel-cobranza-reglas-negocio",
  templateUrl: "./aspel-cobranza-reglas-negocio.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, Accordion, AccordionPanel, AppTable, LxIcon],
})
export class AspelCobranzaReglasNegocioComponent {
  readonly items: AccordionItem[] = [
    {
      id: "0",
      title:
        "1. Arquitectura de Módulos (Aviso de Cobro, Deudas Actuales, Edo. Cuenta)",
    },
    {
      id: "1",
      title: "2. Tratamiento de Descuentos por Pronto Pago (Cuenta 002)",
    },
    { id: "2", title: "3. Cargos Vencidos y Algoritmo de Conciliación (FIFO)" },
    { id: "3", title: "4. Saldos a Favor (Adelantos) y Movimientos Negativos" },
    { id: "4", title: "5. Cuotas Extraordinarias, Recargos y Penalizaciones" }];
}
