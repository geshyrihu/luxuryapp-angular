import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { OnboardingChecklistOptionDto } from "../interfaces/onboarding-checklist-option.dto";
import { formatRoles as formatRolesUtil } from "../onboarding-checklist-option.utils";

@Component({
  selector: "app-onboarding-checklist-option-list-mobile",
  templateUrl: "./onboarding-checklist-option-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileActionMenu, ButtonMobile, MobileListItem, LuxDataViewMobile],
})
export class OnboardingChecklistOptionListMobile {
  data = input.required<OnboardingChecklistOptionDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();

  protected readonly formatRoles = formatRolesUtil;
}
