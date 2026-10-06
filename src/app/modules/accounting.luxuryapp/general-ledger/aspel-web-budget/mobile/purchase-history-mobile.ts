import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { PurchaseHistoryDTO } from "../presupuestos.interfaces";

@Component({
  selector: "app-purchase-history-mobile",
  templateUrl: "./purchase-history-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, WebButtonIcon, LxIcon, DataViewMobile, MobileListItem],
})
export class PurchaseHistoryMobile {
  data = input.required<PurchaseHistoryDTO[]>();
  globalFilterFields = input<string[]>([]);

  viewPdf = output<{ url: string; fileName: string }>();
}
