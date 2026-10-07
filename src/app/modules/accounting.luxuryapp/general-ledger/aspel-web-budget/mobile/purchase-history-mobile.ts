import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PurchaseHistoryDTO } from "../presupuestos.interfaces";

@Component({
  selector: "app-purchase-history-mobile",
  templateUrl: "./purchase-history-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonWeb, CommonModule, LxIcon, LuxDataViewMobile, MobileListItem],
})
export class PurchaseHistoryMobile {
  data = input.required<PurchaseHistoryDTO[]>();
  globalFilterFields = input<string[]>([]);

  viewPdf = output<{ url: string; fileName: string }>();
}
