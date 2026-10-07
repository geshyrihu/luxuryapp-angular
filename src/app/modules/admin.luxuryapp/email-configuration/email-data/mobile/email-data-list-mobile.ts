import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { EmailDataFormDto } from "@core/interfaces/email-data-form.interface";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-email-data-list-mobile",
  templateUrl: "./email-data-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    LxIcon,
    LuxDataViewMobile,
    MobileActionMenu,
    MobileListItem,
  ],
})
export class EmailDataListMobile {
  data = input.required<EmailDataFormDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  sendTestEmail = output<string>();
}
