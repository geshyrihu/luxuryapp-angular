import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { OnboardingChecklistOptionListDesktop } from "./desktop/onboarding-checklist-option-list-desktop";
import { OnboardingChecklistOptionDto } from "./interfaces/onboarding-checklist-option.dto";
import { OnboardingChecklistOptionListMobile } from "./mobile/onboarding-checklist-option-list-mobile";
import { OnboardingChecklistOptionForm } from "./onboarding-checklist-option-form";

@Component({
  selector: "app-onboarding-checklist-option-list",
  templateUrl: "./onboarding-checklist-option-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OnboardingChecklistOptionListDesktop,
    OnboardingChecklistOptionListMobile,
  ],
})
export class OnboardingChecklistOptionList implements OnInit {
  readonly dialogHandlerS = inject(DialogHandlerService);
  readonly apiResponseS = inject(ApiResponseService);
  readonly platformS = inject(PlatformService);
  readonly dataSignal = signal<OnboardingChecklistOptionDto[]>([]);

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );

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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
