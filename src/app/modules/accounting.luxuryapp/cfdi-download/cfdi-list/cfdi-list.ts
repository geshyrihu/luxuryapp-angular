import { ChangeDetectionStrategy, Component, inject, input, output } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { SatCfdiRecibidoDto } from "../interfaces/cfdi-download.interfaces";
import { CfdiListDesktop } from "./desktop/cfdi-list-desktop";
import { CfdiListMobile } from "./mobile/cfdi-list-mobile";

@Component({
  selector: "app-cfdi-list",
  templateUrl: "./cfdi-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CfdiListDesktop, CfdiListMobile],
})
export class CfdiList {
  platformS = inject(PlatformService);

  data = input.required<SatCfdiRecibidoDto[]>();
  globalFilterFields = input<string[]>([]);

  verPdf = output<string>();
  exportarExcel = output<void>();
}
