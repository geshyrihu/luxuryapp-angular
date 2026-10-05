import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxBadge } from "@ui/adaptive/badge/badge";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-ordenes-compra-cedula-list-mobile",
  templateUrl: "./ordenes-compra-cedula-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DataViewMobile, MobileListItem, AppIcon, LxBadge],
})
export class OrdenesCompraCedulaListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  pagadas = input<number>(0);
  noPagadas = input<number>(0);

  viewOrder = output<any>();
}
