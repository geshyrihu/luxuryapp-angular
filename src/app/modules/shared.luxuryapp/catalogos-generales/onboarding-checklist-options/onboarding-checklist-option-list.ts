import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { OnboardingChecklistOptionDto } from "./interfaces/onboarding-checklist-option.dto";
import { OnboardingChecklistOptionForm } from "./onboarding-checklist-option-form";

@Component({
  selector: "app-onboarding-checklist-option-list",
  templateUrl: "./onboarding-checklist-option-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    TableEmptyMessage,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    TableCaption,
    TableFooter,
    DataViewMobile,
    MobileActionMenu,
  ],
})
export class OnboardingChecklistOptionList implements OnInit {
  readonly dialogHandlerS = inject(DialogHandlerService);
  readonly apiResponseS = inject(ApiResponseService);
  readonly platformS = inject(PlatformService);
  readonly tableScrollHeightS = inject(TableScrollHeightService);
  readonly dataSignal = signal<OnboardingChecklistOptionDto[]>([]);

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  readonly tableRows = tableRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetList<OnboardingChecklistOptionDto[]>(
        Endpoints.Catalogs.OnboardingChecklistOptions.getAll,
      )
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onDelete(id: string): void {
    this.apiResponseS
      .onDelete(Endpoints.Catalogs.OnboardingChecklistOptions.delete(id))
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogHandlerS
      .openDialog(
        OnboardingChecklistOptionForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  formatRoles(roles: string[]): string {
    if (!roles || roles.length === 0) return "Sin roles";
    return roles.join(", ");
  }
}

