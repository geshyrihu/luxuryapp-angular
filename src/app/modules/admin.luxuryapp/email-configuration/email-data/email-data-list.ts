import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { EmailDataFormDto } from "@core/interfaces/email-data-form.interface";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { EmailDataListDesktop } from "./desktop/email-data-list-desktop";
import { EmailDataForm } from "./email-data-form";
import { EmailDataListMobile } from "./mobile/email-data-list-mobile";

@Component({
  selector: "app-email-data-list",
  templateUrl: "./email-data-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmailDataListDesktop, EmailDataListMobile],
})
export class EmailDataList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  dataSignal = signal<EmailDataFormDto[]>([]);

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  loading = signal(true);
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<EmailDataFormDto[]>(Endpoints.Catalogs.EmailData.getAll)
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onModalForm(data: Partial<EmailDataFormDto & { title: string }>) {
    this.dialogHandlerS
      .openDialog(EmailDataForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onSendTestEmail(id: string) {
    this.apiResponseS.onPost(
      Endpoints.Catalogs.EmailData.sendTestEmail(id),
      null,
    );
  }
}
