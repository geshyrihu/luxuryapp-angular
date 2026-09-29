import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PresupuestoWebAspelWrapper } from "@accounting.luxuryapp/general-ledger/aspel-web-budget/wrapper";

@Component({
  selector: "app-informacion-financiera",
  imports: [PresupuestoWebAspelWrapper],
  templateUrl: "./informacion-financiera.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformacionFinanciera {
}
