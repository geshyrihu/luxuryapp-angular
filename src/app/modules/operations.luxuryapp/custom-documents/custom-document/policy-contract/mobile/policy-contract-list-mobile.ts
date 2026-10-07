import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PdfViewerTriggerMobile } from "@ui/mobile/pdf-viewer-trigger-mobile/pdf-viewer-trigger-mobile";

@Component({
  selector: "app-policy-contract-list-mobile",
  templateUrl: "./policy-contract-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    PdfViewerTriggerMobile,
    LxTag,
    MobileActionMenu,
    LuxDataViewMobile,
    MobileListItem,
    LxIcon,
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
