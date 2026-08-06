import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AccordionModule } from "primeng/accordion";
import { TableModule } from "primeng/table";

@Component({
  selector: "app-aspel-cobranza-reglas-negocio",
  templateUrl: "./aspel-cobranza-reglas-negocio.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AccordionModule, TableModule],
})
export class AspelCobranzaReglasNegocioComponent {}
