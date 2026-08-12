import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AccordionModule } from "primeng/accordion";
import { TableModule } from "primeng/table";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-aspel-cobranza-reglas-negocio",
  templateUrl: "./aspel-cobranza-reglas-negocio.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AccordionModule, TableModule, AppIcon],
})
export class AspelCobranzaReglasNegocioComponent {}
