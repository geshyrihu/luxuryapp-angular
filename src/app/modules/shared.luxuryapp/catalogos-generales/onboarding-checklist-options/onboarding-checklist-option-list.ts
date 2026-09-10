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
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PlatformService } from "src/app/core/services/platform.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { OnboardingChecklistOptionDto } from "./interfaces/onboarding-checklist-option.dto";
import { OnboardingChecklistOptionForm } from "./onboarding-checklist-option-form";

@Component({
  selector: "app-onboarding-checklist-option-list",
  templateUrl: "./onboarding-checklist-option-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
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
  readonly tablePrimeNgRows = tablePrimeNgRows();
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
