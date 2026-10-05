import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelViewPdf } from "@ui/buttons/mobile-label/button-view-pdf";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-policy-contract-list-mobile",
  templateUrl: "./policy-contract-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    LxTag,
    MobileActionMenu,
    MobileButtonLabelViewPdf,
    MobileButtonLabelDelete,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class PolicyContractListMobile {
  groupedData = input.required<any>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  deleteDocument = output<any>();

  getTagSeverity(tagLabel: string | null): "success" | "warn" | "danger" {
    if (tagLabel === "Vigente") return "success";
    if (tagLabel === "Próximo a vencer") return "warn";
    if (tagLabel === "Vencido") return "danger";
  }
}
