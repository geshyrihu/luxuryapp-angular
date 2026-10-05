import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { ButtonMobile } from "@ui/buttons/mobile";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { IAnnouncementAdminList } from "../announcement.model";

@Component({
  selector: "app-announcement-admin-list-mobile",
  templateUrl: "./announcement-admin-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    MobileButtonLabelDelete,
    MobileButtonLabelItem,
    ApiDatePipe,
    LxTag,
    CustomInputSelectSignal,
    DataViewMobile,
    AppIcon,
    MobileListItem,
  ],
})
export class AnnouncementAdminListMobile {
  data = input.required<IAnnouncementAdminList[]>();
  globalFilterFields = input<string[]>([]);
  statusControl = input.required<FormControl<string>>();
  typeControl = input.required<FormControl<string>>();
  statusOptions = input.required<SelectItemDto[]>();
  typeOptions = input.required<SelectItemDto[]>();

  add = output<{ id: string; title: string }>();
  edit = output<IAnnouncementAdminList>();
  delete = output<string>();
  downloadPdf = output<string>();
  viewPreview = output<string>();
  viewAnalytics = output<string>();
  filterChange = output<void>();
}
