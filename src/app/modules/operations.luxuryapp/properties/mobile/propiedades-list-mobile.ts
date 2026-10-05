import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-propiedades-list-mobile",
  templateUrl: "./propiedades-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    CommonModule,
    MobileActionMenu,
    MobileListItem,
    AppIcon,
    DataViewMobile,
  ],
})
export class PropiedadesListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: any; title: string }>();
  delete = output<any>();

  formatAccountNumber(accountNumber: string): string {
    const digits = (accountNumber || "").replace(/\D/g, "");
    if (!digits) return "";

    return digits.match(/.{1,3}/g)?.join("-") ?? digits;
  }
}
