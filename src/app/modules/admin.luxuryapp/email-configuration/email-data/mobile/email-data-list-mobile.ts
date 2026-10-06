import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { EmailDataFormDto } from "@core/interfaces/email-data-form.interface";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-email-data-list-mobile",
  templateUrl: "./email-data-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    AppIcon,
    DataViewMobile,
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
