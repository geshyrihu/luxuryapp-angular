import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { SatCfdiRecibidoDto } from "../../interfaces/cfdi-download.interfaces";

@Component({
  selector: "app-cfdi-list-mobile",
  templateUrl: "./cfdi-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LxTag, AppIcon, DataViewMobile, MobileListItem],
})
export class CfdiListMobile {
  data = input.required<SatCfdiRecibidoDto[]>();
  globalFilterFields = input<string[]>([]);

  verPdf = output<string>();

  efosSeverity(efosEstado: string | null): "danger" | "warning" | "success" {
    if (!efosEstado) return "success";
    if (efosEstado === "Definitivo") return "danger";
    return "warning";
  }
}
