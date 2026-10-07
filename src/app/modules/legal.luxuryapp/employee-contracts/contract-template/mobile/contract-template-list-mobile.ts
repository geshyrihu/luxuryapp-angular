import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { ContractTemplateListDTO } from "../interfaces/contract-template.dto";

@Component({
  selector: "app-contract-template-list-mobile",
  templateUrl: "./contract-template-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    LuxDataViewMobile,
    ApiDatePipe,
  ],
})
export class ContractTemplateListMobile {
  data = input.required<ContractTemplateListDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<ContractTemplateListDTO>();
  toggleActive = output<ContractTemplateListDTO>();
}
