import { ChangeDetectionStrategy, Component } from "@angular/core";
import { HistorialComprasList } from "./historial-compras-list";

@Component({
  selector: "app-historial-compras-wrapper",

  imports: [HistorialComprasList],
  template: ` <app-historial-compras-list /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialComprasWrapper {}
